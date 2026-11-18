const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { loadPricing } = require('./helpers/pricing.cjs');

const files = ['address-regions.js', 'address-search.js', 'address-data.js'];
const sandbox = vm.createContext({ window: {} });
for (const file of files) vm.runInContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), sandbox);
const catalog = sandbox.window.KDOL_ADDRESSES;
const engine = sandbox.window.KDOL_ADDRESS_SEARCH;
const regionRules = sandbox.window.KDOL_ADDRESS_REGIONS;

test('catalog retains all workbook records, 34 provinces and string codes with leading zeroes', () => {
    assert.equal(catalog.records.length, 3321);
    assert.equal(new Set(catalog.records.map(row => row.provinceCode)).size, 34);
    assert.equal(new Set(catalog.records.map(row => row.wardCode)).size, 3321);
    assert.ok(catalog.records.every(row => ['provinceCode', 'provinceName', 'provinceTmsCode', 'districtCode', 'districtName', 'wardCode', 'wardName'].every(key => typeof row[key] === 'string' && row[key].length)));
    const first = catalog.records[0];
    assert.equal(first.provinceCode, '01');
    assert.equal(first.wardCode, '10105001');
    assert.equal(first.districtName, 'Quận Hoàn Kiếm');
    assert.equal(first.wardName, 'Phường Hoàn Kiếm');
    assert.equal(first.provinceName, 'Thành phố Hà Nội');
});

test('accented, unaccented and punctuation queries match both new wards and old districts', () => {
    const codeList = query => engine.search(catalog.records, query).map(row => row.wardCode).join(',');
    assert.equal(codeList('Hoàn Kiếm'), codeList('HOAN KIEM'));
    assert.equal(codeList('  hoan,   kiem  '), codeList('Hoàn Kiếm'));
    assert.equal(codeList('Đống Đa'), codeList('dong da'));
    assert.ok(engine.search(catalog.records, 'huyen dong anh').length > 0);
    assert.ok(engine.search(catalog.records, 'Cửa Nam').some(row => row.wardCode === '10105002'));
    assert.equal(engine.search(catalog.records, 'ha noi hoan kiem')[0].wardCode, '10105001');
    assert.equal(engine.search(catalog.records, 'hoan kiem ha noi')[0].wardCode, '10105001');
});

test('exact new ward matches rank before district-only matches and codes remain searchable', () => {
    const matches = engine.search(catalog.records, 'hoan kiem');
    assert.equal(matches[0].wardName, 'Phường Hoàn Kiếm');
    assert.ok(matches.some(row => row.wardName === 'Phường Cửa Nam'));
    assert.equal(engine.search(catalog.records, '10105002')[0].wardName, 'Phường Cửa Nam');
    assert.ok(engine.search(catalog.records, '10105').length >= 2);
});

test('old district to new wards: Quan 10 returns exactly its three wards without matching numeric codes', () => {
    const matches = engine.search(catalog.records, 'quận 10');
    assert.equal(matches.length, 3);
    assert.equal(matches.map(row => row.wardName).sort().join('|'), ['Phường Diên Hồng', 'Phường Vườn Lài', 'Phường Hoà Hưng'].sort().join('|'));
    assert.ok(matches.every(row => row.districtName === 'Quận 10'));
    const quan1 = engine.search(catalog.records, 'quan 1');
    assert.ok(quan1.length > 0);
    assert.ok(quan1.every(row => row.districtName === 'Quận 1'));
});

test('new ward to old district: Phuong Hoa Hung returns Quan 10 without scattering words across fields', () => {
    const matches = engine.search(catalog.records, 'phường hòa hưng');
    assert.equal(matches.length, 1);
    assert.equal(matches[0].districtName, 'Quận 10');
    assert.equal(matches[0].wardCode, '70119089');
    const untyped = engine.search(catalog.records, 'hoa hung');
    assert.equal(untyped.length, 5); // Also includes old Xã Hòa Hưng -> new Xã Hòa Hội in HCM.
    assert.ok(untyped.every(row => [row.wardName, ...(row.matchedOrigins || []).map(origin => origin.wardName)]
        .some(name => engine.normalize(name).includes('hoa hung'))));
    assert.equal(engine.search(catalog.records, 'phuong hoa hung', '01').length, 0);
    const dongAnh = engine.search(catalog.records, 'huyện đông anh');
    assert.equal(dongAnh.length, 5);
    assert.ok(dongAnh.every(row => row.districtName === 'Huyện Đông Anh'));
});

