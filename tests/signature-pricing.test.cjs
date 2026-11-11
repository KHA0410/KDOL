const assert = require('node:assert/strict');
const test = require('node:test');
const { readPlans, loadPricing, roundFraction } = require('./helpers/pricing.cjs');

test('all signature plans: VAT 8/10, both CA contract tiers, fixed Token and copied prices', () => {
    const app = loadPricing(), state = app.state, plans = readPlans();
    let priceCases = 0, copyCases = 0;
    function checkTokenPlan(plan, tokenBase) {
        for (const tier of ['under100', '100plus']) for (const vat of [8, 10]) for (const discount of [0, 10, 20, 30, 40, 50, ...(tier === '100plus' ? [60] : [])]) {
            state.vnptCaContractSize = tier;
            state.vatRate = vat; state.discountVnptCa = discount;
            const token = roundFraction(BigInt(tokenBase) * BigInt(100 + vat), 110n);
            assert.equal(state.vnptCaTokenPrice, token);
            for (const field of ['price', 'invoice_price']) {
                const service = BigInt(Number(plan[field]) - tokenBase);
                const expected = roundFraction(service * BigInt(100 + vat) * BigInt(100 - discount), 11000n) + token;
                assert.equal(state.calculateVnptCaPrice(plan[field]), expected);
                if (!discount && vat === 10) assert.equal(expected, Number(plan[field]));
                priceCases++;
            }
            state.executeCaCopy(plan);
            assert.ok(app.copied().includes(state.formatPrice(state.calculateVnptCaPrice(plan.price))));
            if (state.activeVnptCaTab === 'doanhnghiep') {
                assert.ok(app.copied().includes(state.formatPrice(state.calculateVnptCaPrice(plan.invoice_price))));
            }
            assert.equal(app.copied().includes('(không chiết khấu)'), token > 0);
            if (token) assert.ok(app.copied().includes(state.formatPrice(token)));
            if (discount) assert.ok(app.copied().includes(`Đã giảm ${discount}% phí dịch vụ`));
            copyCases++;
        }
    }
    const standard = plans.filter(plan => plan.service_id === 'vnptca');
    assert.equal(standard.length, 21);
    for (const plan of standard) {
        const [tab, type] = plan.plan_group.split('_');
        state.activeVnptCaTab = tab; state.activeVnptCaType = type || 'moi'; state.activeVnptCaTier = 'standard';
        checkTokenPlan(plan, type === 'moi' ? (tab === 'doanhnghiep' ? 550000 : 165000) : 0);
    }
    const sourcePrices = {
        doanhnghiep: [5500000, 9900000, 13200000],
        nhanvien: [660000, 1100000, 1430000],
        canhan: [550000, 990000, 1320000]
    };
    for (const [tab, prices] of Object.entries(sourcePrices)) for (const type of ['moi', 'giahan']) {
        state.activeVnptCaTab = tab; state.activeVnptCaType = type; state.activeVnptCaTier = 'pro';
        const token = type === 'moi' ? (tab === 'doanhnghiep' ? 550000 : 165000) : 0;
        assert.equal(state.currentVnptCaPlans.length, 3);
        for (const [i, plan] of state.currentVnptCaPlans.entries()) {
            assert.equal(plan.price, prices[i] + token);
            assert.equal(plan.invoice_price, plan.price);
            checkTokenPlan(plan, token);
        }
    }
    const smart = plans.filter(plan => plan.service_id === 'smartca');
    assert.equal(smart.length, 16);
    state.smartCaData = [...new Set(smart.map(plan => plan.plan_group))].map(type => ({ type, name: type, plans: smart.filter(plan => plan.plan_group === type) }));
    const customerCaps = { term: 0, existing: 10, revenue10to30: 20, largeExisting: 30, competition: 30 };
    for (const mode of ['none', 'auto', 'custom']) for (const [condition, customerCap] of Object.entries(customerCaps)) for (const plan of smart) for (const advanced of [false, true]) {
        for (const vat of [8, 10]) for (const discount of [0, 10, 20, 30]) {
            state.activeSmartCaTab = plan.plan_group; state.isAdvanced = advanced;
            state.smartCaCustomerType = condition;
            state.smartCaDiscountMode = mode;
            state.vatRate = vat; state.discountRate = discount;
            const factor = advanced && plan.plan_group !== '1lan';
            const months = Number(plan.duration_text);
            const termCap = plan.plan_group === '1lan' ? 10 : months >= 12 ? 30 : months === 6 ? 20 : 10;
            const maxDiscount = Math.max(termCap, customerCap);
            const applied = mode === 'auto' ? maxDiscount : mode === 'custom' ? Math.min(discount, maxDiscount) : 0;
            assert.equal(state.getSmartCaMaxDiscount(plan), Math.max(termCap, customerCap));
            assert.equal(state.getSmartCaDiscount(plan), applied);
            const numerator = BigInt(plan.price) * (factor ? 3n : 1n) * BigInt(100 + vat) * BigInt(100 - applied);
            const expected = roundFraction(numerator, 11000n * (factor ? 2n : 1n));
            assert.equal(state.calculateFinalPrice(plan), expected);
            const original = roundFraction(BigInt(plan.price) * (factor ? 3n : 1n) * BigInt(100 + vat), 110n * (factor ? 2n : 1n));
            assert.equal(state.calculateOriginalPrice(plan.price), original);
            state.executeCopy(plan);
            assert.ok(app.copied().includes(state.formatPrice(expected)));
            if (applied) assert.ok(app.copied().includes(`Đã giảm ${applied}% (${state.getSmartCaDiscountReason(plan)})`));
            priceCases++; copyCases++;
        }
    }
    assert.equal(priceCases, 5868);
    assert.equal(copyCases, 4854);
});

