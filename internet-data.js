/* Bổ sung các gói Home Cam còn thiếu theo ảnh người dùng cung cấp.
 * Cột giá thứ nhất là Ngoại thành, cột thứ hai là Nội thành,
 * đối chiếu Home Cam 1 (215.000 / 255.000) và +1 Mesh (230.000 / 270.000).
 * Chỉ thêm gói chưa có trên máy chủ, không thay giá các gói hiện hữu.
 */
window.KDOL_INTERNET = {
    configurationOverrides: { 'Home Slay_F': '1mesh', 'Home Cam Sành': '1mesh' },
    priorityPlanNames: ['Home Slay_M', 'Home Slay_F'],
    promotionPlanNames: ['Home Cam Canh', 'Home Cam Sành', 'Home Cam Mật'],
    withoutFamilyBenefitNames: ['Home Cam Canh', 'Home Cam Sành', 'Home Cam Mật'],
    supplementalPlans: [
        { id: 'internet-nt-cam-canh', service_id: 'internet', plan_group: 'nt_cam_none', group_name: 'Kèm Camera Ngoại thành',
            duration_text: 'Home Cam Canh (300Mbps)', price: 195000, note: '01 Camera Indoor và Cloud (3 ngày)' },
        { id: 'internet-noi-cam-canh', service_id: 'internet', plan_group: 'noi_cam_none', group_name: 'Kèm Camera Nội thành',
            duration_text: 'Home Cam Canh (300Mbps)', price: 240000, note: '01 Camera Indoor và Cloud (3 ngày)' },
        { id: 'internet-nt-cam-sanh', service_id: 'internet', plan_group: 'nt_cam_none', group_name: 'Kèm Camera Ngoại thành',
            duration_text: 'Home Cam Sành (300Mbps)', price: 235000, note: '01 Mesh + 01 Camera Indoor lưu trữ 1 ngày + MyTV S1 (App) hoặc MyTV S2 (App)' },
        { id: 'internet-noi-cam-sanh', service_id: 'internet', plan_group: 'noi_cam_none', group_name: 'Kèm Camera Nội thành',
            duration_text: 'Home Cam Sành (300Mbps)', price: 255000, note: '01 Mesh + 01 Camera Indoor lưu trữ 1 ngày + MyTV S1 (App) hoặc MyTV S2 (App)' },
        { id: 'internet-nt-cam-mat', service_id: 'internet', plan_group: 'nt_cam_none', group_name: 'Kèm Camera Ngoại thành',
            duration_text: 'Home Cam Mật (300Mbps)', price: 220000, note: '01 Camera Indoor + Cloud 1 ngày + MyTV App' }
    ]
};
