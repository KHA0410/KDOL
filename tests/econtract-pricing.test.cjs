const assert = require('node:assert/strict');
const test = require('node:test');
const { readPlans, loadPricing, roundFraction } = require('./helpers/pricing.cjs');

test('eContract per-add-on subtotals match displayed quantities, rates, TSA discount and the combined total', () => {
    const { state } = loadPricing();
    state.addonSmsCount = 100; state.addonEkycCount = 100;
    state.addonCecaPackage = 'min'; state.addonCecaAmount = 300;
    assert.deepEqual({ ...state.econtractAddonSubtotals }, { sms: 80000, ekyc: 300000, storage: 0, tsa: 300000 });
    assert.equal(state.totalEcontractAddonNoVat, 680000);
    for (const deployment of ['econtract_saas', 'econtract_onprem']) {
        state.selectEcontractMode(deployment);
        state.econtractDiscountMode = 'auto'; state.econtractCustomerType = 'competition';
        for (const brand of ['shared', 'private']) for (const vat of [8, 10]) for (const discount of [0, 15, 30]) {
            state.econtractSmsBrand = brand; state.econtractPrivateSmsPrice = 450;
            state.addonStorageCount = 2; state.vatRate = vat; state.discountTsa = discount;
            for (const [type, quantity, tsaBase] of [['min', 300, 300000], ['5000', '', 4500000], ['max', 50001, 25000500]]) {
                state.addonCecaPackage = type; state.addonCecaAmount = quantity;
                const prices = { sms: brand === 'shared' ? 80000 : 45000, ekyc: 300000, storage: 180000, tsa: tsaBase * (100 - discount) / 100 };
                assert.deepEqual({ ...state.econtractAddonSubtotals }, prices);
                const total = Object.values(prices).reduce((sum, price) => sum + price, 0);
                assert.equal(state.totalEcontractAddonNoVat, total);
                assert.equal(state.totalEcontractAddonWithVat, roundFraction(BigInt(total) * BigInt(100 + vat), 100n));
            }
        }
    }
});

test('invalid add-on inputs suppress their subtotals without hiding other valid line prices', () => {
    const { state } = loadPricing();
    state.addonSmsCount = 100; state.addonEkycCount = 100; state.addonStorageCount = 1;
    state.econtractSmsBrand = 'private'; state.econtractPrivateSmsPrice = '';
    assert.equal(state.econtractAddonSubtotals.sms, null);
    assert.equal(state.econtractAddonSubtotals.ekyc, 300000);
    assert.equal(state.econtractAddonSubtotals.storage, 90000);
    assert.equal(state.totalEcontractAddonNoVat, null);
    state.addonSmsCount = 0;
    assert.equal(state.econtractAddonSubtotals.sms, 0);
    assert.equal(state.totalEcontractAddonNoVat, 390000);
    state.econtractSmsBrand = 'shared';
    for (const [field, key] of [['addonSmsCount', 'sms'], ['addonEkycCount', 'ekyc'], ['addonStorageCount', 'storage']]) {
        const original = state[field];
        for (const value of [-1, 0.5, 'abc', Infinity, Number.MAX_SAFE_INTEGER]) {
            state[field] = value;
            assert.equal(state.econtractAddonSubtotals[key], null);
            assert.equal(state.totalEcontractAddonNoVat, null);
        }
        state[field] = original;
    }
    state.addonCecaPackage = 'min'; state.addonCecaAmount = 5000;
    assert.equal(state.econtractAddonSubtotals.tsa, null);
    assert.equal(state.totalEcontractAddonNoVat, null);
    state.addonCecaPackage = 'none';
    assert.equal(state.econtractAddonSubtotals.tsa, 0);
    assert.equal(state.totalEcontractAddonNoVat, 390000);
});

const source = [
    ['E50', 50, 250, 350000], ['E100', 100, 500, 650000], ['E200', 200, 1000, 1200000],
    ['E500', 500, 2500, 2900000], ['E1000', 1000, 5000, 5600000],
    ['E2000', 2000, 10000, 10800000], ['E5000', 5000, 25000, 26000000]
];

function loadEcontract() {
    const app = loadPricing();
    app.state.econtractData = Object.values(readPlans(['econtract']).reduce((groups, plan) => {
        (groups[plan.plan_group] ??= { type: plan.plan_group, plans: [] }).plans.push(plan);
        return groups;
    }, {}));
    return app;
}