test('VAT switches do not accumulate changes; one-dong rounding regressions', () => {
    const { state } = loadPricing();
    state.activeVnptCaTab = 'doanhnghiep'; state.activeVnptCaType = 'moi'; state.discountVnptCa = 30;
    for (const vat of [10, 8, 10, 8]) {
        state.vatRate = vat;
        assert.equal(state.calculateVnptCaPrice(1823000), vat === 10 ? 1441100 : 1414898);
        assert.equal(state.vnptCaTokenPrice, vat === 10 ? 550000 : 540000);
    }
    state.activeSmartCaTab = 'canhan'; state.isAdvanced = false; state.discountRate = 20; state.smartCaDiscountMode = 'custom';
    assert.equal(state.calculateFinalPrice({ price: 120000, duration_text: '6' }), 94255);
    state.activeSmartCaTab = '1lan'; state.isAdvanced = true; state.discountRate = 10;
    assert.equal(state.calculateFinalPrice({ price: 20000, duration_text: '1' }), 17673);
});

test('CA discount caps apply to prices and copy immediately when contract tier changes', () => {
    const app = loadPricing(), state = app.state;
    const plan = { duration_text: '12', price: 1823000, invoice_price: 1823000 };
    assert.equal(state.vnptCaContractSize, 'under100');
    assert.equal(state.maxVnptCaDiscount, 50);
    state.vnptCaContractSize = '100plus'; state.discountVnptCa = 60;
    assert.equal(state.maxVnptCaDiscount, 60);
    assert.equal(state.calculateVnptCaPrice(plan.price), 1059200);
    assert.equal(state.vnptCaTokenPrice, 550000);
    state.executeCaCopy(plan);
    assert.ok(app.copied().includes('Đã giảm 60% phí dịch vụ'));

    state.vnptCaContractSize = 'under100';
    // Computed price and copied text must be safe even before Vue runs the watcher.
    assert.equal(state.vnptCaDiscount, 50);
    assert.equal(state.calculateVnptCaPrice(plan.price), 1186500);
    assert.equal(state.calculateVnptCaPrice(plan.price, 60), 1186500);
    state.executeCaCopy(plan);
    assert.ok(app.copied().includes('Đã giảm 50% phí dịch vụ'));
    assert.ok(!app.copied().includes('Đã giảm 60%'));
    app.watch.maxVnptCaDiscount.call(state, state.maxVnptCaDiscount);
    assert.equal(state.discountVnptCa, 50);
    assert.equal(state.calculateVnptCaPrice(plan.price, -5), 1823000);

    state.activeSmartCaTab = '1lan'; state.discountRate = 10; state.vatRate = 8; state.smartCaDiscountMode = 'custom';
    assert.equal(state.calculateFinalPrice({ price: 20000, duration_text: '1' }), 17673);
    assert.equal(state.discountVnptCa, 50);
    state.selectService({ id: 'cks' });
    assert.equal(state.vnptCaContractSize, 'under100');
    assert.equal(state.discountVnptCa, 0);
});

