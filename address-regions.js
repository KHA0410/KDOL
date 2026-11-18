// VNPT price areas supplied by the user on 2026-11-18, using old boundaries.
// Match OLD districtCode, not provinceTmsCode: the workbook stores NEW provinces.
// Precedence: new ward override > old district override > old province prefix > default.
window.KDOL_ADDRESS_REGIONS = Object.freeze({
    defaultArea: 'ngoai',
    districtPrefixes: Object.freeze({
        '101': 'noi', // Hà Nội, except the 17 old rural districts and Sơn Tây below.
        '103': 'noi', // Hải Phòng under old boundaries; includes its rural districts.
        '701': 'noi'  // Hồ Chí Minh under old boundaries, including Thủ Đức.
    }),
    wardCodes: Object.freeze({}),
    districtCodes: Object.freeze({
        '10129': 'ngoai', // Thị xã Sơn Tây
        '10117': 'ngoai', // Đông Anh
        '10119': 'ngoai', // Gia Lâm
        '10115': 'ngoai', // Sóc Sơn
        '10125': 'ngoai', // Mê Linh
        '10137': 'ngoai', // Hoài Đức
        '10133': 'ngoai', // Đan Phượng
        '10131': 'ngoai', // Phúc Thọ
        '10135': 'ngoai', // Thạch Thất
        '10139': 'ngoai', // Quốc Oai
        '10151': 'ngoai', // Ba Vì
        '10123': 'ngoai', // Thanh Trì
        '10141': 'ngoai', // Thanh Oai
        '10153': 'ngoai', // Chương Mỹ
        '10143': 'ngoai', // Thường Tín
        '10149': 'ngoai', // Phú Xuyên
        '10147': 'ngoai', // Ứng Hòa (Ứng Hoà in the workbook)
        '10145': 'ngoai', // Mỹ Đức
        '70139': 'ngoai', // Bình Chánh
        '70137': 'ngoai', // Hóc Môn
        '70135': 'ngoai', // Củ Chi
        '70141': 'ngoai', // Nhà Bè
        '70143': 'ngoai'  // Cần Giờ
    })
});
