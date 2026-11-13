# Đối chiếu VNPT-BHXH

Nguồn: bốn ảnh bảng giá BHXH độc lập, tích hợp đăng ký mới, tích hợp gia hạn và chính sách bán hàng do người dùng cung cấp. Các giá đã bao gồm VAT 10%.

## Phí dịch vụ độc lập (đăng ký mới và gia hạn)

| Gói | 18 tháng | 33 tháng | 48 tháng | 60 tháng |
| --- | ---: | ---: | ---: | ---: |
| VAN 10 | 220.000 | 352.000 | 418.000 | 528.000 |
| VAN 100 | 550.000 | 880.000 | 1.045.000 | 1.320.000 |
| VAN 1000 | 880.000 | 1.408.000 | 1.672.000 | 1.936.000 |
| VAN MAX | 1.210.000 | 1.936.000 | 2.299.000 | 2.585.000 |

## Phí dịch vụ tích hợp BHXH + VNPT-CA

| Gói | 18 tháng | 33 tháng | 48 tháng |
| --- | ---: | ---: | ---: |
| VAN 10 | 1.320.000 | 2.156.000 | 2.530.000 |
| VAN 100 đăng ký mới | 1.584.000 | 2.695.000 | 3.020.600 |
| VAN 100 gia hạn | 1.584.000 | 2.695.100 | 3.020.600 |
| VAN 1000 | 1.897.500 | 3.157.000 | 3.608.000 |
| VAN MAX | 2.200.000 | 3.658.600 | 4.202.000 |

Các giá trên chưa cộng Token. Chỉ tích hợp đăng ký mới cộng 550.000đ Token ở VAT 10% (540.000đ khi đổi VAT 8%); gia hạn và BHXH độc lập không cộng Token. Token không bị chiết khấu.

VAN 100 tích hợp gia hạn 33 tháng có giá 2.695.100đ theo ảnh gia hạn và xác nhận riêng của người dùng; khác 100đ so với phí đăng ký mới cùng kỳ. Đã sửa bản CSV. `bhxh-data.js` giữ giá điều chỉnh cục bộ cho đúng nhóm/kỳ này để giao diện vẫn đúng nếu Supabase còn trả về 2.695.000đ. Không sửa dữ liệu Supabase online trong lần cập nhật này và không đổi giá đăng ký mới.

## Trần chính sách theo địa bàn

Phần chiết khấu thu gọn thành Giá gốc / Áp dụng chiết khấu, mặc định Giá gốc. Chỉ bật Áp dụng chiết khấu mới hiện địa bàn, thanh kéo bước 5% và ghi chú Token. Bật không tự chọn mức giảm; dùng mức thủ công đang lưu, ban đầu 0%. Giá gốc ngừng áp dụng mọi mức giảm đang lưu vào giá và nội dung sao chép. Mở lại giữ mức chọn, giới hạn ngay theo địa bàn/loại gói; đổi nhóm độc lập/tích hợp hoặc chọn lại dịch vụ đặt lại Giá gốc và 0%.

| Địa bàn | BHXH độc lập | BHXH + VNPT-CA |
| --- | ---: | ---: |
| Hà Nội, Đà Nẵng, TP.HCM | 65% | 55% |
| Các địa bàn còn lại | 50% | 45% |

Trần tính chung khuyến mại, chiết khấu, chăm sóc khách hàng và thù lao đại lý theo ảnh chính sách. Giao diện chưa có khoản ưu đãi riêng khác để cộng dồn; thanh hiện tại dùng để chọn chiết khấu dịch vụ trong giới hạn trên.

Giao diện mặc định "Các địa bàn còn lại", chiết khấu 0%. Giữ cấu hình sẵn có: khi chọn dịch vụ BHXH, VAT mặc định 8%; muốn đối chiếu trực tiếp giá trong ảnh cần chọn VAT 10%. Đây là trạng thái bộ tính giá, không phải xác nhận điều kiện áp dụng thuế. Đổi địa bàn hoặc loại gói sang mức trần thấp hơn sẽ hạ mức giảm nếu cần. Phần hiển thị, công thức và nội dung sao chép cùng dùng mức đã giới hạn, kể cả trước khi watcher cập nhật thanh chọn. Nội dung sao chép có địa bàn, tỷ lệ giảm thực tế và giá Token nếu có.

Phí dịch vụ = làm tròn(`giá gốc VAT 10% × (100 + VAT chọn) × (100 − chiết khấu hợp lệ) / 11000`) đến đồng. Tổng thanh toán = phí dịch vụ đã giảm + nguyên giá Token nếu có. Không làm tròn trung gian sau đổi VAT rồi mới chiết khấu. Kỳ tích hợp chỉ có 18/33/48 tháng theo ảnh; không thêm kỳ 60 tháng.
