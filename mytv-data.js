/* Danh sách MyTV và giá theo thông tin/ảnh người dùng cung cấp. */
window.KDOL_MYTV = (() => {
    const groups = [
        { id: 'vtv', name: 'VTV' },
        { id: 'htv', name: 'HTV' },
        { id: 'vtvcab', name: 'VTVcab' },
        { id: 'sctv', name: 'SCTV' },
        { id: 'movies', name: 'Phim truyện' },
        { id: 'sports', name: 'SPOTV' },
        { id: 'entertainment', name: 'Giải trí' },
        { id: 'kids', name: 'Thiếu nhi' },
        { id: 'education', name: 'Khoa giáo' },
        { id: 'news', name: 'Tin tức' },
        { id: 'essential', name: 'Thiết yếu' },
        { id: 'local', name: 'Địa phương' }
    ];
    const vtv = [
        [1, 'VTV1'], [2, 'VTV2'], [3, 'VTV3'], [4, 'VTV4'], [5, 'VTV5'],
        [106, 'VTV5 Tây Nam Bộ'], [110, 'VTV5 Tây Nguyên'], [6, 'VTV Cần Thơ'],
        [9, 'VTV7'], [68, 'VTV8'], [69, 'VTV9']
    ];
    const htv = [
        [10, 'HTV1'], [93, 'HTV2'], [87, 'HTV3'], [94, 'HTV7'], [95, 'HTV9'],
        [14, 'HTV Key'], [15, 'HTV Thể thao'], [107, 'HTVC Ca nhạc'],
        [64, 'HTVC Gia đình'], [144, 'HTVC Du lịch và Cuộc sống'], [77, 'HTVC Phim'],
        [205, 'HTVC Phụ nữ'], [74, 'HTVC Thuần Việt'], [168, 'HTVC+']
    ];
    const vtvcab = [
        [102, 'ON BiBi'], [230, 'ON Kids'], [97, 'ON Vie Giải trí'], [100, 'ON E Channel'],
        [132, 'ON V Family'], [195, 'ON InfoTV'], [233, 'ON Life'], [196, 'ON Music'],
        [103, 'ON Style TV'], [104, 'ON Trending'], [105, 'ON Cine'], [194, 'ON Movies'],
        [98, 'ON Phim Việt'], [99, 'ON Vie Dramas'], [39, 'ON Football'], [37, 'ON Sports'],
        [101, 'ON Sports+'], [197, 'ON Sports News'], [199, 'ON Golf'], [91, 'ON O2TV']
    ];
    const sctv = [
        [12, 'SCTV - Phim Tổng hợp'], [13, 'SCTV1'], [16, 'SCTV2'], [18, 'SCTV3'],
        [19, 'SCTV4'], [20, 'SCTV6'], [22, 'SCTV7'], [25, 'SCTV8'], [27, 'SCTV9'],
        [33, 'SCTV11'], [34, 'SCTV12'], [40, 'SCTV13'], [41, 'SCTV14'], [44, 'SCTV16'],
        [45, 'SCTV18'], [46, 'SCTV19'], [47, 'SCTV20'], [48, 'SCTV21'],
        [54, 'SCTV15 - SSportT2'], [55, 'SCTV17 - SSport'], [56, 'SCTV22 - SSportT1']
    ];
    const movies = [[173, 'HBO'], [52, 'Box Hits'], [174, 'Cinemax'], [165, 'WarnerTV']];
    const entertainmentBasic = [
        [157, 'ABC Australia (SD)'], [170, 'Arirang (SD)'],
        [138, 'KBS World (HD)'], [150, 'Asian Food Network']
    ];
    const entertainmentExtended = [
        [185, 'Travel & Living'], [162, 'Fashion TV'], [177, 'AXN'], [150, 'Asian Food Network'],
        [170, 'Arirang (SD)'], [138, 'KBS World (SD)'], [157, 'ABC Australia (SD)'],
        [108, 'Outdoor Channel'], [58, 'Music Box']
    ];
    const educationBasic = [[616, 'BTV9 - An Viên']];
    const educationExtended = [[183, 'Animal Planet'], [148, 'Da Vinci'], [160, 'Discovery Channel'], ...educationBasic];
    const newsBasic = [
        [137, 'France 24 English (SD)'], [65, 'TV5 Asie (SD)'], [146, 'Channel News Asia'],
        [136, 'DW'], [50, 'NHK World Japan']
    ];
    const newsExtended = [...newsBasic, [163, 'CNBC (SD)'], [180, 'CNN']];
    const essential = [[35, 'ANTV (SD)'], [127, 'QPVN'], [7, 'Vietnam Today']];
    const kids = [[256, 'DreamWorks'], [179, 'Cartoon Network']];
    const sports = [[42, 'SPOTV'], [43, 'SPOTV2']];
    const local = [
        [190, 'HanoiTV1'], [193, 'HanoiTV2'], [981, 'BacNinhTV'], [111, 'CaoBangTV'],
        [271, 'DienBienTV'], [159, 'HaiPhongTV (THP)'], [149, 'HaiPhongTV3 (THP3)'],
        [892, 'HungYenTV'], [251, 'LaiChauTV'], [121, 'LangsonTV'],
        [241, 'LaoCaiTV'], [351, 'NinhBinhTV'], [192, 'PhuThoTV'], [244, 'QuangNinhTV1'],
        [245, 'QuangNinhTV3'], [261, 'SonLaTV'], [203, 'ThaiNguyen'], [221, 'TuyenQuangTV'],
        [362, 'ThanhHoaTV'], [372, 'NgheAnTV'], [382, 'HaTinhTV'], [731, 'QuangTriTV'],
        [751, 'HueTV'], [431, 'DaNangTV1'], [432, 'DaNangTV2'], [762, 'QuangNgaiTV1 (QNTV1)'],
        [821, 'QuangNgaiTV2 (QNTV2)'], [811, 'GiaLaiTV'], [471, 'DakLakTV'], [791, 'KhanhHoaTV'],
        [851, 'KhanhHoaTV1'], [491, 'LamDongTV1'], [861, 'LamDongTV2'], [481, 'LamDongTV3'],
        [683, 'AnGiangTV1'], [671, 'AnGiangTV2'], [691, 'CaMauTV'], [651, 'CanThoTV1'],
        [951, 'CanThoTV2'], [831, 'CanThoTV3'], [603, 'DongNaiTV1'], [602, 'DongNaiTV2'],
        [661, 'DongThapTV1'], [631, 'DongThapTV2'], [24, 'VinhLongTV1'], [28, 'VinhLongTV2'],
        [29, 'VinhLongTV3'], [57, 'VinhLongTV4'], [841, 'VinhLongTV5'], [621, 'TayNinhTV']
    ];
    const basic = { vtv, htv, entertainment: entertainmentBasic, education: educationBasic, news: newsBasic, essential, local };
    const extended = { vtv, htv, movies, entertainment: entertainmentExtended, kids, education: educationExtended, news: newsExtended, essential, local };
    const specifications = [
        { id: 's', name: 'S', channelCount: '109', monthlyPrice: 30000, highlights: 'VTV · HTV · Địa phương', galaxy: 'Galaxy VIP vào thứ 7 hằng tuần', lineup: basic },
        { id: 's1', name: 'S1', channelCount: '130', monthlyPrice: 30000, highlights: 'VTVcab · HBO', galaxy: 'Galaxy VIP vào thứ 7 hằng tuần', lineup: { ...basic, vtvcab, movies: [movies[0]] } },
        { id: 's2', name: 'S2', channelCount: '131', monthlyPrice: 30000, highlights: 'SCTV · HBO', galaxy: 'Galaxy VIP vào thứ 7 hằng tuần', lineup: { ...basic, sctv, movies: [movies[0]] } },
        { id: 'film', name: 'Film', channelCount: 'Gần 120', monthlyPrice: 65000, highlights: '2 kênh thể thao SPOTV độc quyền\nMiễn phí Galaxy VIP\nKho nội dung VOD giải trí phong phú (không quảng cáo)', galaxy: 'Galaxy VIP', lineup: { ...extended, vtv: [vtv[0], vtv[4]], sports } },
        { id: 'film-plus', name: 'Film+', channelCount: 'Gần 130', monthlyPrice: 65000, highlights: 'Miễn phí Galaxy VIP\nKho nội dung VOD giải trí phong phú (không quảng cáo)', galaxy: 'Galaxy VIP', lineup: extended },
        { id: 'flexi-1', name: 'Flexi 1', channelCount: 'Gần 150', monthlyPrice: 65000, highlights: 'Chùm 20 kênh VTVcab\nMiễn phí Galaxy Play cao cấp\nKho nội dung VOD giải trí phong phú', galaxy: 'Galaxy Play cao cấp', lineup: { ...extended, vtvcab } },
        { id: 'flexi-2', name: 'Flexi 2', channelCount: 'Gần 150', monthlyPrice: 65000, highlights: 'Chùm 21 kênh SCTV\nMiễn phí Galaxy Play cao cấp\nKho nội dung VOD giải trí phong phú', galaxy: 'Galaxy Play cao cấp', lineup: { ...extended, sctv } },
        {
            id: 'vip', name: 'MyTV VIP', channelCount: 'Gần 170', monthlyPrice: 95000,
            highlights: 'Chùm kênh SCTV và VTVcab\n2 kênh thể thao SPOTV độc quyền\nMiễn phí Galaxy VIP\nKho nội dung VOD giải trí phong phú (không quảng cáo)',
            galaxy: 'Galaxy VIP', lineup: { vtv, htv, vtvcab, sctv, sports },
            channelNote: 'Danh sách tra cứu hiện gồm các chùm VTV, HTV, VTVcab, SCTV và 2 kênh SPOTV. Chưa có danh sách đầy đủ gần 170 kênh của gói VIP.',
            poster: null, deviceSummary: null, replaySummary: null
        }
    ];
    const packages = specifications.map(({ lineup, ...specification }) => ({
        poster: `assets/mytv/${specification.id}.jpg`,
        deviceSummary: 'Đăng nhập 5 · Xem đồng thời 2',
        replaySummary: 'Tối đa 72 giờ, tùy kênh',
        ...specification,
        monthlyPrice: specification.monthlyPrice ?? null,
        channels: groups.flatMap(group => (lineup[group.id] || []).map(([number, name]) => ({ number: String(number), name, group: group.id })))
    }));
    return { groups, packages };
})();
