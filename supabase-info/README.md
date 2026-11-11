# Cấu trúc Supabase của KDOL

Nguồn: ảnh sơ đồ, SQL và ba file CSV do người dùng cung cấp ngày 2026-11-10, đối chiếu với `index.html`. Chưa kết nối trực tiếp database. Bản chép cấu trúc nằm trong `schema.sql`; dữ liệu xuất nằm trong `categories.csv`, `services.csv`, `plans.csv`.

## Dữ liệu CSV đã đọc

| File | Số dòng dữ liệu | Nội dung |
| --- | ---: | --- |
| `categories.csv` | 2 | `cntt` (Công nghệ thông tin, thứ tự 1), `brcd` (Băng rộng cố định, thứ tự 2) |
| `services.csv` | 7 | CNTT: `cks`, `bhxh`, `hddt`, `econtract`. Băng rộng cố định: `internet`, `mytv`, `camera` |
| `plans.csv` | 176 | 49 nhóm gói của bảy mã phân loại bên dưới |

Số dòng trên không tính tiêu đề CSV. Người dùng đã bổ sung `plans.csv` từ 100 lên 176 dòng (thêm 76 dòng). Các số liệu trong tài liệu đã được cập nhật theo bản xuất bổ sung này; chưa đối chiếu trực tiếp với database đang chạy.

Giá BHXH tích hợp VAN 100 gia hạn 33 tháng trong CSV đã được sửa từ 2.695.000đ thành 2.695.100đ theo ảnh và xác nhận người dùng. Giao diện áp dụng cùng điều chỉnh qua `bhxh-data.js` trong khi Supabase chưa cập nhật; xem [bhxh-reference.md](bhxh-reference.md).

| `plans.service_id` | Số gói trong CSV | Nhánh code sử dụng |
| --- | ---: | --- |
| `vnptca` | 21 | Chữ ký số Token |
| `smartca` | 16 | Chữ ký số từ xa |
| `bhxh` | 40 | BHXH độc lập và tích hợp |
| `invoice` | 21 | Invoice, truyền nhận TVAN, POS |
| `inbot` | 5 | Hóa đơn đầu vào |
| `econtract` | 11 | eContract SaaS và TSA CeCA |
| `internet` | 62 | Internet cáp quang: bảng so sánh cấu hình và tính giá 1/3/6/12 tháng |

Đã đối chiếu tên cột với SQL, kiểm tra ID trống/trùng, UUID của gói, liên kết danh mục của dịch vụ, nhãn gói trùng trong cùng nhóm, các trường phân nhóm/thời hạn/giá bắt buộc cho cách đọc hiện tại và định dạng số không âm của giá có giá trị. Không phát hiện vấn đề ở các kiểm tra này trong ba CSV. Đây chưa phải xác nhận tính đúng đắn của mức giá hoặc dữ liệu đầy đủ trên Supabase.

Người dùng xác nhận gói có ID `f66f61f7-a8da-4c40-a1d5-099da062a986` (`invoice_new`) là `HD 2,000 NEW`, gồm 2.000 hóa đơn với đơn giá 650đ/HĐ và giá gói 1.300.000đ chưa VAT. Đã sửa tên và ghi chú trong CSV theo xác nhận này. Đây là chỉnh sửa bản dữ liệu local; chưa cập nhật bản ghi trên Supabase online. Code đọc dữ liệu trực tiếp từ Supabase nên tên và ghi chú trên website phụ thuộc bản ghi online.

## Các bảng

| Bảng | Vai trò trong ứng dụng | Cột |
| --- | --- | --- |
| `categories` | Danh mục ở cột thứ nhất, sắp xếp theo `sort_order` | `id` (text, PK), `name` (text), `sort_order` (integer, mặc định 0) |
| `services` | Dịch vụ ở cột thứ hai, lọc theo `category_id` và sắp xếp theo `sort_order` | `id` (text, PK), `category_id` (text, FK), `name` (text), `sort_order` (integer, mặc định 0) |
| `plans` | Gói cước dùng để lập bảng giá theo dịch vụ và nhóm gói | `id` (uuid, PK, mặc định `gen_random_uuid()`), `service_id`, `plan_group`, `group_name`, `duration_text`, `note` (text), `price`, `invoice_price` (bigint) |