test('eContract supplied SaaS prices, storage, setup and OnPremise 50% usage are exact', () => {
    const { state } = loadEcontract();
    const csv = readPlans(['econtract']).filter(plan => plan.plan_group === 'econtract_saas');
    assert.equal(csv.length, 7);
    for (const mode of ['econtract_saas', 'econtract_onprem']) {
        state.selectEcontractMode(mode);
        assert.equal(state.currentEcontractPlans.length, 7);
        const onprem = mode === 'econtract_onprem';
        assert.equal(state.econtractSetupBase, onprem ? 100000000 : 2000000);
        for (const [i, [name, quantity, storage, price]] of source.entries()) {
            const plan = state.currentEcontractPlans[i];
            assert.equal(plan.duration_text, name); assert.equal(plan.quantity, quantity);
            assert.equal(plan.price, onprem ? price / 2 : price);
            assert.equal(plan.storageMB, onprem ? 0 : storage);
            assert.equal(Number(csv.find(row => row.duration_text === name).price), price);
        }
        state.econtractEmaxAmount = 10000;
        assert.equal(state.econtractEmaxPlan.price, onprem ? 25000000 : 50000000);
        assert.equal(state.econtractEmaxPlan.storageMB, onprem ? 0 : 50000);
    }
});

test('eContract SaaS/OnPremise limits service and setup separately, leaves add-ons undiscounted, and copies exact totals', () => {
    const app = loadEcontract(), state = app.state;
    const customers = { quantity: [0, 0, 0], existing: [10, 10, 10], revenue10to30: [20, 50, 20], largeExisting: [30, 100, 30], competition: [30, 100, 30] };
    const addons = [
        { sms: 0, ekyc: 0, storage: 0, brand: 'shared', rate: '', ceca: 'none', total: 0 },
        { sms: 3, ekyc: 2, storage: 1, brand: 'shared', rate: '', ceca: 'none', total: 98400 },
        { sms: 2, ekyc: 1, storage: 2, brand: 'private', rate: 650, ceca: '5000', total: 4684300 }
    ];
    let cases = 0;
    for (const deployment of ['econtract_saas', 'econtract_onprem']) {
        state.selectEcontractMode(deployment);
        const onprem = deployment === 'econtract_onprem';
        state.econtractEmaxAmount = 10000;
        const plans = [...state.currentEcontractPlans, state.econtractEmaxPlan];
        for (const mode of ['none', 'auto', 'custom']) for (const [customer, [customerService, customerSaasSetup, customerOnpremSetup]] of Object.entries(customers)) {
            for (const plan of plans) for (const requested of [0, 20, 100]) for (const requestedSetup of [0, 50, 150]) {
                for (const vat of [8, 10]) for (const addon of addons) {
                    state.econtractDiscountMode = mode; state.econtractCustomerType = customer;
                    state.discountEcontract = requested; state.discountEcontractSetup = requestedSetup; state.vatRate = vat;
                    state.addonSmsCount = addon.sms; state.addonEkycCount = addon.ekyc; state.addonStorageCount = addon.storage;
                    state.econtractSmsBrand = addon.brand; state.econtractPrivateSmsPrice = addon.rate; state.addonCecaPackage = addon.ceca;
                    const [quantityService, quantitySetup] = plan.quantity >= 5000 ? [30, 100] : plan.quantity >= 2000 ? [20, 50] : [10, 10];
                    const serviceCap = onprem ? 0 : Math.max(quantityService, customerService);
                    const setupCap = onprem ? customerOnpremSetup : Math.max(quantitySetup, customerSaasSetup);
                    const serviceDiscount = mode === 'auto' ? serviceCap : mode === 'custom' ? Math.min(requested, serviceCap) : 0;
                    const setupDiscount = mode === 'auto' ? setupCap : mode === 'custom' ? Math.min(requestedSetup, setupCap) : 0;
                    const setupBase = onprem ? 100000000 : 2000000;
                    const expected = roundFraction((BigInt(plan.price) * BigInt(100 - serviceDiscount)
                        + BigInt(setupBase) * BigInt(100 - setupDiscount) + BigInt(addon.total) * 100n) * BigInt(100 + vat), 10000n);
                    assert.equal(state.getEcontractServiceDiscount(plan), serviceDiscount);
                    assert.equal(state.getEcontractSetupDiscount(plan), setupDiscount);
                    assert.equal(state.totalEcontractAddonNoVat, addon.total);
                    assert.equal(state.calculateEcontractTotal(plan), expected);
                    assert.equal(state.calculateEcontractSetupFee(plan), roundFraction(BigInt(setupBase) * BigInt(100 - setupDiscount) * BigInt(100 + vat), 10000n));
                    if (plan.duration_text === 'Emax') {
                        assert.equal(state.calculateEcontractEmaxTotal(), expected);
                        state.executeEcontractEmaxCopy();
                    } else state.executeEcontractCopy(plan);
                    assert.ok(app.copied().includes(state.formatPrice(expected)));
                    assert.ok(app.copied().includes(onprem ? 'OnPremise' : 'SaaS'));
                    assert.ok(app.copied().includes(plan.duration_text));
                    if (serviceDiscount || setupDiscount) assert.ok(app.copied().includes(`giảm dịch vụ ${serviceDiscount}%, khởi tạo/triển khai ${setupDiscount}%`));
                    if (addon.total) assert.ok(app.copied().includes(state.formatPrice(state.totalEcontractAddonWithVat)));
                    if (addon.brand === 'private') assert.ok(app.copied().includes('Brandname riêng'));
                    if (onprem) assert.ok(app.copied().includes('Không kèm lưu trữ'));
                    cases++;
                }
            }
        }
    }
    assert.equal(cases, 12960);
});

