const assert = require('node:assert/strict');
const test = require('node:test');
const { loadPricing, roundFraction } = require('./helpers/pricing.cjs');

const source = [
    ['cb10', 'CB10 HKD NEW 24T', 'new', 1896000, 24, 5000],
    ['cb11', 'CB11 HKD NEW 36T', 'new', 2484000, 36, 5000],
    ['cb7', 'CB7 HKD_89', 'new', 1602000, 18, 5000],
    ['cb8', 'CB8 HKD_99', 'new', 1188000, 12, 5000],
    ['cb1', 'CB1 HKD 70', 'new', 800000, 12, 500],
    ['cb2', 'CB2 HKD 70', 'new', 750000, 12, 500],
    ['cb3', 'CB3 HKD 70', 'new', 1220000, 12, 500],
    ['cb4', 'CB4 HKD 70', 'new', 1170000, 12, 500],
    ['cb5', 'CB5 HKD 70', 'new', 1420000, 12, 1000],
    ['cb6', 'CB6 HKD 70', 'new', 1370000, 12, 1000],
    ['cb9', 'CB9 HKD Tiêu chuẩn', 'renewal', 1602000, 12, 5000],
    ['cb12', 'CB12 HKD_TC 24T', 'renewal', 2400000, 24, 5000],
    ['cb13', 'CB13 HKD_TC 36T', 'renewal', 3060000, 36, 5000],
    ['hkd-ud', 'CB_HKD_UD', 'free', 0, undefined, 1000],
    ['hkd-ud2', 'CB HKD_UD2', 'free', 0, undefined, 1000]
];

test('HKD all 15 names, prices, durations and invoice quantities match the supplied PDF', () => {
    const { state } = loadPricing();
    assert.equal(state.hkdCatalog.plans.length, 15);
    for (const [id, name, group, price, months, quantity] of source) {
        const plan = state.hkdCatalog.plans.find(plan => plan.id === id);
        assert.ok(plan, id);
        assert.equal(plan.name, name); assert.equal(plan.group, group);
        assert.equal(plan.price, price); assert.equal(plan.months, months);
        assert.equal(plan.invoiceQuantity, quantity);
    }
    assert.equal(state.hkdCatalog.area, 'TP.HCM');
    assert.equal(state.hkdCatalog.maxDiscount, 40);
    assert.equal(state.hkdCatalog.plans.find(plan => plan.id === 'hkd-ud').referencePrice, 1220000);
    assert.equal(state.hkdCatalog.plans.find(plan => plan.id === 'hkd-ud2').referencePrice, 970000);
});

test('HKD paid totals and copied quotes use capped combo discounts then VAT, with no unrelated service fees', () => {
    const app = loadPricing(), state = app.state;
    state.selectService({ id: 'hkd' });
    assert.equal(state.vatRate, 8); assert.equal(state.hkdDiscountMode, 'none');
    state.posSetupAmount = 9999999; state.includeInvoiceDesign = true;
    state.activeInvoiceSetupStatus = 'thu'; state.receiptHasSoftware = false;
    state.addonSmsCount = 100; state.discountVnptCa = 60;
    const original = JSON.stringify(state.hkdCatalog);
    for (const group of ['new', 'renewal']) {
        state.selectHkdGroup(group);
        assert.equal(state.currentHkdPlans.length, group === 'new' ? 10 : 3);
        for (const mode of ['none', 'custom']) for (const requested of [-5, 0, 5, 15, 30, 40, 65, 100]) for (const vat of [8, 10]) {
            state.hkdDiscountMode = mode; state.discountHkd = requested; state.vatRate = vat;
            const applied = mode === 'custom' ? Math.min(40, Math.max(0, requested)) : 0;
            for (const plan of state.currentHkdPlans) {
                const expected = roundFraction(BigInt(plan.price) * BigInt(100 - applied) * BigInt(100 + vat), 10000n);
                assert.equal(state.getHkdDiscount(plan), applied);
                assert.equal(state.calculateHkdPackagePrice(plan), plan.price * (100 - applied) / 100);
                assert.equal(state.calculateHkdTotal(plan), expected);
                state.executeHkdCopy(plan);
                assert.ok(app.copied().includes(plan.name));
                assert.ok(app.copied().includes(state.formatPrice(expected)));
                assert.ok(app.copied().includes(`VAT ${vat}%`));
                assert.ok(app.copied().includes('Chưa gồm USB Token'));
                for (const component of plan.components) assert.ok(app.copied().includes(component));
                if (applied) assert.ok(app.copied().includes(`chiết khấu ${applied}%`));
                else assert.ok(!app.copied().includes('chiết khấu'));
                if (plan.firstUseOnly) {
                    assert.ok(app.copied().includes('Chỉ áp dụng lần đầu sử dụng'));
                    assert.ok(app.copied().includes('đã gồm 6 tháng miễn phí'));
                    assert.ok(app.copied().includes('không tặng kèm'));
                }
                if (group === 'renewal') assert.ok(app.copied().includes('Gia hạn từ năm thứ 2'));
            }
        }
    }
    assert.equal(JSON.stringify(state.hkdCatalog), original);
});