Chi tiết `NOT NULL` và giá trị mặc định được giữ trong `schema.sql`. Kiểu `int4` trên sơ đồ tương ứng `integer`; `int8` tương ứng `bigint`.

## Quan hệ đã xác nhận từ SQL

- `services.category_id` tham chiếu `categories.id`, cho phép NULL. `ON DELETE CASCADE` khiến các dịch vụ thuộc danh mục bị xóa theo khi xóa danh mục.
- Trong SQL được cung cấp, `plans.service_id` là cột text cho phép NULL và chưa có khóa ngoại.
- `plan_group` là mã nhóm gói; `group_name` là tên nhóm hiển thị. Code gom các bản ghi cùng `plan_group` trong từng nhánh dịch vụ.
- `duration_text` là text: code dùng nó làm thời hạn theo tháng cho chữ ký số/BHXH và làm nhãn gói cho các dịch vụ khác.

## Mã dịch vụ trong code hiện tại

| Nhánh giao diện (`activeService.id`) | Mã `plans.service_id` mà code lọc |
| --- | --- |
| `cks` | `vnptca`, `smartca` |
| `bhxh` | `bhxh` |
| `hddt` | `invoice`, `inbot` |
| `econtract` | `econtract` |
| `internet` | `internet` |
| `mytv` | Chưa có trong `plans.csv`; danh mục kênh ở `mytv-data.js` |
| `mesh` | Cấu hình cục bộ ở `mesh-data.js`, chưa có trong CSV |
| `camera` | 14 gói add-on và 3 thiết bị mua đứt ở `camera-data.js`, chưa có trong CSV |

CSV xác nhận `cks`, `bhxh`, `hddt`, `econtract` là các ID trong `services`; `vnptca`, `smartca`, `invoice`, `inbot` chỉ xuất hiện trong `plans.service_id`, không có dòng tương ứng trong `services.csv`. Code đang ánh xạ chúng theo bảng trên. Vì vậy không thể thêm trực tiếp khóa ngoại `plans.service_id → services.id` với các ID hiện tại mà vẫn giữ nguyên dữ liệu này.

Các dịch vụ `internet`, `mytv`, `camera` có trong `services.csv`, nên xuất hiện ở danh sách dịch vụ. Nhánh `internet` xử lý 62 gói thuộc 20 nhóm trong CSV. Nhánh `mytv` tra cứu 8 gói và kênh từ `mytv-data.js`, theo ảnh người dùng cung cấp; S/S1/S2 có giá 30.000đ/tháng, Film/Film+/Flexi 1/Flexi 2 giá 65.000đ/tháng, MyTV VIP giá 95.000đ/tháng. VIP có gần 170 kênh theo ảnh, gồm SCTV, VTVcab và 2 kênh SPOTV, Galaxy VIP, VOD không quảng cáo; danh sách tra cứu VIP mới gồm các chùm kênh đã xác nhận. Các giá MyTV này được cập nhật cục bộ, chưa có trong `plans.csv` hoặc Supabase. Chi tiết nguồn dữ liệu và cách bổ sung giá được ghi trong `mytv-reference.md`. Nhánh `camera` tra cứu 14 gói add-on và 3 thiết bị mua đứt từ `camera-data.js`, theo ảnh và xác nhận của người dùng; Cam IN TTN 789.000đ, Cam OUT TTN 990.000đ. Phí lắp tính từng camera, miễn khi mua đứt hoặc chọn kỳ từ 6 tháng; xem `camera-reference.md`. Dữ liệu Camera chưa được thêm vào `plans.csv` hoặc Supabase. Các gói Internet có kèm MyTV hoặc Camera được tra cứu trong phần Internet.

Dịch vụ `mesh` được bổ sung cục bộ vào Băng rộng cố định nếu Supabase chưa trả về ID này. Dữ liệu `mesh-data.js` gồm 12 dòng Pack add-on theo ảnh, điều kiện Pack 5*/10* và giá mua 699.000đ/thiết bị; xem `mesh-reference.md`. Các số lượng dòng trong CSV ở đầu tài liệu vẫn phản ánh bản xuất gốc, chưa bao gồm dịch vụ Mesh cục bộ.

