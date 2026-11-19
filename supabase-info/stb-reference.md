# Set-top-box MyTV

Nguồn: hai ảnh bảng giá MyTV B2B và Set-top-box MyTV B2C do người dùng cung cấp trong cuộc trò chuyện ngày 19/11/2026. Dữ liệu nằm trong `stb-data.js`.

Dịch vụ `stb` (Set-top-box) thuộc `brcd` (Băng rộng cố định), thứ tự 5 sau WiFi Mesh. Khi server chưa có dịch vụ này, ứng dụng bổ sung cục bộ và không tạo trùng nếu server đã trả về ID `stb`. Không ghi thêm vào Supabase, không sửa CSV xuất từ server. Chọn lại dịch vụ đặt về tab B2C, kỳ 1 tháng; chuyển tab B2C/B2B giữ kỳ B2C đã chọn.

## MyTV B2C

Giá đã gồm VAT, không cộng thêm VAT theo tùy chọn thuế của các dịch vụ khác. Bảng 1 tháng áp dụng trả sau hoặc trả trước.

| Gói | 1 tháng | 3 tháng | 6/7/8/9 tháng | 12/13/14/15/16/17/18 tháng |
| --- | ---: | ---: | ---: | ---: |
| 1 STB | 50.000 | 150.000 | 300.000 | 600.000 |
| 2 STB | 100.000 | 300.000 | 600.000 | 1.200.000 |
| 3 STB | 150.000 | 450.000 | 900.000 | 1.800.000 |
| 4 STB | 200.000 | 600.000 | 1.200.000 | 2.400.000 |
| 5 STB | 250.000 | 750.000 | 1.500.000 | 3.000.000 |

Người dùng xác nhận không có kỳ 4 tháng; bỏ kỳ này khỏi dữ liệu và giao diện, không coi là thiếu giá. Các nhóm kỳ 6–9 và 12–18 tháng lấy đúng mức giá cố định trong ảnh, không nhân với số tháng sử dụng. Nhãn rút gọn của thanh chọn kỳ là 1 tháng, 3 tháng, 6–9 tháng, 12–18 tháng.

## MyTV B2B

Giá tháng chưa gồm VAT, đơn vị đồng/thuê bao/phòng. Bảng giữ hai cột giá theo nguồn, không áp dụng mức VAT suy đoán.

| Gói | Chưa gồm STB | Đã gồm STB |
| --- | ---: | ---: |
| MyTV B2B Standard | 70.000 | 110.000 |
| MyTV B2B Gold | 180.000 | 220.000 |
| MyTV B2B Premium | 240.000 | 280.000 |
| MyTV B2B Diamond | 370.000 | 410.000 |

Giá đã gồm STB chứa phí thuê thiết bị 40.000đ/thuê bao/phòng/STB/tháng (chưa VAT). Không cộng thêm khoản này lần nữa và không dùng mức B2C 50.000đ cho B2B.

Chức năng này tra cứu bảng giá riêng, không thay đổi bộ tính MyTV B2C đang có (cộng 50.000đ/tháng cho một STB theo số tháng thanh toán).
