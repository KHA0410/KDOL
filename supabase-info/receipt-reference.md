# Biên lai điện tử

Nguồn: ảnh bảng phí dịch vụ biên lai điện tử và ghi chú do người dùng cung cấp. Phí chưa gồm VAT 10%; cấu hình giao diện mặc định VAT 8% theo yêu cầu trước đó, có thể đổi 10%.

| Gói | Số biên lai/gói | Giá chưa VAT |
| --- | ---: | ---: |
| BL300 | 300 | 300.000đ |
| BL500 | 500 | 420.000đ |
| BL1.000 | 1.000 | 670.000đ |
| BL2.000 | 2.000 | 1.000.000đ |
| BL5.000 | 5.000 | 2.150.000đ |
| BL10.000 | 10.000 | 3.600.000đ |
| Trên 10.000 biên lai | Số lượng thực tế | Số lượng × 300đ |

Đúng 10.000 dùng BL10.000. Số lượng tùy nhập phải nguyên và từ 10.001, theo ghi chú nguồn. Giá đã bao gồm lưu trữ mỗi biên lai trong 10 năm kể từ ngày phát hành.

Người dùng bổ sung: biên lai điện tử dùng cùng phần mềm với Invoice. Khi **chưa có** phần mềm, thu khởi tạo **1.000.000đ chưa VAT**, một lần cho gói đang báo giá; đã có phần mềm thì không thu. Giao diện có hai nút Chưa có / Đã có, mặc định Chưa có khi mở hoặc chọn lại dịch vụ. Phí đã VAT hiển thị riêng trên từng dòng và trong báo giá sao chép. Chiết khấu dịch vụ không giảm phí khởi tạo; không tự áp mức miễn/giảm khởi tạo của Invoice sang biên lai.

Theo chỉ định người dùng, chiết khấu tối đa 30%, chưa có điều kiện khách hàng hoặc số lượng riêng. Thanh kéo bước 5%, mặc định 0%; công thức cũng giới hạn trong 0–30%. Tổng thanh toán = làm tròn đến đồng của `(giá gói chưa VAT × (100 − chiết khấu) + phí khởi tạo chưa VAT × 100) × (100 + VAT) / 10000`. Báo giá sao chép dùng cùng tổng, VAT và mức giảm thực tế, kèm số lượng và lưu trữ 10 năm.

Ví dụ đã có phần mềm, VAT 8%: BL300 giá gốc 324.000đ; giảm 30% còn 226.800đ. Nếu chưa có phần mềm, cộng 1.080.000đ khởi tạo đã VAT: tương ứng 1.404.000đ và 1.306.800đ. 10.001 biên lai, đã có phần mềm, giá chưa VAT 3.000.300đ; giảm 5%, VAT 8%, thanh toán 3.078.308đ.

Danh mục và giá cục bộ nằm trong `receipt-data.js`. Dịch vụ `bienlai` được thêm vào CNTT nếu máy chủ chưa có mã này, sau eContract theo `sort_order: 5`. Phần số lượng trên 10.000 nằm cuối cùng trong bảng, không tách tab. Nhập sai không hiện tổng hoặc cho sao chép dòng tùy nhập; sáu gói cố định vẫn tra được. Chọn lại dịch vụ đặt lại VAT 8%, chiết khấu 0% và xóa số lượng tùy nhập. Không cập nhật Supabase online hoặc thay số dòng CSV xuất.