Nhánh Chữ ký số Token có lựa chọn Gói thường / Gói Pro cho OID, SID và PID. Giá Pro 12/24/36 tháng nằm trong `vnptca-data.js`, theo ba ảnh người dùng cung cấp, chưa thêm vào CSV/Supabase. OID Pro bổ sung bảo vệ Email và xác thực người dùng; SID/PID thường đã có bảo vệ Email, Pro bổ sung xác thực người dùng. Chi tiết giá mới/gia hạn và chức năng: [vnptca-reference.md](vnptca-reference.md).

## Cách hiển thị Internet

- `internetData` gom gói theo `plan_group`, giữ `id`, `duration_text`, `price`, `note` và sắp xếp tăng dần theo giá trong mỗi nhóm.
- Khu vực: `noi` (Nội thành), `nt` (Ngoại thành).
- Bảng gia đình ghép các gói `home` (Chỉ Internet), `tv` (Internet + MyTV), `cam` (Internet + Camera). Mỗi dòng là một cặp loại gói + `duration_text` trong khu vực đang chọn; các cấu hình `_none`, `_1mesh`, `_2mesh` được đặt cạnh nhau thành ba cột giá. Cấu hình chưa có dữ liệu hiển thị dấu `—`.
- `duration_text` được tách tên gói và tốc độ trong ngoặc; tốc độ hiển thị bằng dòng chữ nhỏ dưới tên gói ở cả hai bảng, không cần cột Internet riêng. Các nhóm home/tv/cam có màu nền khác nhau; gói có ghi chú bắt đầu bằng `KM:` được đánh dấu ưu đãi và giữ thành dòng riêng theo tên gói.
- Các gói ưu đãi được xếp lên đầu bảng gia đình. Trong phần ưu đãi và phần gói thường, các dòng tiếp tục xếp theo nhóm home/tv/cam rồi theo tên gói với thứ tự số tự nhiên.
- Theo yêu cầu người dùng, giá ưu đãi của `Home 1_M` hiển thị ở cột "+1 Mesh 6" theo nhóm `nt_home_1mesh`. Riêng `Home Slay_M` vẫn được đưa vào cột "Mặc định", dù bản CSV đang phân nhóm ở `noi_home_1mesh`. Đây là ánh xạ hiển thị trong bảng, giữ nguyên giá và quyền lợi đã kèm trong gói; không sửa nhóm gói trên Supabase/CSV và không di chuyển cấu hình Mesh của các gói thường.
- Người dùng xác nhận các gói thường trong bảng Internet gia đình (`home`, `tv`, `cam`) đều có `Family Safe / GreenNet`, còn các gói ưu đãi có ghi chú bắt đầu bằng `KM:` thì không có. Ứng dụng chỉ bổ sung quyền lợi chung này vào dòng tích hợp và tooltip của gói thường, kể cả khi ghi chú trong CSV/Supabase chưa nhắc đến. Gói chỉ Internet thường hiển thị quyền lợi này thay cho chữ `Modem`; gói MyTV/Camera thường giữ tích hợp riêng ở dòng trên. Gói ưu đãi chỉ hiển thị quyền lợi theo ghi chú, không được tự thêm `Family Safe / GreenNet`. Không tự áp dụng xác nhận này cho bảng Internet + Di động riêng.
- Nhãn `_none` là "Mặc định" vì một số gói khuyến mại trong nhóm này vẫn kèm Mesh theo ghi chú. Quyền lợi chung ưu tiên ghi chú của cấu hình mặc định; loại bỏ phần cộng Mesh của gói thường khỏi cột quyền lợi chung. Cột tích hợp dùng cụm từ ngắn như `Family Safe / GreenNet`, `MyTV (App)`, `MyTV VIP (App)`, `1 Camera Indoor · Cloud 3 ngày`. Các thông tin có ảnh hưởng tới tư vấn như lựa chọn `hoặc`, số Mesh và thời gian lưu của gói ưu đãi được giữ lại. Ghi chú gốc vẫn có trong tooltip quyền lợi/ô giá.
- Các gói `mobile` không có hậu tố Mesh, được hiển thị ở bảng Internet + Di động riêng, kèm tốc độ dưới tên gói, tích hợp MyTV nếu ghi chú có nhắc đến và quyền lợi di động rút gọn thành các dòng dữ liệu/ngày, phút gọi, số thành viên gọi nhóm miễn phí. Tooltip giữ ghi chú gốc.
- Giá đầu vào Internet được dùng làm giá tháng theo yêu cầu bảng tham chiếu của người dùng. Các nút 1, 3, 6, 12-13 tháng cập nhật toàn bộ ô giá ở cả hai bảng bằng `price × số tháng trả trước`, cộng phí lắp đặt nếu được chọn. Kỳ 12-13 tháng thu tiền 12 tháng và tặng 1 tháng sử dụng (tổng 13 tháng); nhãn kỳ và tiêu đề bảng đều hiển thị "12-13 tháng". Không cộng thêm VAT hoặc chiết khấu. Kỳ giá được giữ khi đổi khu vực và đặt lại 1 tháng khi chọn lại dịch vụ Internet.
- Ô chọn "Cộng 300.000đ phí lắp đặt" nằm trong khung tính giá nhanh và mặc định tắt. Khi bật, mỗi gói ở cả hai bảng được cộng một lần 300.000đ vào tổng tiền của kỳ đang chọn (`price × số tháng + 300000`), không nhân phí theo số tháng. Khi tắt, bảng trở về giá gói theo kỳ. Tiêu đề cột chuyển thành "Tổng N tháng (đ)" khi có phí để phân biệt với giá cước tháng. Lựa chọn phí được giữ khi đổi khu vực hoặc số tháng; không sửa giá gốc trong CSV/Supabase.
- Ô chọn "+ Phí lắp cam 100.000đ" trong khung tính giá nhanh mặc định tắt. Khi bật, chỉ các gói thuộc nhóm `cam` được cộng một lần 100.000đ, kể cả gói ưu đãi có camera; không nhân phí theo số tháng và không áp dụng quy tắc miễn phí của dịch vụ Camera riêng. Hai ô phí độc lập: nếu cùng bật, gói có camera cộng tổng 400.000đ phí, các gói khác chỉ cộng 300.000đ. Lựa chọn phí được giữ khi đổi khu vực hoặc kỳ giá.
- Giá Internet hiển thị bằng văn bản, không có chức năng bấm để sao chép. Cột "Tích hợp" mặc định ẩn ở cả hai bảng, chỉ xuất hiện khi chọn "Hiện cột tích hợp"; bảng di động vẫn giữ cột "Quyền lợi di động". Lựa chọn hiện/ẩn được giữ khi đổi khu vực hoặc kỳ giá. Khi ẩn tích hợp, cột bị loại khỏi cả phần định nghĩa cột, tiêu đề và dữ liệu để các cột còn lại sử dụng hết chiều rộng.
- Bộ chọn khu vực chỉ hiển thị các khu vực có dữ liệu. Ở màn hình lớn, phần bảng Internet được mở rộng; ở màn hình nhỏ có thể cuộn ngang bảng, cột tên gói được cố định khi cuộn. Khung chọn khu vực và ô hiện cột tích hợp cuộn theo nội dung. Phần "Tính giá nhanh" là khung riêng, luôn sticky ở đầu vùng cuộn trên cả điện thoại và máy tính để đổi kỳ 1/3/6/12-13 tháng ngay khi đang xem các gói bên dưới.
- Khi chưa có dữ liệu phù hợp, bảng hiện thông báo thay cho vùng giá trống.

