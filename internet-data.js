/* Bổ sung Internet theo ảnh và file VNPT Internet.xlsx người dùng cung cấp.
 * Cột giá thứ nhất là Ngoại thành, cột thứ hai là Nội thành,
 * đối chiếu Home Cam 1 (215.000 / 255.000) và +1 Mesh (230.000 / 270.000).
 * Chỉ thêm gói chưa có; đính chính Cloud Home Cam Canh và tốc độ HomeTV VIP 3.
 * Không thay giá các gói hiện hữu.
 */
window.KDOL_INTERNET = {
    configurationOverrides: { 'Home Slay_F': '1mesh', 'Home Cam Sành': '1mesh' },
    priorityPlanNames: ['Home Slay', 'Home Slay_M', 'Home Slay_F'],
    promotionPlanNames: ['Home Slay', 'Home Cam Canh', 'Home Cam Sành', 'Home Cam Mật'],
    planSortOverrides: {
        'Home X': { bundle: 'home', order: 1, colorBundle: 'home' },
        'Home TV One': { bundle: 'tv', order: -1, colorBundle: 'tv' }
    },
    withoutFamilyBenefitNames: ['Home Slay', 'Home X'],
    mytvAdvancedPlanNames: ['HomeTV 1', 'HomeTV 2', 'HomeTV 3', 'Home X'],
    mytvFlexiPlanNames: ['Home TV One', 'Home Đỉnh'],
    planCorrections: {
        'Home Cam Canh': { note: '01 Camera Indoor và Cloud (1 ngày)' },
        'HomeTV VIP 3': { duration_text: 'HomeTV VIP 3 (1Gbps)' }
    },
    supplementalPlans: [
        { id: 'internet-nt-cam-canh', service_id: 'internet', plan_group: 'nt_cam_none', group_name: 'Kèm Camera Ngoại thành',
            duration_text: 'Home Cam Canh (300Mbps)', price: 195000, note: '01 Camera Indoor và Cloud (1 ngày)' },
        { id: 'internet-noi-cam-canh', service_id: 'internet', plan_group: 'noi_cam_none', group_name: 'Kèm Camera Nội thành',
            duration_text: 'Home Cam Canh (300Mbps)', price: 240000, note: '01 Camera Indoor và Cloud (1 ngày)' },
        { id: 'internet-nt-cam-sanh', service_id: 'internet', plan_group: 'nt_cam_none', group_name: 'Kèm Camera Ngoại thành',
            duration_text: 'Home Cam Sành (300Mbps)', price: 235000, note: '01 Mesh + 01 Camera Indoor lưu trữ 1 ngày + MyTV S1 (App) hoặc MyTV S2 (App)' },
        { id: 'internet-noi-cam-sanh', service_id: 'internet', plan_group: 'noi_cam_none', group_name: 'Kèm Camera Nội thành',
            duration_text: 'Home Cam Sành (300Mbps)', price: 255000, note: '01 Mesh + 01 Camera Indoor lưu trữ 1 ngày + MyTV S1 (App) hoặc MyTV S2 (App)' },
        { id: 'internet-nt-cam-mat', service_id: 'internet', plan_group: 'nt_cam_none', group_name: 'Kèm Camera Ngoại thành',
            duration_text: 'Home Cam Mật (300Mbps)', price: 220000, note: '01 Camera Indoor + Cloud 1 ngày + MyTV App' },
        { id: 'internet-noi-home-slay', service_id: 'internet', plan_group: 'noi_home_none', group_name: 'Chỉ Internet Nội thành',
            duration_text: 'Home Slay (300ULM)', price: 200000, note: '_' },
        { id: 'internet-noi-tv-one', service_id: 'internet', plan_group: 'noi_cam_none', group_name: 'Kèm Camera Nội thành',
            duration_text: 'Home TV One (300Mbps)', price: 255000, note: 'MyTV Flexi + 01 Camera Indoor + Cloud 1 ngày' },
        { id: 'internet-nt-tv-one', service_id: 'internet', plan_group: 'nt_cam_none', group_name: 'Kèm Camera Ngoại thành',
            duration_text: 'Home TV One (300Mbps)', price: 230000, note: 'MyTV Flexi + 01 Camera Indoor + Cloud 1 ngày' },
        { id: 'internet-noi-home-x', service_id: 'internet', plan_group: 'noi_tv_1mesh', group_name: 'Kèm MyTV Nội thành',
            duration_text: 'Home X (2500Mbps)', price: 990000, note: 'MyTV Nâng cao (App) + 01 Mesh 6' },
        { id: 'internet-nt-home-x', service_id: 'internet', plan_group: 'nt_tv_1mesh', group_name: 'Kèm MyTV Ngoại thành',
            duration_text: 'Home X (2500Mbps)', price: 990000, note: 'MyTV Nâng cao (App) + 01 Mesh 6' }
    ]
};
