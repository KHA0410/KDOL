/* Bảng giá VNPT Invoice-Inbot do người dùng cung cấp, chưa gồm VAT.
 * Gói cố định và đơn giá MAX tách riêng phí cài đặt/khởi tạo một lần.
 * Chi tiết: supabase-info/inbot-reference.md.
 */
window.KDOL_INBOT = {
    customerConditions: [
        { id: 'quantity', label: 'Theo số hóa đơn đăng ký', maxDiscount: 0 },
        { id: 'existing', label: 'Khách hàng hiện hữu còn lại của VNPT · tối đa 20%', maxDiscount: 20 },
        { id: 'revenue10to30', label: 'KH đang dùng dịch vụ VNPT, doanh thu từ 10 đến dưới 30 triệu/tháng · tối đa 30%', maxDiscount: 30 },
        { id: 'revenue30plus', label: 'KH đang dùng dịch vụ VNPT, doanh thu từ 30 triệu/tháng · tối đa 40%', maxDiscount: 40 },
        { id: 'competition', label: 'Khách hàng có cạnh tranh về giá của đối thủ · tối đa 40%', maxDiscount: 40 }
    ],
    setupPrice: 300000,
    maxUnitPrice: 350,
    maxName: 'VNPT Invoice-Inbot_MAX',
    plans: [
        { duration_text: 'VNPT Invoice-Inbot_300', quantity: 300, unitPrice: 1050, price: 315000 },
        { duration_text: 'VNPT Invoice-Inbot_500', quantity: 500, unitPrice: 900, price: 450000 },
        { duration_text: 'VNPT Invoice-Inbot_1000', quantity: 1000, unitPrice: 540, price: 540000 },
        { duration_text: 'VNPT Invoice-Inbot_2000', quantity: 2000, unitPrice: 495, price: 990000 },
        { duration_text: 'VNPT Invoice-Inbot_5000', quantity: 5000, unitPrice: 450, price: 2250000 },
        { duration_text: 'VNPT Invoice-Inbot_10000', quantity: 10000, unitPrice: 400, price: 4000000 }
    ]
};
