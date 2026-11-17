# Bổ sung gói Internet Home Cam

Mục Internet nay có hai tab Gia đình (các gói Home hiện có) và Doanh nghiệp. Dữ liệu doanh nghiệp được tách trong `internet-business-data.js`, không dùng giá/kỳ/VAT của các gói Home. Chi tiết nguồn Excel, giá và các xác nhận của người dùng: [internet-business-reference.md](internet-business-reference.md).

Nguồn: ảnh bảng giá do người dùng cung cấp. Cột giá đầu tiên tương ứng Ngoại thành, cột tiếp theo Nội thành, đối chiếu với hai gói đã có trong CSV và ứng dụng: Home Cam 1 = 215.000/255.000đ, Home Cam 1 (+1 Mesh) = 230.000/270.000đ mỗi tháng.

| Gói 300 Mbps | Ngoại thành | Nội thành | Tích hợp theo ảnh |
| --- | ---: | ---: | --- |
| Home Cam Canh | 195.000đ/tháng | 240.000đ/tháng | 01 Camera Indoor và Cloud (1 ngày), theo yêu cầu đính chính |
| Home Cam Sành | 235.000đ/tháng | 255.000đ/tháng | 1 Mesh, 1 Camera Indoor lưu trữ 1 ngày, MyTV S1 (App) hoặc MyTV S2 (App), theo xác nhận bổ sung của người dùng |
| Home Cam Mật | 220.000đ/tháng | Không áp dụng | 1 Camera Indoor, Cloud 1 ngày, MyTV App |

Các gói được bổ sung cục bộ qua `internet-data.js`, hiển thị ở bảng Internet phía trên. Theo yêu cầu người dùng, giá Home Slay_F và Home Cam Sành hiển thị ở cột +1 Mesh 6, cột Mặc định để trống, thông qua `configurationOverrides`. Giữ nguyên giá gói vì Mesh đã nằm trong quyền lợi, không tính thêm tiền thiết bị. Home Slay_M vẫn ở cột Mặc định. Home Cam Canh và Home Cam Mật cũng giữ cột Mặc định; không tự tạo giá +2 Mesh.

Home Cam Mật chỉ được thêm ở Ngoại thành theo xác nhận người dùng; tốc độ 300 Mbps, không tự tạo giá hoặc quyền lợi cho Nội thành. Gói gồm Camera, Cloud 1 ngày, MyTV(S1/S2) và Family Safe / GreenNet theo xác nhận bổ sung; không có Mesh. Bảng dưới giữ tên Gói Internet + Di động và chỉ có các gói di động như trước.

Theo xác nhận mới nhất của người dùng, Home Cam Canh, Home Cam Sành và Home Cam Mật đều có Family Safe / GreenNet. Hiển thị trong phần tích hợp và tooltip, dùng màu xanh lá theo quy ước chung; Home Cam Mật vẫn chỉ có ở Ngoại thành. Cấu hình ngoại lệ theo tên gói trong `withoutFamilyBenefitNames` chỉ còn Home Slay và Home X, áp dụng cả bản ghi bổ sung lẫn bản ghi máy chủ.

Hai gói được đánh dấu Ưu đãi theo yêu cầu người dùng: nền vàng, nhãn Ưu đãi và xếp cùng nhóm ưu đãi ở đầu bảng, áp dụng cả hai khu vực qua `promotionPlanNames`. Đây là phân nhóm hiển thị, không tự giảm giá hoặc thêm quyền lợi.

Khi tải dữ liệu, chỉ thêm gói còn thiếu theo khu vực/nhóm cấu hình và tên gói (bỏ hậu tố tốc độ, chuẩn hóa khoảng trắng và chữ hoa/thường). Nếu máy chủ đã có gói tương ứng thì giữ giá bản ghi máy chủ; chỉ đính chính nội dung/tốc độ đã được yêu cầu trong `planCorrections`. Không ghi vào Supabase, không sửa bản CSV xuất hoặc giá Home Cam 1 và Home Cam 1 +1 Mesh.

## Bổ sung theo Excel và yêu cầu ngày 17/11/2026

Chỉ thực hiện ba gói bổ sung và hai đính chính được người dùng chỉ định sau khi đối chiếu phần giá từ 01/08/2026 trong `VNPT Internet.xlsx`:

