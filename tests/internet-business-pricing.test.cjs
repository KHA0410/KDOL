const assert = require('node:assert/strict');
const test = require('node:test');
const source = require('./fixtures/internet-business-source.json');
const { loadPricing, roundFraction } = require('./helpers/pricing.cjs');

const columns = {
    xtra: { retail: ['H', 'I', 'J'], delegated: ['K', 'L', 'M'], health: ['N', 'P', 'Q'] },
    eco: { retail: ['K', 'L', 'M'], delegated: ['N', 'P', 'Q'], health: ['R', 'S', 'T'], mtl: ['U', 'V', 'W'] },
    wifi: { retail: ['H', 'I', 'J'], delegated: ['K', 'L', 'M'] },
    on: { retail: ['I', 'J', 'K'], health: ['L', 'M', 'N'] },
    multi: { retail: ['F', 'G', 'H'], delegated: ['I', 'J', 'K'] }
};
const periods = ['monthly', 'half', 'annual'];

function fraction(value) {
    const [mantissa, exponent = '0'] = String(value).toLowerCase().split('e');
    const decimal = mantissa.split('.')[1]?.length || 0;
    let n = BigInt(mantissa.replace('.', '')), d = 1n;
    const scale = decimal - Number(exponent);
    if (scale > 0) d = 10n ** BigInt(scale); else n *= 10n ** BigInt(-scale);
    return [n, d];
}

function sourcePrice(plan, scheme, period) {
    const col = columns[plan.family][scheme]?.[periods.indexOf(period)];
    return col ? source[col + plan.sourceRow] ?? null : null;
}

test('business catalog matches all 36 Excel configurations, price cells and latest speeds without rounding', () => {
    const { state } = loadPricing(), catalog = state.internetBusinessCatalog;
    assert.equal(catalog.plans.length, 36);
    assert.equal(new Set(catalog.plans.map(plan => plan.id)).size, 36);
    assert.equal(catalog.plans.filter(plan => plan.discontinued).length, 6);
    assert.equal(catalog.setupPrice, 272727);
    for (const plan of catalog.plans) {
        assert.ok(plan.name === source['B' + plan.sourceRow].trim() || plan.sourceRow === 42);
        for (const [scheme, cols] of Object.entries(columns[plan.family])) for (const [i, period] of periods.entries()) {
            const price = source[cols[i] + plan.sourceRow];
            assert.equal(plan.prices[scheme][period], price === undefined ? null : Number(price));
        }
        const col = { xtra: 'D', eco: 'E', wifi: 'D', on: 'F', multi: 'C' }[plan.family];
        assert.equal(plan.latestSpeed, source[col + plan.sourceRow]);
        assert.equal(plan.domesticMbps, Number(plan.latestSpeed.split('/')[0]));
        if (plan.latestSpeed.includes('/')) assert.equal(plan.internationalMbps, Number(plan.latestSpeed.split('/')[1]));
    }
    for (const ip of catalog.ipPlans) {
        assert.equal(ip.retail, Number(source['U' + ip.id]));
        assert.equal(ip.delegated, Number(source['V' + ip.id]));
    }
});

