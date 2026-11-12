const assert = require('node:assert/strict');
const test = require('node:test');
const { readPlans, loadPricing, roundFraction } = require('./helpers/pricing.cjs');

const source = [
    [300, 1050, 315000],
    [500, 900, 450000],
    [1000, 540, 540000],
    [2000, 495, 990000],
    [5000, 450, 2250000],
    [10000, 400, 4000000]
];

test('Inbot catalog and CSV match all six packages, unit prices, setup and MAX in the supplied table', () => {
    const { state } = loadPricing();
    const csv = readPlans(['inbot']);
    assert.equal(csv.length, 6);
    assert.equal(state.currentInbotPlans.length, 6);
    assert.equal(state.inbotSetupPrice, 300000);
    assert.equal(state.inbotMaxUnitPrice, 350);
    for (const [i, [quantity, unitPrice, price]] of source.entries()) {
        const plan = state.currentInbotPlans[i];
        assert.equal(plan.quantity, quantity);
        assert.equal(plan.unitPrice, unitPrice);
        assert.equal(plan.price, price);
        assert.equal(quantity * unitPrice, price);
        const row = csv.find(row => Number(row.duration_text.replace(/\D/g, '')) === quantity);
        assert.equal(Number(row.price), price);
        assert.equal(row.note, plan.note);
    }
    // The updated local price list must replace an outdated five-package server response.
    state.inbotData = [{ type: 'inbot_goi', plans: [{ duration_text: 'IB 500', price: 400000 }] }];
    assert.equal(state.currentInbotPlans.length, 6);
    assert.equal(state.currentInbotPlans.find(plan => plan.quantity === 500).price, 450000);
});

test('Inbot package/setup discounts and copied quotes enforce both policies for every mode', () => {
    const app = loadPricing(), state = app.state;
    const snapshot = JSON.stringify(state.inbotCatalog);
    const plans = [...state.currentInbotPlans, ...[10001, 15000].map(quantity => ({ duration_text: state.inbotMaxName, quantity, price: quantity * 350 }))];
    const conditions = { quantity: 0, existing: 20, revenue10to30: 30, revenue30plus: 40, competition: 40 };
    let cases = 0;
    for (const packageMode of ['none', 'auto', 'custom']) for (const setupMode of ['none', 'auto', 'custom']) {
        for (const [condition, customerCap] of Object.entries(conditions)) for (const plan of plans) {
            for (const requested of [0, 40, 100]) for (const setupRequested of [0, 50, 100]) {
              for (const vat of [8, 10]) for (const type of ['moi', 'giahan']) {
                state.inbotDiscountMode = packageMode; state.inbotSetupDiscountMode = setupMode;
                state.inbotCustomerType = condition; state.activeInbotType = type; state.vatRate = vat;
                state.discountInbot = requested; state.discountInbotSetup = setupRequested;
                const quantityCap = plan.quantity >= 10000 ? 40 : plan.quantity >= 5000 ? 30 : 20;
                const cap = Math.max(quantityCap, customerCap);
                const discount = packageMode === 'auto' ? cap : packageMode === 'custom' ? Math.min(requested, cap) : 0;
                const serviceNumerator = BigInt(plan.price) * BigInt(100 - discount);
                const setupCap = serviceNumerator > 50000000n ? 100 : 50;
                const setupDiscount = type === 'giahan' ? 0 : setupMode === 'auto' ? setupCap : setupMode === 'custom' ? Math.min(setupRequested, setupCap) : 0;
                const setupNumerator = type === 'moi' ? 300000n * BigInt(100 - setupDiscount) : 0n;
                const expected = roundFraction((serviceNumerator + setupNumerator) * BigInt(100 + vat), 10000n);
                const expectedFee = roundFraction(setupNumerator * BigInt(100 + vat), 10000n);
                assert.equal(state.getInbotMaxDiscount(plan), cap);
                assert.equal(state.getInbotDiscount(plan), discount);
                assert.equal(state.getInbotSetupMaxDiscount(plan), setupCap);
                assert.equal(state.getInbotSetupDiscount(plan), setupDiscount);
                assert.equal(state.calculateInbotSetupFee(plan), expectedFee);
                assert.equal(state.calculateInbotTotal(plan), expected);
                if (plan.quantity > 10000) {
                    state.inbotMaxAmount = plan.quantity;
                    assert.equal(state.inbotMaxPlan.price, plan.price);
                    state.executeInbotMaxCopy();
                } else state.executeInbotCopy(plan);
                assert.ok(app.copied().startsWith(plan.duration_text));
                assert.ok(app.copied().includes(state.formatPrice(expected)));
                assert.equal(app.copied().includes('Đã CK'), discount > 0);
                if (discount) assert.ok(app.copied().includes(`Đã CK ${discount}% dịch vụ;`));
                assert.equal(app.copied().includes('+ Phí khởi tạo:'), type === 'moi');
                if (type === 'moi') assert.ok(app.copied().includes(state.formatPrice(expectedFee)));
                if (setupDiscount) assert.ok(app.copied().includes(`(giảm ${setupDiscount}%)`));
                cases++;
              }
            }
        }
    }
    assert.equal(cases, 12960);
    assert.equal(JSON.stringify(state.inbotCatalog), snapshot);
});

