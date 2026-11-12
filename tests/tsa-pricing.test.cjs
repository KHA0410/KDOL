const assert = require('node:assert/strict');
const test = require('node:test');
const { loadPricing, roundFraction } = require('./helpers/pricing.cjs');

test('TSA source prices, unit rates and strict Min/Max boundaries match the supplied table', () => {
    const { state } = loadPricing();
    const source = [[5000, 900, 4500000], [10000, 800, 8000000], [20000, 700, 14000000], [50000, 600, 30000000]];
    assert.equal(state.currentTsaPlans.length, source.length);
    source.forEach(([quantity, rate, price], i) => {
        const plan = state.currentTsaPlans[i];
        assert.equal(plan.quantity, quantity); assert.equal(plan.unitPrice, rate); assert.equal(plan.price, price);
        assert.equal(plan.price, quantity * rate);
        assert.equal(plan.duration_text, 'TSA CeCA ' + new Intl.NumberFormat('vi-VN').format(quantity));
    });
    for (const [type, quantity, price] of [['min', 1, 1000], ['min', 4999, 4999000], ['max', 50001, 25000500]]) {
        assert.equal(state.getTsaCustomPlan(type, quantity).price, price);
    }
    for (const [type, quantity] of [['min', 0], ['min', 5000], ['min', 1.5], ['max', 50000], ['max', 'abc'], ['max', Infinity], ['max', Number.MAX_SAFE_INTEGER], ['other', 1]]) {
        assert.equal(state.getTsaCustomPlan(type, quantity), null);
    }
});

test('TSA discount alone applies to standalone and bundled TSA, capped at 30%, with both VAT rates', () => {
    const app = loadPricing(), state = app.state;
    for (const vat of [8, 10]) for (const requested of [-5, 0, 15, 30, 100]) {
        const applied = Math.max(0, Math.min(requested, 30));
        state.vatRate = vat; state.discountTsa = requested;
        assert.equal(state.tsaDiscount, applied);
        for (const tsa of state.currentTsaPlans) {
            state.selectEcontractMode('econtract_ceca_tab');
            state.discountEcontract = 100;
            const standalone = roundFraction(BigInt(tsa.price) * BigInt(100 - applied) * BigInt(100 + vat), 10000n);
            assert.equal(state.calculateEcontractTotal(tsa), standalone);
            state.executeEcontractCopy(tsa);
            assert.ok(app.copied().includes('giảm TSA ' + applied + '%'));
            assert.ok(app.copied().includes(state.formatPrice(standalone)));
            for (const mode of ['econtract_saas', 'econtract_onprem']) for (const offer of ['none', 'auto', 'custom']) {
                state.selectEcontractMode(mode);
                state.econtractDiscountMode = offer; state.econtractCustomerType = 'competition';
                state.discountEcontract = 100; state.discountEcontractSetup = 100;
                state.addonSmsCount = 7; state.addonEkycCount = 3; state.addonStorageCount = 2;
                state.addonCecaPackage = String(tsa.quantity);
                const otherAddons = 7 * 800 + 3 * 3000 + 2 * 90000;
                const discountedTsa = tsa.price * (100 - applied) / 100;
                assert.equal(state.totalEcontractAddonNoVat, otherAddons + discountedTsa);
                const plan = state.currentEcontractPlans[0];
                const serviceDiscount = offer === 'none' ? 0 : mode === 'econtract_saas' ? 30 : 0;
                const setupDiscount = offer === 'none' ? 0 : mode === 'econtract_saas' ? 100 : 30;
                const numerator = BigInt(plan.price) * BigInt(100 - serviceDiscount)
                    + BigInt(mode === 'econtract_saas' ? 2000000 : 100000000) * BigInt(100 - setupDiscount)
                    + BigInt(otherAddons + discountedTsa) * 100n;
                const total = roundFraction(numerator * BigInt(100 + vat), 10000n);
                assert.equal(state.calculateEcontractTotal(plan), total);
                state.executeEcontractCopy(plan);
                assert.ok(app.copied().includes(state.formatPrice(total)));
                assert.ok(app.copied().includes(tsa.duration_text));
                assert.ok(app.copied().includes('giảm TSA ' + applied + '%'));
            }
        }
    }
});

