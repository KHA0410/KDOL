# VNPT Invoice-POS

Nguồn: ảnh bảng giá và chính sách chiết khấu POS do người dùng cung cấp. Giá chưa gồm VAT 10%; dữ liệu giá nằm trong `pos-data.js`.

## Giá

| Gói | Số HĐ | Giá chưa VAT |
| --- | ---: | ---: |
| MTT 100 | 100 | 150.000 |
| MTT 500 | 500 | 300.000 |
| MTT 1.000 | 1.000 | 570.000 |
| MTT 1.500 | 1.500 | 780.000 |
| MTT 5.000 | 5.000 | 1.950.000 |
| MTT 10.000 | 10.000 | 3.000.000 |
| MTT 50.000 | 50.000 | 11.000.000 |
| MTT 100.000 | 100.000 | 18.000.000 |
| MTT 500.000 | 500.000 | 65.000.000 |
| MTT Max | Từ 500.000 trở lên | Số HĐ × 100đ |

Cước duy trì: 50.000đ/lần, cộng một lần trong báo giá, không nhân số hóa đơn và không tự suy diễn chu kỳ tháng/năm. Phí cài đặt/khởi tạo do đơn vị bán hàng quyết định theo yêu cầu phát sinh; văn bản không ấn định mức cố định. Theo yêu cầu bổ sung của người dùng, giao diện tạm mặc định 1.000.000đ chưa VAT, vẫn sửa được và nhập 0 nếu không thu. Mức mặc định nằm trong `defaultSetupPrice` của `pos-data.js`, dùng khi mở dịch vụ hoặc đặt lại cấu hình. Khi xóa trống hoặc nhập số không hợp lệ, vẫn tra được giá gói/duy trì nhưng chưa có tổng hoàn chỉnh và chưa cho sao chép báo giá.

Ảnh có đồng thời gói MTT 500.000 giá 65.000.000đ và MTT Max từ 500.000 HĐ giá 100đ/HĐ (50.000.000đ tại đúng 500.000 HĐ). Giữ cả hai đúng nguồn, không tự đổi mốc MAX sang 500.001 hoặc sửa giá gói cố định.

## Chiết khấu

| Điều kiện | Giá gói tối đa | Duy trì tối đa |
| --- | ---: | ---: |
| KH hiện hữu còn lại của VNPT hoặc gói từ 10.000 HĐ trở xuống | 10% | 20% |
| KH hiện hữu, doanh thu bình quân từ 10 đến dưới 30 triệu đồng/tháng hoặc mua gói 50.000 HĐ | 30% | 50% |
| Cạnh tranh giá hoặc KH lớn hiện hữu có doanh thu bình quân từ 30 triệu đồng/tháng hoặc gói từ 100.000 HĐ | 40% | 100% |

Áp dụng điều kiện "hoặc", lấy trần cao nhất mà gói hoặc khách hàng thỏa mãn, không cộng dồn các tỷ lệ. Ảnh chỉ nêu gói 50.000 HĐ cho mức giữa; không tự suy diễn mức số lượng ở khoảng 10.001–49.999 hoặc 50.001–99.999 HĐ. Các khoảng này không có trong danh sách gói cố định/MAX hiện tại; điều kiện khách hàng riêng vẫn có thể đủ điều kiện.

Giao diện có "Giá gốc / Áp dụng ưu đãi" cho cả giá gói và duy trì. Tùy chỉnh thu gọn cho phép chọn điều kiện khách hàng và yêu cầu tỷ lệ riêng; công thức luôn chặn theo từng trần. Điều kiện doanh thu/cạnh tranh giá do người tư vấn chọn vì chưa có dữ liệu để xác minh tự động. Phí khởi tạo đã do đơn vị bán hàng quyết định nên không áp thêm tỷ lệ giảm từ hai cột chính sách trên.

Tổng tiền = làm tròn đến đồng của `(giá gói × (100 − giảm gói) + 50000 × (100 − giảm duy trì) + phí khởi tạo đã nhập × 100) × (100 + VAT) / 10000`. Giá trị duy trì và khởi tạo hiển thị/copy là giá sau VAT, đã nằm trong tổng thanh toán. Mặc định chưa áp dụng chiết khấu, phí khởi tạo tạm tính 1.000.000đ chưa VAT. Không dùng cấu hình phí/chiết khấu Invoice TT78 hoặc Inbot cho POS.

Đã đối chiếu chín giá cố định với CSV hiện có, không cần sửa giá CSV. Giao diện dùng cấu hình POS cục bộ; chưa cập nhật Supabase online.