test('SaaS exact 2000/5000 thresholds cannot grant free setup below eligibility; OnPremise ignores quantity for setup', () => {
    const { state } = loadEcontract();
    state.vatRate = 10; // This price example explicitly uses VAT 10%.
    state.econtractDiscountMode = 'auto';
    for (const [quantity, service, setup] of [[1, 10, 10], [1999, 10, 10], [2000, 20, 50], [4999, 20, 50], [5000, 30, 100]]) {
        const plan = { quantity, price: 1000000 };
        assert.equal(state.getEcontractServiceDiscount(plan), service);
        assert.equal(state.getEcontractSetupDiscount(plan), setup);
    }
    state.econtractDiscountMode = 'custom'; state.discountEcontractSetup = 100;
    assert.equal(state.getEcontractSetupDiscount(state.currentEcontractPlans[0]), 10);
    state.selectEcontractMode('econtract_onprem'); state.econtractDiscountMode = 'auto';
    const large = state.currentEcontractPlans.at(-1);
    assert.equal(state.getEcontractSetupDiscount(large), 0);
    state.econtractCustomerType = 'existing'; assert.equal(state.getEcontractSetupDiscount(large), 10);
    state.econtractCustomerType = 'revenue10to30'; assert.equal(state.getEcontractSetupDiscount(large), 20);
    state.econtractCustomerType = 'competition'; assert.equal(state.getEcontractSetupDiscount(large), 30);
    assert.equal(state.getEcontractServiceDiscount(large), 0);
    assert.equal(state.calculateEcontractTotal(large), 91300000);
});

test('private SMS requires its own price; add-on attempts/storage are valid integers and apply on both deployments', () => {
    const app = loadEcontract(), state = app.state;
    for (const deployment of ['econtract_saas', 'econtract_onprem']) {
        state.selectEcontractMode(deployment);
        const plan = state.currentEcontractPlans[0];
        state.econtractSmsBrand = 'private'; state.addonSmsCount = 1; state.econtractPrivateSmsPrice = '';
        assert.ok(state.econtractAddonError); assert.equal(state.totalEcontractAddonNoVat, null);
        assert.equal(state.calculateEcontractTotal(plan), null);
        const previous = app.copied(); state.executeEcontractCopy(plan); assert.equal(app.copied(), previous);
        state.econtractPrivateSmsPrice = 450;
        assert.equal(state.totalEcontractAddonNoVat, 450);
        state.addonSmsCount = 0; state.econtractPrivateSmsPrice = '';
        assert.equal(state.totalEcontractAddonNoVat, 0);
        state.econtractSmsBrand = 'shared'; state.addonSmsCount = 2; state.addonEkycCount = 3; state.addonStorageCount = 2;
        assert.equal(state.totalEcontractAddonNoVat, 2 * 800 + 3 * 3000 + 2 * 90000);
        for (const field of ['addonSmsCount', 'addonEkycCount', 'addonStorageCount']) {
            const original = state[field];
            for (const value of [-1, 0.5, 'abc', Infinity]) {
                state[field] = value; assert.equal(state.totalEcontractAddonNoVat, null); assert.equal(state.calculateEcontractTotal(plan), null);
            }
            state[field] = original;
        }
        state.addonCecaPackage = 'invalid'; assert.equal(state.calculateEcontractTotal(plan), null);
        state.addonSmsCount = 0; state.addonEkycCount = 0; state.addonStorageCount = 0; state.addonCecaPackage = 'none';
    }
});

