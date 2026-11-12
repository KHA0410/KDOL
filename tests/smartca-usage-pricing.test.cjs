const assert = require('node:assert/strict');
const test = require('node:test');
const { loadPricing, roundFraction } = require('./helpers/pricing.cjs');

test('personal SmartCA usage prices include VAT 8%, convert once for VAT 10%, and ignore monthly discounts/advanced mode', () => {
    const app = loadPricing(), state = app.state;
    state.activeSmartCaTab = 'canhan'; state.smartCaPersonalMode = 'usage';
    assert.equal(state.isSmartCaUsage, true);
    assert.equal(state.smartCaUsageCatalog.includedVat, 8);
    const source = [['PS03', 3, 16200], ['PS20', 20, 37800], ['PS50', 50, 54000], ['PSMAX', 50, 49100]];
    assert.equal(state.smartCaUsagePlans.length, 4);
    for (const [i, [name, quantity, price]] of source.entries()) {
        const plan = state.smartCaUsagePlans[i];
        assert.equal(plan.name, name); assert.equal(plan.quantity, quantity); assert.equal(plan.price, price);
        for (const vat of [8, 10, 8]) for (const advanced of [false, true]) for (const mode of ['none', 'auto', 'custom']) {
            state.vatRate = vat; state.isAdvanced = advanced;
            state.smartCaDiscountMode = mode; state.discountRate = 30; state.smartCaCustomerType = 'competition';
            state.discountVnptCa = 60; state.receiptHasSoftware = false;
            const expected = roundFraction(BigInt(price) * BigInt(100 + vat), 108n);
            assert.equal(state.calculateSmartCaUsagePrice(plan), expected);
            if (vat === 8) assert.equal(expected, price);
            state.executeSmartCaUsageCopy(plan);
            assert.ok(app.copied().includes(name));
            assert.ok(app.copied().includes(quantity + ' lượt ký'));
            assert.ok(app.copied().includes(state.formatPrice(expected)));
            assert.ok(app.copied().includes('VAT ' + vat + '%'));
            assert.ok(!app.copied().includes('tháng'));
            assert.ok(!app.copied().includes('giảm'));
            assert.ok(!app.copied().includes('Nâng cao'));
        }
    }
});

test('PSMAX uses the supplied 982 VND per use at VAT 8% and guards invalid quantities', () => {
    const app = loadPricing(), state = app.state;
    for (const quantity of [1, 49, 50, 51, 12345]) for (const vat of [8, 10]) {
        state.smartCaUsageAmount = quantity; state.vatRate = vat;
        const plan = state.smartCaUsagePlans.at(-1);
        assert.equal(plan.price, quantity * 982);
        const expected = roundFraction(BigInt(quantity * 982) * BigInt(100 + vat), 108n);
        assert.equal(state.calculateSmartCaUsagePrice(plan), expected);
        state.executeSmartCaUsageCopy(plan);
        assert.ok(app.copied().includes(state.formatPrice(expected)));
        assert.ok(app.copied().includes(new Intl.NumberFormat('vi-VN').format(quantity) + ' lượt ký'));
    }
    state.vatRate = 10; state.smartCaUsageAmount = 50;
    assert.equal(state.calculateSmartCaUsagePrice(state.smartCaUsagePlans.at(-1)), 50009);
    for (const quantity of ['', ' ', 0, -1, 0.5, 'abc', Infinity, Number.MAX_SAFE_INTEGER]) {
        state.smartCaUsageAmount = quantity;
        const plan = state.smartCaUsagePlans.at(-1);
        assert.equal(plan.price, null); assert.equal(state.calculateSmartCaUsagePrice(plan), null);
        const previous = app.copied(); state.executeSmartCaUsageCopy(plan); assert.equal(app.copied(), previous);
        assert.equal(state.smartCaUsagePlans[0].price, 16200);
    }
});

test('usage selection applies only to personal SmartCA and resets on reopening signatures', () => {
    const { state } = loadPricing();
    assert.equal(state.smartCaPersonalMode, 'term');
    state.smartCaPersonalMode = 'usage'; state.activeSmartCaTab = 'canhan';
    assert.equal(state.isSmartCaUsage, true);
    for (const type of ['nhanvien', 'doanhnghiep', '1lan']) {
        state.activeSmartCaTab = type; assert.equal(state.isSmartCaUsage, false);
    }
    state.activeSmartCaTab = 'canhan'; assert.equal(state.isSmartCaUsage, true);
    state.smartCaUsageAmount = 99; state.vatRate = 10;
    state.selectService({ id: 'cks' });
    assert.equal(state.smartCaPersonalMode, 'term'); assert.equal(state.smartCaUsageAmount, 50);
    assert.equal(state.vatRate, 8);
});
