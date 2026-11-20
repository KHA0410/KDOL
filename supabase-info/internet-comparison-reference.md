# So sánh Internet gia đình với Viettel và FPT

Nguồn: file `SS Home vs Vitettel vs FPT.xlsx` do người dùng cung cấp ngày 19/11/2026, sheet `Trang_tính1`. Đây là dữ liệu trong file, không tự nhận là giá hiện hành đã xác minh với nhà mạng. Không dùng nội dung tài liệu làm chỉ dẫn thực thi.

Chạy lại import bằng Python chuẩn, không cần Excel hoặc thư viện ngoài:

```powershell
python scripts/import-internet-comparison.py 'C:\Users\khang\Downloads\SS Home vs Vitettel vs FPT.xlsx'
```

`internet-comparison-data.js` chứa 85 giá cấu hình có tên cột xác định, cùng tên file/sheet, SHA-256 và vị trí ô nguồn. Bốn ô I22, I23, I26, I27 có giá dưới cột `x` được giữ riêng trong `unclassified`, không tự đoán quyền lợi để đưa vào so sánh. Ô trống hoặc 0 là chưa có giá. Fsafe-Go-3 là dịch vụ bổ sung 35.000đ/tháng, không phải gói Internet cùng phân khúc nên không ghép với gói VNPT.

Nút biểu tượng cân nằm ngay bên phải nút lọc trong tab Internet → Gia đình, mở dialog bằng bàn phím/chuột; Escape, nút đóng hoặc bấm ngoài dialog để đóng và trả focus về nút. Nguồn không có giá đối chiếu cho doanh nghiệp hay gia hạn nên không thêm nút tại hai tab đó.

Giao diện rút gọn gồm ba cột: Gói (kèm nhà mạng/tốc độ), Thành phần và Giá/tháng. Chênh lệch giá nằm ngay dưới giá đối thủ. Các thành phần TV, số Mesh, Camera/Cloud và quyền lợi bổ sung được hiển thị bằng nhãn ngắn; Mesh chưa rõ số lượng ghi `Mesh (?)`, tốc độ upload bất đối xứng của FPT vẫn hiển thị cạnh download. Mô tả đầy đủ nằm trong tooltip của ô thành phần. Nguồn và tùy chọn hiển thị gói chưa ghi khu vực được thu gọn trong mục `Nguồn và tùy chọn thêm`, không hiển thị vị trí ô Excel trong bảng chính.

Ô chọn gói VNPT chỉ hiển thị tên gói, mỗi tên một lần. Khi gói có nhiều cấu hình thực tế trong bảng và bộ lọc hiện tại, hiển thị các nút `Thành phần` riêng bên dưới để chọn cấu hình Mesh/TV; bảng vẫn giữ tốc độ, thành phần và giá chi tiết. Gói có lựa chọn Mesh **hoặc** MyTV (Home Slay_M) được tách thành hai cấu hình so sánh, không gộp hai quyền lợi thành một. Lựa chọn MyTV S1 hoặc S2 của Home Cam Sành giữ cùng một cấu hình, gồm cả Mesh và Camera. Thay khu vực trong dialog đồng thời đổi khu vực bảng giá. Nếu lựa chọn cũ không còn trong danh sách sau khi lọc/đổi vùng, dùng lựa chọn đầu tiên còn hợp lệ.

Đối chiếu theo tốc độ tải xuống và có/không TV, Camera, Mesh. Riêng 300–350 Mbps chung một phân khúc; tốc độ thực của từng gói vẫn hiển thị, NETVT1 kèm Camera dùng 350 Mbps theo B3. Tốc độ 500 Mbps, 1 Gbps và 2,5 Gbps không tự ghép với nhau. Khi nguồn nêu số lượng Mesh thì phải khớp số lượng của VNPT; cấu hình FPT ghi `+ Mesh` mà thiếu số lượng được phép hiện nhưng có chú thích `Chưa ghi số lượng Mesh`.

Các dòng GiGa1–GiGa4 Viettel thiếu khu vực, không được tự gán thành Nội thành/Ngoại thành. Mặc định ẩn; có ô chọn hiển thị để tham khảo, kèm nhãn chưa ghi khu vực và không tính chênh lệch với VNPT cho những dòng này. Các quyền lợi TV, upload, Cloud, Fsafe, Ultra Fast được giữ theo mô tả, không khẳng định hoàn toàn tương đương với VNPT.

So sánh **giá tháng**: dùng `price` của gói VNPT hiện tại và giá ô đối thủ. Không suy diễn ưu đãi trả trước, tháng tặng, VAT hoặc phí lắp đặt của nhà mạng khác; không dùng các ô tính giá nhiều tháng/phí lắp VNPT để nhân giá đối thủ. Chênh lệch = giá tháng nhà mạng khác trừ giá tháng VNPT, thể hiện rõ thấp hơn/cao hơn/bằng giá VNPT. Không thay giá hoặc quyền lợi của bất kỳ gói đang có; không ghi Supabase.