test('Emax guards quantity, changes OnPremise price/storage, and reset restores safe defaults', () => {
    const app = loadEcontract(), state = app.state;
    state.vatRate = 10; // This price example explicitly uses VAT 10%.
    for (const value of ['', -1, 0, 'abc', 9999, 10000.5, Infinity]) {
        state.econtractEmaxAmount = value; assert.equal(state.econtractEmaxPlan, null);
        state.executeEcontractEmaxCopy(); assert.equal(app.copied(), '');
    }
    state.econtractEmaxAmount = 10000; assert.equal(state.calculateEcontractEmaxTotal(), 57200000);
    state.selectEcontractMode('econtract_onprem');
    assert.equal(state.calculateEcontractEmaxTotal(), 137500000);
    assert.equal(state.econtractEmaxPlan.storageMB, 0);
    state.addonSmsCount = 2; state.econtractDiscountMode = 'auto'; state.econtractCustomerType = 'competition';
    state.selectService({ id: 'econtract' });
    assert.equal(state.vatRate, 8);
    assert.equal(state.activeEcontractGroup, 'econtract_saas'); assert.equal(state.econtractDiscountMode, 'none');
    assert.equal(state.totalEcontractAddonNoVat, 0); assert.equal(state.econtractEmaxPlan, null);
    assert.equal(state.calculateEcontractTotal(state.currentEcontractPlans[0]), 2538000);
});

test('existing standalone TSA CeCA prices and Min/Max rates do not inherit platform fees/add-ons/rules', () => {
    const app = loadEcontract(), state = app.state;
    state.selectEcontractMode('econtract_ceca_tab');
    state.addonSmsCount = -1; state.econtractSmsBrand = 'private'; state.econtractPrivateSmsPrice = '';
    assert.equal(state.currentEcontractPlans.length, 6);
    const prices = [4500000, 8000000, 14000000, 30000000];
    assert.deepEqual(Array.from(state.currentTsaPlans, plan => Number(plan.price)).sort((a, b) => a - b), prices);
    for (const plan of state.currentTsaPlans) for (const vat of [8, 10]) for (const requested of [0, 20, 30, 100]) {
        state.vatRate = vat; state.discountTsa = requested;
        const applied = Math.min(requested, 30);
        const expected = roundFraction(BigInt(plan.price) * BigInt(100 - applied) * BigInt(100 + vat), 10000n);
        assert.equal(state.calculateEcontractSetupFee(plan), 0);
        assert.equal(state.calculateEcontractTotal(plan), expected);
        state.executeEcontractCopy(plan); assert.ok(app.copied().includes(state.formatPrice(expected)));
    }
    state.vatRate = 10; state.discountTsa = 0;
    for (const [type, quantity, price] of [['min', 1, 1000], ['min', 4999, 4999000], ['max', 50001, 25000500]]) {
        state.tsaQuantities[type] = quantity;
        const plan = state.currentEcontractPlans.find(plan => plan.tsaType === type);
        assert.equal(plan.price, price);
        assert.equal(state.calculateEcontractTotal(plan), roundFraction(BigInt(price) * 110n, 100n));
        state.executeEcontractCopy(plan); assert.ok(app.copied().includes(plan.duration_text));
    }
    for (const [type, quantity] of [['min', 0], ['min', 5000], ['min', 1.5], ['max', 50000], ['max', 'abc']]) {
        state.tsaQuantities[type] = quantity;
        assert.equal(state.currentEcontractPlans.find(plan => plan.tsaType === type).price, null);
    }
});
