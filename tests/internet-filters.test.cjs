const assert = require('node:assert/strict');
const test = require('node:test');
const { readPlans, loadPricing } = require('./helpers/pricing.cjs');

async function loadInternet() {
    const data = {
        categories: [{ id: 'brcd', name: 'Internet' }],
        services: [{ id: 'internet', category_id: 'brcd', name: 'Internet', sort_order: 1 }],
        plans: readPlans(['internet'])
    };
    const { state } = loadPricing({ from(table) { return { select() { return { data: data[table], order: async () => ({ data: data[table] }) }; } }; } });
    await state.fetchData();
    return state;
}

const names = rows => Array.from(rows, row => row.name);

test('speed options normalize Mbps, ULM and Gbps and combine with other customer needs', async () => {
    const state = await loadInternet();
    assert.deepEqual(Array.from(state.internetFilterDefinitions[0].options, option => option.id), ['', '300', '500', '1000', '2500']);
    state.internetFilters.speed = '1000';
    assert.deepEqual(names(state.internetMatrixRows), ['Home 3', 'HomeTV 3', 'HomeTV VIP 3', 'Home Cam 3']);
    assert.equal(state.internetMobileRows.length, 0);
    state.internetFilters.camera = 'yes';
    state.internetFilters.mesh = '2';
    assert.deepEqual(names(state.internetMatrixRows), ['Home Cam 3']);
    assert.deepEqual(Object.keys(state.internetMatrixRows[0].variants), ['2mesh']);
    assert.equal(Number(state.internetMatrixRows[0].variants['2mesh'].price), 375000);
});

test('Mesh filters keep only matching price variants including built-in promotion equipment', async () => {
    const state = await loadInternet();
    const original = JSON.stringify(state.internetAllMatrixRows);
    state.internetFilters.mesh = '1';
    assert.deepEqual(Object.keys(state.internetMatrixRows.find(row => row.name === 'Home 1').variants), ['1mesh']);
    assert.deepEqual(Object.keys(state.internetMatrixRows.find(row => row.name === 'Home Cam Sành').variants), ['1mesh']);
    assert.deepEqual(Object.keys(state.internetMatrixRows.find(row => row.name === 'Home X').variants), ['1mesh']);
    assert.equal(state.internetMobileRows.length, 0);
    state.internetFilters.mesh = '0';
    assert.equal(names(state.internetMatrixRows).includes('Home Cam Sành'), false);
    assert.equal(names(state.internetMatrixRows).includes('Home X'), false);
    assert.equal(names(state.internetMatrixRows).includes('Home 1'), false);
    assert.deepEqual(Object.keys(state.internetMatrixRows.find(row => row.name === 'Home Cam 1').variants), ['none']);
    assert.equal(state.internetMobileRows.length, 2);
    assert.equal(JSON.stringify(state.internetAllMatrixRows), original);
});

test('MyTV tiers include mobile bundles and camera filters use actual benefits', async () => {
    const state = await loadInternet();
    state.internetFilters.mytv = 'flexi';
    assert.deepEqual(names(state.internetMobileRows), ['Home Đỉnh']);
    assert.deepEqual(names(state.internetMatrixRows), ['Home TV One']);
    state.internetFilters.mytv = 'film';
    assert.deepEqual(names(state.internetMatrixRows), ['Home X', 'HomeTV 1', 'HomeTV 2', 'HomeTV 3']);
    state.internetFilters.mytv = 'vip';
    assert.deepEqual(names(state.internetMatrixRows), ['HomeTV VIP 1', 'HomeTV VIP 3']);
    state.internetFilters.mytv = 's';
    state.internetFilters.camera = '1';
    assert.deepEqual(names(state.internetMatrixRows), ['Home Cam Sành']);
    state.internetFilters.mytv = 'no';
    assert.deepEqual(names(state.internetMatrixRows), ['Home Slay_F', 'Home Cam Canh']);
    state.internetFilters.camera = '3';
    assert.deepEqual(names(state.internetMatrixRows), ['Home Cam 1', 'Home Cam 2', 'Home Cam 3']);
});

test('Home Slay_M alternatives cannot satisfy a simultaneous Mesh and MyTV requirement', async () => {
    const state = await loadInternet();
    state.internetFilters.mesh = '1';
    state.internetFilters.mytv = 'no';
    assert.ok(names(state.internetMatrixRows).includes('Home Slay_M'));
    state.internetFilters.mesh = '0';
    state.internetFilters.mytv = 'yes';
    assert.ok(names(state.internetMatrixRows).includes('Home Slay_M'));
    state.internetFilters.mesh = '1';
    assert.equal(names(state.internetMatrixRows).includes('Home Slay_M'), false);
});

test('region changes preserve customer needs and resetting restores all regional prices', async () => {
    const state = await loadInternet();
    state.internetFilters = { speed: '300', mesh: '0', mytv: 's', camera: '1' };
    assert.equal(state.internetFilterCount, 4);
    assert.equal(state.internetMatrixRows.length, 0);
    state.activeInternetRegion = 'nt';
    state.syncInternetFilters();
    assert.deepEqual(names(state.internetMatrixRows), ['Home Cam Mật']);
    assert.equal(Number(state.internetMatrixRows[0].variants.none.price), 220000);
    state.internetMonths = 12;
    state.includeInternetSetupFee = true;
    state.includeInternetCameraSetupFee = true;
    assert.equal(state.calculateInternetTotal(220000, state.internetMatrixRows[0].hasCamera), 3040000);
    state.showInternetFilters = true;
    state.openInternetFilter = 'camera';
    state.toggleInternetFilters();
    assert.equal(state.showInternetFilters, false);
    assert.equal(state.openInternetFilter, '');
    assert.equal(state.internetFilterCount, 4);
    state.resetInternetFilters();
    assert.equal(state.internetFilterCount, 0);
    assert.deepEqual(names(state.internetMatrixRows), names(state.internetAllMatrixRows));
    assert.equal(state.internetMobileRows.length, state.internetAllMobileRows.length);
});