test('combined place names work in either order while typed administrative names stay together', () => {
    for (const query of ['phuong hoa hung ho chi minh', 'ho chi minh phuong hoa hung']) {
        const matches = engine.search(catalog.records, query);
        assert.equal(matches.length, 1, query);
        assert.equal(matches[0].districtName, 'Quận 10', query);
    }
    for (const query of ['quan 10 ho chi minh', 'ho chi minh quan 10']) {
        assert.equal(engine.search(catalog.records, query).length, 3, query);
    }
    assert.equal(engine.search(catalog.records, 'quan 10 ha noi').length, 0);
    assert.ok(engine.search(catalog.records, 'phuong hoa hu').some(row => row.wardCode === '70119089'));
});

test('HCM imports 493 origin mappings covering all 168 new wards, keeping both code systems separate', () => {
    const mapped = catalog.records.filter(row => row.origins);
    assert.equal(catalog.historySource, 'tphcm-sap-nhap-phuong-xa.xlsx');
    assert.equal(catalog.historyCount, 493);
    assert.equal(mapped.length, 168);
    assert.equal(mapped.reduce((count, row) => count + row.origins.length, 0), 493);
    assert.equal(new Set(mapped.map(row => row.officialWardCode)).size, 168);
    assert.ok(mapped.every(row => row.provinceCode === '29' && row.origins.every(origin => origin.districtCode && origin.provinceName && origin.mergerType)));
    const conDao = mapped.find(row => row.wardName === 'Đặc khu Côn Đảo');
    assert.equal(conDao.origins[0].wardName, '');
    assert.equal(conDao.origins[0].districtName, 'Huyện Côn Đảo');
});

test('old Phuong 14 Quan 10 returns both split destinations and only the relevant old address', () => {
    for (const query of ['phường 14, quận 10, hcm', 'p14 q10 tphcm', 'P.14, Q.10, TP.HCM', 'hcm quan 10 phuong 14']) {
        const matches = engine.search(catalog.records, query);
        assert.equal(matches.length, 2, query);
        assert.equal(matches.map(row => row.officialWardCode).sort().join(','), '27163,27169');
        assert.ok(matches.every(row => row.matchedOrigins.length === 1
            && row.matchedOrigins[0].wardName === 'Phường 14'
            && row.matchedOrigins[0].districtName === 'Quận 10'));
        assert.ok(matches.every(row => engine.classify(row).id === 'noi'));
        assert.ok(matches.find(row => row.officialWardCode === '27169').matchedOrigins[0].mergerType.includes('chủ yếu'));
        assert.ok(matches.find(row => row.officialWardCode === '27163').matchedOrigins[0].mergerType.includes('một phần'));
    }
    assert.equal(engine.search(catalog.records, 'phuong 14 quan 10 ha noi').length, 0);
});

test('reverse HCM lookup lists every source ward, keeps numbered wards distinct and supports official codes', () => {
    const dienHong = engine.search(catalog.records, 'phuong dien hong hcm');
    assert.equal(dienHong.length, 1);
    assert.equal(dienHong[0].matchedOrigins.map(origin => origin.wardName).sort().join(','), 'Phường 14,Phường 6,Phường 8');
    assert.equal(engine.search(catalog.records, '27169')[0].wardName, 'Phường Diên Hồng');
    // This old ward is absent from the source, so do not substitute Phường 10/11/14.
    assert.equal(engine.search(catalog.records, 'phuong 1 quan 1 hcm').length, 0);
    assert.ok(engine.search(catalog.records, 'huyen dau tieng tinh binh duong').length > 0);
});