test('Inbot setup cap uses strict post-discount, pre-VAT, unrounded revenue', () => {
    const { state } = loadPricing();
    state.inbotSetupDiscountMode = 'auto';
    for (const vat of [8, 10]) {
        state.vatRate = vat;
        for (const [price, cap] of [[499999, 50], [500000, 50], [500001, 100]]) {
            assert.equal(state.getInbotSetupMaxDiscount({ quantity: 1000, price }), cap);
        }
        assert.equal(state.getInbotSetupMaxDiscount({ quantity: 1000, price: 490000 }), 50);
        state.inbotDiscountMode = 'custom'; state.discountInbot = 20;
        const exact = { quantity: 1000, price: 625000 };
        assert.equal(state.calculateInbotPackagePrice(exact), 500000);
        assert.equal(state.getInbotSetupDiscount(exact), 50);
        assert.equal(state.calculateInbotSetupFee(exact), vat === 10 ? 165000 : 162000);
        assert.equal(state.calculateInbotTotal(exact), vat === 10 ? 715000 : 702000);
        state.inbotCustomerType = 'competition'; state.discountInbot = 40;
        const fractional = { quantity: 1000, price: 833334 };
        assert.equal(Math.round(state.calculateInbotPackagePrice(fractional)), 500000);
        assert.equal(state.getInbotSetupDiscount(fractional), 100);
        assert.equal(state.calculateInbotSetupFee(fractional), 0);
        state.inbotCustomerType = 'quantity'; state.inbotDiscountMode = 'none';
    }
    state.vatRate = 10;
    const thousand = state.currentInbotPlans.find(plan => plan.quantity === 1000);
    assert.equal(state.getInbotSetupDiscount(thousand), 100);
    state.inbotDiscountMode = 'auto';
    assert.equal(state.calculateInbotPackagePrice(thousand), 432000);
    assert.equal(state.getInbotSetupDiscount(thousand), 50);
    assert.equal(state.calculateInbotTotal(thousand), 640200);
    state.inbotSetupDiscountMode = 'custom'; state.discountInbotSetup = 100;
    assert.equal(state.getInbotSetupDiscount(thousand), 50);
    assert.equal(state.calculateInbotSetupFee(thousand), 165000);
    state.activeInbotType = 'giahan';
    assert.equal(state.getInbotSetupDiscount(thousand), 0);
    assert.equal(state.calculateInbotSetupFee(thousand), 0);
    assert.equal(state.calculateInbotTotal(thousand), 475200);
});

test('Inbot package caps follow exact quantity boundaries and OR customer conditions', () => {
    const { state } = loadPricing();
    assert.equal(state.inbotDiscountMode, 'none');
    assert.equal(state.inbotSetupDiscountMode, 'none');
    state.inbotDiscountMode = 'auto';
    for (const [quantity, cap] of [[300, 20], [4999, 20], [5000, 30], [9999, 30], [10000, 40], [10001, 40]]) {
        assert.equal(state.getInbotDiscount({ quantity, price: 1000000 }), cap);
    }
    const small = state.currentInbotPlans[0];
    for (const [condition, cap] of [['existing', 20], ['revenue10to30', 30], ['revenue30plus', 40], ['competition', 40], ['invalid', 20]]) {
        state.inbotCustomerType = condition;
        assert.equal(state.getInbotDiscount(small), cap);
    }
    state.inbotCustomerType = 'competition'; state.inbotSetupDiscountMode = 'auto';
    assert.equal(state.getInbotDiscount(null), 0);
    assert.equal(state.getInbotSetupDiscount(null), 0);
    state.inbotDiscountMode = 'custom'; state.discountInbot = -5;
    assert.equal(state.getInbotDiscount(small), 0);
    state.selectService({ id: 'hddt' });
    assert.equal(state.inbotDiscountMode, 'none');
    assert.equal(state.inbotSetupDiscountMode, 'none');
    assert.equal(state.inbotCustomerType, 'quantity');
    assert.equal(state.vatRate, 8);
    assert.equal(state.calculateInbotTotal(small), 664200);
});

test('Inbot MAX rejects invalid quantities and rounds only the final total', () => {
    const app = loadPricing(), state = app.state;
    for (const quantity of ['', 0, -1, 'abc', 10000, 10000.5, Infinity]) {
        state.inbotMaxAmount = quantity;
        assert.equal(state.inbotMaxPlan, null);
        state.executeInbotMaxCopy();
        assert.equal(app.copied(), '');
    }
    state.inbotMaxAmount = 10001;
    state.inbotDiscountMode = 'custom'; state.inbotSetupDiscountMode = 'custom';
    for (const vat of [8, 10]) for (let discount = 0; discount <= 40; discount++) for (const setupDiscount of [0, 50, 99, 100]) {
        state.vatRate = vat; state.discountInbot = discount; state.discountInbotSetup = setupDiscount;
        const plan = state.inbotMaxPlan;
        const expected = roundFraction((BigInt(plan.price) * BigInt(100 - discount) + 300000n * BigInt(100 - setupDiscount)) * BigInt(100 + vat), 10000n);
        assert.equal(state.calculateInbotTotal(plan), expected);
    }
});
