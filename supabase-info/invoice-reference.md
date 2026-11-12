# Đơn giá tạo lập và truyền nhận VNPT Invoice

Nguồn: bảng "Giá dịch vụ Hóa đơn điện tử triển khai theo Thông tư số 78/TT-BTC" người dùng cung cấp. Đơn vị: VNĐ, **chưa gồm VAT**.

| Số hóa đơn | Đơn giá tạo lập/HĐ | Đơn giá truyền nhận/HĐ | Tổng đơn giá/HĐ | Giá gói |
| --- | ---: | ---: | ---: | ---: |
| 300 | 1.000 | 300 | 1.300 | 390.000 |
| 500 | 840 | 252 | 1.092 | 546.000 |
| 1.000 | 670 | 201 | 871 | 871.000 |
| 2.000 | 500 | 150 | 650 | 1.300.000 |
| 5.000 | 430 | 129 | 559 | 2.795.000 |
| 10.000 | 360 | 108 | 468 | 4.680.000 |
| Trên 10.000 (MAX) | 300 | 90 | 390 | Số lượng × 390 |

`invoice-data.js` lưu hai thành phần đơn giá, ghép vào các dòng `invoice_new` theo số hóa đơn trong tên gói. Mỗi gói hiển thị ba dòng gọn: tên gói; `Tạo lập: 1000đ/Truyền nhận: 300đ`; `Đơn giá: 1300đ/HĐ` (ví dụ HD 300 NEW). Không lặp số lượng HĐ hoặc ghi chú VAT trong các dòng này; số tiền đơn giá không có dấu phân cách hàng nghìn. Khối HD_MAX NEW dùng cùng cách trình bày. Không áp dụng đơn giá này cho TVAN riêng, Invoice-POS hoặc Inbot.

Tạo lập và truyền nhận là hai thành phần đã nằm trong giá gói; không cộng thêm vào tổng tiền lần nữa. Đơn giá tạo lập theo từng hóa đơn khác với khoản phí khởi tạo dịch vụ một lần 1.000.000đ chưa VAT. Bổ sung này không thay đổi công thức VAT, chiết khấu, phí khởi tạo hoặc giá gói hiện có. Các đơn giá hiển thị là giá niêm yết chưa VAT.

Dòng số lượng 2.000 HĐ trong ảnh có tên "HD 3,000 NEW" nhưng số lượng, đơn giá và giá gói đều khớp 2.000 × 650 = 1.300.000đ. Giữ tên hiện có "HD 2,000 NEW" trong CSV/ứng dụng; không tự đổi thành 3.000 HĐ.

Thông tin thành phần đơn giá được bổ sung cục bộ, chưa thêm cột hoặc sửa dữ liệu Supabase.

## Chiết khấu thương mại Invoice

Nguồn: ảnh "2. Chính sách chiết khấu thương mại" người dùng cung cấp bổ sung.

| Điều kiện | Tối đa |
| --- | ---: |
| Đăng ký dưới 5.000 hóa đơn hoặc khách hàng hiện hữu còn lại của VNPT | 20% |
| Đăng ký từ 5.000 đến dưới 10.000 hóa đơn hoặc KH hiện hữu có doanh thu từ 10 đến dưới 30 triệu đồng/tháng | 30% |
| Đăng ký từ 10.000 hóa đơn trở lên hoặc KH lớn hiện hữu có doanh thu từ 30 triệu đồng/tháng hoặc có cạnh tranh về giá của đối thủ | 40% |

Các điều kiện nối bằng "hoặc": mỗi gói dùng trần cao nhất giữa số hóa đơn đăng ký và điều kiện khách hàng được chọn; không cộng dồn các tỷ lệ. Số lượng 5.000 thuộc mức 30%, đúng 10.000 thuộc mức 40%. Khi chỉ xét số lượng, chọn giảm 40% thủ công vẫn chỉ giảm 20% cho gói 300–2.000 HĐ và 30% cho gói 5.000 HĐ.

Giao diện giữ cách dùng gọn: mặc định "Giá gốc", bấm "Áp dụng ưu đãi" để tự tính mức tối đa phù hợp từng gói. Phần "Tùy chỉnh ưu đãi" thu gọn chứa điều kiện khách hàng và lựa chọn giảm thủ công thấp hơn trần. Điều kiện riêng/mức giảm thủ công có tóm tắt bên ngoài phần thu gọn. Phần tên gói giữ đúng ba dòng gọn theo yêu cầu; mức "Giảm X%" chỉ hiện cạnh tổng tiền.

Giá chưa VAT, giá thanh toán có VAT, gói MAX và nội dung sao chép cùng dùng tỷ lệ đã giới hạn theo từng gói. Bản sao chép ghi tỷ lệ thực tế và điều kiện áp dụng. Số lượng không xác định hoặc không hợp lệ không được tự hưởng chiết khấu theo chính sách này. Ứng dụng chưa có dữ liệu khách hàng để kiểm chứng doanh thu hoặc cạnh tranh giá; người tư vấn chọn đúng điều kiện.

Ràng buộc mới chỉ áp dụng cho Invoice TT78 (`invoice_new`) và HD_MAX NEW. Ảnh này chưa xác nhận chính sách riêng cho TVAN, POS, Inbot hoặc cước khởi tạo, nên giữ cách tính hiện có của các phần đó. Không dùng mức Invoice để sửa chiết khấu phí khởi tạo. Khi chọn lại dịch vụ Hóa đơn hoặc đổi tab chính, ưu đãi Invoice trở về giá gốc, điều kiện theo số hóa đơn.