## Nhóm gói đã xác nhận trong CSV

- VNPT-CA: `canhan_moi`, `canhan_giahan`, `nhanvien_moi`, `nhanvien_giahan`, `doanhnghiep_moi`, `doanhnghiep_giahan`, `device`.
- SmartCA: `canhan`, `nhanvien`, `doanhnghiep`, `1lan`.
- BHXH: `bhxh_doclap`, `tichhop_moi`, `tichhop_giahan`, mỗi loại có các biến thể hậu tố rỗng, `_100`, `_1000`, `_max`.
- Invoice: `invoice_new`, `invoice_nt`, `invoice_pos`.
- Inbot: `inbot_goi`.
- eContract: `econtract_saas`, `econtract_ceca`.
- Internet: các mã có tiền tố `noi_` hoặc `nt_`, tiếp theo là `home`, `tv`, `cam` hoặc `mobile`; các nhóm home/tv/cam trong CSV còn có hậu tố `_none`, `_1mesh` hoặc `_2mesh` tùy nhóm. Tên nhóm thể hiện nội thành/ngoại thành và dịch vụ tích hợp. Bảng tính 3/6/12 tháng dùng giá tháng nhân số tháng; các chính sách ưu đãi trả trước hoặc phí bổ sung chưa được xác nhận.

