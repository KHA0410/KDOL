const assert = require('node:assert/strict');
const test = require('node:test');
const { readPlans, loadPricing } = require('./helpers/pricing.cjs');

async function loadInternet() {
    const data = {
        categories: [{ id: 'brcd', name: 'Internet' }],
        services: [{ id: 'internet', category_id: 'brcd', name: 'Internet', sort_order: 1 }],
        plans: readPlans(['internet'])
    };
    const { state } = loadPricing({ from(table) { return { select() { return { data: data[table], order: async () => ({ data: data[table] }) }; } }; } }, ['internet-comparison-data.js']);
    await state.fetchData();
    return state;
}

function select(state, name, meshCount = 0) {
    const option = state.internetComparisonOptions.find(option => option.name === name && option.meshCount === meshCount);
    assert.ok(option, `${name}, ${meshCount} Mesh`);
    state.activeInternetComparisonId = option.id;
    return option;
}

const provider = (state, id) => state.internetComparisonGroups.find(group => group.id === id).plans;
const sourceCells = plans => Array.from(plans, plan => plan.sourceCell);

test('Excel imports positive prices with cell provenance and keeps ambiguous columns out of comparisons', async () => {
    const state = await loadInternet();
    const { plans, unclassified, source } = state.internetComparisonCatalog;
    assert.equal(plans.length, 85);
    assert.equal(new Set(plans.map(plan => plan.id)).size, 85);
    assert.ok(plans.every(plan => plan.monthlyPrice > 0));
    assert.equal(source.filename, 'SS Home vs Vitettel vs FPT.xlsx');
    assert.match(source.sha256, /^[a-f0-9]{64}$/);
    assert.deepEqual(sourceCells(unclassified), ['I22', 'I23', 'I26', 'I27']);
    assert.equal(plans.some(plan => ['I22', 'I23', 'I26', 'I27'].includes(plan.sourceCell)), false);
    assert.equal(plans.find(plan => plan.sourceCell === 'D3').monthlyPrice, 235000);
    assert.equal(plans.find(plan => plan.sourceCell === 'D4').monthlyPrice, 195000);
    assert.equal(plans.find(plan => plan.sourceCell === 'J28').monthlyPrice, 230000);
    assert.match(plans.find(plan => plan.sourceCell === 'J28').details, /cloud 3 ngày/);
    assert.equal(plans.find(plan => plan.sourceCell === 'G20').meshCount, null);
    assert.equal(plans.some(plan => plan.name === 'Fsafe-Go-3'), false);
});

test('300 Mbps Internet matches the same region and monthly configuration, independently of prepayment and setup', async () => {
    const state = await loadInternet();
    select(state, 'Home Slay');
    assert.deepEqual(sourceCells(provider(state, 'viettel')), ['D3']);
    assert.deepEqual(sourceCells(provider(state, 'fpt')), ['D20']);
    assert.equal(state.getInternetComparisonDifference(provider(state, 'viettel')[0]), 'Cao hơn 35.000 đ/tháng');
    state.internetMonths = 12;
    state.includeInternetSetupFee = true;
    state.includeInternetCameraSetupFee = true;
    assert.equal(state.selectedInternetComparison.monthlyPrice, 200000);
    assert.equal(provider(state, 'viettel')[0].monthlyPrice, 235000);
    state.activeInternetRegion = 'nt';
    assert.equal(state.selectedInternetComparison.id, state.internetComparisonOptions[0].id);
    select(state, 'Home Cam Canh');
    assert.deepEqual(sourceCells(provider(state, 'viettel')), ['K4']);
    assert.deepEqual(sourceCells(provider(state, 'fpt')), ['J21']);
    assert.equal(state.selectedInternetComparison.monthlyPrice, 195000);
    assert.equal(state.getInternetComparisonDifference(provider(state, 'viettel')[0]), 'Cao hơn 20.000 đ/tháng');
});

test('camera segment shows actual 350 Mbps and never substitutes a TV or Mesh bundle', async () => {
    const state = await loadInternet();
    select(state, 'Home Cam Canh');
    const viettel = provider(state, 'viettel');
    assert.deepEqual(sourceCells(viettel), ['K3']);
    assert.equal(viettel[0].speedMbps, 350);
    assert.equal(viettel[0].monthlyPrice, 255000);
    assert.deepEqual(sourceCells(provider(state, 'fpt')), ['J20']);
    assert.equal(state.getInternetComparisonSpeedTier(viettel[0].speedMbps), state.getInternetComparisonSpeedTier(state.selectedInternetComparison.speedMbps));
    select(state, 'Home Slay_F', 1);
    assert.deepEqual(sourceCells(provider(state, 'viettel')), ['J3']);
    assert.equal(provider(state, 'fpt').length, 0);
    select(state, 'Home Cam Sành', 1);
    assert.equal(provider(state, 'viettel').length, 0);
    assert.equal(provider(state, 'fpt').length, 0);
});

test('Mesh quantities and download tiers stay distinct; unknown quantities remain explicitly labeled', async () => {
    const state = await loadInternet();
    select(state, 'Home 2', 1);
    assert.deepEqual(sourceCells(provider(state, 'viettel')), ['E7']);
    assert.deepEqual(sourceCells(provider(state, 'fpt')), ['E30']);
    assert.match(provider(state, 'fpt')[0].details, /Chưa ghi số lượng Mesh/);
    select(state, 'Home 2', 2);
    assert.deepEqual(sourceCells(provider(state, 'viettel')), ['E9']);
    assert.equal(provider(state, 'viettel').some(plan => plan.sourceCell === 'E11'), false);
    select(state, 'Home X', 1);
    assert.equal(provider(state, 'viettel').length, 0);
    assert.equal(provider(state, 'fpt').length, 0);
});