test('business totals and copied quotes use fixed VAT 10% independently of other services', () => {
    const app = loadPricing(), state = app.state;
    const snapshot = JSON.stringify(state.internetBusinessCatalog);
    state.includeInternetSetupFee = true; state.includeInternetCameraSetupFee = true;
    state.internetMonths = 12; state.vatRate = 8;
    let checked = 0;
    for (const plan of state.internetBusinessCatalog.plans.filter(plan => !plan.discontinued)) {
        for (const scheme of ['retail', 'delegated', 'health', 'mtl']) for (const period of periods) for (const vat of [8, 10]) for (const setup of [false, true]) {
            state.businessInternetScheme = scheme; state.businessInternetPeriod = period;
            state.vatRate = vat; state.includeBusinessInternetSetup = setup;
            assert.equal(state.businessInternetVat, 10);
            const effective = plan.sourceRow === 17 ? 'retail' : scheme;
            const raw = sourcePrice(plan, effective, period);
            if (raw === null || (plan.sourceRow === 42 && period === 'monthly')) {
                assert.equal(state.getBusinessInternetBase(plan), null);
                assert.equal(state.calculateBusinessInternetTotal(plan), null);
                const previous = app.copied(); state.executeBusinessInternetCopy(plan); assert.equal(app.copied(), previous);
                continue;
            }
            const [n, d] = fraction(raw);
            const expected = roundFraction((n + (setup ? 272727n * d : 0n)) * 110n, d * 100n);
            assert.equal(state.getBusinessInternetScheme(plan), effective);
            assert.equal(state.calculateBusinessInternetTotal(plan), expected, `${plan.name} ${scheme} ${period} VAT ${vat}`);
            state.executeBusinessInternetCopy(plan);
            assert.ok(app.copied().includes(plan.name));
            assert.ok(app.copied().includes(state.formatPrice(expected)));
            assert.ok(app.copied().includes('VAT 10%'));
            assert.ok(app.copied().includes(state.getBusinessInternetTermLabel(plan)));
            const schemeLabel = state.internetBusinessCatalog.schemes.find(item => item.id === effective).label;
            assert.ok(app.copied().includes('giá ' + schemeLabel));
            if (setup) assert.ok(app.copied().includes('lắp đặt '));
            checked++;
        }
    }
    assert.ok(checked > 500);
    assert.equal(JSON.stringify(state.internetBusinessCatalog), snapshot);
});

test('FiberEco1 always uses current price, FiberOn3 keeps source long-period prices, Fiber Pro cannot sell monthly', () => {
    const { state } = loadPricing();
    const eco1 = state.internetBusinessCatalog.plans.find(plan => plan.sourceRow === 17);
    assert.equal(state.businessInternetVat, 10);
    for (const scheme of ['retail', 'delegated', 'health', 'mtl']) {
        state.businessInternetScheme = scheme;
        for (const [period, price] of [['monthly', 352000], ['half', 2112000], ['annual', 4224000]]) {
            state.businessInternetPeriod = period;
            assert.equal(state.calculateBusinessInternetTotal(eco1), price);
        }
    }
    const on3 = state.internetBusinessCatalog.plans.find(plan => plan.sourceRow === 51);
    state.businessInternetScheme = 'retail';
    for (const [period, price] of [['monthly', 1900000], ['half', 16500000], ['annual', 33000000]]) {
        state.businessInternetPeriod = period; assert.equal(state.calculateBusinessInternetTotal(on3), price);
    }
    const pro = state.internetBusinessCatalog.plans.find(plan => plan.sourceRow === 42);
    state.businessInternetPeriod = 'monthly'; assert.equal(state.calculateBusinessInternetTotal(pro), null);
    state.businessInternetPeriod = 'half'; assert.equal(state.getBusinessInternetTermLabel(pro), '6 tháng'); assert.equal(state.calculateBusinessInternetTotal(pro), 8700000);
    state.businessInternetPeriod = 'annual'; assert.equal(state.getBusinessInternetTermLabel(pro), '13 tháng'); assert.equal(state.calculateBusinessInternetTotal(pro), 17400000);
});

test('business filtering hides six discontinued plans, blocks their quotes, and resets independently from family Internet', () => {
    const app = loadPricing(), state = app.state;
    assert.equal(state.activeInternetTab, 'home');
    assert.equal(state.businessInternetSections.flatMap(group => group.plans).length, 30);
    state.businessInternetQuery = 'fiberxtra';
    assert.equal(state.businessInternetSections.flatMap(group => group.plans).length, 5);
    state.businessInternetShowStopped = true;
    assert.equal(state.businessInternetSections.flatMap(group => group.plans).length, 6);
    for (const plan of state.internetBusinessCatalog.plans.filter(plan => plan.discontinued)) {
        state.executeBusinessInternetCopy(plan); assert.equal(app.copied(), '');
    }
    state.businessInternetQuery = ''; assert.equal(state.businessInternetSections.flatMap(group => group.plans).length, 36);
    state.internetMonths = 6; state.activeInternetRegion = 'nt';
    state.activeInternetTab = 'business'; state.businessInternetPeriod = 'annual';
    state.activeInternetTab = 'home'; assert.equal(state.internetMonths, 6); assert.equal(state.activeInternetRegion, 'nt');
    state.vatRate = 8; state.businessInternetScheme = 'health'; state.businessIpQuantities['4'] = 2;
    state.selectService({ id: 'internet' });
    assert.equal(state.activeInternetTab, 'home'); assert.equal(state.businessInternetPeriod, 'monthly');
    assert.equal(state.businessInternetScheme, 'retail'); assert.equal(state.businessInternetVat, 10);
    assert.equal(state.businessIpSubtotal, 0); assert.equal(state.businessInternetShowStopped, false);
});

