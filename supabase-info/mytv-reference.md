# Dữ liệu tra cứu MyTV

Mục tiêu: so sánh nhanh các gói và tìm kênh phù hợp khi tư vấn. Dịch vụ `mytv` đã có trong `services.csv`, thuộc danh mục `brcd`. Danh sách gói/kênh hiện nằm trong `mytv-data.js`; ảnh gốc được sao chép vào `assets/mytv/` để mở trực tiếp từ trang.

## Nguồn

Bảy ảnh do người dùng cung cấp từ thư mục `D:\MY VNPT\MyTV`, dành cho khách hàng sử dụng mạng VNPT, cùng ảnh bảng giá và quyền lợi MyTV VIP bổ sung trong cuộc trò chuyện. Bảng so sánh người dùng gửi ngày 2026-11-19 được ưu tiên cho số kênh và quyền lợi. Riêng danh sách VTV của Film giữ VTV1 và VTV5 theo tờ rơi và đính chính của người dùng; mô tả không gồm VTV2–VTV9 trong bảng so sánh không được dùng để loại VTV5. Dữ liệu là bản chép từ ảnh, chưa xác minh trực tiếp với danh mục MyTV đang phát sóng. Không tự suy diễn gói tên lớn hơn sẽ bao gồm toàn bộ kênh của gói trước.

| Gói | Ảnh nguồn danh sách kênh | Số kênh công bố theo bảng mới nhất | Số mục đã nhập để tra cứu |
| --- | --- | --- | ---: |
| S | `S.jpg` | 109 | 88 |
| S1 | `S1.jpg` | 130 | 109 |
| S2 | `S2.jpg` | 131 | 110 |
| Film | `FILM.jpg` | 117 | 97 |
| Film+ | `FILM PLUS.jpg` | 125 | 104 |
| Flexi 1 | `FLEXI 1.jpg` | 145 | 124 |
| Flexi 2 | `FLEXI 2.jpg` | 146 | 125 |
| MyTV VIP | Ảnh quyền lợi và bảng giá gửi trong cuộc trò chuyện | 168 | 68 kênh thuộc các chùm đã xác nhận, chưa phải toàn bộ danh sách |

Số kênh công bố trên tờ giới thiệu khác số mục được liệt kê trong ảnh. Giao diện giữ riêng số công bố và danh sách thực tế chép được; không tạo thêm kênh để bù vào tổng. Ảnh gốc có thể mở bằng liên kết "Xem tờ kênh gốc" khi chọn từng gói.

## Các điểm phân biệt được giữ theo ảnh

- S: chùm VTV, HTV, tin tức, giải trí cơ bản, khoa giáo, thiết yếu, địa phương; không có HBO trong danh sách ảnh.
- S1: thêm chùm VTVcab và HBO. S2: thêm chùm SCTV và HBO. Bảng mới ghi S/S1/S2 không có chùm kênh quốc tế; cột nổi bật giữ đúng mô tả này và không quảng bá HBO. Danh sách tra cứu vẫn giữ HBO và các kênh quốc tế lẻ đã chép từ ảnh vì bảng mới chưa xác nhận tên từng kênh bị loại.
- Film: phần VTV có VTV1 và VTV5 theo tờ rơi, được người dùng xác nhận lại; giữ cả hai trong cột nổi bật và danh sách tra cứu. Có SPOTV và SPOTV2. Film+ liệt kê đầy đủ chùm VTV, không liệt kê SPOTV. Hai gói đều có HBO, Box Hits, Cinemax, WarnerTV, nhóm thiếu nhi và khoa giáo mở rộng.
- Flexi 1 có VTVcab; Flexi 2 có SCTV; cả hai có nhóm phim, thiếu nhi và khoa giáo mở rộng.
- MyTV VIP có VTV/HTV, cả chùm VTVcab và SCTV, hai kênh SPOTV/SPOTV2, Galaxy VIP và VOD không quảng cáo. Ảnh mới chỉ mô tả các chùm kênh, không có danh sách đầy đủ; tra cứu VIP tạm dùng 68 kênh đã biết thuộc các chùm VTV, HTV, VTVcab, SCTV và SPOTV. Không tự ghép các kênh quốc tế/phim/địa phương chưa được xác nhận. Chi tiết gói có ghi chú về danh sách chưa đầy đủ.
- S/S1/S2: Galaxy Cao Cấp vào thứ 7 hằng tuần, VOD có quảng cáo; lần lượt 69 HD + 40 SD, 90 HD + 40 SD, 91 HD + 40 SD. S không có chùm VTVcab. Film/Film+: Galaxy VIP, VOD không quảng cáo. Flexi 1/Flexi 2: Galaxy Play cao cấp, VOD có quảng cáo; có chùm trong nước và quốc tế nhưng không gồm 2 kênh SPOTV. Film+ cũng không gồm 2 kênh SPOTV. VIP có chùm trong nước và quốc tế, Galaxy VIP và VOD không quảng cáo.
- Bảy ảnh gốc cùng ghi 1 tài khoản đăng nhập 5 thiết bị, xem đồng thời 2 thiết bị; xem lại tối đa 72 giờ theo chính sách từng kênh. Ảnh VIP bổ sung chưa xác nhận các thông số này nên không hiển thị cho VIP. VIP chưa có ảnh gốc cục bộ trong `assets/mytv/`, không tạo liên kết ảnh bị lỗi.
- KBS World trong ảnh S/S1/S2 ghi HD; trong ảnh Film/Film+/Flexi 1/Flexi 2 ghi SD. Dữ liệu giữ tên kèm chất lượng theo từng ảnh.