test('SmartCA limits each duration and copied quote when 30% is selected', () => {
    const app = loadPricing(), state = app.state;
    const smart = readPlans().filter(plan => plan.service_id === 'smartca');
    state.smartCaData = [...new Set(smart.map(plan => plan.plan_group))].map(type => ({ type, name: type, plans: smart.filter(plan => plan.plan_group === type) }));
    state.activeSmartCaTab = 'canhan'; state.discountRate = 30; state.smartCaDiscountMode = 'custom';
    assert.equal(state.smartCaCustomerType, 'term');
    assert.equal(state.maxSmartCaDiscount, 30);
    const expected = { 1: [10, 31500], 3: [10, 58500], 6: [20, 96000], 12: [30, 154000] };
    for (const [duration, [discount, price]] of Object.entries(expected)) {
        const plan = smart.find(plan => plan.plan_group === 'canhan' && plan.duration_text === duration);
        assert.equal(state.getSmartCaDiscount(plan), discount);
        assert.equal(state.calculateFinalPrice(plan), price);
        state.executeCopy(plan);
        assert.ok(app.copied().includes(`Đã giảm ${discount}%`));
        if (discount < 30) assert.ok(!app.copied().includes('Đã giảm 30%'));
    }
    const sixMonths = smart.find(plan => plan.plan_group === 'canhan' && plan.duration_text === '6');
    state.smartCaCustomerType = 'competition';
    assert.equal(state.getSmartCaDiscount(sixMonths), 30);
    state.executeCopy(sixMonths);
    assert.ok(app.copied().includes('cạnh tranh về giá'));
    state.smartCaCustomerType = 'revenue10to30';
    assert.equal(state.getSmartCaDiscount(sixMonths), 20);
    state.smartCaCustomerType = 'largeExisting';
    assert.equal(state.getSmartCaDiscount(sixMonths), 30);
    state.smartCaCustomerType = 'invalid';
    assert.equal(state.getSmartCaDiscount(sixMonths), 20);
    assert.equal(state.getSmartCaMaxDiscount({ price: 100000, duration_text: '5' }), 0);

    state.smartCaCustomerType = 'term'; state.activeSmartCaTab = '1lan';
    const oneTime = smart.find(plan => plan.plan_group === '1lan');
    assert.equal(state.maxSmartCaDiscount, 10);
    assert.equal(state.getSmartCaDiscount(oneTime), 10);
    state.executeCopy(oneTime);
    assert.ok(app.copied().includes('Đã giảm 10% (Gói dùng 1 lần)'));
    app.watch.maxSmartCaDiscount.call(state, state.maxSmartCaDiscount);
    assert.equal(state.discountRate, 10);
    state.smartCaCustomerType = 'largeExisting'; state.discountRate = 30;
    assert.equal(state.getSmartCaDiscount(oneTime), 30);
    state.selectService({ id: 'cks' });
    assert.equal(state.smartCaCustomerType, 'term');
    assert.equal(state.discountRate, 0);
    assert.equal(state.smartCaDiscountMode, 'none');
});

test('SmartCA one-click automatic discounts, optional custom rates and original prices', () => {
    const app = loadPricing(), state = app.state;
    const plans = [
        { duration_text: '1', price: 35000 },
        { duration_text: '6', price: 120000 },
        { duration_text: '12', price: 220000 }
    ];
    state.activeSmartCaTab = 'canhan';
    state.smartCaData = [{ type: 'canhan', name: 'Cá nhân', plans }];
    assert.equal(state.smartCaDiscountMode, 'none');
    for (const plan of plans) assert.equal(state.calculateFinalPrice(plan), plan.price);
    state.smartCaDiscountMode = 'auto';
    assert.deepEqual(plans.map(plan => state.getSmartCaDiscount(plan)), [10, 20, 30]);
    assert.deepEqual(plans.map(plan => state.calculateFinalPrice(plan)), [31500, 96000, 154000]);
    state.executeCopy(plans[1]);
    assert.ok(app.copied().includes('96.000 đ'));
    assert.ok(app.copied().includes('Đã giảm 20%'));
    state.smartCaCustomerType = 'competition';
    assert.deepEqual(plans.map(plan => state.getSmartCaDiscount(plan)), [30, 30, 30]);
    state.smartCaDiscountMode = 'custom'; state.discountRate = 10;
    assert.deepEqual(plans.map(plan => state.getSmartCaDiscount(plan)), [10, 10, 10]);
    state.smartCaDiscountMode = 'none';
    for (const plan of plans) assert.equal(state.calculateFinalPrice(plan), plan.price);
    state.executeCopy(plans[1]);
    assert.ok(!app.copied().includes('Đã giảm'));
    state.smartCaDiscountMode = 'auto'; state.smartCaCustomerType = 'term';
    state.activeSmartCaTab = '1lan';
    assert.equal(state.getSmartCaDiscount({ duration_text: '1', price: 20000 }), 10);
    state.activeSmartCaTab = 'canhan';
    assert.equal(state.getSmartCaDiscount(plans[2]), 30);
});
