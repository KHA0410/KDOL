# Internet doanh nghiệp VNPT

Nguồn: `VNPT internet doanh nghiệp.xlsx` do người dùng cung cấp, sheet `Trang_tính1`. Toàn bộ giá trong các bảng gốc chưa VAT. Catalog: `internet-business-data.js`; bản chép các ô dùng để đối chiếu nằm trong `tests/fixtures/internet-business-source.json`. Không sửa dữ liệu Supabase hoặc CSV hiện có.

## Tổ chức giao diện

Mục Internet có hai tab Gia đình / Doanh nghiệp. Gia đình chứa nguyên các bảng Home, các lựa chọn khu vực, kỳ thanh toán, phí lắp và cột tích hợp hiện có. Doanh nghiệp dùng trạng thái và giá riêng; đổi qua lại hai tab giữ các lựa chọn, chọn lại dịch vụ Internet trở về Gia đình và đặt lại cấu hình doanh nghiệp.

Tab Doanh nghiệp mặc định giá Hiện hành, kỳ tháng. Theo xác nhận người dùng, Internet tính VAT cố định 10%; đã bỏ nút chọn VAT, tổng tiền và báo giá luôn dùng 10%, độc lập với lựa chọn thuế ở dịch vụ CNTT. Bộ chọn kỳ dùng nhãn tổng quát 1 tháng / 6–7 tháng / 12–14 tháng; từng dòng và báo giá ghi chính xác nhãn kỳ của bảng nguồn. Phí lắp và IP mua thêm mặc định tắt/0. Có tìm tên gói. Các nhóm không có mức giá đang chọn không hiện, không tự suy ra giá ưu đãi còn thiếu.

## Các nhóm dữ liệu

| Nhóm | Dòng Excel | Số cấu hình | Đang cung cấp |
| --- | --- | ---: | ---: |
| FiberIoT / FiberXtra | 5–12 | 8 | 5 |
| FiberEco / Fiber / FiberVip | 17–30 | 14 | 14 |
| FiberS / FiberWifi / Fiber Pro | 36–42 | 7 | 7 |
| FiberOn | 48–51 | 4 | 1 |
| FiberM | 57–59 | 3 | 3 |
| Tổng | | 36 | 30 |

Sáu cấu hình ghi dừng từ 15/08: FiberIoT1, FiberIoT2, FiberXtra1, FiberOn1 và hai cấu hình FibeOn2 (IP động/IP tĩnh). Mặc định ẩn; bật Hiện gói đã dừng để tra lịch sử, không cho sao chép báo giá bán mới. Giữ tên `FibeOn2` đúng nguồn và ghi thêm loại IP để phân biệt hai dòng.

## Cột giá sử dụng

| Nhóm | Hiện hành | Phân cấp | Y tế / GD / Sở BN | DN MTL |
| --- | --- | --- | --- | --- |
| FiberIoT/Xtra | H/I/J | K/L/M | N/P/Q | Không có |
| Eco/Fiber/VIP | K/L/M | N/P/Q | R/S/T | U/V/W, chỉ Eco1–4 có số |
| S/Wifi/Pro | H/I/J | K/L/M | Không có | Không có |
| FiberOn | I/J/K | Không có | L/M/N; bảng nhóm này ghi riêng Y tế | Không có |
| FiberM | F/G/H | I/J/K | Không có | Không có |

Mỗi bộ ba cột lần lượt là tháng / kỳ ngắn / kỳ dài. Không lấy các cột Y/AB hoặc U10:V13 là số đã quy đổi VAT để cộng VAT lần nữa. Các cột phụ không có tiêu đề rõ ràng không được suy diễn thành mức giá mới.

### Xác nhận của người dùng

