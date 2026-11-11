# Camera: nguồn giá và quy tắc tính

Dữ liệu cục bộ ở `../camera-data.js`, dùng trong nhánh dịch vụ `camera` đã có trong danh mục Supabase. Chưa thêm gói vào Supabase hoặc `plans.csv`.

Nguồn: ảnh `D:\MY VNPT\Camera.jpg` do người dùng cung cấp, lưu bản tham chiếu ở `../assets/camera/camera.jpg`. Các mức giá cước dưới đây đã gồm VAT theo ảnh; không cộng thêm VAT trong ứng dụng.

## Giá cước add-on (đ)

| Gói | 1 tháng | 3 tháng | 6 tháng | 12–13 tháng |
| --- | ---: | ---: | ---: | ---: |
| Pack 01 Cam | 30.000 | 90.000 | 180.000 | 360.000 |
| Pack 03 Cam | 80.000 | 240.000 | 480.000 | 960.000 |
| Pack 05 Cam | 130.000 | 390.000 | 780.000 | 1.560.000 |
| Pack 10 Cam | 250.000 | 750.000 | 1.500.000 | 3.000.000 |
| Pack 01 Cam Out | 40.000 | 120.000 | 240.000 | 480.000 |
| Pack 01 Cam In + 01 Cam Out | 66.000 | 198.000 | 396.000 | 792.000 |
| Cam IN thẻ nhớ 64GB | 30.000 | 90.000 | 180.000 | 360.000 |
| Cam OUT thẻ nhớ 64GB | 50.000 | 150.000 | 300.000 | 600.000 |
| Cam IN Cloud 7 | 40.000 | 120.000 | 240.000 | 480.000 |
| Cam IN Cloud 15 | 60.000 | 180.000 | 360.000 | 720.000 |
| Cam IN Cloud 30 | 90.000 | 270.000 | 540.000 | 1.080.000 |
| Cam OUT Cloud 7 | 60.000 | 180.000 | 360.000 | 720.000 |
| Cam OUT Cloud 15 | 80.000 | 240.000 | 480.000 | 960.000 |
| Cam OUT Cloud 30 | 110.000 | 330.000 | 660.000 | 1.320.000 |

Giữ nhãn kỳ dài `12–13 tháng` theo ảnh; chưa quy định thêm điều kiện được tháng thứ 13. Lưu riêng bốn mức giá cho từng gói.

## Giá mua đứt (TTN)

- Cam IN + thẻ nhớ 64GB: **789.000đ/thiết bị**, theo người dùng xác nhận, thay giá 646.000đ trong ảnh.
- Cam OUT + thẻ nhớ 64GB: **990.000đ/thiết bị**, theo người dùng xác nhận, thay giá 946.000đ trong ảnh.
- Đầu ghi WN883P: **1.870.000đ/thiết bị**, theo ảnh.

Các giá mua thanh toán một lần, không nhân theo kỳ cước.

## Phí lắp đặt

Người dùng xác nhận phí tính **theo từng camera**:

- Kỳ 1 hoặc 3 tháng: 100.000đ/Cam IN + 150.000đ/Cam OUT, thu một lần cho gói đang báo giá.
- Miễn phí khi mua đứt hoặc chọn kỳ từ 6 tháng (áp dụng cho cả 6 tháng và 12–13 tháng).
- Tổng báo giá = giá cước của kỳ + phí lắp; không nhân phí lắp theo số tháng.
- Ví dụ gói 1 IN + 1 OUT: kỳ 1 tháng 66.000 + 250.000 = 316.000đ; kỳ 3 tháng 198.000 + 250.000 = 448.000đ; kỳ 6 tháng 396.000đ, không phí lắp.

Giao diện cho chọn kỳ bằng thanh tính giá nhanh sticky, thay đổi giá của cả 14 gói và tách cột giá cước, phí lắp, tổng tiền. Thành phần gói ghi nhỏ dưới tên để giảm số cột. Nhánh mua đứt hiển thị ba thiết bị và miễn phí lắp. Các mức phí Camera độc lập với ô phí lắp Internet và STB MyTV.
