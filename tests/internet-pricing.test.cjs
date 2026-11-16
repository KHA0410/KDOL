const assert = require('node:assert/strict');
const test = require('node:test');
const { readPlans, loadPricing } = require('./helpers/pricing.cjs');

function loadInternet(plans = readPlans(['internet'])) {
    const data = {
        categories: [{ id: 'brcd', name: 'Băng rộng cố định' }, { id: 'cntt', name: 'Công nghệ thông tin' }],
        services: [{ id: 'internet', category_id: 'brcd', name: 'Internet', sort_order: 1 }],
        plans
    };
    const app = loadPricing({ from(table) { return { select() { return { data: data[table], order: async () => ({ data: data[table] }) }; } }; } });
    return { ...app, data };
}

const prices = {
    nt: { 'Home Cam Canh': 195000, 'Home Cam Sành': 235000, 'Home Cam 1': 215000, mesh: 230000 },
    noi: { 'Home Cam Canh': 240000, 'Home Cam Sành': 255000, 'Home Cam 1': 255000, mesh: 270000 }
};

test('Internet adds both missing Home Cam plans in each region while preserving every existing price', async () => {
    const app = loadInternet(), state = app.state;
    const original = JSON.stringify(app.data.plans);
    await state.fetchData();
    const loaded = state.internetData.flatMap(group => group.plans);
    assert.equal(loaded.length, app.data.plans.length + 5);
    for (const plan of app.data.plans) {
        const actual = loaded.find(item => item.id === plan.id);
        assert.equal(actual.price, plan.price);
        assert.equal(actual.note, plan.note);
    }
    for (const region of ['nt', 'noi']) {
        state.activeInternetRegion = region;
        for (const name of ['Home Cam Canh', 'Home Cam Sành', 'Home Cam 1']) {
            const row = state.internetMatrixRows.find(row => row.bundle === 'cam' && row.name === name);
            assert.ok(row, `${region}: ${name}`);
            assert.equal(row.speed, '300Mbps');
            assert.equal(row.hasCamera, true);
            const configuration = name === 'Home Cam Sành' ? '1mesh' : 'none';
            assert.equal(Number(row.variants[configuration].price), prices[region][name]);
            if (name !== 'Home Cam 1') {
                assert.equal(state.internetMobileRows.some(row => row.name === name), false);
                assert.equal(row.variants[name === 'Home Cam Sành' ? 'none' : '1mesh'], undefined);
                assert.equal(row.variants['2mesh'], undefined);
                assert.ok(row.benefits.includes(name === 'Home Cam Canh' ? 'Camera Indoor' : 'MyTV S1/S2'));
                if (name === 'Home Cam Sành') {
                    assert.match(row.benefits, /01 Mesh/);
                    assert.match(row.benefits, /1 Camera Indoor lưu 1 ngày/);
                    assert.match(row.benefitsFull, /01 Camera Indoor lưu trữ 1 ngày/);
                }
                assert.doesNotMatch(row.benefits, /Family\s*Safe|GreenNet/i);
                assert.doesNotMatch(row.benefitsFull, /Family\s*Safe|GreenNet/i);
            } else {
                assert.equal(Number(row.variants['1mesh'].price), prices[region].mesh);
                assert.match(row.benefits, /Family Safe \/ GreenNet/);
                assert.match(row.benefitsFull, /Family Safe \/ GreenNet/);
            }
        }
    }
    assert.equal(JSON.stringify(app.data.plans), original);
});