- FiberEco1 ghi Không phân cấp là chương trình giảm đã hết: luôn dùng giá hiện hành 320.000 / 1.920.000 / 3.840.000đ trước VAT, kể cả khi đang chọn chế độ Phân cấp, Y tế hoặc DN MTL. Bảng và báo giá ghi rõ giá hiện hành. Không dùng các ô giảm cũ N17/U17.
- FiberOn3 giữ từng giá nguồn: tháng 1.727.272,727…đ; kỳ 7 tháng 15.000.000đ; kỳ 14 tháng 30.000.000đ, trước VAT. Không tự sửa thành 6/12 lần giá tháng. Giá riêng Y tế giữ các ô L51/M51/N51 theo nguồn.
- IP tĩnh mua thêm cộng một lần vào báo giá, không nhân số tháng hoặc số phiên.

FiberEco2 có mức Phân cấp tháng tối thiểu 350.000đ, dùng đúng số này thay vì tự giảm theo phần trăm. Fiber Pro chỉ bán kỳ 6/13 tháng; ô giá tháng được giữ trong catalog để đối chiếu nhưng không được báo giá tháng. Các kỳ của nhóm FiberM còn ghi 6/7 và 12/13/14 tháng nên giữ nguyên nhãn, không tự khẳng định số tháng tặng.

## Tốc độ, IP và thiết bị

Ưu tiên tốc độ cập nhật T3/2025: Xtra cột D, Eco/Fiber/VIP cột E, S/Wifi cột D, On cột F. Nếu ô có dạng `400/8`, giữ nguyên chuỗi cập nhật và hiển thị 400 Mbps trong nước, 8 Mbps quốc tế. Cột quốc tế gốc cũng được lưu và hiện trong chi tiết khi khác số mới, ví dụ FiberEco4 400/8 so với cột cam kết cũ 7, FiberS2 800/6 so với cột cũ 5. Không bỏ thông tin khác biệt của nguồn.

Xtra ghi quốc tế giới hạn; các bảng khác ghi cam kết. FiberM dùng tốc độ mỗi phiên và số phiên đồng thời, không tự gán tốc độ quốc tế. IP v4/v6, dự phòng 4G/5G/FiberVNN và Mesh được lấy đúng từng dòng. Ô trống không tự điền từ gói liền kề. Các lựa chọn Mesh Wi-Fi 5/6 ở nhóm FiberWifi giữ cả hai phương án vì số thiết bị khác nhau.

File có danh sách gói dùng thử nhưng không nêu thời gian, giá hoặc điều kiện miễn phí cụ thể; không tự tạo nút miễn cước.

## VAT và khoản cộng thêm

Phí lắp: 272.727đ/thuê bao chưa VAT theo ô A1, chỉ cộng khi chọn, một lần; VAT 10% làm tròn thành 300.000đ.

| IP mua thêm | Hiện hành, chưa VAT | Phân cấp, chưa VAT |
| --- | ---: | ---: |
| 1 địa chỉ IP tĩnh | 200.000 | 160.000 |
| Block 8 địa chỉ | 500.000 | 400.000 |
| Block 16 địa chỉ | 1.000.000 | 800.000 |
| Block 32 địa chỉ | 2.000.000 | 1.600.000 |

Chế độ giá IP riêng, mặc định Hiện hành; không tự áp chế độ ngành của gói Internet vào IP. Số lượng là số nguyên không âm. Để trống hiểu là 0. Nhập không hợp lệ chặn tổng và sao chép để tránh báo giá thiếu IP.

Tổng = làm tròn đến đồng một lần của `(giá đúng kỳ trong nguồn + phí lắp nếu chọn + tổng IP mua thêm) × (100 + VAT) / 100`. Giữ số lẻ của các gói Fiber Pro, FiberM2/M3, FiberOn3, FiberIoT1 trong suốt phép tính; chỉ định dạng phần hiển thị đến đồng. Không nhân giá kỳ dài từ giá tháng, không nhân khoản cộng thêm theo số phiên hoặc thời hạn. Các giá Gia đình đã VAT và kỳ 12–13 tháng không tham gia phép tính Doanh nghiệp.

Báo giá sao chép ghi tên/loại IP của gói, kỳ, mức giá thực tế, tổng đã VAT, khoản lắp/IP đã chọn và thông số đi kèm. Gói đã dừng hoặc kỳ/mức giá không có trong file không tạo báo giá.
