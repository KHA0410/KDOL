const assert = require('node:assert/strict');
const test = require('node:test');
const { loadPricing } = require('./helpers/pricing.cjs');

const plans = state => state.businessInternetSections.flatMap(section => section.plans);
const names = state => Array.from(plans(state), plan => plan.name).sort();

test('the five business tags combine minimum speeds, static IP and backup needs without changing prices', () => {
    const { state } = loadPricing();
    const original = JSON.stringify(state.internetBusinessCatalog);
    assert.deepEqual(Array.from(state.businessInternetFilterDefinitions, filter => filter.label), ['Tốc độ', 'Quốc tế', 'IP tĩnh', 'Mesh', 'Dự phòng']);
    assert.equal(state.businessInternetFilteredCount, 30);
    state.businessInternetFilters = { speed: '500', international: '20', internationalKind: 'committed', ip: 'static', mesh: '', backup: 'mobile' };
    assert.equal(state.businessInternetFilterCount, 4);
    assert.deepEqual(names(state), ['Fiber5', 'Fiber6', 'Fiber7', 'Fiber8']);
    assert.ok(state.businessInternetSections.every(section => state.isBusinessInternetFamilyOpen(section.id)));
    assert.equal(state.businessInternetFilteredCount, 4);
    assert.equal(state.calculateBusinessInternetTotal(plans(state).find(plan => plan.name === 'Fiber5')), 5500000);
    assert.equal(JSON.stringify(state.internetBusinessCatalog), original);
});

test('international filters distinguish committed and limited bandwidth and exclude unspecified speeds', () => {
    const { state } = loadPricing();
    state.businessInternetFilters.international = '20';
    state.businessInternetFilters.internationalKind = 'limited';
    assert.deepEqual(names(state), ['FiberXtra2', 'FiberXtra3', 'FiberXtra4', 'FiberXtra5', 'FiberXtra6']);
    const filter = state.businessInternetFilterDefinitions.find(filter => filter.id === 'international');
    assert.equal(state.businessInternetFilterCount, 1);
    assert.equal(state.getBusinessInternetFilterLabel(filter), 'Giới hạn · Từ 20 Mbps');
    assert.equal(state.getBusinessInternetFilterLabel(filter, true), 'GH ≥20M');
    state.businessInternetFilters.international = '';
    state.businessInternetFilters.internationalKind = 'committed';
    assert.equal(names(state).some(name => /^FiberM/.test(name)), false);
    state.resetBusinessInternetFilters();
    assert.ok(names(state).includes('FiberM1'));
});

test('static IP filtering uses included IPv4 and combines with search, scheme and stopped-plan controls', () => {
    const { state } = loadPricing();
    state.businessInternetFilters.ip = 'lan8';
    assert.equal(state.businessInternetFilteredCount, 11);
    state.businessInternetQuery = 'vip';
    assert.deepEqual(names(state), ['FiberVip6', 'FiberVip7', 'FiberVip8', 'FiberVip9']);
    state.businessInternetScheme = 'mtl';
    assert.equal(state.businessInternetFilteredCount, 0);
    state.businessInternetScheme = 'retail';
    state.businessInternetQuery = 'FibeOn2';
    state.businessInternetShowStopped = true;
    state.businessInternetFilters.ip = 'static';
    assert.deepEqual(Array.from(plans(state), plan => plan.variantLabel), ['IP tĩnh']);
    state.businessInternetFilters.ip = 'dynamic';
    assert.deepEqual(Array.from(plans(state), plan => plan.variantLabel), ['IP động']);
    state.businessInternetShowStopped = false;
    assert.equal(state.businessInternetFilteredCount, 0);
});

test('Mesh types support alternative equipment bundles and incompatible needs return no matches', () => {
    const { state } = loadPricing();
    state.businessInternetFilters.mesh = '5';
    assert.deepEqual(names(state), ['FiberWifi1', 'FiberWifi2', 'FiberWifi3']);
    state.businessInternetFilters.mesh = '6';
    assert.deepEqual(names(state), ['Fiber Pro', 'FiberWifi1', 'FiberWifi2', 'FiberWifi3']);
    state.businessInternetFilters.ip = 'static';
    assert.equal(state.businessInternetFilteredCount, 0);
    state.businessInternetFilters.ip = '';
    state.businessInternetFilters.mesh = 'no';
    assert.equal(names(state).some(name => /FiberWifi|Fiber Pro/.test(name)), false);
});

test('Fiber backup requires a named backup connection and does not mistake an IPv6 subnet for a connection', () => {
    const { state } = loadPricing();
    state.businessInternetFilters.backup = 'fiber';
    assert.deepEqual(names(state), ['FiberVip6', 'FiberVip7', 'FiberVip8', 'FiberVip9']);
    state.businessInternetFilters.backup = 'both';
    assert.equal(state.businessInternetFilteredCount, 0);
    const fiber5 = state.internetBusinessCatalog.plans.find(plan => plan.name === 'Fiber5');
    assert.equal(state.matchesBusinessInternetFilters({ ...fiber5, backupFiber: 'FiberXtra1' }), true);
    state.businessInternetFilters.backup = 'mobile';
    assert.deepEqual(names(state), ['Fiber4', 'Fiber5', 'Fiber6', 'Fiber7', 'Fiber8', 'FiberEco5']);
});

test('selecting an option closes its panel, restores focus and keeps household filters independent', () => {
    const { state } = loadPricing();
    let focused;
    state.$nextTick = callback => callback();
    state.focusInternetFilterTrigger = id => { focused = id; };
    state.internetFilters.mesh = '2';
    state.showBusinessInternetFilters = true;
    state.openBusinessInternetFilter = 'mesh';
    state.businessInternetOpenFamilies = { wifi: false };
    state.selectBusinessInternetFilter('mesh', 'mesh', '6');
    assert.equal(state.businessInternetFilters.mesh, '6');
    assert.equal(state.openBusinessInternetFilter, '');
    assert.equal(focused, 'business-internet-filter-mesh');
    assert.equal(state.isBusinessInternetFamilyOpen('wifi'), true);
    state.toggleBusinessInternetFilters();
    assert.equal(state.showBusinessInternetFilters, false);
    assert.equal(state.businessInternetFilterCount, 1);
    state.businessInternetPeriod = 'annual';
    state.businessIpQuantities['4'] = 1;
    state.resetBusinessInternetFilters();
    assert.equal(state.businessInternetFilterCount, 0);
    assert.equal(state.businessInternetPeriod, 'annual');
    assert.equal(state.businessIpQuantities['4'], 1);
    assert.equal(state.internetFilters.mesh, '2');
    state.selectInternetFilter('mesh', '1');
    assert.equal(focused, 'internet-filter-mesh');
    state.selectBusinessInternetFilter('speed', 'speed', '500');
    state.resetBusinessInternetOptions();
    assert.equal(state.showBusinessInternetFilters, false);
    assert.equal(state.businessInternetFilterCount, 0);
    assert.equal(state.businessInternetPeriod, 'monthly');
});