test('bundled TSA Min/Max require valid counts, prevent incomplete quotes, and reset safely', () => {
    const app = loadPricing(), state = app.state;
    state.selectEcontractMode('econtract_saas');
    state.discountTsa = 30;
    const plan = state.currentEcontractPlans[0];
    for (const [type, quantity, expected] of [['min', 4999, 3499300], ['max', 50001, 17500350]]) {
        state.addonCecaPackage = type; state.addonCecaAmount = quantity;
        assert.equal(state.econtractAddonError, '');
        assert.equal(state.totalEcontractAddonNoVat, expected);
        assert.equal(state.econtractTsaAddonPlan.duration_text, type === 'min' ? 'TSA CeCA Min' : 'TSA CeCA Max');
        for (const vat of [8, 10]) {
            state.vatRate = vat;
            assert.equal(state.calculateEcontractTotal(plan), roundFraction(BigInt(2350000 + expected) * BigInt(100 + vat), 100n));
            state.executeEcontractCopy(plan);
            assert.ok(app.copied().includes(new Intl.NumberFormat('vi-VN').format(quantity)));
        }
    }
    for (const [type, quantity] of [['min', ''], ['min', 5000], ['min', -1], ['min', 1.5], ['max', 50000], ['max', 'abc']]) {
        state.addonCecaPackage = type; state.addonCecaAmount = quantity;
        assert.ok(state.econtractAddonError); assert.equal(state.totalEcontractAddonNoVat, null);
        assert.equal(state.calculateEcontractTotal(plan), null);
        const before = app.copied(); state.executeEcontractCopy(plan); assert.equal(app.copied(), before);
    }
    state.resetEcontractOptions();
    assert.equal(state.discountTsa, 0); assert.equal(state.addonCecaAmount, '');
    assert.equal(state.addonCecaPackage, 'none'); assert.equal(state.totalEcontractAddonNoVat, 0);
});

test('unified TSA table keeps independent Min/Max inputs and quotes alongside all four fixed plans', () => {
    const app = loadPricing(), state = app.state;
    state.selectEcontractMode('econtract_ceca_tab');
    const names = ['TSA CeCA Min', 'TSA CeCA 5.000', 'TSA CeCA 10.000', 'TSA CeCA 20.000', 'TSA CeCA 50.000', 'TSA CeCA Max'];
    assert.deepEqual(Array.from(state.currentEcontractPlans, plan => plan.duration_text), names);
    for (const index of [0, 5]) {
        const plan = state.currentEcontractPlans[index];
        assert.equal(plan.price, null); assert.equal(state.calculateEcontractTotal(plan), null);
        state.executeEcontractCopy(plan); assert.equal(app.copied(), '');
    }
    state.tsaQuantities.min = 1234; state.tsaQuantities.max = 54321;
    for (const vat of [8, 10]) for (const discount of [0, 10, 30, 100]) {
        state.vatRate = vat; state.discountTsa = discount;
        for (const [index, quantity, price] of [[0, 1234, 1234000], [5, 54321, 27160500]]) {
            const plan = state.currentEcontractPlans[index];
            assert.equal(plan.quantity, quantity); assert.equal(plan.price, price);
            const expected = roundFraction(BigInt(price) * BigInt(100 - Math.min(discount, 30)) * BigInt(100 + vat), 10000n);
            assert.equal(state.calculateEcontractTotal(plan), expected);
            state.executeEcontractCopy(plan);
            assert.ok(app.copied().includes(state.formatPrice(expected)));
            assert.ok(app.copied().includes(plan.duration_text));
        }
    }
    state.tsaQuantities.min = 5000;
    assert.equal(state.calculateEcontractTotal(state.currentEcontractPlans[0]), null);
    assert.notEqual(state.calculateEcontractTotal(state.currentEcontractPlans[5]), null);
    assert.equal(state.currentEcontractPlans[1].price, 4500000);
    state.resetEcontractOptions();
    assert.equal(state.tsaQuantities.min, ''); assert.equal(state.tsaQuantities.max, '');
});
