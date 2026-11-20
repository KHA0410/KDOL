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
    assert.equal(loaded.length, app.data.plans.length + 10);
    for (const plan of app.data.plans) {
        const actual = loaded.find(item => item.id === plan.id);
        assert.equal(actual.price, plan.price);
        if (!['Home Slay_M', 'Home Slay_F', 'HomeTV_B'].includes(state.splitInternetPlanLabel(plan.duration_text).name)) {
            assert.equal(actual.note, plan.note);
        }
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
                assert.ok(row.benefits.includes(name === 'Home Cam Canh' ? 'Camera Indoor' : 'MyTV(S1/S2)'));
                if (name === 'Home Cam Sành') {
                    assert.match(row.benefits, /1 Mesh/);
                    assert.match(row.benefits, /1 Camera Indoor\(1 ngày\)/);
                    assert.match(row.benefitsFull, /1 Camera Indoor\(1 ngày\)/);
                }
                assert.match(row.benefits, /Family Safe \/ GreenNet/);
                assert.match(row.benefitsFull, /Family Safe \/ GreenNet/);
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
    assert.match(row.benefits, /1 Camera Indoor\(1 ngày\)/);
    assert.match(row.benefits, /MyTV\(S1\/S2\)/);
    assert.match(row.benefits, /Family Safe \/ GreenNet/);
    assert.match(row.benefitsFull, /Family Safe \/ GreenNet/);
    assert.doesNotMatch(row.benefits, /Mesh/i);
    for (const months of [1, 3, 6, 12]) for (const internet of [false, true]) for (const camera of [false, true]) {
        state.internetMonths = months; state.includeInternetSetupFee = internet; state.includeInternetCameraSetupFee = camera;
        assert.equal(state.calculateInternetTotal(row.variants.none.price, row.hasCamera), 220000 * months + (internet ? 300000 : 0) + (camera ? 100000 : 0));
    }
    state.activeInternetRegion = 'noi';
    assert.equal(state.internetMatrixRows.some(row => row.name === 'Home Cam Mật'), false);
    assert.equal(state.internetMobileRows.some(row => row.name === 'Home Cam Mật'), false);
});

test('requested Excel additions have exact regional availability, features, columns and totals', async () => {
    const app = loadInternet(), state = app.state;
    const original = JSON.stringify(app.data.plans);
    await state.fetchData();
    const expected = {
        noi: [['Home Slay', '300ULM', 'none', 200000, false], ['Home TV One', '300Mbps', 'none', 255000, true], ['Home X', '2500Mbps', '1mesh', 990000, false]],
        nt: [['Home TV One', '300Mbps', 'none', 230000, true], ['Home X', '2500Mbps', '1mesh', 990000, false]]
    };
    for (const region of ['noi', 'nt']) {
        state.activeInternetRegion = region;
        for (const [name, speed, configuration, price, camera] of expected[region]) {
            const rows = state.internetMatrixRows.filter(row => row.name === name);
            assert.equal(rows.length, 1);
            const row = rows[0];
            assert.equal(row.speed, speed); assert.equal(row.hasCamera, camera);
            assert.equal(row.promotion, name === 'Home Slay');
            assert.deepEqual(Object.keys(row.variants), [configuration]);
            assert.equal(row.variants[configuration].price, price);
            if (name === 'Home TV One') {
                assert.match(row.benefitsFull, /MyTV\(Flexi\)/);
                assert.match(row.benefitsFull, /1 Camera Indoor\(1 ngày\)/);
            } else if (name === 'Home X') {
                assert.match(row.benefitsFull, /MyTV\(Flexi1\/Flexi2\/Film\/Film\+\).*1 Mesh/);
            } else assert.equal(row.benefitsFull, '_');
            for (const months of [1, 3, 6, 12]) for (const internetSetup of [false, true]) for (const cameraSetup of [false, true]) {
                state.internetMonths = months; state.includeInternetSetupFee = internetSetup; state.includeInternetCameraSetupFee = cameraSetup;
                assert.equal(state.calculateInternetTotal(price, row.hasCamera), price * months + (internetSetup ? 300000 : 0) + (camera && cameraSetup ? 100000 : 0));
            }
        }
        const canh = state.internetMatrixRows.find(row => row.name === 'Home Cam Canh');
        assert.match(canh.benefitsFull, /1 Camera Indoor\(1 ngày\)/);
        assert.doesNotMatch(canh.benefitsFull, /3 ngày/);
        const vip = state.internetMatrixRows.find(row => row.name === 'HomeTV VIP 3');
        assert.equal(vip.speed, '1Gbps');
        assert.equal(Number(vip.variants['1mesh'].price), region === 'noi' ? 400000 : 360000);
    }
    state.activeInternetRegion = 'nt';
    for (const name of ['Home Slay', 'Home Slay_M', 'Home Slay_F']) assert.equal(state.internetMatrixRows.some(row => row.name === name), false);
    const loaded = state.internetData.flatMap(group => group.plans);
    for (const plan of app.data.plans) {
        const actual = loaded.find(item => item.id === plan.id);
        assert.equal(actual.price, plan.price);
        const vip = plan.duration_text.startsWith('HomeTV VIP 3 (');
        if (['Home Slay_M', 'Home Slay_F', 'HomeTV_B'].includes(state.splitInternetPlanLabel(plan.duration_text).name)) continue;
        assert.equal(actual.duration_text, vip ? 'HomeTV VIP 3 (1Gbps)' : plan.duration_text);
        assert.equal(actual.note, plan.note);
    }
    assert.equal(JSON.stringify(app.data.plans), original);
});

