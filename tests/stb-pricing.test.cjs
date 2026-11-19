const assert = require('node:assert/strict');
const test = require('node:test');
const { loadPricing } = require('./helpers/pricing.cjs');

const loadStb = () => loadPricing({}, ['stb-data.js']).state;

test('B2C returns each supplied period price, including fixed 6-9 and 12-18 month bands', () => {
    const state = loadStb();
    const cases = [
        ['monthly', [50000, 100000, 150000, 200000, 250000]],
        ['quarterly', [150000, 300000, 450000, 600000, 750000]],
        ['six-to-nine', [300000, 600000, 900000, 1200000, 1500000]],
        ['annual-to-eighteen', [600000, 1200000, 1800000, 2400000, 3000000]]
    ];
    assert.equal(state.stbCatalog.b2c.vatIncluded, true);
    for (const vat of [8, 10]) for (const [period, expected] of cases) {
        state.vatRate = vat;
        state.activeStbTermId = period;
        assert.equal(state.selectedStbPeriod.id, period);
        assert.deepEqual(Array.from(state.stbQuoteRows, row => row.price), expected);
    }
});

test('B2C excludes the unsupported four-month period and keeps price columns aligned', () => {
    const state = loadStb();
    assert.deepEqual(Array.from(state.stbCatalog.b2c.periods, period => period.label), ['1 tháng', '3 tháng', '6–9 tháng', '12–18 tháng']);
    assert.ok(state.stbCatalog.b2c.plans.every(plan => plan.prices.length === 4 && plan.prices.every(Number.isFinite)));
    const missing = loadPricing().state;
    assert.equal(missing.selectedStbPeriod, null);
    assert.equal(missing.stbQuoteRows.length, 0);
});

test('B2B preserves source prices before VAT and includes 40000 monthly STB rental exactly once', () => {
    const state = loadStb();
    state.activeStbTab = 'b2b';
    const expected = [
        ['MyTV B2B Standard', 70000, 110000],
        ['MyTV B2B Gold', 180000, 220000],
        ['MyTV B2B Premium', 240000, 280000],
        ['MyTV B2B Diamond', 370000, 410000]
    ];
    assert.equal(state.stbCatalog.b2b.vatIncluded, false);
    assert.equal(state.stbCatalog.b2b.monthlyStbRental, 40000);
    for (const vat of [8, 10]) {
        state.vatRate = vat;
        assert.deepEqual(Array.from(state.stbCatalog.b2b.plans, plan => [plan.name, plan.monthlyWithoutStb, plan.monthlyWithStb]), expected);
    }
    for (const plan of state.stbCatalog.b2b.plans) assert.equal(plan.monthlyWithStb - plan.monthlyWithoutStb, 40000);
    assert.equal(state.mytvStbPrice, 50000);
});

test('Set-top-box appears under broadband, avoids duplicate server records and resets selection', async () => {
    const data = {
        categories: [{ id: 'brcd', name: 'Băng rộng cố định' }],
        services: [
            { id: 'internet', category_id: 'brcd', name: 'Internet', sort_order: 1 },
            { id: 'mytv', category_id: 'brcd', name: 'MyTV', sort_order: 2 },
            { id: 'camera', category_id: 'brcd', name: 'Camera', sort_order: 3 }
        ],
        plans: []
    };
    const { state } = loadPricing({ from(table) { return { select() { return { data: data[table], order: async () => ({ data: data[table] }) }; } }; } }, ['mesh-data.js', 'stb-data.js']);
    await state.fetchData();
    const category = state.categories.find(category => category.id === 'brcd');
    assert.deepEqual(Array.from(category.services, service => service.id), ['internet', 'mytv', 'camera', 'mesh', 'stb']);
    const service = category.services.find(service => service.id === 'stb');
    state.activeStbTab = 'b2b';
    state.activeStbTermId = 'quarterly';
    state.selectService(service);
    assert.equal(state.activeService.id, 'stb');
    assert.equal(state.activeStbTab, 'b2c');
    assert.equal(state.activeStbTermId, 'monthly');
    data.services.push({ ...service });
    await state.fetchData();
    assert.equal(state.categories.find(category => category.id === 'brcd').services.filter(service => service.id === 'stb').length, 1);
});