## Quy ước giá mà code đang áp dụng

- VNPT-CA, SmartCA và BHXH: coi giá đầu vào đã gồm VAT 10%, quy đổi khi chọn VAT khác rồi áp dụng chiết khấu phần dịch vụ. SmartCA nâng cao nhân hệ số 1,5, trừ gói một lần.
- VNPT-CA đăng ký mới (trừ Device ID): `price` và `invoice_price` đã bao gồm Token. Giá Token gốc ở VAT 10% là 550.000đ cho doanh nghiệp, 165.000đ cho cá nhân/nhân viên; ở VAT 8% lần lượt là 540.000đ và 162.000đ. Tách Token khỏi giá gốc VAT 10%, tính chiết khấu và VAT cho phần dịch vụ rồi cộng nguyên giá Token theo VAT đang chọn; chỉ làm tròn tổng cuối cùng đến đồng. Công thức này áp dụng đồng nhất cho giá thanh toán, giá xuất HĐ và nội dung sao chép. Gia hạn và Device ID không tách/cộng phí Token. Giá Token hiện bằng dòng chữ đỏ ngay trên giá thanh toán từng gói; đã bao gồm trong tổng tiền, không cộng thêm lần nữa.
- SmartCA: tính hệ số nâng cao (nếu có), VAT và chiết khấu trước khi làm tròn giá cuối cùng đến đồng. Không dùng giá đã làm tròn sau quy đổi VAT để tiếp tục tính chiết khấu. Gói một lần không nhân hệ số nâng cao.
- SmartCA có lựa chọn "Giá gốc / Áp dụng ưu đãi", mặc định giá gốc. Bấm áp dụng để tự tính mức giảm phù hợp từng gói: 1–3 tháng/dùng một lần 10%, 6 tháng 20%, từ 12 tháng 30%. Phần "Tùy chỉnh ưu đãi" thu gọn chứa điều kiện khách hàng riêng và chọn mức giảm thủ công; mọi mức giảm vẫn bị giới hạn theo chính sách. Điều kiện riêng/mức thủ công có tóm tắt bên ngoài phần thu gọn. Mỗi dòng chỉ ghi "Giảm X%" cạnh giá, công thức và nội dung sao chép dùng cùng mức thực tế; xem [smartca-reference.md](smartca-reference.md).
- CA Token có chính sách chiết khấu riêng theo số chữ ký số trên 1 hợp đồng: dưới 100 tối đa 50%, từ 100 trở lên tối đa 60%, chỉ giảm phí dịch vụ. Chọn quy mô hợp đồng và mức chiết khấu bước 1%; tự hạ mức vượt trần khi đổi quy mô. Ngoài phân cấp cần đề xuất qua Phòng Điều hành gửi Tổng Công ty xem xét. Giá trong bảng và nội dung sao chép vẫn là giá cho 1 chữ ký số. Chính sách CA Token độc lập với SmartCA; xem [vnptca-reference.md](vnptca-reference.md).
- BHXH phân biệt địa bàn: Hà Nội/Đà Nẵng/TP.HCM tối đa 65% độc lập, 55% tích hợp; các địa bàn còn lại tối đa 50%/45%. Trần tính chung các khoản ưu đãi và thù lao đại lý theo chính sách. Mặc định địa bàn khác, giảm 0%; tự giới hạn khi đổi địa bàn hoặc loại gói. Chỉ chiết khấu phí dịch vụ, cộng nguyên Token cho tích hợp đăng ký mới; đổi VAT và chiết khấu trước khi làm tròn kết quả cuối. Xem [bhxh-reference.md](bhxh-reference.md).
- Invoice, Inbot và eContract: coi `price` là giá chưa VAT, sau đó tính chiết khấu, VAT và các khoản cộng thêm theo từng dịch vụ.
- `invoice_price` được dùng làm giá xuất hóa đơn trong nhánh VNPT-CA doanh nghiệp.
- Các quy ước này đến từ JavaScript, không được thể hiện bằng ràng buộc trong SQL đã cung cấp.

## Thông tin còn thiếu

- Trạng thái RLS và policies, grants, views, functions, triggers và index bổ sung nếu có. Cần đối chiếu phần quyền khi phát triển chức năng ghi dữ liệu.

Các ảnh cấu trúc và CSV chưa xác nhận những thông tin trên; chưa thể kết luận database có hoặc không có chúng.
