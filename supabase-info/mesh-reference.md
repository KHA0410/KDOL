# Dữ liệu WiFi Mesh

Nguồn: ảnh `D:\MY VNPT\Mesh.jpg` và giá mua 699.000đ/thiết bị do người dùng cung cấp ngày 2026-11-11. Bản ảnh dùng để mở từ giao diện được lưu tại `assets/mesh/mesh.jpg`; cấu hình và giá nằm trong `mesh-data.js`.

## Danh mục và thiết bị

- Dịch vụ `mesh` (WiFi Mesh) thuộc `brcd` (Băng rộng cố định), thứ tự 4 sau Internet, MyTV và Camera. Khi Supabase chưa có dịch vụ này, `fetchData()` ghép cấu hình cục bộ vào danh sách trước khi lọc theo danh mục; không thêm bản trùng nếu server đã trả về ID `mesh`.
- Thiết bị theo ảnh: WiFi Mesh 6 EW302S, hỗ trợ tốc độ đến 3Gbps, băng tần 2.4GHz/5GHz, 1 cổng WAN 1Gbps + 1 cổng LAN 1Gbps, kết nối đồng thời tối đa 100 thiết bị. Phù hợp mở rộng vùng phủ cho nhà nhiều phòng/nhiều tầng.
- Giao diện có hai lựa chọn: tính giá nhanh Mesh add-on và tính giá mua thiết bị. Giá là văn bản, không bấm để sao chép.

## Mesh add-on

Giá đã bao gồm VAT theo ảnh. Thanh "Tính giá nhanh" có các nút 1 tháng, 3 tháng, 6 tháng, 12/13 tháng, cập nhật một cột giá theo kỳ đang chọn. Bảng chỉ còn ba cột Gói / Số Mesh / Giá kỳ chọn, bỏ độ rộng tối thiểu 620px để gọn trên điện thoại. Thanh chọn kỳ sticky giống các dịch vụ khác; mặc định 1 tháng, giữ kỳ khi đổi qua mua thiết bị rồi quay lại và đặt lại 1 tháng khi chọn lại dịch vụ Mesh.

Giá từng kỳ được lấy trực tiếp từ `prices` trong `mesh-data.js`, không nhân giá tháng để suy ra giá kỳ dài. Đặc biệt giá 12/13 tháng của Pack 2 trở lên khác giá tháng nhân 12. Không tự suy diễn chính sách tặng tháng. Bảng dưới đây giữ đầy đủ giá gốc làm tài liệu đối chiếu.

| Gói | Số Mesh | 1 tháng | 3 tháng | 6 tháng | 12/13 tháng |
| --- | ---: | ---: | ---: | ---: | ---: |
| Pack 1 | 1 | 30.000 | 90.000 | 180.000 | 360.000 |
| Pack 2 | 2 | 50.000 | 150.000 | 300.000 | 450.000 |
| Pack 3 | 3 | 75.000 | 225.000 | 450.000 | 675.000 |
| Pack 4 | 4 | 100.000 | 300.000 | 600.000 | 900.000 |
| Pack 5 | 5 | 120.000 | 360.000 | 720.000 | 1.080.000 |
| Pack 5* | 5 | 100.000 | 300.000 | 600.000 | 900.000 |
| Pack 6 | 6 | 140.000 | 420.000 | 840.000 | 1.260.000 |
| Pack 7 | 7 | 160.000 | 480.000 | 960.000 | 1.440.000 |
| Pack 8 | 8 | 180.000 | 540.000 | 1.080.000 | 1.620.000 |
| Pack 9 | 9 | 200.000 | 600.000 | 1.200.000 | 1.800.000 |
| Pack 10 | 10 | 220.000 | 660.000 | 1.320.000 | 1.980.000 |
| Pack 10* | 10 | 200.000 | 600.000 | 1.200.000 | 1.800.000 |

Pack 5* và Pack 10* áp dụng cho khách hàng doanh nghiệp, khách hàng cá nhân đăng ký theo dự án, sở ban ngành, cơ quan hành chính sự nghiệp, đúng chú thích ảnh. Hai dòng này được đánh dấu riêng trong bảng.

## Mua thiết bị

Giá mua theo xác nhận của người dùng: 699.000đ/thiết bị. Tổng tiền = số lượng thiết bị × 699.000đ, tính một lần, không theo tháng. Chỉ chấp nhận số lượng nguyên dương trong giới hạn số nguyên an toàn; ô rỗng, 0, âm hoặc số lẻ hiển thị yêu cầu nhập lại.

Giá mua này tách biệt với giá các Pack add-on. Không tự cộng VAT, phí lắp đặt Internet hoặc phí STB MyTV vào giá mua. Các dữ liệu hiện là cấu hình cục bộ, chưa ghi thêm vào Supabase hoặc thay đổi các bản CSV đã xuất.
