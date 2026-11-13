# VNPT eContract: SaaS, OnPremise và add-on

Nguồn: các ảnh triển khai, bảng giá khởi tạo/SaaS/OnPremise, dịch vụ cộng thêm và chính sách chiết khấu do người dùng cung cấp. Giá trong các bảng dưới đây chưa gồm VAT 10%. Giá và điều kiện cục bộ nằm trong `econtract-data.js`.

## SaaS trên hạ tầng VNPT

Khởi tạo: 2.000.000đ, gồm khảo sát, tư vấn và khởi tạo phần mềm. Không có miễn phí khởi tạo vô điều kiện; khi áp dụng chiết khấu, từng gói bị giới hạn theo chính sách bên dưới.

| Gói | Số hợp đồng | Lưu trữ kèm gói (MB) | Giá dịch vụ |
| --- | ---: | ---: | ---: |
| E50 | 50 | 250 | 350.000 |
| E100 | 100 | 500 | 650.000 |
| E200 | 200 | 1.000 | 1.200.000 |
| E500 | 500 | 2.500 | 2.900.000 |
| E1000 | 1.000 | 5.000 | 5.600.000 |
| E2000 | 2.000 | 10.000 | 10.800.000 |
| E5000 | 5.000 | 25.000 | 26.000.000 |
| Emax | Từ 10.000 | Số hợp đồng × 5 MB | Số hợp đồng × 5.000đ |

Bảy giá SaaS đã khớp CSV hiện có. Không sửa số lượng bản ghi CSV hoặc ghi lên Supabase. Giữ tên gói đúng bảng; Emax nhận số lượng nguyên từ đúng 10.000, đặt dưới bảng cố định.

## OnPremise trên hệ thống khách hàng

- Cước tư vấn, cài đặt, triển khai: 100.000.000đ.
- Cước sử dụng theo số hợp đồng: bằng 50% giá SaaS đã ban hành. Bảy gói tương ứng 175.000 / 325.000 / 600.000 / 1.450.000 / 2.800.000 / 5.400.000 / 13.000.000đ; Emax 2.500đ/HĐ.
- Cước sử dụng này không kèm lưu trữ trong gói. Chưa bao gồm chi phí/tối ưu trên hệ thống khác theo yêu cầu triển khai; ghi chú này có trên giao diện và bản sao chép báo giá.
- Theo phần chính sách được cung cấp, chiết khấu OnPremise áp dụng riêng cho cước tư vấn/cài đặt/triển khai theo điều kiện khách hàng. Không tự áp thêm chiết khấu SaaS theo số lượng lên giá sử dụng OnPremise đã bằng 50% giá SaaS.

Khách hàng chuẩn bị hạ tầng mạng/máy chủ theo tư vấn, đăng ký số hợp đồng và hình thức ký; VNPT khảo sát, lên phương án, triển khai, đào tạo và hướng dẫn sử dụng. Giao diện không tự ước lượng các khoản triển khai riêng chưa có giá.

## Hình thức ký và dịch vụ cộng thêm

Các add-on dưới đây dùng được cho cả SaaS và OnPremise, không bị chiết khấu theo tỷ lệ phần mềm/khởi tạo:

| Dịch vụ | Giá chưa VAT | Điều kiện |
| --- | ---: | --- |
| SMS OTP Brandname chung VNPT eContract / V.eContract | 800đ/tin | Nhập số tin nhắn |
| SMS OTP Brandname riêng doanh nghiệp | Theo chính sách SMS Brandname | Khi có số tin phải nhập đơn giá thực tế riêng; không tự lấy giá 800đ |
| VNPT eKYC-eContract | 3.000đ/lượt ký | OCR 2 mặt giấy tờ và Face Matching; tính cả lượt thành công và không thành công |
| 250MB-eContract | 90.000đ/gói 250 MB | Lưu trữ 10 năm |

VNPT-CA và VNPT SmartCA đã tích hợp vào hệ thống; khách hàng dùng USB Token hoặc ứng dụng SmartCA để ký. Cước chữ ký số/chứng thư theo dịch vụ tương ứng, không tự cộng vào giá phần mềm eContract.

### TSA CeCA

