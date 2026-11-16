# Combo HKD tại TP.HCM

Nguồn: file người dùng cung cấp `TỔNG HỢP_CÁC GÓI COMBO HKD - Giá cước_update 13.11.pdf`, 2 trang. Đã đối chiếu cả nội dung và ảnh bảng. Catalog cục bộ: `hkd-data.js`. Thêm menu HKD vào CNTT, sau Biên lai điện tử, không cần bản ghi dịch vụ trên Supabase và không tạo trùng khi máy chủ đã có ID `hkd`.

## Giá gói chưa VAT

| Nhóm | Tên theo PDF | Thời hạn | Số hóa đơn | Giá gói |
| --- | --- | ---: | ---: | ---: |
| Đăng ký mới | CB10 HKD NEW 24T | 24 tháng | 5.000 | 1.896.000 |
| Đăng ký mới | CB11 HKD NEW 36T | 36 tháng | 5.000 | 2.484.000 |
| Đăng ký mới | CB7 HKD_89 | 18 tháng | 5.000 | 1.602.000 |
| Đăng ký mới | CB8 HKD_99 | 12 tháng | 5.000 | 1.188.000 |
| Đăng ký mới | CB1 HKD 70 | 12 tháng | 500 | 800.000 |
| Đăng ký mới | CB2 HKD 70 | 12 tháng | 500 | 750.000 |
| Đăng ký mới | CB3 HKD 70 | 12 tháng | 500 | 1.220.000 |
| Đăng ký mới | CB4 HKD 70 | 12 tháng | 500 | 1.170.000 |
| Đăng ký mới | CB5 HKD 70 | 12 tháng | 1.000 | 1.420.000 |
| Đăng ký mới | CB6 HKD 70 | 12 tháng | 1.000 | 1.370.000 |
| Gia hạn từ năm thứ 2 | CB9 HKD Tiêu chuẩn | 12 tháng | 5.000 | 1.602.000 |
| Gia hạn | CB12 HKD_TC 24T | 24 tháng | 5.000 | 2.400.000 |
| Gia hạn | CB13 HKD_TC 36T | 36 tháng | 5.000 | 3.060.000 |
| Miễn phí | CB_HKD_UD | HĐ 12 tháng; SmartCA và HKD 6 tháng | 1.000 | Không thu tiền (giá trị 1.220.000) |
| Miễn phí | CB HKD_UD2 | HĐ 12 tháng; HKD 6 tháng | 1.000 | Không thu tiền (giá trị 970.000) |

Giữ thứ tự các dòng theo PDF. Thành phần từng gói và loại chữ ký số nằm trong catalog và phần mở rộng dưới tên gói; CB1/CB2 không có phần mềm VNPT HKD. Không đổi các gói nâng cao thành toàn diện hoặc tự thêm chữ ký số cho gói miễn phí UD2.

## Điều kiện

- CB7, CB8, CB10, CB11 chỉ dành cho khách hàng lần đầu sử dụng; thời hạn công bố đã gồm 6 tháng miễn phí. Không cộng thêm 6 tháng, không tặng kèm CB_HKD_UD hoặc CB HKD_UD2. Hiển thị nhãn riêng ngay dưới tên gói và điều kiện trong phần chi tiết/báo giá.
- CB1–CB6: khách hàng mua đồng thời nhiều dịch vụ.
- CB9: gia hạn từ năm thứ 2. CB12/CB13: khách có nhu cầu gia hạn.
- Hai gói miễn phí áp dụng 08/08/2025–31/12/2026 theo 844/QĐ-KHDN-TT DVSDN. Giá trị 1.220.000 và 970.000 chỉ là giá trị gói trước VAT, không phải tiền phải trả. Không tính VAT/chiết khấu trên các giá trị tham khảo này.
- CB7/CB8/CB9 theo 977/VNPTVNP-KHDN, từ 13/11/2025. CB10/CB11/CB12/CB13 theo 286/QĐ-VNPTVNP-KHDN, từ 16/12/2025. CB1–CB6 theo 3262/KHDN-TT DVS DN, từ 26/05/2025. Các gói thu tiền ghi hiệu lực đến khi có thông báo mới.
- Giá chưa gồm USB Token, tích hợp phần mềm khác, chuyển đổi dữ liệu, tùy chỉnh/phát triển chức năng và đào tạo. Lưu trữ hóa đơn tối thiểu 10 năm từ ngày phát hành.

## Tra cứu và tính giá

Ba nút Đăng ký mới / Gia hạn / Miễn phí lọc cùng một bảng. Mặc định Đăng ký mới và VAT 8% theo yêu cầu chung của ứng dụng; có nút đổi VAT 10%. Bảng hiện thời hạn, số hóa đơn, giá gói và thanh toán; thành phần, điều kiện, văn bản nằm trong phần mở theo nhu cầu.

Tất cả 13 gói thu tiền có mức chiết khấu tối đa 40%, không có các điều kiện phân tầng khác trong PDF. Mặc định Giá gốc; Áp dụng chiết khấu mở thanh 0–40%, bước 5%. Đổi nhóm hoặc chọn lại dịch vụ đặt lại chiết khấu về 0. Tổng thanh toán = làm tròn một lần đến đồng của `giá gói × (100 − chiết khấu) × (100 + VAT) / 10000`. Ví dụ CB8: VAT 8% giá gốc 1.283.040đ; giảm 40% còn 769.824đ.

Không áp phí khởi tạo, duy trì POS hoặc phí của các dịch vụ độc lập vào combo vì PDF không quy định các khoản này. Chưa có giá USB Token trong file nên chỉ ghi rõ chưa bao gồm, không tự lấy giá Token hoặc cộng thiết bị. Gói miễn phí luôn thanh toán 0đ. Báo giá sao chép dùng đúng tổng, thành phần, điều kiện lần đầu, khu vực và phạm vi chưa gồm. Không đưa bản PDF nội bộ vào tài nguyên công khai của website.
