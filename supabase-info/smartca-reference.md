# Ràng buộc chiết khấu SmartCA

## SmartCA Cá nhân theo lượt

Nguồn bổ sung: ảnh PS03/PS20/PS50/PSMAX do người dùng cung cấp, xác nhận **giá đã gồm VAT 8%**. Người dùng chọn **chỉ hiển thị giá gốc trước**, không áp chính sách chiết khấu theo thời hạn hoặc điều kiện khách hàng lên các gói theo lượt này.

| Gói | Lượt ký | Giá đã VAT 8% |
| --- | ---: | ---: |
| PS03 | 3 | 16.200đ |
| PS20 | 20 | 37.800đ |
| PS50 | 50 | 54.000đ |
| PSMAX | Tùy chọn | Số lượt × 982đ |

Lựa chọn Theo thời hạn / Theo lượt nằm trong tab Cá nhân của SmartCA. Theo lượt hiển thị cả bốn dòng cùng bảng; PSMAX có ô nhập số nguyên dương, mặc định 50 lượt = 49.100đ tại VAT 8%. Ảnh không xác nhận số lượt tối thiểu riêng hoặc thời hạn sử dụng; không tự thêm điều kiện này. Không áp hệ số Nâng cao 1,5 của gói theo thời hạn, không cộng Token hoặc khởi tạo. Dữ liệu nằm trong `smartca-usage-data.js`.

Chuyển VAT: `làm tròn(giá đã VAT 8% × (100 + VAT chọn) / 108)`. Tổng PSMAX nhân số lượt với 982đ trước khi đổi VAT và làm tròn một lần. Ví dụ 50 lượt tại VAT 10% = 50.009đ; không nhân 50 với đơn giá VAT 10% đã làm tròn. Chú thích đơn giá PSMAX trên giao diện ghi rõ mức VAT nguồn 8%. Báo giá sao chép ghi tên gói, số lượt và VAT, không ghi số tháng hay cấp độ Cơ bản/Nâng cao. Nhập sai PSMAX chặn giá và sao chép dòng đó. Mở lại dịch vụ Chữ ký số đặt lại Theo thời hạn, 50 lượt và VAT 8%.

## Gói theo thời hạn và dùng một lần

### SmartCA Hộ kinh doanh

Người dùng cung cấp và xác nhận giá **Nâng cao đã gồm VAT 8%**: 12 tháng 540.000đ, 24 tháng 1.026.000đ, 36 tháng 1.458.000đ. Gói 6 tháng miễn phí là **gói riêng cho lần đầu kích hoạt**, không cộng thêm vào kỳ 12/24/36 tháng.

Tab Hộ kinh doanh được bổ sung cục bộ trước tab Dùng 01 lần, không cần bản ghi máy chủ. Chỉ có Nâng cao; ẩn nút Cơ bản/Nâng cao và không nhân giá thêm 1,5 lần. Dữ liệu trong `smartca-household-data.js`. Chọn Lần đầu kích hoạt (mặc định) hiện thêm dòng 6 tháng, giá 0đ; chọn Đã kích hoạt ẩn dòng này và chặn sao chép gói miễn phí cũ nếu trạng thái vừa đổi. Mở lại dịch vụ Chữ ký số đặt lại Lần đầu kích hoạt và VAT 8%.

Các gói trả phí áp dụng bộ tùy chọn ưu đãi SmartCA theo thời hạn hiện có, mặc định giá gốc; từ 12 tháng có trần 30%. Gói miễn phí không áp thêm chiết khấu, không đổi giá hay kéo dài kỳ của các gói trả phí. Không tự thêm tốc độ/hạn mức lượt ký hoặc phí Token/khởi tạo chưa được cung cấp.

Công thức: `làm tròn(giá đã VAT 8% × (100 + VAT chọn) × (100 − chiết khấu thực tế) / 10800)`. Giá gốc VAT 10% tương ứng 550.000đ / 1.045.000đ / 1.485.000đ. Giá bị gạch ngang và báo giá sao chép dùng đúng cơ sở VAT của gói; sao chép luôn ghi Nâng cao và điều kiện lần đầu kích hoạt cho gói miễn phí.

### Chính sách chung

Nguồn: ảnh "IV. Chính sách phân cấp tăng giá, chiết khấu thương mại tối đa" do người dùng cung cấp. Phần cập nhật này áp dụng chính sách chiết khấu thương mại trong bảng.

| Điều kiện | Chiết khấu tối đa |
| --- | ---: |
| Khách hàng có cạnh tranh về giá của đối thủ | 30% |
| Khách hàng lớn hiện hữu của VNPT, doanh thu bình quân từ 30 triệu đồng/tháng | 30% |
| Gói có thời hạn từ 12 tháng trở lên | 30% |
| Khách hàng hiện hữu của VNPT, doanh thu bình quân từ 10 đến dưới 30 triệu đồng/tháng | 20% |
| Gói 6 tháng | 20% |
| Khách hàng hiện hữu còn lại của VNPT | 10% |
| Gói 1–3 tháng hoặc dùng một lần | 10% |

Các điều kiện trong bảng nối bằng "hoặc". Mỗi gói được áp dụng mức tối đa cao nhất giữa điều kiện thời hạn và điều kiện khách hàng được chọn; không cộng dồn các mức chiết khấu.

Giao diện chính chỉ có "Giá gốc / Áp dụng ưu đãi", mặc định giá gốc. Bấm "Áp dụng ưu đãi" để tự áp dụng mức tối đa phù hợp cho từng gói: gói 6 tháng giảm 20%, gói 1–3 tháng hoặc dùng một lần giảm 10%, gói từ 12 tháng giảm 30%. Chế độ tự động tính lại theo từng gói khi đổi nhóm, VAT hoặc cơ bản/nâng cao; không bị giữ mức thấp của nhóm vừa xem trước đó.

"Tùy chỉnh ưu đãi" mặc định thu gọn, chứa điều kiện khách hàng riêng và lựa chọn giảm thấp hơn mức tối đa. Khi chọn mức 30% thủ công, gói 6 tháng vẫn chỉ giảm 20% nếu chỉ xét thời hạn. Khách hàng có điều kiện cạnh tranh giá hoặc doanh thu cao có thể được áp dụng trần cao hơn trên gói ngắn khi chọn đúng điều kiện. Điều kiện khách hàng riêng và mức chọn thủ công luôn được tóm tắt bên ngoài phần tùy chỉnh để không bị ẩn khi đóng lại. Khi chỉ có gói dùng một lần và không có điều kiện khách hàng riêng, nút chọn thủ công 20%/30% bị khóa.

Mỗi dòng chỉ hiển thị giá và "Giảm X%" khi có ưu đãi; bỏ các dòng nhắc trần lặp lại. Công thức và nội dung sao chép dùng cùng mức thực tế, bản sao chép ghi cả lý do. Chọn lại "Giá gốc" tắt toàn bộ chiết khấu SmartCA, kể cả khi trước đó đã chọn điều kiện khách hàng riêng. Điều kiện và mức thủ công vẫn được giới hạn ngay trong công thức.

Ứng dụng chưa có dữ liệu khách hàng để tự xác minh doanh thu hoặc cạnh tranh giá. Người tư vấn chọn điều kiện khách hàng; thời hạn gói được kiểm tra từ dữ liệu giá. Không suy diễn mức giảm theo thời hạn chưa có trong chính sách. Khi chọn lại dịch vụ Chữ ký số, điều kiện trở về "Chỉ xét thời hạn gói", hiển thị giá gốc.
