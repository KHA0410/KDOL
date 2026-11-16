# Bổ sung gói Internet Home Cam

Nguồn: ảnh bảng giá do người dùng cung cấp. Cột giá đầu tiên tương ứng Ngoại thành, cột tiếp theo Nội thành, đối chiếu với hai gói đã có trong CSV và ứng dụng: Home Cam 1 = 215.000/255.000đ, Home Cam 1 (+1 Mesh) = 230.000/270.000đ mỗi tháng.

| Gói 300 Mbps | Ngoại thành | Nội thành | Tích hợp theo ảnh |
| --- | ---: | ---: | --- |
| Home Cam Canh | 195.000đ/tháng | 240.000đ/tháng | 01 Camera Indoor và Cloud (3 ngày) |
| Home Cam Sành | 235.000đ/tháng | 255.000đ/tháng | 1 Mesh, 1 Camera Indoor lưu trữ 1 ngày, MyTV S1 (App) hoặc MyTV S2 (App), theo xác nhận bổ sung của người dùng |
| Home Cam Mật | 220.000đ/tháng | Không áp dụng | 1 Camera Indoor, Cloud 1 ngày, MyTV App |

Năm biến thể được bổ sung cục bộ qua `internet-data.js` vào `nt_cam_none` / `noi_cam_none`, hiển thị ở bảng Internet phía trên. Theo yêu cầu người dùng, giá Home Slay_F và Home Cam Sành hiển thị ở cột +1 Mesh 6, cột Mặc định để trống, thông qua `configurationOverrides`. Giữ nguyên giá gói vì Mesh đã nằm trong quyền lợi, không tính thêm tiền thiết bị. Home Slay_M vẫn ở cột Mặc định. Home Cam Canh và Home Cam Mật cũng giữ cột Mặc định; không tự tạo giá +2 Mesh.

Home Cam Mật chỉ được thêm ở Ngoại thành theo xác nhận người dùng; tốc độ 300 Mbps, không tự tạo giá hoặc quyền lợi cho Nội thành. Nguồn chỉ ghi Camera, Cloud 1 ngày và MyTV App nên không tự thêm Mesh hoặc Family Safe / GreenNet cho gói này. Bảng dưới giữ tên Gói Internet + Di động và chỉ có các gói di động như trước.

Theo xác nhận người dùng, Home Cam Canh và Home Cam Sành không có Family Safe hoặc GreenNet. Loại hai quyền lợi này khỏi nội dung tích hợp và tooltip của hai gói ở cả hai khu vực, không đổi quyền lợi các gói khác. Cấu hình ngoại lệ theo tên gói trong `withoutFamilyBenefitNames` áp dụng cả bản ghi bổ sung lẫn bản ghi máy chủ.

Hai gói được đánh dấu Ưu đãi theo yêu cầu người dùng: nền vàng, nhãn Ưu đãi và xếp cùng nhóm ưu đãi ở đầu bảng, áp dụng cả hai khu vực qua `promotionPlanNames`. Đây là phân nhóm hiển thị, không tự giảm giá hoặc thêm quyền lợi.

Khi tải dữ liệu, chỉ thêm gói còn thiếu theo khu vực/nhóm cấu hình và tên gói (bỏ hậu tố tốc độ, chuẩn hóa khoảng trắng và chữ hoa/thường). Nếu máy chủ đã có gói tương ứng thì giữ nguyên bản ghi máy chủ. Không ghi vào Supabase, không sửa bản CSV xuất hoặc giá Home Cam 1 và Home Cam 1 +1 Mesh.

Theo thông tin người dùng đính chính sau cùng, Home Cam Sành gồm 1 Mesh, 1 Camera Indoor lưu trữ 1 ngày và MyTV S1/S2. Đã cập nhật thành phần và bỏ ngoại lệ không có Camera. Gói có `hasCamera = true`, áp dụng phí lắp Camera khi tích chọn, vẫn không có Family Safe hoặc GreenNet. Giữ nguyên giá gói và vị trí ở bảng trên.

Tổng tiền dùng cùng công thức Internet hiện có: giá tháng × 1/3/6/12 tháng, cộng một lần phí lắp Internet 300.000đ nếu tích chọn. Phí lắp Camera 100.000đ chỉ cộng nếu tích chọn và gói thực sự có Camera: bao gồm Home Cam Canh, Home Cam Sành, Home Cam Mật và các gói Camera hiện hữu. Kỳ 12–13 tháng chỉ thu 12 tháng, tặng thêm 1 tháng sử dụng. Không áp thêm VAT hoặc chiết khấu của dịch vụ CNTT vào giá Internet.
