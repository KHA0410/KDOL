# Quy ước CSS của KDOL

Mục đích chính của KDOL là tra cứu nhanh thông tin và giá gói cước khi tư vấn. Ưu tiên bảng gọn, giá dễ so sánh và thông tin ngắn dễ quét. Đặt tốc độ dưới tên gói; trình bày quyền lợi bằng cụm từ ngắn, giữ chi tiết đầy đủ trong tooltip và các cột tùy chọn. Với bảng Internet, giá là văn bản; cột tích hợp mặc định ẩn và chỉ hiện khi chọn "Hiện cột tích hợp".

- CSS riêng của ứng dụng nằm trong `styles.css`; HTML liên kết bằng thẻ `<link>`.
- Dùng CSS thuần, không cần bước build hoặc `@apply`. Tailwind CDN vẫn cung cấp reset và các utility còn lại.
- Đặt tên class theo chức năng, có tiền tố `kdol-`: `kdol-config-panel`, `kdol-copy-button`, `kdol-price`.
- Biến thể dùng hậu tố `--`: `kdol-choice--compact`. Luôn dùng kèm class nền: `kdol-choice kdol-choice--compact`.
- Khai báo màu, bo góc, đổ bóng và thời gian chuyển động dùng chung trong `:root`, với tên biến `--kdol-*`. Màu VNPT trong cấu hình Tailwind tham chiếu các biến này.
- Gom các nhóm định dạng lặp lại thành class thành phần. Giữ utility ngắn cho khoảng cách, chiều rộng và bố cục riêng từng vị trí (`mb-4`, `w-1/3`, `text-right`).
- Tránh để class thành phần và utility cùng điều khiển một thuộc tính trên một phần tử. Khi cần một biến thể dùng nhiều lần, thêm class `--...` thay vì phụ thuộc thứ tự CSS.
- Để Vue điều khiển trạng thái đang chọn, VAT và chiết khấu qua `:class`. Các class nền như `kdol-choice` và `kdol-price` không đặt màu mà Vue đang thay đổi.
- Viết theo hướng mobile trước. Dùng breakpoint đồng bộ với Tailwind: `sm` = 640px, `md` = 768px, `xl` = 1280px.
- Thứ tự trong CSS: biến dùng chung → tiện ích → thành phần → responsive. Thụt lề 4 dấu cách; không dùng `!important` hoặc selector theo ID để tăng độ ưu tiên.
- Hiệu ứng tương tác dùng `--kdol-transition-duration` (160ms), hiện nội dung dùng `--kdol-transition-content-duration` (180ms). Chỉ chuyển các thuộc tính cần thiết, tránh `transition: all` và chuyển kích thước bảng/cột. Giá cập nhật ngay, không chạy số đếm.
- Dấu chọn danh mục dùng phần tử giả, không thêm/bớt độ dày viền làm dịch bố cục. Nút danh mục dùng `<button>` với trạng thái `aria-pressed` để hỗ trợ chuột, cảm ứng và bàn phím.
- Giữ sticky ở thanh tính giá nhanh; phần chọn khu vực cuộn bình thường. Không đặt `transform` hoặc `will-change` thường trực lên vùng chứa thanh sticky. Tôn trọng `prefers-reduced-motion` khi thêm hiệu ứng mới.

Ví dụ nút chọn:

```html
<button
    @click="vatRate = 10"
    :class="['kdol-choice', vatRate === 10 ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-50']">
    VAT 10%
</button>
```

Ví dụ bảng giá:

```html
<div class="kdol-table-wrap mb-4">
    <table class="min-w-full divide-y divide-gray-300">
        <!-- Nội dung bảng -->
    </table>
</div>
```
