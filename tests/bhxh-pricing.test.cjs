const assert = require('node:assert/strict');
const test = require('node:test');
const { readPlans, loadPricing, roundFraction } = require('./helpers/pricing.cjs');

function loadBhxh() {
    const app = loadPricing();
    const plans = readPlans(['bhxh']);
    app.state.bhxhData = Object.values(plans.reduce((groups, plan) => {
        (groups[plan.plan_group] ??= { type: plan.plan_group, plans: [] }).plans.push(plan);
        return groups;
    }, {}));
    return { ...app, plans };
}

function selectGroup(state, code) {
    state.activeBhxhGroup = code.startsWith('bhxh_doclap') ? 'doclap' : 'tichhop';
    state.activeBhxhType = code.includes('giahan') ? 'giahan' : 'moi';
    state.activeBhxhVan = code.replace(/^(?:bhxh_doclap|tichhop_(?:moi|giahan))/, '');
}

test('40 BHXH prices match supplied tables, including confirmed VAN 100 renewal correction', () => {
    const { state, plans } = loadBhxh();
    state.vatRate = 10; // This price example explicitly uses VAT 10%.
    const standalone = {
        '': [220000, 352000, 418000, 528000],
        _100: [550000, 880000, 1045000, 1320000],
        _1000: [880000, 1408000, 1672000, 1936000],
        _max: [1210000, 1936000, 2299000, 2585000]
    };
    const integrated = {
        '': [1320000, 2156000, 2530000],
        _100: [1584000, 2695000, 3020600],
        _1000: [1897500, 3157000, 3608000],
        _max: [2200000, 3658600, 4202000]
    };
    const newTotals = {
        '': [1870000, 2706000, 3080000],
        _100: [2134000, 3245000, 3570600],
        _1000: [2447500, 3707000, 4158000],
        _max: [2750000, 4208600, 4752000]
    };
    assert.equal(plans.length, 40);
    for (const plan of plans) {
        selectGroup(state, plan.plan_group);
        const standalonePlan = state.activeBhxhGroup === 'doclap';
        const index = [18, 33, 48, 60].indexOf(Number(plan.duration_text));
        let expected = (standalonePlan ? standalone : integrated)[state.activeBhxhVan][index];
        if (plan.plan_group === 'tichhop_giahan_100' && plan.duration_text === '33') expected = 2695100;
        assert.equal(Number(plan.price), expected, `${plan.plan_group}/${plan.duration_text}`);
        assert.equal(Number(state.currentBhxhPlans.find(row => row.duration_text === plan.duration_text).price), expected);
        if (!standalonePlan && state.activeBhxhType === 'moi') {
            assert.equal(state.calculateBhxhTotal(plan.price), newTotals[state.activeBhxhVan][index]);
        }
    }
    // Runtime correction must work even while the online database still returns the old price.
    const raw = state.bhxhData.find(group => group.type === 'tichhop_giahan_100').plans.find(plan => plan.duration_text === '33');
    raw.price = 2695000;
    selectGroup(state, 'tichhop_giahan_100');
    assert.equal(state.currentBhxhPlans.find(plan => plan.duration_text === '33').price, 2695100);
    assert.equal(raw.price, 2695000);
    selectGroup(state, 'tichhop_moi_100');
    assert.equal(Number(state.currentBhxhPlans.find(plan => plan.duration_text === '33').price), 2695000);
});

test('BHXH service, total and copied quote use regional caps, VAT 8/10 and undiscounted Token', () => {
    const app = loadBhxh(), state = app.state;
    let cases = 0;
    for (const group of state.bhxhData) {
        selectGroup(state, group.type);
        for (const plan of state.currentBhxhPlans) for (const region of ['other', 'major']) {
            state.bhxhRegion = region;
            const cap = state.activeBhxhGroup === 'doclap' ? (region === 'major' ? 65 : 50) : (region === 'major' ? 55 : 45);
            assert.equal(state.maxBhxhDiscount, cap);
            for (const vat of [8, 10]) for (const requested of [0, 10, 45, 50, 55, 65, 100]) {
                state.vatRate = vat; state.discountBhxh = requested;
                const discount = Math.min(requested, cap);
                const service = roundFraction(BigInt(plan.price) * BigInt(100 + vat) * BigInt(100 - discount), 11000n);
                const hasToken = group.type.startsWith('tichhop_moi');
                const token = hasToken ? (vat === 10 ? 550000 : 540000) : 0;
                assert.equal(state.bhxhDiscount, discount);
                assert.equal(state.bhxhTokenPrice, token);
                assert.equal(state.calculateBhxhServicePrice(plan.price), service);
                assert.equal(state.calculateBhxhTotal(plan.price), service + token);
                state.executeBhxhCopy(plan);
                assert.ok(app.copied().includes(state.formatPrice(service + token)));
                assert.ok(app.copied().includes(state.bhxhRegionName));
                assert.equal(app.copied().includes('không chiết khấu'), hasToken);
                if (token) assert.ok(app.copied().includes(state.formatPrice(token)));
                if (discount) assert.ok(app.copied().includes(`Đã CK ${discount}% dịch vụ`));
                cases++;
            }
        }
    }
    assert.equal(cases, 1120);
});

test('BHXH caps take effect before watchers and reset when reselecting the service', () => {
    const app = loadBhxh(), state = app.state;
    state.vatRate = 10; // This price example explicitly uses VAT 10%.
    state.bhxhRegion = 'major'; state.discountBhxh = 65;
    assert.equal(state.maxBhxhDiscount, 65);
    assert.equal(state.calculateBhxhTotal(220000), 77000);
    state.bhxhRegion = 'other';
    assert.equal(state.bhxhDiscount, 50);
    assert.equal(state.calculateBhxhTotal(220000), 110000);
    app.watch.maxBhxhDiscount.call(state, state.maxBhxhDiscount);
    assert.equal(state.discountBhxh, 50);
    state.activeBhxhGroup = 'tichhop'; state.bhxhRegion = 'major'; state.discountBhxh = 65;
    assert.equal(state.bhxhDiscount, 55);
    assert.equal(state.calculateBhxhTotal(1320000), 1144000);
    state.vatRate = 8;
    assert.equal(state.calculateBhxhTotal(1320000), 1123200);
    state.bhxhRegion = 'other';
    assert.equal(state.bhxhDiscount, 45);
    assert.equal(state.calculateBhxhTotal(1320000), 1252800);
    state.activeBhxhType = 'giahan';
    assert.equal(state.bhxhTokenPrice, 0);
    assert.equal(state.calculateBhxhServicePrice(2695100), 1455354);
    assert.equal(state.calculateBhxhServicePrice(2695100, -5), 2646098);
    state.selectService({ id: 'bhxh' });
    assert.equal(state.bhxhRegion, 'other'); assert.equal(state.discountBhxh, 0);
    assert.equal(state.activeBhxhGroup, 'doclap'); assert.equal(state.vatRate, 8);
});
