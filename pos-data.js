/* Giá và chiết khấu POS theo ảnh người dùng cung cấp; tất cả giá chưa VAT.
 * Phí khởi tạo do đơn vị bán hàng quyết định; người dùng yêu cầu tạm mặc định 1.000.000đ.
 * Chi tiết: supabase-info/pos-reference.md.
 */
window.KDOL_POS = {
    defaultSetupPrice: 1000000,
    maintenancePrice: 50000,
    maxName: 'MTT Max',
    maxMinimum: 500000,
    maxUnitPrice: 100,
    customerConditions: [
        { id: 'quantity', label: 'Theo số hóa đơn của gói', packageDiscount: 0, maintenanceDiscount: 0 },
        { id: 'existing', label: 'Khách hàng hiện hữu còn lại của VNPT', packageDiscount: 10, maintenanceDiscount: 20 },
        { id: 'revenue10to30', label: 'KH hiện hữu, doanh thu từ 10 đến dưới 30 triệu/tháng', packageDiscount: 30, maintenanceDiscount: 50 },
        { id: 'largeExisting', label: 'KH lớn hiện hữu, doanh thu từ 30 triệu/tháng', packageDiscount: 40, maintenanceDiscount: 100 },
        { id: 'competition', label: 'Khách hàng có cạnh tranh về giá của đối thủ', packageDiscount: 40, maintenanceDiscount: 100 }
    ],
    plans: [
        { duration_text: 'MTT 100', quantity: 100, unitPrice: 1500, price: 150000 },
        { duration_text: 'MTT 500', quantity: 500, unitPrice: 600, price: 300000 },
        { duration_text: 'MTT 1.000', quantity: 1000, unitPrice: 570, price: 570000 },
        { duration_text: 'MTT 1.500', quantity: 1500, unitPrice: 520, price: 780000 },
        { duration_text: 'MTT 5.000', quantity: 5000, unitPrice: 390, price: 1950000 },
        { duration_text: 'MTT 10.000', quantity: 10000, unitPrice: 300, price: 3000000 },
        { duration_text: 'MTT 50.000', quantity: 50000, unitPrice: 220, price: 11000000 },
        { duration_text: 'MTT 100.000', quantity: 100000, unitPrice: 180, price: 18000000 },
        { duration_text: 'MTT 500.000', quantity: 500000, unitPrice: 130, price: 65000000 }
    ]
};
