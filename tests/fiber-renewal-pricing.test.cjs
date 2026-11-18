const assert = require('node:assert/strict');
const test = require('node:test');
const source = require('./fixtures/fiber-renewal-source.json');
const { loadPricing } = require('./helpers/pricing.cjs');

const columns = {
    retail: { monthly: 'F', quarterly: 'G', half: 'H', annual: 'I', biennial: 'J' },
    combo: { half: 'K', annual: 'L' }
};

test('all 41 renewal plans and 235 VAT-inclusive prices match the supplied workbook', () => {
    const { state } = loadPricing();
    const catalog = state.fiberRenewalCatalog;
    assert.equal(catalog.source, 'Gia Han FiberVNN.xlsx');
    assert.equal(catalog.pricesIncludeVat, true);
    assert.equal(catalog.schemes[0].label, 'Bán lẻ');
    assert.deepEqual(Array.from(catalog.periods, period => period.label), ['1 tháng', '3 tháng', '6 tháng', '12 tháng', '24 tháng']);
    assert.equal(JSON.stringify(catalog, (key, value) => key === 'namePattern' ? undefined : value).includes('?'), false, 'Catalog text must retain Vietnamese accents');
    assert.equal(catalog.plans.length, 41);
    assert.equal(new Set(catalog.plans.map(plan => plan.id)).size, 41);
    const snapshot = JSON.stringify(catalog);
    let priceCount = 0;
    for (const plan of catalog.plans) {
        const row = plan.sourceRow;
        assert.equal(plan.name, source['A' + row]);
        assert.equal(plan.speedMbps, source['B' + row]);
        assert.equal(plan.internationalCommitment, source['C' + row]);
        assert.equal(plan.ip, source['D' + row]);
        assert.equal(plan.note, source['M' + row] || '');
        for (const [scheme, periods] of Object.entries(columns)) {
            state.selectFiberRenewalScheme(scheme);
            for (const [period, col] of Object.entries(periods)) {
                state.fiberRenewalPeriod = period;
                const value = source[col + row];
                const expected = typeof value === 'number' ? value : null;
                assert.equal(state.getFiberRenewalPrice(plan), expected, `${plan.name}: ${scheme}/${period}`);
                if (expected !== null) priceCount++;
                // Renewal values already contain VAT and never inherit installation fees or other tabs' settings.
                state.vatRate = 8;
                state.internetMonths = 24;
                state.includeInternetSetupFee = true;
                state.includeInternetCameraSetupFee = true;
                state.includeBusinessInternetSetup = true;
                assert.equal(state.getFiberRenewalPrice(plan), expected);
            }
        }
    }
    assert.equal(priceCount, 235);
    assert.equal(JSON.stringify(catalog), snapshot);
});

test('scheme switches preserve supported periods and recover from retail-only periods', () => {
    const { state } = loadPricing();
    assert.equal(state.fiberRenewalPeriod, 'monthly');
    state.selectFiberRenewalScheme('combo');
    assert.equal(state.fiberRenewalPeriod, 'half');
    state.fiberRenewalPeriod = 'annual';
    state.selectFiberRenewalScheme('retail');
    state.selectFiberRenewalScheme('combo');
    assert.equal(state.fiberRenewalPeriod, 'annual');
    assert.deepEqual(Array.from(state.fiberRenewalPeriods, period => period.id), ['half', 'annual']);
    state.selectFiberRenewalScheme('retail');
    assert.equal(state.fiberRenewalPeriods.length, 5);
    for (const period of ['monthly', 'quarterly', 'biennial']) {
        state.fiberRenewalPeriod = period;
        state.selectFiberRenewalScheme('combo');
        assert.equal(state.fiberRenewalPeriod, 'half');
        state.selectFiberRenewalScheme('retail');
    }
    state.selectFiberRenewalScheme('unknown');
    assert.equal(state.fiberRenewalScheme, 'retail');
});

test('search accepts case, accents, separators and formatted prices while preserving the plus variant', () => {
    const { state } = loadPricing();
    for (const query of [' f18 db ', 'F18_ĐB', 'F18-đb']) {
        state.fiberRenewalQuery = query;
        assert.deepEqual(Array.from(state.fiberRenewalPlans, plan => plan.name), ['F18_ĐB']);
    }
    state.fiberRenewalQuery = 'fiber 100+';
    assert.deepEqual(Array.from(state.fiberRenewalPlans, plan => plan.name), ['Fiber100+']);
    state.fiberRenewalPeriod = 'half';
    for (const query of ['1.066.000', '1,066,000', '1 066 000 đ', '1066000₫']) {
        state.fiberRenewalQuery = query;
        assert.deepEqual(Array.from(state.fiberRenewalPlans, plan => plan.name), ['Fiber20']);
    }
    state.selectFiberRenewalScheme('combo');
    assert.equal(state.fiberRenewalPlans.length, 0);
    state.fiberRenewalQuery = '1.004.000';
    assert.deepEqual(Array.from(state.fiberRenewalPlans, plan => plan.name), ['Fiber20']);
    state.fiberRenewalPeriod = 'annual';
    assert.equal(state.fiberRenewalPlans.length, 0);
    state.fiberRenewalQuery = 'không có gói này';
    assert.equal(state.fiberRenewalPlans.length, 0);
    state.fiberRenewalQuery = '   ';
    assert.equal(state.fiberRenewalPlans.length, 41);
});

