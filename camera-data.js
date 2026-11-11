/* Giá theo Camera.jpg; giá mua đứt và phí lắp theo xác nhận của người dùng.
 * Chi tiết nguồn và quy tắc: supabase-info/camera-reference.md.
 */
window.KDOL_CAMERA = {
    poster: 'assets/camera/camera.jpg',
    specifications: [
        { label: 'Hình ảnh', value: '2K · Kết nối WiFi' },
        { label: 'Thông minh', value: 'AI phát hiện chuyển động' },
        { label: 'Âm thanh', value: 'Đàm thoại 2 chiều' },
        { label: 'Thiết bị', value: 'IN: IS310P · OUT: ES311P' }
    ],
    installation: { indoor: 100000, outdoor: 150000 },
    periods: [
        { id: 'monthly', label: '1 tháng', freeInstallation: false },
        { id: 'quarterly', label: '3 tháng', freeInstallation: false },
        { id: 'six-months', label: '6 tháng', freeInstallation: true },
        { id: 'annual', label: '12–13 tháng', freeInstallation: true }
    ],
    plans: [
        { id: 'pack-01-in', name: 'Pack 01 Cam', indoor: 1, outdoor: 0, description: '1 Cam IN · 1 Cloud 3 ngày', prices: [30000, 90000, 180000, 360000] },
        { id: 'pack-03-in', name: 'Pack 03 Cam', indoor: 3, outdoor: 0, description: '3 Cam IN · 3 Cloud 3 ngày', prices: [80000, 240000, 480000, 960000] },
        { id: 'pack-05-in', name: 'Pack 05 Cam', indoor: 5, outdoor: 0, description: '5 Cam IN · 5 Cloud 3 ngày', prices: [130000, 390000, 780000, 1560000] },
        { id: 'pack-10-in', name: 'Pack 10 Cam', indoor: 10, outdoor: 0, description: '10 Cam IN · 10 Cloud 3 ngày', prices: [250000, 750000, 1500000, 3000000] },
        { id: 'pack-01-out', name: 'Pack 01 Cam Out', indoor: 0, outdoor: 1, description: '1 Cam OUT · 1 Cloud 3 ngày', prices: [40000, 120000, 240000, 480000] },
        { id: 'pack-in-out', name: 'Pack 01 Cam In + 01 Cam Out', indoor: 1, outdoor: 1, description: '1 Cam IN + 1 Cam OUT · 2 Cloud 3 ngày', prices: [66000, 198000, 396000, 792000] },
        { id: 'in-card', name: 'Cam IN thẻ nhớ 64GB', indoor: 1, outdoor: 0, description: '1 Cam IN IS310P · 1 thẻ nhớ 64GB', prices: [30000, 90000, 180000, 360000] },
        { id: 'out-card', name: 'Cam OUT thẻ nhớ 64GB', indoor: 0, outdoor: 1, description: '1 Cam OUT ES311P · 1 thẻ nhớ 64GB', prices: [50000, 150000, 300000, 600000] },
        { id: 'in-cloud-7', name: 'Cam IN Cloud 7', indoor: 1, outdoor: 0, description: '1 Cam IN · Cloud 7 ngày', prices: [40000, 120000, 240000, 480000] },
        { id: 'in-cloud-15', name: 'Cam IN Cloud 15', indoor: 1, outdoor: 0, description: '1 Cam IN · Cloud 15 ngày', prices: [60000, 180000, 360000, 720000] },
        { id: 'in-cloud-30', name: 'Cam IN Cloud 30', indoor: 1, outdoor: 0, description: '1 Cam IN · Cloud 30 ngày', prices: [90000, 270000, 540000, 1080000] },
        { id: 'out-cloud-7', name: 'Cam OUT Cloud 7', indoor: 0, outdoor: 1, description: '1 Cam OUT · Cloud 7 ngày', prices: [60000, 180000, 360000, 720000] },
        { id: 'out-cloud-15', name: 'Cam OUT Cloud 15', indoor: 0, outdoor: 1, description: '1 Cam OUT · Cloud 15 ngày', prices: [80000, 240000, 480000, 960000] },
        { id: 'out-cloud-30', name: 'Cam OUT Cloud 30', indoor: 0, outdoor: 1, description: '1 Cam OUT · Cloud 30 ngày', prices: [110000, 330000, 660000, 1320000] }
    ],
    purchases: [
        { id: 'in-ttn', name: 'Cam IN TTN', description: '1 Camera Indoor · 1 thẻ nhớ 64GB', price: 789000 },
        { id: 'out-ttn', name: 'Cam OUT TTN', description: '1 Camera Outdoor · 1 thẻ nhớ 64GB', price: 990000 },
        { id: 'recorder-ttn', name: 'Đầu ghi WN883P TTN', description: 'VNPT Network Video Recorder WN883P', price: 1870000 }
    ]
};
