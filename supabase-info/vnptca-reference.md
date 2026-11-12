# Giá và chức năng VNPT-CA Pro

Nguồn: ba ảnh bảng giá OID Pro, Staff ID Pro và Personal ID Pro do người dùng cung cấp trong cuộc trò chuyện. Giá đã bao gồm VAT 10%.

| Gói | Kỳ (tháng) | Phí dịch vụ / gia hạn | Token đăng ký mới | Tổng đăng ký mới |
| --- | ---: | ---: | ---: | ---: |
| OID Pro | 12 | 5.500.000 | 550.000 | 6.050.000 |
| OID Pro | 24 | 9.900.000 | 550.000 | 10.450.000 |
| OID Pro | 36 | 13.200.000 | 550.000 | 13.750.000 |
| Staff ID Pro | 12 | 660.000 | 165.000 | 825.000 |
| Staff ID Pro | 24 | 1.100.000 | 165.000 | 1.265.000 |
| Staff ID Pro | 36 | 1.430.000 | 165.000 | 1.595.000 |
| Personal ID Pro | 12 | 550.000 | 165.000 | 715.000 |
| Personal ID Pro | 24 | 990.000 | 165.000 | 1.155.000 |
| Personal ID Pro | 36 | 1.320.000 | 165.000 | 1.485.000 |

Theo xác nhận của người dùng:

- OID thường có ký số; OID Pro bổ sung bảo vệ Email và xác thực người dùng.
- SID (Staff ID) và PID (Personal ID) thường đã có bảo vệ Email; bản Pro chỉ bổ sung xác thực người dùng.
- Các gói Pro đều có ký số, bảo vệ Email và xác thực người dùng.

`vnptca-data.js` lưu phí dịch vụ Pro cho kỳ 12/24/36 tháng. Khi đăng ký mới, ứng dụng cộng Token đúng một lần vào cả giá thanh toán và giá xuất HĐ; gia hạn chỉ tính dịch vụ. Khi tính chiết khấu, tách Token khỏi giá gốc VAT 10%, chỉ giảm phần dịch vụ và quy đổi VAT rồi cộng nguyên giá Token theo VAT đang chọn. Chỉ làm tròn tổng cuối cùng đến đồng, tránh sai lệch do làm tròn ở bước trung gian. Nội dung sao chép bao gồm tên bản Pro, chức năng và giá tương ứng.

Dữ liệu Pro được bổ sung cục bộ, chưa cập nhật CSV/Supabase. Giá gói thường tiếp tục lấy từ Supabase. Device ID không có lựa chọn Pro. Khi chọn lại dịch vụ Chữ ký số, ứng dụng mặc định về OID thường, đăng ký mới.

## Chiết khấu CA Token

Bảng đăng ký mới (gói thường và Pro) có thêm cột “Giá dịch vụ”, kèm VAT đang chọn và đã trừ chiết khấu phí dịch vụ. Giá gốc được gạch ngang khi có giảm giá. Cột này lấy giá thanh toán gốc trừ Token trước khi tính VAT/chiết khấu; giá dịch vụ sau làm tròn cộng giá Token bằng tổng thanh toán. Gia hạn và Device ID không hiện thêm cột này.

Nguồn: ảnh "Chính sách chiết khấu — Giá cước dịch vụ" người dùng cung cấp.

- Dưới 100 chữ ký số trên 1 hợp đồng: mức chiết khấu tối đa 50%.
- Từ 100 chữ ký số trở lên trên 1 hợp đồng: mức chiết khấu tối đa 60%.
- Ngoài mức phân cấp: đơn vị bán hàng gửi đề xuất chi tiết, đầy đủ cơ sở phân tích về Phòng Điều hành để gửi Tổng Công ty xem xét quyết định.

Giao diện CA Token có bộ chọn quy mô hợp đồng và thanh chiết khấu bước 5%. Chỉ chiết khấu phí dịch vụ, áp dụng cho gói thường/Pro, đăng ký mới/gia hạn và Device ID; không giảm giá Token. Các ô giá và nội dung sao chép là giá cho 1 chữ ký số, không nhân với số chữ ký số trên hợp đồng. Khi chuyển từ mức từ 100 xuống dưới 100, mức chiết khấu vượt 50% được hạ về 50%; công thức và nội dung sao chép luôn giới hạn theo quy mô đang chọn. Mặc định dưới 100 chữ ký số, chiết khấu 0%. Chính sách và trạng thái chiết khấu SmartCA độc lập, có ràng buộc thời hạn/khách hàng riêng theo [smartca-reference.md](smartca-reference.md).