Nguồn bổ sung: ảnh bảng giá Add-on VNPT TSA và mục VI chính sách chiết khấu thương mại do người dùng cung cấp. TSA ký dấu thời gian lên hợp đồng điện tử truyền lên trục phát triển hợp đồng điện tử, dành cho khách hàng dùng hợp đồng điện tử VNPT. Đơn giá chưa VAT.

| Gói | Số lượt | Đơn giá/lượt | Giá gói |
| --- | ---: | ---: | ---: |
| TSA CeCA Min | Dưới 5.000 | 1.000đ | Số lượt × 1.000đ |
| TSA CeCA 5.000 | 5.000 | 900đ | 4.500.000đ |
| TSA CeCA 10.000 | 10.000 | 800đ | 8.000.000đ |
| TSA CeCA 20.000 | 20.000 | 700đ | 14.000.000đ |
| TSA CeCA 50.000 | 50.000 | 600đ | 30.000.000đ |
| TSA CeCA Max | Trên 50.000 | 500đ | Số lượt × 500đ |

Chiết khấu TSA tối đa **30%**, tách riêng khỏi chiết khấu phần mềm/khởi tạo. Cùng một mức chọn áp dụng khi tra TSA riêng hoặc kèm SaaS/OnPremise; mặc định 0%. Không giảm SMS, eKYC, lưu trữ theo tỷ lệ TSA và không giảm TSA thêm lần nữa theo phần mềm. Giá gói cố định và đơn giá Min/Max lấy từ cùng cấu hình `econtract-data.js`, không phụ thuộc giá TSA cũ trên máy chủ. Cả sáu lựa chọn có trong menu TSA kèm eContract.

Trường hợp vượt phân cấp: đơn vị gửi đề xuất kèm cơ sở về Phòng Điều hành để gửi Ban KHDN xem xét, hướng dẫn. Ứng dụng ghi chú quy trình này và giới hạn 30%, không tự áp ngoại lệ.

Min nhận số nguyên 1–4.999; Max từ 50.001. Bảng TSA riêng hiển thị chung sáu dòng: Min, bốn gói cố định, Max; không tách tab. Min và Max có ô nhập số lượt độc lập ngay trong dòng. Nhập sai chặn tổng tiền và sao chép của dòng đó; các dòng khác vẫn dùng được. Add-on và khởi tạo phần mềm không bị cộng vào báo giá TSA CeCA riêng. Tổng và nội dung sao chép sử dụng cùng mức giảm TSA, VAT và số lượt thực tế; TSA kèm phần mềm được mô tả riêng trong nội dung add-on.

Số lượng SMS/lượt eKYC/gói lưu trữ phải nguyên không âm. Không có đơn giá SMS riêng hoặc có số lượng không hợp lệ thì chặn tổng hoàn chỉnh và sao chép cho SaaS/OnPremise, kể cả Emax. Chọn CeCA riêng không bị ảnh hưởng bởi các giá trị add-on đang nhập ở tab phần mềm.

TSA kèm phần mềm là tùy chọn: Không kèm, hoặc chọn Min/Max nhưng để trống/0 lượt đều tính TSA 0đ và không chặn tổng các add-on khác. Không ghi TSA vào báo giá sao chép khi không sử dụng. Nếu nhập số lượt khác 0 thì vẫn kiểm tra số nguyên dương và giới hạn Min 1–4.999 / Max từ 50.001; gói cố định vẫn tính đúng giá khi được chọn. Quy tắc trống/0 này chỉ dành cho add-on, không thay giới hạn gói TSA tra riêng.

## Chiết khấu SaaS

| Điều kiện (nối bằng "hoặc") | Dịch vụ tối đa | Khởi tạo tối đa |
| --- | ---: | ---: |
| KH hiện hữu còn lại của VNPT hoặc dưới 2.000 hợp đồng | 10% | 10% |
| KH hiện hữu doanh thu từ 10 đến dưới 30 triệu đồng/tháng hoặc từ 2.000 hợp đồng | 20% | 50% |
| Cạnh tranh giá hoặc KH lớn hiện hữu doanh thu từ 30 triệu đồng/tháng hoặc từ 5.000 hợp đồng | 30% | 100% |

Lấy trần cao nhất trong các điều kiện thỏa mãn, không cộng dồn các tỷ lệ. Đúng 2.000 và 5.000 hợp đồng thuộc mức mới tương ứng. Mức giảm dịch vụ và khởi tạo được giới hạn riêng cho từng dòng và Emax.