test('new Home Cam plans use existing prepayment and one-time Internet/Camera setup rules', async () => {
    const { state } = loadInternet();
    await state.fetchData();
    for (const region of ['nt', 'noi']) for (const months of [1, 3, 6, 12]) {
        state.activeInternetRegion = region; state.internetMonths = months;
        for (const internetSetup of [false, true]) for (const cameraSetup of [false, true]) {
            state.includeInternetSetupFee = internetSetup; state.includeInternetCameraSetupFee = cameraSetup;
            for (const name of ['Home Cam Canh', 'Home Cam Sành', 'Home Cam 1']) {
                const row = state.internetMatrixRows.find(row => row.name === name);
                const expected = prices[region][name] * months + (internetSetup ? 300000 : 0) + (cameraSetup ? 100000 : 0);
                const plan = row.variants[name === 'Home Cam Sành' ? '1mesh' : 'none'];
                assert.equal(state.calculateInternetTotal(plan.price, row.hasCamera), expected);
                assert.equal(state.formatInternetAmount(plan.price, row.hasCamera), new Intl.NumberFormat('vi-VN').format(expected));
            }
            for (const row of state.internetMobileRows) {
                const expected = Number(row.plan.price) * months + (internetSetup ? 300000 : 0);
                assert.equal(state.calculateInternetTotal(row.plan.price), expected);
            }
        }
        assert.equal(state.internetTermLabel, months === 12 ? '12-13 tháng' : months + ' tháng');
    }
});

test('Home Cam Mật is only available outside the city with the supplied price and entitlements', async () => {
    const { state } = loadInternet();
    await state.fetchData();
    state.activeInternetRegion = 'nt';
    const rows = state.internetMatrixRows.filter(row => row.name === 'Home Cam Mật');
    assert.equal(rows.length, 1);
    const row = rows[0];
    assert.equal(row.speed, '300Mbps');
    assert.equal(row.variants.none.price, 220000);
    assert.equal(row.variants['1mesh'], undefined);
    assert.equal(row.variants['2mesh'], undefined);
    assert.equal(row.hasCamera, true);
    assert.match(row.benefits, /1 Camera Indoor/);
    assert.match(row.benefits, /Cloud 1 ngày/);
    assert.match(row.benefits, /MyTV \(App\)/);
    assert.doesNotMatch(row.benefits, /Family\s*Safe|GreenNet|Mesh/i);
    for (const months of [1, 3, 6, 12]) for (const internet of [false, true]) for (const camera of [false, true]) {
        state.internetMonths = months; state.includeInternetSetupFee = internet; state.includeInternetCameraSetupFee = camera;
        assert.equal(state.calculateInternetTotal(row.variants.none.price, row.hasCamera), 220000 * months + (internet ? 300000 : 0) + (camera ? 100000 : 0));
    }
    state.activeInternetRegion = 'noi';
    assert.equal(state.internetMatrixRows.some(row => row.name === 'Home Cam Mật'), false);
    assert.equal(state.internetMobileRows.some(row => row.name === 'Home Cam Mật'), false);
});

test('Internet supplemental plans do not duplicate server packages or overwrite their price/benefits', async () => {
    const replacement = {
        id: 'server-cam-canh', service_id: 'internet', plan_group: 'nt_cam_none',
        group_name: 'Camera Ngoại thành', duration_text: '  HOME   CAM CANH (300 Mbps)',
        price: 196000, note: 'Ghi chú từ máy chủ'
    };
    const sanh = { ...replacement, id: 'server-cam-sanh', duration_text: ' HOME   CAM SÀNH (300Mbps)', price: 235000, note: '01 Mesh + 01 Camera Indoor lưu trữ 1 ngày + MyTV S1 (App) hoặc MyTV S2 (App)' };
    const app = loadInternet([replacement, sanh]), state = app.state;
    for (let i = 0; i < 2; i++) {
        await state.fetchData();
        const loaded = state.internetData.flatMap(group => group.plans);
        assert.equal(loaded.length, 5);
        assert.equal(loaded.filter(plan => plan.id === 'server-cam-canh').length, 1);
        assert.equal(loaded.some(plan => plan.id === 'internet-nt-cam-canh'), false);
        assert.equal(loaded.find(plan => plan.id === 'server-cam-canh').price, 196000);
        assert.equal(loaded.find(plan => plan.id === 'server-cam-canh').note, 'Ghi chú từ máy chủ');
        state.activeInternetRegion = 'nt';
        const row = state.internetMatrixRows.find(row => row.variants['1mesh']?.id === 'server-cam-sanh');
        assert.equal(row.hasCamera, true);
        state.includeInternetCameraSetupFee = true;
        assert.equal(state.calculateInternetTotal(row.variants['1mesh'].price, row.hasCamera), 335000);
    }
    assert.equal(app.data.plans.length, 2);
});
