const assert = require('node:assert/strict');
const test = require('node:test');
const { loadPricing, roundFraction } = require('./helpers/pricing.cjs');

test('SmartCA household catalog has exact advanced prices and a dedicated tab without server records', () => {
    const { state } = loadPricing();
    assert.equal(state.smartCaHouseholdCatalog.includedVat, 8);
    state.smartCaData = [{ type: 'canhan', name: 'Personal', plans: [] }, { type: 'doanhnghiep', name: 'Enterprise', plans: [] }, { type: '1lan', name: 'Once', plans: [] }];
    assert.deepEqual(Array.from(state.smartCaHouseholdCatalog.plans, plan => [plan.duration_text, plan.price]), [['12', 540000], ['24', 1026000], ['36', 1458000]]);
    assert.deepEqual(Array.from(state.smartCaTabs, tab => tab.type), ['canhan', 'doanhnghiep', 'hokinhdoanh', '1lan']);
    state.smartCaData.push({ type: 'hokinhdoanh', name: 'Stale server entry', plans: [] });
    assert.equal(state.smartCaTabs.filter(tab => tab.type === 'hokinhdoanh').length, 1);
    state.activeSmartCaTab = 'hokinhdoanh'; state.smartCaHouseholdFirstActivation = false;
    assert.equal(state.currentSmartCaPlans.length, 3);
    assert.equal(state.isSmartCaHousehold, true); assert.equal(state.isSmartCaUsage, false);
});

test('household advanced prices use their own VAT basis once, with normal SmartCA term caps and exact quotes', () => {
    const app = loadPricing(), state = app.state;
    state.activeSmartCaTab = 'hokinhdoanh'; state.smartCaHouseholdFirstActivation = false;
    for (const sourceVat of [0, 8, 10]) {
        state.smartCaHouseholdCatalog.includedVat = sourceVat;
        for (const vat of [8, 10]) for (const advanced of [false, true]) for (const mode of ['none', 'auto', 'custom']) for (const requested of [0, 10, 30, 60]) {
            state.vatRate = vat; state.isAdvanced = advanced; state.smartCaDiscountMode = mode;
            state.smartCaCustomerType = 'term'; state.discountRate = requested;
            for (const plan of state.currentSmartCaPlans) {
                const discount = mode === 'none' ? 0 : mode === 'auto' ? 30 : Math.min(requested, 30);
                const denominator = BigInt((100 + sourceVat) * 100);
                const expected = roundFraction(BigInt(plan.price) * BigInt(100 + vat) * BigInt(100 - discount), denominator);
                const original = roundFraction(BigInt(plan.price) * BigInt(100 + vat), BigInt(100 + sourceVat));
                assert.equal(state.calculateFinalPrice(plan), expected);
                assert.equal(state.calculateSmartCaOriginalPrice(plan), original);
                assert.equal(state.getSmartCaDiscount(plan), discount);
                state.executeCopy(plan);
                assert.ok(app.copied().includes('Hộ kinh doanh (Nâng cao)'));
                assert.ok(app.copied().includes(plan.duration_text + ' tháng'));
                assert.ok(app.copied().includes(state.formatPrice(expected)));
                assert.ok(app.copied().includes(vat + '% VAT'));
                if (discount) assert.ok(app.copied().includes('Đã giảm ' + discount + '%'));
            }
        }
    }
});

test('first-activation free trial is separate and becomes unavailable immediately after an existing activation is selected', () => {
    const app = loadPricing(), state = app.state;
    state.activeSmartCaTab = 'hokinhdoanh';
    state.smartCaDiscountMode = 'auto'; state.smartCaCustomerType = 'competition';
    let trial;
    for (const vat of [8, 10]) {
        state.vatRate = vat; state.smartCaHouseholdFirstActivation = true;
        assert.equal(state.currentSmartCaPlans.length, 4);
        trial = state.currentSmartCaPlans[0];
        assert.equal(trial.duration_text, '6'); assert.equal(trial.price, 0);
        assert.equal(state.calculateFinalPrice(trial), 0); assert.equal(state.getSmartCaDiscount(trial), 0);
        state.executeCopy(trial); assert.ok(app.copied().includes('Miễn phí 6 tháng cho lần đầu kích hoạt'));
        assert.ok(!app.copied().includes('Đã giảm'));
    }
    state.smartCaHouseholdFirstActivation = false;
    assert.equal(state.currentSmartCaPlans.length, 3);
    assert.ok(state.currentSmartCaPlans.every(plan => !plan.firstActivationOnly));
    assert.equal(state.calculateFinalPrice(trial), null);
    const before = app.copied(); state.executeCopy(trial); assert.equal(app.copied(), before);
    state.selectService({ id: 'cks' });
    assert.equal(state.smartCaHouseholdFirstActivation, true); assert.equal(state.vatRate, 8);
});
