const assert = require('node:assert/strict');
const test = require('node:test');
const { loadPricing, roundFraction } = require('./helpers/pricing.cjs');

test('receipt fixed plans match source and use their own VAT/discount for totals and quotes', () => {
    const app = loadPricing(), state = app.state;
    const source = [['BL300', 300, 300000], ['BL500', 500, 420000], ['BL1.000', 1000, 670000], ['BL2.000', 2000, 1000000], ['BL5.000', 5000, 2150000], ['BL10.000', 10000, 3600000]];
    state.selectService({ id: 'bienlai' });
    assert.equal(state.vatRate, 8); assert.equal(state.receiptDiscount, 0);
    assert.equal(state.receiptHasSoftware, false);
    state.receiptHasSoftware = true;
    assert.equal(state.receiptCatalog.storageYears, 10);
    assert.equal(state.receiptTablePlans.length, 7);
    for (const [i, [name, quantity, price]] of source.entries()) {
        const plan = state.receiptTablePlans[i];
        assert.equal(plan.name, name); assert.equal(plan.quantity, quantity); assert.equal(plan.price, price);
        for (const vat of [8, 10]) for (const requested of [-5, 0, 5, 10, 15, 20, 25, 30, 35, 100]) {
            state.vatRate = vat; state.discountReceipt = requested;
            state.discountInvoice = 40; state.discountBhxh = 65; state.discountRate = 30;
            const discount = Math.max(0, Math.min(requested, 30));
            const expected = roundFraction(BigInt(price) * BigInt(100 - discount) * BigInt(100 + vat), 10000n);
            assert.equal(state.receiptDiscount, discount);
            assert.equal(state.calculateReceiptTotal(plan), expected);
            assert.equal(state.calculateReceiptTotal(plan, 0), roundFraction(BigInt(price) * BigInt(100 + vat), 100n));
            assert.equal(state.calculateReceiptTotal(plan, 100), roundFraction(BigInt(price) * 70n * BigInt(100 + vat), 10000n));
            state.executeReceiptCopy(plan);
            assert.ok(app.copied().includes(name)); assert.ok(app.copied().includes(state.formatPrice(expected)));
            assert.ok(app.copied().includes('VAT ' + vat + '%'));
            assert.ok(app.copied().includes('10 năm từ ngày phát hành'));
            if (discount) assert.ok(app.copied().includes('giảm ' + discount + '%'));
            else assert.ok(!app.copied().includes('giảm '));
        }
    }
});

test('receipt quantities over 10000 use 300/unit, reject invalid counts and reset safely', () => {
    const app = loadPricing(), state = app.state;
    state.selectService({ id: 'bienlai' });
    state.receiptHasSoftware = true;
    for (const value of ['', ' ', 'abc', 0, -1, 10000, 10000.5, Infinity, Number.MAX_SAFE_INTEGER]) {
        state.receiptCustomAmount = value;
        const plan = state.receiptTablePlans.at(-1);
        assert.equal(plan.price, null); assert.equal(state.calculateReceiptTotal(plan), null);
        state.executeReceiptCopy(plan); assert.equal(app.copied(), '');
    }
    for (const quantity of [10001, 12345, 50000]) for (const vat of [8, 10]) for (const discount of [0, 5, 30]) {
        state.receiptCustomAmount = quantity; state.vatRate = vat; state.discountReceipt = discount;
        const plan = state.receiptTablePlans.at(-1);
        assert.equal(plan.quantity, quantity); assert.equal(plan.price, quantity * 300);
        const expected = roundFraction(BigInt(quantity * 300) * BigInt(100 - discount) * BigInt(100 + vat), 10000n);
        assert.equal(state.calculateReceiptTotal(plan), expected);
        state.executeReceiptCopy(plan);
        assert.ok(app.copied().includes(state.formatPrice(expected)));
        assert.ok(app.copied().includes(new Intl.NumberFormat('vi-VN').format(quantity) + ' biên lai'));
    }
    state.selectService({ id: 'bienlai' });
    assert.equal(state.vatRate, 8); assert.equal(state.receiptDiscount, 0); assert.equal(state.receiptCustomAmount, '');
    assert.equal(state.receiptHasSoftware, false);
    assert.equal(state.calculateReceiptTotal(state.receiptTablePlans[0]), 1404000);
});

test('receipt service appears under CNTT without a server record and is not duplicated on reload', async () => {
    const data = {
        categories: [{ id: 'cntt', name: 'CNTT' }, { id: 'brcd', name: 'BRCD' }],
        services: [{ id: 'econtract', category_id: 'cntt', name: 'eContract', sort_order: 4 }, { id: 'internet', category_id: 'brcd', name: 'Internet', sort_order: 1 }],
        plans: []
    };
    const { state } = loadPricing({ from(table) { return { select() { return { data: data[table], order: async () => ({ data: data[table] }) }; } }; } });
    await state.fetchData();
    assert.equal(state.isLoading, false);
    const cntt = state.categories.find(category => category.id === 'cntt');
    assert.ok(cntt);
    assert.deepEqual(Array.from(cntt.services, service => service.id), ['econtract', 'bienlai']);
    state.selectService(cntt.services[1]);
    assert.equal(state.activeService.name, 'Biên lai điện tử');
    assert.equal(state.calculateReceiptTotal(state.receiptTablePlans[0]), 1404000);
    data.services.push({ ...state.receiptCatalog.service });
    await state.fetchData();
    assert.equal(state.categories.find(category => category.id === 'cntt').services.filter(service => service.id === 'bienlai').length, 1);
});

test('receipt charges setup once only without Invoice software and never discounts it with service rates', () => {
    const app = loadPricing(), state = app.state;
    state.selectService({ id: 'bienlai' });
    state.receiptCustomAmount = 10001;
    const plans = state.receiptTablePlans;
    for (const hasSoftware of [false, true]) for (const vat of [8, 10]) for (const requested of [0, 5, 15, 30, 100]) {
        state.receiptHasSoftware = hasSoftware; state.vatRate = vat; state.discountReceipt = requested;
        state.discountInvoiceSetup = 100; state.activeInvoiceSetupStatus = 'khong'; state.activeInvoiceType = 'giahan';
        const setup = hasSoftware ? 0 : 1000000;
        const setupWithVat = roundFraction(BigInt(setup) * BigInt(100 + vat), 100n);
        assert.equal(state.receiptSetupBase, setup); assert.equal(state.receiptSetupFee, setupWithVat);
        for (const plan of plans) {
            const discount = Math.min(requested, 30);
            const numerator = BigInt(plan.price) * BigInt(100 - discount) + BigInt(setup) * 100n;
            const expected = roundFraction(numerator * BigInt(100 + vat), 10000n);
            assert.equal(state.calculateReceiptTotal(plan), expected);
            state.executeReceiptCopy(plan);
            assert.ok(app.copied().includes(state.formatPrice(expected)));
            if (hasSoftware) assert.ok(app.copied().includes('đã có phần mềm Invoice, không thu phí khởi tạo'));
            else assert.ok(app.copied().includes('khởi tạo ' + state.formatPrice(setupWithVat)));
        }
    }
    state.receiptHasSoftware = false; state.vatRate = 8; state.discountReceipt = 30;
    assert.equal(state.calculateReceiptTotal(plans[0]), 1306800);
    state.receiptHasSoftware = true;
    assert.equal(state.calculateReceiptTotal(plans[0]), 226800);
    state.selectService({ id: 'bienlai' });
    assert.equal(state.receiptHasSoftware, false); assert.equal(state.receiptSetupFee, 1080000);
});