| Gói | Nội thành | Ngoại thành | Cột giá | Thành phần |
| --- | ---: | ---: | --- | --- |
| Home Slay | 200.000đ/tháng | Không thêm | Mặc định | 300 ULM, Internet lẻ |
| Home TV One | 255.000đ/tháng | 230.000đ/tháng | Mặc định | 300 Mbps, MyTV Flexi + 1 Camera Indoor, Cloud 1 ngày |
| Home X | 990.000đ/tháng | 990.000đ/tháng | +1 Mesh 6 | 2.500 Mbps, MyTV nâng cao App + 1 Mesh 6 |

Home Cam Canh sửa Cloud 3 ngày thành 1 ngày ở cả hai khu vực. HomeTV VIP 3 sửa tốc độ hiển thị từ 500 ULM thành 1 Gbps ở cả hai khu vực, giữ giá 400.000/360.000đ và cột +1 Mesh. Các đính chính áp dụng cả dữ liệu máy chủ thông qua cấu hình cục bộ, không thay giá các gói này. Không thêm Home Slay_M hoặc Home Slay_F vào Ngoại thành. Không thêm Family Safe / GreenNet vào Home Slay và Home X khi nguồn không nêu.

Theo yêu cầu sắp xếp tiếp theo, Home Slay được đưa vào nhóm Ưu đãi và đứng trước Home Slay_M, Home Slay_F. Home X ở cuối nhóm Home, ngay sau Home 3; Home TV One đứng ngay trước HomeTV 1. `planSortOverrides` chỉ thay vị trí hiển thị, vẫn giữ Home TV One có Camera để tính phí lắp đúng và giữ Home X ở cột +1 Mesh.

Cột Tích hợp phân màu theo thành phần: Mesh màu tím, MyTV màu xanh dương, Camera/Cloud màu cam nâu, Family Safe/GreenNet màu xanh lá. Giữ nguyên các chữ nối "hoặc", "và", dấu ngăn và nội dung; không biến lựa chọn thành đồng thời có cả hai dịch vụ. Áp dụng cùng màu MyTV trong bảng Internet + Di động, không đổi quyền lợi hay giá.

Nhãn MyTV rút gọn theo loại dịch vụ: thường ghi `MyTV(S1/S2)`; nâng cao ghi `MyTV(Flexi, Film+)`. HomeTV 1/2/3 và Home X dùng nhãn nâng cao theo Excel. Home TV One và Home Đỉnh chỉ ghi `MyTV(Flexi)` theo thành phần riêng đã cung cấp. Gói VIP giữ nhãn VIP. Áp dụng trong cột Tích hợp và tooltip; không đổi nội dung dữ liệu gốc hoặc giá.

Cách ghi thiết bị thống nhất trong phần tích hợp và tooltip: `1 Mesh`, `2 Mesh`, không hiện số 0 đầu hoặc hậu tố Wi-Fi 6/Mesh 6. Tiêu đề cột dùng `+1 Mesh` / `+2 Mesh`. Camera kèm lưu trữ ghi `1 Camera Indoor(1 ngày)` hoặc `1 Camera Indoor(3 ngày)` theo đúng số ngày của từng gói; giữ số lượng và loại Indoor/Outdoor nếu nguồn có nêu. Đây chỉ là rút gọn nhãn, không đổi thiết bị hoặc chính sách tính phí.

Cụm chọn Nội thành/Ngoại thành nằm bên phải tiêu đề Tính giá nhanh trong cùng thanh tính giá, nút được thu nhỏ và không kéo giãn. Ô Hiện cột tích hợp nằm bên phải tiêu đề Gói Internet; vẫn điều khiển cột ở cả hai bảng. Hai ô phí lắp đặt tiếp tục dùng cùng lựa chọn và cách tính như trước.

Home Cam Sành gồm 1 Mesh, 1 Camera Indoor lưu trữ 1 ngày, MyTV S1/S2 và Family Safe / GreenNet. Gói có `hasCamera = true`, áp dụng phí lắp Camera khi tích chọn. Giữ nguyên giá gói và vị trí ở bảng trên.

Tổng tiền dùng cùng công thức Internet hiện có: giá tháng × 1/3/6/12 tháng, cộng một lần phí lắp Internet 300.000đ nếu tích chọn. Phí lắp Camera 100.000đ chỉ cộng nếu tích chọn và gói thực sự có Camera: bao gồm Home Cam Canh, Home Cam Sành, Home Cam Mật và các gói Camera hiện hữu. Kỳ 12–13 tháng chỉ thu 12 tháng, tặng thêm 1 tháng sử dụng. Không áp thêm VAT hoặc chiết khấu của dịch vụ CNTT vào giá Internet.
