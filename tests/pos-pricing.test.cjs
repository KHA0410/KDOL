const assert = require('node:assert/strict');
const test = require('node:test');
const { readPlans, loadPricing, roundFraction } = require('./helpers/pricing.cjs');

const source = [
    [100, 1500, 150000], [500, 600, 300000], [1000, 570, 570000],
    [1500, 520, 780000], [5000, 390, 1950000], [10000, 300, 3000000],
    [50000, 220, 11000000], [100000, 180, 18000000], [500000, 130, 65000000]
];

test('POS nine fixed packages, maintenance and MAX match supplied prices', () => {
    const { state } = loadPricing();
    const csv = readPlans(['invoice']).filter(plan => plan.plan_group === 'invoice_pos');
    assert.equal(csv.length, 9); assert.equal(state.currentPosPlans.length, 9);
    assert.equal(state.posMaintenancePrice, 50000);
    for (const [i, [quantity, unitPrice, price]] of source.entries()) {
        const plan = state.currentPosPlans[i];
        assert.equal(plan.quantity, quantity); assert.equal(plan.unitPrice, unitPrice);
        assert.equal(plan.price, price); assert.equal(quantity * unitPrice, price);
        const row = csv.find(row => Number(row.duration_text.replace(/\D/g, '')) === quantity);
        assert.equal(Number(row.price), price); assert.equal(plan.duration_text, row.duration_text);
        assert.equal(plan.note, row.note);
    }
    state.posMaxAmount = 500000;
    assert.equal(state.posMaxPlan.price, 50000000);
    assert.equal(state.currentPosPlans.find(plan => plan.quantity === 500000).price, 65000000);
});

test('POS package and maintenance caps apply together to totals and copied quotes', () => {
    const app = loadPricing(), state = app.state;
    const plans = [...state.currentPosPlans, { duration_text: 'MTT Max', quantity: 500000, price: 50000000 }];
    const conditions = { quantity: [0, 0], existing: [10, 20], revenue10to30: [30, 50], largeExisting: [40, 100], competition: [40, 100] };
    const snapshot = JSON.stringify(state.posCatalog);
    let cases = 0;
    for (const mode of ['none', 'auto', 'custom']) for (const [condition, [customerPackage, customerMaintenance]] of Object.entries(conditions)) {
        for (const plan of plans) for (const requestedPackage of [0, 30, 100]) for (const requestedMaintenance of [0, 50, 100]) {
            for (const vat of [8, 10]) for (const setup of [0, 175000, 1000000]) {
                state.posDiscountMode = mode; state.posCustomerType = condition; state.vatRate = vat;
                state.discountPosPackage = requestedPackage; state.discountPosMaintenance = requestedMaintenance;
                state.posSetupAmount = setup;
                const [quantityPackage, quantityMaintenance] = plan.quantity >= 100000 ? [40, 100] : plan.quantity === 50000 ? [30, 50] : [10, 20];
                const packageCap = Math.max(quantityPackage, customerPackage);
                const maintenanceCap = Math.max(quantityMaintenance, customerMaintenance);
                const packageDiscount = mode === 'auto' ? packageCap : mode === 'custom' ? Math.min(requestedPackage, packageCap) : 0;
                const maintenanceDiscount = mode === 'auto' ? maintenanceCap : mode === 'custom' ? Math.min(requestedMaintenance, maintenanceCap) : 0;
                const expected = roundFraction((BigInt(plan.price) * BigInt(100 - packageDiscount)
                    + 50000n * BigInt(100 - maintenanceDiscount) + BigInt(setup) * 100n) * BigInt(100 + vat), 10000n);
                const maintenance = roundFraction(50000n * BigInt(100 - maintenanceDiscount) * BigInt(100 + vat), 10000n);
                assert.equal(state.getPosPackageDiscount(plan), packageDiscount);
                assert.equal(state.getPosMaintenanceDiscount(plan), maintenanceDiscount);
                assert.equal(state.calculatePosMaintenanceFee(plan), maintenance);
                assert.equal(state.calculatePosTotal(plan), expected);
                if (plan.duration_text === 'MTT Max') {
                    state.posMaxAmount = 500000; state.executePosMaxCopy();
                } else state.executePosCopy(plan);
                assert.ok(app.copied().includes(plan.duration_text));
                assert.ok(app.copied().includes(state.formatPrice(expected)));
                assert.ok(app.copied().includes('duy trì ' + state.formatPrice(maintenance)));
                assert.ok(app.copied().includes('khởi tạo ' + state.formatPrice(state.posSetupFee)));
                if (packageDiscount || maintenanceDiscount) assert.ok(app.copied().includes(`giảm gói ${packageDiscount}%, duy trì ${maintenanceDiscount}%`));
                cases++;
            }
        }
    }
    assert.equal(cases, 8100); assert.equal(JSON.stringify(state.posCatalog), snapshot);
});

