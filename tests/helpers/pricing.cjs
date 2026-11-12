const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '../..');

function readPlans(serviceIds = ['vnptca', 'smartca']) {
    const csv = fs.readFileSync(path.join(root, 'supabase-info/plans.csv'), 'utf8');
    const rows = [];
    let row = [], field = '', quoted = false;
    for (let i = 0; i < csv.length; i++) {
        const char = csv[i];
        if (char === '"') {
            if (quoted && csv[i + 1] === '"') { field += '"'; i++; }
            else quoted = !quoted;
        } else if (!quoted && (char === ',' || char === '\n')) {
            row.push(field); field = '';
            if (char === '\n') { rows.push(row); row = []; }
        } else if (char !== '\r' || quoted) field += char;
    }
    if (field || row.length) { row.push(field); rows.push(row); }
    const headers = rows.shift();
    return rows.map(values => Object.fromEntries(headers.map((key, i) => [key, values[i]])))
        .filter(plan => serviceIds.includes(plan.service_id));
}

function loadPricing() {
    const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    const script = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
        .filter(match => !/\bsrc\s*=/.test(match[1])).at(-1)[2];
    let options, copied = '';
    const sandbox = {
        window: { supabase: { createClient: () => ({}) } },
        Vue: { createApp(value) { options = value; return { mount() {} }; } },
        navigator: { clipboard: { writeText(text) { copied = text; return Promise.resolve(); } } }
    };
    vm.createContext(sandbox);
    for (const file of ['vnptca-data.js', 'bhxh-data.js', 'invoice-data.js', 'inbot-data.js', 'pos-data.js', 'econtract-data.js']) {
        vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), sandbox);
    }
    vm.runInContext(script, sandbox);
    const state = options.data();
    for (const [key, fn] of Object.entries(options.methods)) state[key] = fn.bind(state);
    for (const [key, fn] of Object.entries(options.computed)) {
        Object.defineProperty(state, key, { get: () => fn.call(state) });
    }
    state.showToast = () => {};
    return { state, copied: () => copied, watch: options.watch };
}

// Integer fractions provide an independent reference without intermediate rounding.
function roundFraction(numerator, denominator) {
    return Number((2n * numerator + denominator) / (2n * denominator));
}

module.exports = { readPlans, loadPricing, roundFraction };