test('blank cells and Không remain unavailable; both sort directions put them last without changing the catalog', () => {
    const { state } = loadPricing();
    const original = JSON.stringify(state.fiberRenewalCatalog);
    const eco = state.fiberRenewalCatalog.plans.find(plan => plan.name === 'FiberEco1');
    state.fiberRenewalPeriod = 'quarterly';
    assert.equal(state.getFiberRenewalPrice(eco), null);
    state.selectFiberRenewalScheme('combo');
    assert.equal(state.getFiberRenewalPrice(eco), null);
    assert.equal(state.getFiberRenewalPrice(state.fiberRenewalCatalog.plans.find(plan => plan.name === 'Fiber70Eco')), null);
    for (const sort of ['asc', 'desc']) {
        state.fiberRenewalSort = sort;
        let missingSeen = false, previous = null;
        for (const plan of state.fiberRenewalPlans) {
            const price = state.getFiberRenewalPrice(plan);
            if (price === null) { missingSeen = true; continue; }
            assert.equal(missingSeen, false);
            if (previous !== null) assert.ok(sort === 'asc' ? previous <= price : previous >= price);
            previous = price;
        }
    }
    assert.equal(JSON.stringify(state.fiberRenewalCatalog), original);
    state.fiberRenewalQuery = 'FiberEco1';
    assert.equal(state.fiberRenewalPlans.length, 1);
    state.selectService({ id: 'internet' });
    assert.equal(state.fiberRenewalQuery, '');
    assert.equal(state.fiberRenewalScheme, 'retail');
    assert.equal(state.fiberRenewalPeriod, 'monthly');
    assert.equal(state.fiberRenewalSort, 'source');
});

test('renewal groups cover every plan exactly once and reveal matching packages when searching', () => {
    const { state, watch } = loadPricing();
    assert.deepEqual(Array.from(state.fiberRenewalSections, group => [group.label, group.plans.length]), [
        ['F18 / F2H / F2E / F2K', 7], ['Fiber thường', 15], ['FiberEco', 9], ['FiberVIP', 10]
    ]);
    const groupedIds = Array.from(state.fiberRenewalSections.flatMap(group => group.plans), plan => plan.id).sort();
    assert.deepEqual(groupedIds, Array.from(state.fiberRenewalCatalog.plans, plan => plan.id).sort());
    for (const group of state.fiberRenewalSections) {
        assert.equal(state.isFiberRenewalGroupOpen(group.id), false);
        state.toggleFiberRenewalGroup(group.id);
        assert.equal(state.isFiberRenewalGroupOpen(group.id), true);
        state.toggleFiberRenewalGroup(group.id);
    }
    state.fiberRenewalQuery = 'fiber 100+';
    watch.fiberRenewalQuery.call(state);
    assert.deepEqual(Array.from(state.fiberRenewalSections, group => group.id), ['standard']);
    assert.equal(state.isFiberRenewalGroupOpen('standard'), true);
    assert.equal(state.fiberRenewalSections[0].plans[0].name, 'Fiber100+');
    state.fiberRenewalQuery = 'FiberEco';
    watch.fiberRenewalQuery.call(state);
    assert.deepEqual(Array.from(state.fiberRenewalSections, group => group.id), ['eco']);
    assert.equal(state.isFiberRenewalGroupOpen('eco'), true);
    state.fiberRenewalQuery = 'no matching plan';
    assert.equal(state.fiberRenewalSections.length, 0);
    state.fiberRenewalQuery = '';
    watch.fiberRenewalQuery.call(state);
    state.fiberRenewalSort = 'desc';
    for (const group of state.fiberRenewalSections) {
        const prices = Array.from(group.plans, plan => state.getFiberRenewalPrice(plan));
        assert.deepEqual(prices, [...prices].sort((a, b) => b - a));
    }
    state.toggleFiberRenewalGroup('vip');
    state.selectService({ id: 'internet' });
    assert.equal(state.isFiberRenewalGroupOpen('vip'), false);
});