test('HKD free offers never charge their reference prices and reset clears paid discounts', () => {
    const app = loadPricing(), state = app.state;
    const stale = state.currentHkdPlans[0];
    state.discountHkd = 40; state.hkdDiscountMode = 'custom';
    state.selectHkdGroup('free');
    assert.equal(state.currentHkdPlans.length, 2);
    for (const vat of [8, 10]) for (const requested of [0, 40, 100]) {
        state.vatRate = vat; state.hkdDiscountMode = 'custom'; state.discountHkd = requested;
        for (const plan of state.currentHkdPlans) {
            assert.equal(state.getHkdDiscount(plan), 0);
            assert.equal(state.calculateHkdTotal(plan), 0);
            state.executeHkdCopy(plan);
            assert.ok(app.copied().includes('Miễn phí (không thu tiền)'));
            assert.ok(app.copied().includes('31/12/2026'));
            assert.ok(!app.copied().includes('VAT 8%'));
            assert.ok(!app.copied().includes('chiết khấu'));
            assert.ok(!app.copied().includes(state.formatPrice(plan.referencePrice)));
        }
    }
    const previous = app.copied();
    state.executeHkdCopy(stale); assert.equal(app.copied(), previous);
    state.selectHkdGroup('renewal');
    assert.equal(state.hkdDiscountMode, 'none'); assert.equal(state.discountHkd, 0);
    state.selectHkdGroup('unknown'); assert.equal(state.activeHkdGroup, 'renewal');
    state.selectService({ id: 'hkd' });
    assert.equal(state.activeHkdGroup, 'new'); assert.equal(state.hkdDiscountMode, 'none');
    assert.equal(state.discountHkd, 0); assert.equal(state.vatRate, 8);
    assert.equal(state.calculateHkdTotal(state.currentHkdPlans[0]), 2047680);
});

test('HKD appears under CNTT without a server record and never duplicates on reload', async () => {
    const data = {
        categories: [{ id: 'cntt', name: 'Công nghệ thông tin' }, { id: 'brcd', name: 'Băng rộng cố định' }],
        services: [{ id: 'cks', category_id: 'cntt', name: 'Chữ ký số', sort_order: 1 }],
        plans: []
    };
    const { state } = loadPricing({ from(table) { return { select() { return { data: data[table], order: async () => ({ data: data[table] }) }; } }; } });
    await state.fetchData();
    const category = state.categories.find(category => category.id === 'cntt');
    const hkd = category.services.find(service => service.id === 'hkd');
    assert.equal(hkd.name, 'HKD'); assert.equal(hkd.category_id, 'cntt');
    assert.deepEqual(Array.from(category.services, service => service.id), ['cks', 'bienlai', 'hkd']);
    state.selectService(hkd); assert.equal(state.activeService.id, 'hkd');
    assert.equal(state.currentHkdPlans.length, 10);
    data.services.push({ ...state.hkdCatalog.service });
    await state.fetchData();
    assert.equal(state.categories.find(category => category.id === 'cntt').services.filter(service => service.id === 'hkd').length, 1);
});