test('unknown-area GiGa prices are opt-in and cannot produce a misleading price difference', async () => {
    const state = await loadInternet();
    select(state, 'Home 3', 1);
    assert.equal(provider(state, 'viettel').length, 0);
    state.includeInternetComparisonUnknownRegion = true;
    const viettel = provider(state, 'viettel');
    assert.deepEqual(sourceCells(viettel), ['E14']);
    assert.equal(viettel[0].region, null);
    assert.equal(viettel[0].monthlyPrice, 355000);
    assert.equal(state.getInternetComparisonDifference(viettel[0]), 'Chưa đối chiếu khu vực');
    assert.ok(provider(state, 'fpt').every(plan => plan.region === 'noi'));
});

test('compact component labels preserve Mesh uncertainty, TV extras, upload and Cloud retention', async () => {
    const state = await loadInternet();
    const plans = state.internetComparisonCatalog.plans;
    const components = plan => Array.from(state.getInternetComparisonComponents(plan));
    assert.deepEqual(components(plans.find(plan => plan.sourceCell === 'D3')), ['Chỉ Internet']);
    assert.deepEqual(components(plans.find(plan => plan.sourceCell === 'G20')), ['Mesh (?)', 'TV']);
    assert.deepEqual(components(plans.find(plan => plan.sourceCell === 'J28')), ['Camera · Cloud 3 ngày']);
    assert.deepEqual(components(plans.find(plan => plan.sourceCell === 'H22')), ['TV', 'Ngoại Hạng Anh']);
    assert.match(state.getInternetComparisonSpeedLabel(plans.find(plan => plan.sourceCell === 'D22')), /1Gbps.*300Mbps/);
    assert.deepEqual(components(select(state, 'Home Slay')), ['Chỉ Internet']);
    assert.ok(components(select(state, 'Home Cam Canh')).includes('Camera · Cloud 1 ngày'));
});

test('alternative Mesh or MyTV benefits remain separate and respect existing filters without changing plan data', async () => {
    const state = await loadInternet();
    const original = JSON.stringify(state.internetData);
    const options = state.internetComparisonOptions.filter(option => option.name === 'Home Slay_M');
    assert.equal(options.length, 2);
    assert.ok(options.some(option => option.hasMesh && !option.tv));
    assert.ok(options.some(option => !option.hasMesh && option.tv));
    state.internetFilters.mytv = 'yes';
    assert.equal(state.internetComparisonOptions.filter(option => option.name === 'Home Slay_M').length, 1);
    assert.equal(state.internetComparisonOptions.find(option => option.name === 'Home Slay_M').hasMesh, false);
    state.internetFilters.mesh = '1';
    assert.equal(state.internetComparisonOptions.some(option => option.name === 'Home Slay_M'), false);
    state.internetFilters.speed = '9999';
    assert.equal(state.selectedInternetComparison, null);
    assert.ok(state.internetComparisonGroups.every(group => group.plans.length === 0));
    assert.equal(JSON.stringify(state.internetData), original);
});

test('plan picker lists unique names while separate component choices preserve comparison variants', async () => {
    const state = await loadInternet();
    const names = Array.from(state.internetComparisonPlans, plan => plan.name);
    assert.equal(names.length, new Set(names).size);
    const home2 = state.internetComparisonPlans.find(plan => plan.name === 'Home 2');
    state.activeInternetComparisonId = home2.id;
    assert.equal(state.selectedInternetComparisonPlan.name, 'Home 2');
    assert.deepEqual(Array.from(state.selectedInternetComparisonPlan.variants, option => option.meshCount).sort((a, b) => a - b), [0, 1, 2]);
    state.activeInternetComparisonId = home2.variants.find(option => option.meshCount === 2).id;
    assert.equal(state.selectedInternetComparison.meshCount, 2);
    assert.equal(state.selectedInternetComparisonPlan.id, home2.id);
    assert.deepEqual(sourceCells(provider(state, 'viettel')), ['E9']);
    const slay = state.internetComparisonPlans.find(plan => plan.name === 'Home Slay_M');
    assert.deepEqual(Array.from(slay.variants, option => option.configurationLabel), ['1 Mesh', 'TV']);
    const sanh = state.internetComparisonPlans.find(plan => plan.name === 'Home Cam Sành');
    assert.equal(sanh.variants.length, 1);
    assert.equal(sanh.variants[0].meshCount, 1);
    assert.ok(sanh.variants[0].camera && sanh.variants[0].tv);
    assert.match(sanh.variants[0].details, /MyTV\(S1\/S2\)/);
    state.internetFilters.mesh = '2';
    assert.ok(state.internetComparisonPlans.every(plan => plan.variants.every(option => option.meshCount === 2)));
});

test('comparison price differences state their direction and modal restores trigger focus', async () => {
    const state = await loadInternet();
    select(state, 'Home Slay');
    assert.equal(state.getInternetComparisonDifference({ region: 'noi', monthlyPrice: 190000 }), 'Thấp hơn 10.000 đ/tháng');
    assert.equal(state.getInternetComparisonDifference({ region: 'noi', monthlyPrice: 200000 }), 'Bằng giá VNPT');
    const events = [];
    state.$refs = {
        internetComparisonDialog: { open: false, showModal() { events.push('open'); this.open = true; }, close() { events.push('close'); this.open = false; } },
        internetComparisonSelect: { focus() { events.push('select'); } },
        internetComparisonTrigger: { focus() { events.push('trigger'); } }
    };
    state.$nextTick = callback => callback();
    state.openInternetComparison();
    state.closeInternetComparison();
    assert.deepEqual(events, ['open', 'select', 'close', 'trigger']);
});
