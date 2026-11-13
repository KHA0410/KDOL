const assert = require('node:assert/strict');
const test = require('node:test');
const { readPlans, loadPricing, roundFraction } = require('./helpers/pricing.cjs');

test('Invoice original price disables setup discounts in fixed/MAX prices and copied quotes', () => {
    const app = loadInvoice(), state = app.state;
    const plan = state.currentInvoicePlans.find(plan => state.getInvoiceQuantity(plan) === 300);
    state.discountInvoice = 40; state.invoiceMaxAmount = 10001;
    for (const vat of [8, 10]) for (const requested of [-5, 0, 50, 100, 150]) {
        state.vatRate = vat; state.discountInvoiceSetup = requested;
        for (const mode of ['none', 'auto', 'custom', 'none']) {
            state.invoiceDiscountMode = mode;
            const setupDiscount = mode === 'none' ? 0 : Math.min(100, Math.max(0, requested));
            assert.equal(state.invoiceSetupDiscount, setupDiscount);
            for (const [type, setupStatus] of [['moi', 'thu'], ['moi', 'khong'], ['giahan', 'thu']]) {
                state.activeInvoiceType = type; state.activeInvoiceSetupStatus = setupStatus;
                const setupBase = type === 'moi' && setupStatus === 'thu' ? 1000000 : 0;
                const fee = roundFraction(BigInt(setupBase) * BigInt(100 - setupDiscount) * BigInt(100 + vat), 10000n);
                assert.equal(Math.round(state.calculateInvoiceSetupFee()), fee);
                const packageDiscount = mode === 'none' ? 0 : 20;
                const expected = roundFraction(390000n * BigInt(100 - packageDiscount) * BigInt(100 + vat)
                    + BigInt(setupBase) * BigInt(100 - setupDiscount) * BigInt(100 + vat), 10000n);
                assert.equal(Math.round(state.calculateInvoiceTotal(plan.price, plan)), expected);
                state.executeInvoiceCopy(plan);
                assert.ok(app.copied().includes(state.formatPrice(expected)));
                if (fee) assert.ok(app.copied().includes('Khởi tạo: ' + state.formatPrice(fee)));
                const maxDiscount = mode === 'none' ? 0 : 40;
                const expectedMax = roundFraction(BigInt(10001 * 390) * BigInt(100 - maxDiscount) * BigInt(100 + vat)
                    + BigInt(setupBase) * BigInt(100 - setupDiscount) * BigInt(100 + vat), 10000n);
                assert.equal(Math.round(state.calculateInvoiceMaxTotal()), expectedMax);
                state.executeInvoiceMaxCopy();
                assert.ok(app.copied().includes(state.formatPrice(expectedMax)));
                if (fee) assert.ok(app.copied().includes('Khởi tạo: ' + state.formatPrice(fee)));
            }
        }
    }
    state.activeInvoiceSubTab = 'invoice_nt'; state.invoiceDiscountMode = 'none';
    state.activeInvoiceType = 'moi'; state.activeInvoiceSetupStatus = 'thu';
    state.vatRate = 8; state.discountInvoiceSetup = 50;
    assert.equal(state.calculateInvoiceSetupFee(), 540000);
});

function loadInvoice() {
    const app = loadPricing();
    app.state.invoiceData = Object.values(readPlans(['invoice']).reduce((groups, plan) => {
        (groups[plan.plan_group] ??= { type: plan.plan_group, plans: [] }).plans.push(plan);
        return groups;
    }, {}));
    app.state.activeHddtMainTab = 'invoice';
    app.state.activeInvoiceSubTab = 'invoice_new';
    return app;
}

test('Invoice fixed packages enforce quantity/customer rules in prices and copied quotes', () => {
    const app = loadInvoice(), state = app.state;
    const conditions = { quantity: 0, existing: 20, revenue10to30: 30, largeExisting: 40, competition: 40 };
    const plans = state.currentInvoicePlans;
    assert.equal(plans.length, 6);
    assert.equal(state.invoiceDiscountMode, 'none');
    assert.equal(state.invoiceCustomerType, 'quantity');
    const snapshot = JSON.stringify(state.invoiceData);
    let cases = 0;
    for (const mode of ['none', 'auto', 'custom']) for (const [condition, customerCap] of Object.entries(conditions)) {
        for (const plan of plans) for (const requested of [0, 10, 20, 30, 40, 100]) for (const vat of [8, 10]) {
            for (const [type, setup] of [['moi', 'thu'], ['moi', 'khong'], ['giahan', 'thu']]) for (const setupDiscount of [0, 50, 100]) {
                state.invoiceDiscountMode = mode; state.invoiceCustomerType = condition;
                state.discountInvoice = requested; state.vatRate = vat;
                state.activeInvoiceType = type; state.activeInvoiceSetupStatus = setup;
                state.discountInvoiceSetup = setupDiscount;
                const quantity = Number(plan.duration_text.replace(/\D/g, ''));
                const quantityCap = quantity >= 10000 ? 40 : quantity >= 5000 ? 30 : 20;
                const cap = Math.max(quantityCap, customerCap);
                const applied = mode === 'auto' ? cap : mode === 'custom' ? Math.min(requested, cap) : 0;
                assert.equal(state.getInvoiceMaxDiscount(plan), cap);
                assert.equal(state.getInvoiceDiscount(plan), applied);
                const setupBase = type === 'moi' && setup === 'thu' ? 1000000 : 0;
                const appliedSetupDiscount = mode === 'none' ? 0 : setupDiscount;
                const numerator = BigInt(plan.price) * BigInt(100 - applied) * BigInt(100 + vat)
                    + BigInt(setupBase) * BigInt(100 - appliedSetupDiscount) * BigInt(100 + vat);
                const expected = roundFraction(numerator, 10000n);
                assert.equal(Math.round(state.calculateInvoiceTotal(plan.price, plan)), expected);
                assert.equal(Math.round(state.calculateInvoicePackagePrice(plan)), roundFraction(BigInt(plan.price) * BigInt(100 - applied), 100n));
                state.executeInvoiceCopy(plan);
                assert.ok(app.copied().includes(state.formatPrice(expected)));
                assert.equal(app.copied().includes('Đã CK'), applied > 0);
                if (applied) assert.ok(app.copied().includes(`Đã CK ${applied}%; ${state.getInvoiceDiscountReason(plan)}`));
                assert.equal((plan.unitPrices.creation + plan.unitPrices.transmission) * quantity, Number(plan.price));
                cases++;
            }
        }
    }
    assert.equal(cases, 9720);
    assert.equal(JSON.stringify(state.invoiceData), snapshot);
});

