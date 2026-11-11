/* Giá theo ảnh và xác nhận của người dùng; đã gồm VAT 10%, chưa gồm Token.
 * Áp dụng cục bộ khi dữ liệu Supabase chưa cập nhật; xem supabase-info/bhxh-reference.md.
 */
window.KDOL_BHXH = {
    priceOverrides: {
        tichhop_giahan_100: { '33': 2695100 }
    }
};
