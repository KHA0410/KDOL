/* Biên lai điện tử: bảng giá do người dùng cung cấp, giá chưa VAT.
 * Lưu trữ 10 năm từ ngày phát hành. Chi tiết: supabase-info/receipt-reference.md.
 */
window.KDOL_RECEIPT = {
    service: { id: 'bienlai', category_id: 'cntt', name: 'Biên lai điện tử', sort_order: 5 },
    maxDiscount: 30,
    setupPrice: 1000000,
    storageYears: 10,
    customMinimum: 10001,
    customUnitPrice: 300,
    plans: [
        { name: 'BL300', quantity: 300, price: 300000 },
        { name: 'BL500', quantity: 500, price: 420000 },
        { name: 'BL1.000', quantity: 1000, price: 670000 },
        { name: 'BL2.000', quantity: 2000, price: 1000000 },
        { name: 'BL5.000', quantity: 5000, price: 2150000 },
        { name: 'BL10.000', quantity: 10000, price: 3600000 }
    ]
};