## Chiết khấu cước triển khai OnPremise

| Điều kiện khách hàng | Tối đa |
| --- | ---: |
| KH hiện hữu còn lại của VNPT | 10% |
| KH hiện hữu doanh thu từ 10 đến dưới 30 triệu đồng/tháng | 20% |
| Cạnh tranh giá hoặc KH lớn hiện hữu doanh thu từ 30 triệu đồng/tháng | 30% |

Số hợp đồng không tự làm tăng trần giảm cước triển khai OnPremise. Khi chưa chọn điều kiện khách hàng riêng, trần này là 0%. Các điều kiện doanh thu/cạnh tranh giá do người tư vấn chọn; ứng dụng chưa có dữ liệu để xác minh.

## Giao diện và tổng tiền

Dịch vụ cộng thêm hiển thị thành bốn dòng gọn theo thứ tự SMS OTP / eKYC / TSA CeCA / Lưu trữ; đơn giá bên trái, ô số lượng bên phải. Brandname chỉ hiện khi có số SMS hoặc đang chọn loại riêng, tránh giấu cấu hình còn hiệu lực. Khi eKYC có số lượng, hiện nhắc tính cả lượt không thành công. TSA có menu chọn gói, số lượt Min/Max hiện khi cần, thanh chiết khấu nằm trong phần thu gọn riêng. Chú thích dài vào Thông tin dịch vụ; tổng add-on, mức giảm TSA đã chọn và lỗi nhập vẫn hiện bên ngoài. Tổng add-on căn phải toàn khung, số tiền lớn và đậm hơn. Cách tính và điều kiện giá không đổi.

Khi nhập số lượng dương hợp lệ, từng dòng hiện Thành tiền chưa VAT: SMS = số tin × đơn giá Brandname đang chọn; eKYC = số lượt × 3.000đ; lưu trữ = số gói × 90.000đ; TSA dùng giá sau chiết khấu TSA. `econtractAddonSubtotals` là nguồn chung cho giá từng dòng và tổng add-on. Số lượng không hợp lệ, đơn giá SMS riêng còn thiếu hoặc phép tính vượt giới hạn số nguyên an toàn thì dòng đó trả về null, không hiện thành tiền gây nhầm lẫn và không cho chốt tổng hoàn chỉnh. Số lượng 0 không phát sinh phí kể cả khi chưa nhập đơn giá riêng. Giá từng dòng chưa VAT nên giữ nguyên khi đổi VAT; tổng thanh toán tính VAT theo lựa chọn hiện có.

Ba lựa chọn triển khai: SaaS / OnPremise / TSA CeCA. SaaS và OnPremise có "Giá gốc / Áp dụng chiết khấu", mặc định giá gốc; điều kiện khách hàng và mức giảm thấp hơn nằm trong phần tùy chỉnh thu gọn. Phần dịch vụ cộng thêm cũng thu gọn, tổng add-on, mức giảm TSA hoặc lỗi nhập luôn được nhắc bên ngoài khi cần. Đổi hình thức đặt lại chiết khấu phần mềm và điều kiện khách hàng, giữ mức giảm TSA đã chọn; chọn lại dịch vụ đặt lại cả chiết khấu TSA, số lượng add-on/Emax và đơn giá SMS riêng.

Tổng phần mềm = làm tròn đến đồng của `(giá sử dụng × (100 − giảm dịch vụ) + khởi tạo/triển khai × (100 − giảm khởi tạo) + add-on × 100) × (100 + VAT) / 10000`. Mọi giá gốc chưa VAT; chọn VAT 8% nhân 1,08, chọn VAT 10% nhân 1,10. Không làm tròn ở các bước trung gian.

Ví dụ không add-on, VAT 10%: E50 SaaS giá gốc thanh toán (350.000 + 2.000.000) × 1,10 = 2.585.000đ. E5000 OnPremise khi khách đủ điều kiện cạnh tranh giá: dịch vụ 13.000.000đ, triển khai giảm 30% còn 70.000.000đ, tổng 91.300.000đ.

Giá hiển thị, Emax và báo giá sao chép dùng cùng công thức, tỷ lệ thực tế và phạm vi đã tính; không có nút bỏ phí khởi tạo vượt chính sách. Các dữ liệu OnPremise/add-on/chính sách mới là cấu hình cục bộ, chưa cập nhật Supabase online.