test('POS unknown setup blocks incomplete quotes; explicit zero is a valid business decision', () => {
    const app = loadPricing(), state = app.state, plan = state.currentPosPlans[0];
    state.vatRate = 10; // This price example explicitly uses VAT 10%.
    assert.equal(state.posSetupPrice, 1000000);
    assert.equal(state.calculatePosTotal(plan), 1320000);
    state.posSetupAmount = '';
    assert.equal(state.posSetupPrice, null); assert.equal(state.calculatePosTotal(plan), null);
    state.executePosCopy(plan); assert.equal(app.copied(), '');
    for (const fee of ['', ' ', -1, 0.5, 'abc', Infinity, Number.MAX_SAFE_INTEGER + 1]) {
        state.posSetupAmount = fee;
        assert.equal(state.posSetupPrice, null);
        assert.equal(state.calculatePosTotal(plan), null);
        state.executePosCopy(plan); assert.equal(app.copied(), '');
    }
    state.posSetupAmount = '0';
    assert.equal(state.posSetupPrice, 0); assert.equal(state.calculatePosTotal(plan), 220000);
    state.posSetupAmount = 200000; assert.equal(state.calculatePosTotal(plan), 440000);
    state.posDiscountMode = 'auto'; assert.equal(state.calculatePosTotal(plan), 412500);
    state.posSetupAmount = 0;
    assert.equal(state.calculatePosTotal(plan), 192500);
    const medium = state.currentPosPlans.find(plan => plan.quantity === 50000);
    assert.equal(state.calculatePosTotal(medium), 8497500);
    const large = state.currentPosPlans.find(plan => plan.quantity === 100000);
    assert.equal(state.calculatePosTotal(large), 11880000);
    state.posMaxAmount = 500000; assert.equal(state.calculatePosTotal(state.posMaxPlan), 33000000);
});

test('POS quantity boundaries, OR customer conditions and invalid MAX quantities are guarded', () => {
    const app = loadPricing(), state = app.state;
    state.posDiscountMode = 'auto'; state.posSetupAmount = 0;
    for (const [quantity, pkg, maintenance] of [[1, 10, 20], [10000, 10, 20], [10001, 0, 0], [49999, 0, 0], [50000, 30, 50], [50001, 0, 0], [99999, 0, 0], [100000, 40, 100]]) {
        const plan = { quantity, price: 1000000 };
        assert.equal(state.getPosPackageDiscount(plan), pkg);
        assert.equal(state.getPosMaintenanceDiscount(plan), maintenance);
    }
    const small = state.currentPosPlans[0];
    for (const [condition, pkg, maintenance] of [['existing', 10, 20], ['revenue10to30', 30, 50], ['largeExisting', 40, 100], ['competition', 40, 100], ['invalid', 10, 20]]) {
        state.posCustomerType = condition;
        assert.equal(state.getPosPackageDiscount(small), pkg);
        assert.equal(state.getPosMaintenanceDiscount(small), maintenance);
    }
    for (const quantity of ['', 0, -1, 'abc', 499999, 500000.5, Infinity]) {
        state.posMaxAmount = quantity; assert.equal(state.posMaxPlan, null);
        state.executePosMaxCopy(); assert.equal(app.copied(), '');
    }
    state.posMaxAmount = 500000; assert.ok(state.posMaxPlan);
    state.selectService({ id: 'hddt' });
    assert.equal(state.posDiscountMode, 'none'); assert.equal(state.posSetupPrice, 1000000);
    assert.equal(state.posCustomerType, 'quantity'); assert.equal(state.posMaxPlan, null);
});

test('legacy Invoice entry points respect the editable POS setup and separate discounts', () => {
    const app = loadPricing(), state = app.state;
    state.vatRate = 10; // This price example explicitly uses VAT 10%.
    state.activeHddtMainTab = 'pos'; state.activeInvoiceType = 'moi'; state.activeInvoiceSetupStatus = 'thu';
    state.discountInvoice = 40; state.discountInvoiceSetup = 0;
    const plan = state.currentPosPlans[0];
    state.posSetupAmount = 175000;
    assert.equal(state.calculateInvoiceSetupFee(), 0);
    assert.equal(state.calculateInvoiceTotal(plan.price, plan), 412500);
    state.posSetupAmount = 0; state.posDiscountMode = 'auto';
    assert.equal(state.getInvoiceDiscount(plan), 10);
    assert.equal(state.calculateInvoiceTotal(plan.price, plan), 192500);
    state.executeInvoiceCopy(plan);
    assert.ok(app.copied().includes('giảm gói 10%, duy trì 20%'));
    state.posMaxAmount = 500000;
    assert.equal(state.invoiceMaxDiscount, 40);
    assert.equal(state.calculateInvoiceMaxTotal(), 33000000);
    state.executeInvoiceMaxCopy(); assert.ok(app.copied().includes('MTT Max'));
});