test('split addresses keep original VNPT areas and reverse lookup identifies destinations spanning both areas', () => {
    const matches = engine.search(catalog.records, 'xa an phu tay binh chanh');
    assert.equal(matches.length, 2);
    assert.ok(matches.every(row => engine.classify(row).id === 'ngoai'));
    const binhDong = engine.search(catalog.records, 'phuong binh dong hcm');
    assert.equal(binhDong.length, 1);
    assert.equal(engine.classify(binhDong[0]).id, 'mixed');
    assert.ok(binhDong[0].matchedOrigins.some(origin => origin.districtName === 'Quận 8'));
    assert.ok(binhDong[0].matchedOrigins.some(origin => origin.districtName === 'Huyện Bình Chánh'));
    // Similar unaccented names must not merge distinct administrative units.
    assert.equal(catalog.records.find(row => row.wardName === 'Xã Thạnh An' && row.provinceCode === '29').officialWardCode, '27676');
    assert.equal(catalog.records.find(row => row.wardName === 'Xã Thanh An' && row.provinceCode === '29').officialWardCode, '25807');
});

test('province and area filters combine with search; no matches and blank search are handled', () => {
    assert.equal(engine.search(catalog.records, '').length, 3321);
    assert.equal(engine.search(catalog.records, 'zzzzkhongtontai').length, 0);
    assert.equal(engine.search(catalog.records, 'hoan kiem', '34').length, 0);
    assert.ok(engine.search(catalog.records, '', '01').every(row => row.provinceCode === '01'));
    assert.equal(engine.search(catalog.records, '', '', 'unknown').length, 0);
    assert.equal(engine.search(catalog.records, '', '01', 'noi').length, 46);
    assert.equal(engine.search(catalog.records, '', '01', 'ngoai').length, 80);
    assert.ok(engine.search(catalog.records, 'hoan kiem', '01', 'noi').length > 0);
    assert.equal(engine.search(catalog.records, 'hoan kiem', '01', 'ngoai').length, 0);
});

test('VNPT tags require explicit business rules, with ward rules taking precedence', () => {
    const row = catalog.records[0];
    assert.equal(engine.classify(row).id, 'noi');
    const rules = { districtCodes: { '10105': 'ngoai' }, wardCodes: { '10105001': 'noi' } };
    assert.equal(engine.classify(row, rules).label, 'Nội thành');
    assert.equal(engine.classify(catalog.records[1], rules).label, 'Ngoại thành & Tỉnh');
    assert.equal(engine.classify(row, { wardCodes: { '10105001': 'invalid' } }).id, 'unknown');
    sandbox.window.KDOL_ADDRESS_REGIONS = rules;
    assert.equal(engine.search(catalog.records, '', '01', 'noi').length, 1);
    assert.equal(engine.search(catalog.records, '', '01', 'ngoai')[0].wardCode, '10105002');
    // No Quận/Huyện heuristic is allowed without a VNPT rule.
    sandbox.window.KDOL_ADDRESS_REGIONS = {};
    assert.equal(engine.classify(row).id, 'unknown');
    assert.equal(engine.classify(catalog.records.find(row => row.districtName.startsWith('Huyện '))).id, 'unknown');
    sandbox.window.KDOL_ADDRESS_REGIONS = regionRules;
});

test('Hanoi uses the complete supplied 17 rural districts plus Son Tay, with the other 12 old districts in the higher price group', () => {
    const outside = new Set(['Thị xã Sơn Tây', 'Huyện Đông Anh', 'Huyện Gia Lâm', 'Huyện Sóc Sơn',
        'Huyện Mê Linh', 'Huyện Hoài Đức', 'Huyện Đan Phượng', 'Huyện Phúc Thọ', 'Huyện Thạch Thất',
        'Huyện Quốc Oai', 'Huyện Ba Vì', 'Huyện Thanh Trì', 'Huyện Thanh Oai', 'Huyện Chương Mỹ',
        'Huyện Thường Tín', 'Huyện Phú Xuyên', 'Huyện Ứng Hoà', 'Huyện Mỹ Đức']);
    const rows = catalog.records.filter(row => row.provinceCode === '01');
    assert.equal(new Set(rows.map(row => row.districtCode)).size, 30);
    assert.equal(new Set(rows.filter(row => outside.has(row.districtName)).map(row => row.districtCode)).size, 18);
    for (const row of rows) assert.equal(engine.classify(row).id, outside.has(row.districtName) ? 'ngoai' : 'noi', row.districtName);
});

