const assert = require('node:assert/strict');
const test = require('node:test');
const { loadPricing } = require('./helpers/pricing.cjs');

test('MyTV STB fee recurs for each paid month across all package tiers', () => {
    const { state } = loadPricing({}, ['mytv-data.js']);
    const cases = [
        { term: 'monthly', totals: [70000, 80000, 115000, 145000], surcharge: 50000 },
        { term: 'six-months', totals: [420000, 480000, 690000, 870000], surcharge: 300000 },
        { term: 'annual', totals: [840000, 960000, 1380000, 1740000], surcharge: 600000 }
    ];
    const monthlyPrices = [20000, 30000, 65000, 95000];
    assert.equal(state.includeMytvStb, false);
    for (const { term, totals, surcharge } of cases) {
        state.activeMytvTermId = term;
        for (const pkg of state.mytvPackages) {
            const expected = totals[monthlyPrices.indexOf(pkg.monthlyPrice)];
            assert.notEqual(expected, undefined);
            state.includeMytvStb = true;
            assert.equal(state.calculateMytvTotal(pkg.monthlyPrice), expected, `${pkg.id} ${term}`);
            state.includeMytvStb = false;
            assert.equal(state.calculateMytvTotal(pkg.monthlyPrice), expected - surcharge, `${pkg.id} ${term} without STB`);
        }
    }
});

test('MyTV STB does not create a price for a package without pricing', () => {
    const { state } = loadPricing();
    state.includeMytvStb = true;
    state.activeMytvTermId = 'annual';
    assert.equal(state.calculateMytvTotal(null), null);
});
