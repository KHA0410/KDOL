/* SmartCA Hộ kinh doanh: giá Nâng cao đã gồm VAT 8%, người dùng xác nhận.
 * Gói 6 tháng miễn phí riêng, chỉ dành cho lần đầu kích hoạt.
 */
window.KDOL_SMARTCA_HOUSEHOLD = {
    type: 'hokinhdoanh',
    name: 'Hộ kinh doanh',
    includedVat: 8,
    freeMonths: 6,
    plans: [
        { duration_text: '12', price: 540000 },
        { duration_text: '24', price: 1026000 },
        { duration_text: '36', price: 1458000 }
    ]
};
