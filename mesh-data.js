/* Giá Mesh add-on theo ảnh Mesh.jpg; giá mua thiết bị do người dùng cung cấp. */
window.KDOL_MESH = {
    service: { id: 'mesh', category_id: 'brcd', name: 'WiFi Mesh', sort_order: 4 },
    deviceName: 'WiFi Mesh 6 EW302S',
    devicePrice: 699000,
    poster: 'assets/mesh/mesh.jpg',
    specifications: [
        { label: 'Tốc độ hỗ trợ', value: 'Đến 3Gbps' },
        { label: 'Băng tần', value: '2.4GHz & 5GHz' },
        { label: 'Cổng mạng', value: '1 WAN + 1 LAN, 1Gbps' },
        { label: 'Kết nối đồng thời', value: 'Tối đa 100 thiết bị' }
    ],
    periods: [
        { id: 'one', label: '1 tháng' },
        { id: 'three', label: '3 tháng' },
        { id: 'six', label: '6 tháng' },
        { id: 'annual', label: '12/13 tháng' }
    ],
    plans: [
        { id: 'pack-1', name: 'Pack 1', quantity: 1, prices: [30000, 90000, 180000, 360000] },
        { id: 'pack-2', name: 'Pack 2', quantity: 2, prices: [50000, 150000, 300000, 450000] },
        { id: 'pack-3', name: 'Pack 3', quantity: 3, prices: [75000, 225000, 450000, 675000] },
        { id: 'pack-4', name: 'Pack 4', quantity: 4, prices: [100000, 300000, 600000, 900000] },
        { id: 'pack-5', name: 'Pack 5', quantity: 5, prices: [120000, 360000, 720000, 1080000] },
        { id: 'pack-5-special', name: 'Pack 5*', quantity: 5, restricted: true, prices: [100000, 300000, 600000, 900000] },
        { id: 'pack-6', name: 'Pack 6', quantity: 6, prices: [140000, 420000, 840000, 1260000] },
        { id: 'pack-7', name: 'Pack 7', quantity: 7, prices: [160000, 480000, 960000, 1440000] },
        { id: 'pack-8', name: 'Pack 8', quantity: 8, prices: [180000, 540000, 1080000, 1620000] },
        { id: 'pack-9', name: 'Pack 9', quantity: 9, prices: [200000, 600000, 1200000, 1800000] },
        { id: 'pack-10', name: 'Pack 10', quantity: 10, prices: [220000, 660000, 1320000, 1980000] },
        { id: 'pack-10-special', name: 'Pack 10*', quantity: 10, restricted: true, prices: [200000, 600000, 1200000, 1800000] }
    ],
    eligibility: 'Pack 5* và Pack 10* áp dụng cho khách hàng doanh nghiệp, khách hàng cá nhân đăng ký theo dự án, sở ban ngành, cơ quan hành chính sự nghiệp.'
};
