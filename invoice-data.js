/* Đơn giá HĐĐT TT78 theo bảng người dùng cung cấp, chưa gồm VAT.
 * Tạo lập + truyền nhận đã nằm trong giá gói, khác phí khởi tạo dịch vụ.
 * Chi tiết: supabase-info/invoice-reference.md.
 */
window.KDOL_INVOICE = {
    customerConditions: [
        { id: 'quantity', label: 'Theo số hóa đơn đăng ký', maxDiscount: 0 },
        { id: 'existing', label: 'Khách hàng hiện hữu còn lại của VNPT · tối đa 20%', maxDiscount: 20 },
        { id: 'revenue10to30', label: 'KH hiện hữu, doanh thu từ 10 đến dưới 30 triệu/tháng · tối đa 30%', maxDiscount: 30 },
        { id: 'largeExisting', label: 'KH lớn hiện hữu, doanh thu từ 30 triệu/tháng · tối đa 40%', maxDiscount: 40 },
        { id: 'competition', label: 'Khách hàng có cạnh tranh về giá của đối thủ · tối đa 40%', maxDiscount: 40 }
    ],
    unitPrices: {
        300: { creation: 1000, transmission: 300 },
        500: { creation: 840, transmission: 252 },
        1000: { creation: 670, transmission: 201 },
        2000: { creation: 500, transmission: 150 },
        5000: { creation: 430, transmission: 129 },
        10000: { creation: 360, transmission: 108 }
    },
    maxUnitPrices: { creation: 300, transmission: 90 }
};