test('Invoice caps are exact at 5000/10000, safe for missing quantities, and allow OR conditions', () => {
    const { state } = loadInvoice();
    state.invoiceDiscountMode = 'auto';
    for (const [quantity, cap] of [[1, 20], [4999, 20], [5000, 30], [9999, 30], [10000, 40], [10001, 40]]) {
        assert.equal(state.getInvoiceDiscount({ quantity }), cap);
    }
    const small = { duration_text: 'HD 300 NEW', price: 390000 };
    state.invoiceCustomerType = 'competition'; assert.equal(state.getInvoiceDiscount(small), 40);
    state.invoiceCustomerType = 'largeExisting'; assert.equal(state.getInvoiceDiscount(small), 40);
    state.invoiceCustomerType = 'revenue10to30'; assert.equal(state.getInvoiceDiscount(small), 30);
    state.invoiceCustomerType = 'existing'; assert.equal(state.getInvoiceDiscount(small), 20);
    state.invoiceCustomerType = 'invalid'; assert.equal(state.getInvoiceDiscount(small), 20);
    state.invoiceCustomerType = 'competition';
    for (const quantity of [0, -1, 1.5, '', 'abc', NaN]) assert.equal(state.getInvoiceDiscount({ quantity }), 0);
    assert.equal(state.getInvoiceDiscount(null), 0);
    state.invoiceCustomerType = 'quantity'; state.invoiceDiscountMode = 'custom'; state.discountInvoice = 40;
    assert.equal(state.getInvoiceDiscount(small), 20);
    state.discountInvoice = -5; assert.equal(state.getInvoiceDiscount(small), 0);
    state.invoiceDiscountMode = 'none'; state.discountInvoice = 40;
    assert.equal(state.getInvoiceDiscount(small), 0);
    state.selectService({ id: 'hddt' });
    assert.equal(state.invoiceDiscountMode, 'none'); assert.equal(state.invoiceCustomerType, 'quantity');
});

test('Invoice MAX totals and copied discounts match the same policy', () => {
    const app = loadInvoice(), state = app.state;
    let cases = 0;
    for (const mode of ['none', 'auto', 'custom']) for (const requested of [0, 10, 20, 30, 40, 100]) {
        for (const vat of [8, 10]) for (const [type, setup] of [['moi', 'thu'], ['moi', 'khong'], ['giahan', 'thu']]) {
            state.invoiceDiscountMode = mode; state.discountInvoice = requested; state.vatRate = vat;
            state.invoiceMaxAmount = 10001; state.activeInvoiceType = type; state.activeInvoiceSetupStatus = setup;
            const applied = mode === 'auto' ? 40 : mode === 'custom' ? Math.min(requested, 40) : 0;
            const setupBase = type === 'moi' && setup === 'thu' ? 1000000 : 0;
            const expected = roundFraction(BigInt(10001 * 390) * BigInt(100 - applied) * BigInt(100 + vat)
                + BigInt(setupBase) * 100n * BigInt(100 + vat), 10000n);
            assert.equal(state.invoiceMaxDiscount, applied);
            assert.equal(Math.round(state.calculateInvoiceMaxTotal()), expected);
            state.executeInvoiceMaxCopy();
            assert.ok(app.copied().includes(state.formatPrice(expected)));
            if (applied) assert.ok(app.copied().includes(`Đã CK ${applied}%;`));
            cases++;
        }
    }
    assert.equal(cases, 108);
});

test('Invoice policy does not change TVAN calculations', () => {
    const app = loadInvoice(), state = app.state;
    state.invoiceDiscountMode = 'auto'; state.invoiceCustomerType = 'competition'; state.discountInvoice = 25;
    state.activeInvoiceType = 'giahan'; state.vatRate = 10;
    for (const [mainTab, subTab, count] of [['invoice', 'invoice_nt', 6]]) {
        state.activeHddtMainTab = mainTab; state.activeInvoiceSubTab = subTab;
        assert.equal(state.isInvoiceDiscountPolicy, false);
        assert.equal(state.currentInvoicePlans.length, count);
        for (const plan of state.currentInvoicePlans) {
            assert.equal(state.getInvoiceDiscount(plan), 25);
            const expected = roundFraction(BigInt(plan.price) * 75n * 110n, 10000n);
            assert.equal(Math.round(state.calculateInvoiceTotal(plan.price)), expected);
            state.executeInvoiceCopy(plan);
            assert.ok(app.copied().includes('Đã CK 25%'));
            assert.ok(!app.copied().includes('; Số lượng'));
        }
        state.invoiceMaxAmount = 5000001;
        const unit = 110;
        const expected = roundFraction(BigInt(state.invoiceMaxAmount * unit) * 75n * 110n, 10000n);
        assert.equal(Math.round(state.calculateInvoiceMaxTotal()), expected);
    }
});