test('static IP purchases are charged once at their independent tariff, with setup and VAT calculated at the end', () => {
    const app = loadPricing(), state = app.state;
    const plans = state.internetBusinessCatalog.plans.filter(plan => !plan.discontinued);
    const quantities = { '4': 2, '5': 1, '6': 1, '7': 1 };
    const snapshot = JSON.stringify(state.internetBusinessCatalog);
    for (const ipScheme of ['retail', 'delegated']) {
        state.businessIpScheme = ipScheme; state.businessIpQuantities = { ...quantities };
        const ip = ipScheme === 'retail' ? 3900000 : 3120000;
        assert.equal(state.businessIpSubtotal, ip);
        for (const plan of plans) for (const scheme of ['retail', 'delegated', 'health', 'mtl']) for (const period of periods) {
            state.businessInternetScheme = scheme; state.businessInternetPeriod = period;
            const raw = sourcePrice(plan, plan.sourceRow === 17 ? 'retail' : scheme, period);
            if (raw === null || (plan.sourceRow === 42 && period === 'monthly')) continue;
            for (const vat of [8, 10]) for (const setup of [false, true]) {
                state.vatRate = vat; state.includeBusinessInternetSetup = setup;
                const [n, d] = fraction(raw);
                const expected = roundFraction((n + BigInt(ip + (setup ? 272727 : 0)) * d) * 110n, d * 100n);
                assert.equal(state.calculateBusinessInternetTotal(plan), expected);
                state.executeBusinessInternetCopy(plan);
                assert.ok(app.copied().includes(state.formatPrice(expected)));
                assert.ok(app.copied().includes('IP mua thêm (' + (ipScheme === 'retail' ? 'hiện hành' : 'phân cấp') + ')'));
                for (const item of state.internetBusinessCatalog.ipPlans) assert.ok(app.copied().includes(quantities[item.id] + ' × ' + item.name));
            }
        }
    }
    assert.equal(JSON.stringify(state.internetBusinessCatalog), snapshot);
});

test('invalid IP quantities block incomplete quotes, zero/blank means no add-on, and unsafe totals are rejected', () => {
    const app = loadPricing(), state = app.state, plan = state.internetBusinessCatalog.plans.find(plan => plan.sourceRow === 8);
    for (const id of ['4', '5', '6', '7']) for (const quantity of [-1, 0.5, 'abc', Infinity, Number.MAX_SAFE_INTEGER]) {
        state.businessIpQuantities = { '4': 0, '5': 0, '6': 0, '7': 0, [id]: quantity };
        assert.equal(state.businessIpSubtotal, null);
        assert.equal(state.calculateBusinessInternetTotal(plan), null);
        state.executeBusinessInternetCopy(plan); assert.equal(app.copied(), '');
    }
    state.businessIpQuantities = { '4': '', '5': ' ', '6': 0, '7': '0' };
    assert.equal(state.businessIpSubtotal, 0);
    assert.equal(state.calculateBusinessInternetTotal(plan), 550000);
    for (const vat of [NaN, Infinity, -1, 0, 9]) {
        state.vatRate = vat;
        assert.equal(state.businessInternetVat, 10);
        assert.equal(state.calculateBusinessInternetTotal(plan), 550000);
    }
});