test('updated promotion source preserves all prices while correcting speeds and the HomeTV_B TV-only bundle', async () => {
    const app = loadInternet(), state = app.state;
    const original = JSON.stringify(app.data.plans);
    await state.fetchData();
    const expected = [
        ['noi', 'Home Slay_M', '300ULM', 'none', '1 Mesh hoặc MyTV(S1/S2)', [210000, 630000, 1260000, 2520000]],
        ['noi', 'Home Slay_F', '300ULM', '1mesh', '1 Mesh · 1 Camera Indoor(1 ngày)', [215000, 645000, 1290000, 2580000]],
        ['nt', 'Home 1_M', '300Mbps', '1mesh', '1 Mesh', [195000, 585000, 1170000, 2340000]],
        ['nt', 'HomeTV_B', '300Mbps', 'none', 'MyTV(S1/S2)', [195000, 585000, 1170000, 2340000]]
    ];
    for (const [region, name, speed, configuration, benefits, prices] of expected) {
        state.activeInternetRegion = region;
        const row = state.internetAllMatrixRows.find(row => row.name === name);
        assert.ok(row, name);
        assert.equal(row.speed, speed);
        assert.equal(state.getInternetSpeedMbps(row.speed), 300);
        assert.equal(row.benefits, benefits);
        assert.deepEqual(Object.keys(row.variants), [configuration]);
        for (const [index, months] of [1, 3, 6, 12].entries()) {
            state.internetMonths = months;
            assert.equal(state.calculateInternetTotal(row.variants[configuration].price, row.hasCamera), prices[index]);
        }
    }
    state.internetFilters = { speed: '300', mesh: '1', mytv: '', camera: '' };
    assert.equal(state.internetMatrixRows.some(row => row.name === 'HomeTV_B'), false);
    state.internetFilters = { speed: '300', mesh: '0', mytv: 's', camera: 'no' };
    assert.ok(state.internetMatrixRows.some(row => row.name === 'HomeTV_B'));
    assert.equal(JSON.stringify(app.data.plans), original);
});

test('Internet supplements avoid duplicates, preserve server prices and apply only requested metadata corrections', async () => {
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
        assert.equal(loaded.length, 10);
        assert.equal(loaded.filter(plan => plan.id === 'server-cam-canh').length, 1);
        assert.equal(loaded.some(plan => plan.id === 'internet-nt-cam-canh'), false);
        assert.equal(loaded.find(plan => plan.id === 'server-cam-canh').price, 196000);
        assert.equal(loaded.find(plan => plan.id === 'server-cam-canh').note, '01 Camera Indoor và Cloud (1 ngày)');
        state.activeInternetRegion = 'nt';
        const row = state.internetMatrixRows.find(row => row.variants['1mesh']?.id === 'server-cam-sanh');
        assert.equal(row.hasCamera, true);
        state.includeInternetCameraSetupFee = true;
        assert.equal(state.calculateInternetTotal(row.variants['1mesh'].price, row.hasCamera), 335000);
    }
    assert.equal(app.data.plans.length, 2);
});