test('old HCM keeps Thu Duc and its old urban districts inside; exactly the five named rural districts are outside', () => {
    const outside = new Set(['Huyện Bình Chánh', 'Huyện Hóc Môn', 'Huyện Củ Chi', 'Huyện Nhà Bè', 'Huyện Cần Giờ']);
    const rows = catalog.records.filter(row => row.districtCode.startsWith('701'));
    assert.equal(new Set(rows.filter(row => outside.has(row.districtName)).map(row => row.districtCode)).size, 5);
    for (const row of rows) assert.equal(engine.classify(row).id, outside.has(row.districtName) ? 'ngoai' : 'noi', row.districtName);
    const thuDuc = rows.filter(row => row.districtName === 'Thành phố Thủ Đức');
    assert.ok(thuDuc.length > 0);
    assert.ok(thuDuc.every(row => engine.classify(row).id === 'noi'));
});

test('old boundaries prevent merged provinces from inheriting the higher price; all old Hai Phong including rural districts is inside', () => {
    for (const prefix of ['107', '711', '717']) {
        const rows = catalog.records.filter(row => row.districtCode.startsWith(prefix));
        assert.ok(rows.length > 0);
        assert.ok(rows.every(row => engine.classify(row).id === 'ngoai'));
    }
    const haiPhong = catalog.records.filter(row => row.districtCode.startsWith('103'));
    assert.equal(haiPhong.length, 50);
    assert.ok(haiPhong.some(row => row.districtName.startsWith('Huyện ')));
    assert.ok(haiPhong.every(row => engine.classify(row).id === 'noi'));
});

test('all 3321 addresses receive a price area without changing source data', () => {
    const original = JSON.stringify(catalog.records);
    const inside = engine.search(catalog.records, '', '', 'noi');
    const outside = engine.search(catalog.records, '', '', 'ngoai');
    assert.equal(inside.length, 174);
    assert.equal(outside.length, 3147);
    assert.equal(inside.length + outside.length, catalog.records.length);
    assert.equal(JSON.stringify(catalog.records), original);
});

test('Vue lookup loads independently of pricing data, paginates and resets on a new search', async () => {
    const { state, watch } = loadPricing({}, files);
    assert.equal(state.isLoading, true);
    await state.loadAddressCatalog();
    assert.equal(state.addressLoading, false);
    assert.equal(state.addressError, '');
    assert.equal(state.addressMatches.length, 0);
    assert.equal(state.visibleAddresses.length, 0);
    state.addressQuery = 'ha noi';
    assert.equal(state.addressMatches.length, 126);
    assert.equal(state.visibleAddresses.length, 50);
    state.addressLimit += 50;
    assert.equal(state.visibleAddresses.length, 100);
    state.addressQuery = 'hoan kiem';
    watch.addressQuery.call(state);
    assert.equal(state.addressLimit, 50);
    assert.equal(state.visibleAddresses[0].wardCode, '10105001');
    state.addressQuery = 'hoan kiem ca mau';
    assert.equal(state.visibleAddresses.length, 0);
    state.addressQuery = '   ';
    assert.equal(state.visibleAddresses.length, 0);
});

test('lookup opens the dialog and returns keyboard focus when closed', async () => {
    const { state } = loadPricing({}, files);
    let inputFocus = false, triggerFocus = false;
    state.$refs = {
        addressDialog: { open: false, showModal() { this.open = true; }, close() { this.open = false; } },
        addressQueryInput: { focus() { inputFocus = true; } },
        addressTrigger: { focus() { triggerFocus = true; } }
    };
    state.$nextTick = fn => fn();
    await state.openAddressLookup();
    assert.equal(state.$refs.addressDialog.open, true);
    assert.ok(inputFocus);
    state.closeAddressLookup();
    assert.equal(state.$refs.addressDialog.open, false);
    assert.ok(triggerFocus);
});
