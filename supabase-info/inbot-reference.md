# Bảng giá VNPT Invoice-Inbot

Nguồn: ảnh bảng giá người dùng cung cấp trong cuộc trò chuyện. Các giá **chưa gồm VAT 10%**; không chia giá gốc cho 1,10 khi áp dụng VAT khác.

| Tên gói đúng theo văn bản | Số HĐ đầu vào | Đơn giá/HĐ | Giá gói |
| --- | ---: | ---: | ---: |
| VNPT Invoice-Inbot_300 | 300 | 1.050 | 315.000 |
| VNPT Invoice-Inbot_500 | 500 | 900 | 450.000 |
| VNPT Invoice-Inbot_1000 | 1.000 | 540 | 540.000 |
| VNPT Invoice-Inbot_2000 | 2.000 | 495 | 990.000 |
| VNPT Invoice-Inbot_5000 | 5.000 | 450 | 2.250.000 |
| VNPT Invoice-Inbot_10000 | 10.000 | 400 | 4.000.000 |
| VNPT Invoice-Inbot_MAX | Trên 10.000 | 350 | Số lượng × 350 |

Phí cài đặt/khởi tạo gốc: 300.000đ/lần, chưa VAT, áp dụng khi đăng ký mới. Phí này cộng một lần, không nhân theo số hóa đơn; gia hạn không cộng. Khi chưa áp dụng chiết khấu khởi tạo, VAT 10% cho phí 330.000đ; VAT 8% cho 324.000đ. Mức giảm bị giới hạn theo doanh thu sau giảm giá gói như chính sách bên dưới; không có lựa chọn miễn phí vô điều kiện.

`inbot-data.js` là bảng giá dùng trên giao diện, cập nhật đủ sáu gói và xếp theo số lượng tăng dần. Tên gói trên giao diện, trong CSV và nội dung sao chép giữ đầy đủ `VNPT Invoice-Inbot_...` đúng văn bản, không viết tắt `IB` hoặc thêm dấu chấm vào phần số của tên. Các giá và ghi chú của `inbot_goi` trong CSV đã được sửa; bổ sung bản ghi VNPT Invoice-Inbot_300. Giao diện dùng cấu hình cục bộ để không hiển thị lại năm gói/giá cũ khi Supabase chưa cập nhật. Chưa ghi thay đổi lên Supabase online.

Đơn giá MAX và phí khởi tạo cùng lấy từ cấu hình cho cả phần hiển thị, tính tổng và sao chép báo giá. Không cộng lại đơn giá vào giá gói đã có. Chính sách chiết khấu bổ sung được ràng buộc cho từng gói ở cả giá hiển thị và nội dung sao chép.

Gói MAX đặt ngay dưới bảng sáu gói cố định, không có tab riêng. Khối MAX có ô nhập số lượng trên 10.000 HĐ, đơn giá 350đ/HĐ và nút sao chép báo giá sau khi nhập số lượng. Cả bảng cố định và MAX dùng chung các lựa chọn đăng ký mới/gia hạn, VAT, phí khởi tạo và chiết khấu ở phía trên.

Ví dụ không chiết khấu, VAT 10%, đăng ký mới có thu khởi tạo: VNPT Invoice-Inbot_300 thanh toán (315.000 + 300.000) × 1,10 = 676.500đ; VNPT Invoice-Inbot_MAX 15.000 HĐ thanh toán (15.000 × 350 + 300.000) × 1,10 = 6.105.000đ.

## Chiết khấu giá gói dịch vụ

Nguồn: ảnh chính sách Inbot người dùng cung cấp bổ sung, gồm giá cước khởi tạo/cài đặt và giá cước gói dịch vụ.

| Điều kiện | Tối đa |
| --- | ---: |
| Khách hàng hiện hữu còn lại của VNPT hoặc đăng ký dưới 5.000 HĐ | 20% |
| KH đang dùng dịch vụ VNPT, doanh thu bình quân từ 10 đến dưới 30 triệu đồng/tháng hoặc đăng ký từ 5.000 đến dưới 10.000 HĐ | 30% |
| Cạnh tranh giá đối thủ hoặc KH đang dùng dịch vụ VNPT có doanh thu bình quân từ 30 triệu đồng/tháng hoặc đăng ký từ 10.000 HĐ | 40% |

Các điều kiện nối bằng "hoặc", không cộng dồn. Chọn trần cao nhất giữa số hóa đơn và điều kiện khách hàng đã chọn. Ảnh lặp điều kiện cạnh tranh giá ở dòng 30% và 40%; dùng trần cao nhất 40%, vẫn có thể chọn giảm thấp hơn trong phần tùy chỉnh. Doanh thu dịch vụ VNPT là điều kiện người tư vấn xác nhận, ứng dụng chưa có dữ liệu khách hàng để kiểm chứng.

## Chiết khấu cước khởi tạo/cài đặt

| Doanh thu gói sau chiết khấu thương mại, chưa VAT | Giảm khởi tạo tối đa |
| --- | ---: |
| Trên 500.000đ | 100% |
| Từ 500.000đ trở xuống, gồm đúng 500.000đ | 50% |

Doanh thu dùng giá gói chưa VAT sau khi áp dụng mức giảm hợp lệ. Không cộng VAT hoặc phí khởi tạo vào doanh thu để xét ngưỡng; không làm tròn doanh thu trước khi so sánh. Nếu đổi mức giảm giá gói làm doanh thu giảm xuống 500.000đ hoặc thấp hơn, mức miễn/giảm khởi tạo tự bị chặn lại ở 50%, kể cả khi trước đó đã chọn 100%.

Ví dụ VNPT Invoice-Inbot_1000 có giá gốc 540.000đ: nếu không giảm giá gói, doanh thu trên 500.000đ nên được giảm khởi tạo tối đa 100%; nếu giảm giá gói 20%, doanh thu còn 432.000đ, chỉ được giảm khởi tạo tối đa 50%. Không tự chọn phương án có tổng tiền thấp nhất; người tư vấn có thể chọn mức giảm giá gói thấp hơn khi cần.

## Giao diện và cách tính

Mặc định giá gốc cho cả gói dịch vụ và khởi tạo. Hai lựa chọn "Áp dụng chiết khấu" riêng cho gói và khởi tạo tự áp dụng mức tối đa hợp lệ từng dòng. "Tùy chỉnh chiết khấu" mặc định thu gọn, có điều kiện khách hàng, mức giảm giá gói và thanh giảm khởi tạo; mọi mức chọn thủ công đều bị giới hạn trong công thức. Mức đang chọn và điều kiện riêng vẫn hiện tóm tắt khi đóng phần tùy chỉnh.

Gói MAX vẫn nằm cuối bảng, chỉ nhận số hóa đơn nguyên lớn hơn 10.000 và giá trị gói trong giới hạn số nguyên an toàn. Dòng phí khởi tạo cho biết giá sau VAT và mức giảm thực tế, kể cả khi được giảm 100% còn 0đ. Báo giá sao chép giữ đúng tên gói trong văn bản, giá cuối, mức giảm giá gói, điều kiện và mức giảm khởi tạo. Gia hạn không tính phí khởi tạo.

Tổng tiền = làm tròn đến đồng của `(giá gói × (100 − giảm gói) + phí khởi tạo gốc × (100 − giảm khởi tạo)) × (100 + VAT) / 10000`; phí khởi tạo gốc bằng 0 khi gia hạn. Không làm tròn trung gian trước khi tính tổng hoặc xét ngưỡng. Khi chọn lại dịch vụ Hóa đơn hoặc đổi tab chính, chiết khấu trở về giá gốc, điều kiện theo số hóa đơn.
