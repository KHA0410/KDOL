# Dữ liệu tra cứu MyTV

Mục tiêu: so sánh nhanh các gói và tìm kênh phù hợp khi tư vấn. Dịch vụ `mytv` đã có trong `services.csv`, thuộc danh mục `brcd`. Danh sách gói/kênh hiện nằm trong `mytv-data.js`; ảnh gốc được sao chép vào `assets/mytv/` để mở trực tiếp từ trang.

## Nguồn

Bảy ảnh do người dùng cung cấp từ thư mục `D:\MY VNPT\MyTV`, dành cho khách hàng sử dụng mạng VNPT. Dữ liệu là bản chép từ ảnh, chưa xác minh trực tiếp với danh mục MyTV đang phát sóng. Không tự suy diễn gói tên lớn hơn sẽ bao gồm toàn bộ kênh của gói trước.

| Gói | Ảnh nguồn | Số kênh công bố trong ảnh | Số mục được liệt kê và nhập để tra cứu |
| --- | --- | --- | ---: |
| S | `S.jpg` | 109 | 88 |
| S1 | `S1.jpg` | 130 | 109 |
| S2 | `S2.jpg` | 131 | 110 |
| Film | `FILM.jpg` | Gần 120 | 97 |
| Film+ | `FILM PLUS.jpg` | Gần 130 | 104 |
| Flexi 1 | `FLEXI 1.jpg` | Gần 150 | 124 |
| Flexi 2 | `FLEXI 2.jpg` | Gần 150 | 125 |

Số kênh công bố trên tờ giới thiệu khác số mục được liệt kê trong ảnh. Giao diện giữ riêng số công bố và danh sách thực tế chép được; không tạo thêm kênh để bù vào tổng. Ảnh gốc có thể mở bằng liên kết "Xem tờ kênh gốc" khi chọn từng gói.

## Các điểm phân biệt được giữ theo ảnh

- S: chùm VTV, HTV, tin tức, giải trí cơ bản, khoa giáo, thiết yếu, địa phương; không có HBO trong danh sách ảnh.
- S1: thêm chùm VTVcab và HBO. S2: thêm chùm SCTV và HBO.
- Film: phần VTV trong ảnh chỉ liệt kê VTV1, VTV5; có SPOTV và SPOTV2. Film+ liệt kê đầy đủ chùm VTV, không liệt kê SPOTV. Hai gói đều có HBO, Box Hits, Cinemax, WarnerTV, nhóm thiếu nhi và khoa giáo mở rộng.
- Flexi 1 có VTVcab; Flexi 2 có SCTV; cả hai có nhóm phim, thiếu nhi và khoa giáo mở rộng.
- S/S1/S2: trải nghiệm Galaxy VIP vào thứ 7 hằng tuần. Film/Film+: Galaxy VIP. Flexi 1/Flexi 2: Galaxy Play cao cấp (theo ảnh so sánh gói được cung cấp bổ sung).
- Các ảnh cùng ghi 1 tài khoản đăng nhập 5 thiết bị, xem đồng thời 2 thiết bị; xem lại tối đa 72 giờ theo chính sách từng kênh.
- KBS World trong ảnh S/S1/S2 ghi HD; trong ảnh Film/Film+/Flexi 1/Flexi 2 ghi SD. Dữ liệu giữ tên kèm chất lượng theo từng ảnh.

## Giá và cập nhật

Người dùng bổ sung giá và ảnh so sánh gói ngày 2026-11-11:

| Gói | Giá tháng | Cách hiển thị |
| --- | ---: | --- |
| S | 30.000đ | Giá người dùng xác nhận bổ sung |
| S1, S2 | 30.000đ | Giá người dùng xác nhận |
| Film, Film+, Flexi 1, Flexi 2 | 65.000đ | Bỏ chữ "Từ" theo yêu cầu cập nhật của người dùng |

Cột nổi bật của bốn gói 65.000đ được cập nhật theo ảnh so sánh mới: Film có 2 kênh thể thao SPOTV độc quyền, Galaxy VIP miễn phí và VOD không quảng cáo; Film+ có Galaxy VIP miễn phí và VOD không quảng cáo; Flexi 1 có chùm 20 kênh VTVcab, Flexi 2 có chùm 21 kênh SCTV, cả hai miễn phí Galaxy Play cao cấp và có kho VOD giải trí. Số kênh vẫn hiển thị ở cột riêng để tránh lặp lại trong nội dung nổi bật.

Giá được lưu trong `monthlyPrice` của từng gói ở phần `specifications` của `mytv-data.js`. Không tự áp dụng VAT hoặc ưu đãi ngoài thông tin người dùng cung cấp.

Thanh tính giá nhanh MyTV có các kỳ 1 tháng, 6 tháng và 12+2 tháng, cập nhật toàn bộ cột giá. Kỳ 6 tháng tính 6 tháng tiền cước; kỳ 12+2 thanh toán 12 tháng và được dùng 14 tháng. Với bốn gói 65.000đ: 6 tháng = 390.000đ, 12+2 = 780.000đ, đúng các mức người dùng cung cấp. S/S1/S2 dùng giá tháng 30.000đ nên tương ứng 180.000đ và 360.000đ.

Kỳ MyTV được giữ khi tìm kênh hoặc chọn gói, đặt lại 1 tháng khi chọn lại dịch vụ. Phép tính MyTV tách biệt với kỳ giá và phí lắp đặt của Internet.

Người dùng xác nhận TV không phải Smart TV cần thêm STB, giá 50.000đ mỗi thiết bị. Ô chọn "Thêm 1 STB (+50.000đ)" trong thanh tính giá nhanh mặc định tắt; khi bật, mọi giá gói có dữ liệu được cộng một lần 50.000đ cho một thiết bị (`giá tháng × số tháng thanh toán + 50000`). Không nhân giá STB theo kỳ gói hoặc theo hai tháng được tặng. Ví dụ gói 65.000đ: 1 tháng kèm STB = 115.000đ, 6 tháng = 440.000đ, 12+2 tháng = 830.000đ. S/S1/S2 kèm STB lần lượt là 80.000đ, 230.000đ và 410.000đ. Khi bỏ chọn, bảng trở về giá không kèm thiết bị; tiêu đề giá chuyển thành tổng tiền khi có STB.

Chưa thêm bản ghi MyTV vào bảng Supabase `plans`, chưa thay đổi schema, RLS hoặc dữ liệu online. Không ghép giá các combo Internet + MyTV thành giá gói MyTV riêng.

## Tìm kiếm

- Nhập tên kênh không phân biệt hoa/thường, dấu tiếng Việt hoặc khoảng trắng: `HBO`, `vtv 3`, `ON Football`.
- Nhập toàn chữ số để tìm đúng số kênh trên tờ giới thiệu, ví dụ `173` là HBO.
- Bảng gói chỉ giữ những gói có kênh phù hợp; danh sách chi tiết cũng lọc theo cùng từ khóa.
- Chọn tên gói để đổi danh sách chi tiết. Kênh chia nhóm; nhóm địa phương mặc định thu gọn và mở khi có từ khóa tìm kiếm.