## Giá và cập nhật

Người dùng bổ sung giá và ảnh so sánh gói ngày 2026-11-11:

| Gói | Giá tháng | Cách hiển thị |
| --- | ---: | --- |
| S | 20.000đ | Giá người dùng đính chính cho gói S thường |
| S1, S2 | 30.000đ | Giá người dùng xác nhận |
| Film, Film+, Flexi 1, Flexi 2 | 65.000đ | Bỏ chữ "Từ" theo yêu cầu cập nhật của người dùng |
| MyTV VIP | 95.000đ | Đã gồm VAT; 6 tháng 570.000đ, thanh toán 12 tháng 1.140.000đ theo ảnh bảng giá bổ sung |

Cột nổi bật được bổ sung theo bảng ngày 2026-11-19: chùm kênh trong nước/quốc tế, giới hạn SPOTV, trạng thái quảng cáo VOD, Galaxy Cao Cấp thứ 7 và cơ cấu HD/SD của S/S1/S2. Phần VTV của Film ghi VTV1 và VTV5 theo tờ rơi và đính chính của người dùng. Các quyền lợi đã có được giữ: Film có 2 kênh thể thao SPOTV độc quyền; Film/Film+ miễn phí Galaxy VIP; Flexi 1 có chùm 20 kênh VTVcab, Flexi 2 có chùm 21 kênh SCTV, cả hai miễn phí Galaxy Play cao cấp. Tổng số kênh hiển thị ở cột riêng theo số chính xác trong bảng mới.

Giá được lưu trong `monthlyPrice` của từng gói ở phần `specifications` của `mytv-data.js`. Không tự áp dụng VAT hoặc ưu đãi ngoài thông tin người dùng cung cấp.

Theo yêu cầu cập nhật mới nhất, thanh tính giá nhanh MyTV có các kỳ 1 tháng, 6+2 tháng và 12+3 tháng. Kỳ 6+2 thanh toán 6 tháng, tặng 2 tháng, dùng 8 tháng; kỳ 12+3 thanh toán 12 tháng, tặng 3 tháng, dùng 15 tháng. Nhãn nút, tiêu đề giá và chú thích dùng cùng cấu hình. Với bốn gói 65.000đ: 6+2 = 390.000đ, 12+3 = 780.000đ. Gói S thường dùng giá tháng 20.000đ nên tương ứng 120.000đ và 240.000đ. S1/S2 giữ 30.000đ/tháng, tương ứng 180.000đ và 360.000đ.

MyTV VIP dùng cùng bộ tính giá MyTV: 95.000đ, 570.000đ và 1.140.000đ cho các kỳ thanh toán 1/6/12 tháng. Khi chọn thêm một STB với phí 50.000đ/tháng, các tổng lần lượt là 145.000đ, 870.000đ và 1.740.000đ. Không tính thêm VAT vào giá đã gồm thuế.

Kỳ MyTV được giữ khi tìm kênh hoặc chọn gói, đặt lại 1 tháng khi chọn lại dịch vụ. Phép tính MyTV tách biệt với kỳ giá và phí lắp đặt của Internet.

Người dùng đính chính ngày 2026-11-19: STB có phí 50.000đ mỗi tháng cho một thiết bị. Ô chọn "Thêm 1 STB (+50.000đ/tháng)" trong thanh tính giá nhanh mặc định tắt; khi bật, công thức là `(giá tháng + 50000) × số tháng thanh toán`. Phí STB tăng theo 1/6/12 tháng thanh toán tương ứng 50.000đ/300.000đ/600.000đ; hiện dùng cùng số tháng thanh toán với cước gói, không cộng riêng phí cho tháng tặng. Ví dụ gói 65.000đ: 1 tháng kèm STB = 115.000đ, 6+2 tháng = 690.000đ, 12+3 tháng = 1.380.000đ. Gói S thường kèm STB lần lượt là 70.000đ, 420.000đ và 840.000đ. S1/S2 kèm STB là 80.000đ, 480.000đ và 960.000đ. Khi bỏ chọn, bảng trở về giá không kèm thiết bị; tiêu đề giá chuyển thành tổng tiền khi có STB.

Chưa thêm bản ghi MyTV vào bảng Supabase `plans`, chưa thay đổi schema, RLS hoặc dữ liệu online. Không ghép giá các combo Internet + MyTV thành giá gói MyTV riêng.

## Tìm kiếm

- Nhập tên kênh không phân biệt hoa/thường, dấu tiếng Việt hoặc khoảng trắng: `HBO`, `vtv 3`, `ON Football`.
- Nhập toàn chữ số để tìm đúng số kênh trên tờ giới thiệu, ví dụ `173` là HBO.
- Bảng gói chỉ giữ những gói có kênh phù hợp; danh sách chi tiết cũng lọc theo cùng từ khóa.
- Chọn tên gói để đổi danh sách chi tiết. Kênh chia nhóm; nhóm địa phương mặc định thu gọn và mở khi có từ khóa tìm kiếm.
