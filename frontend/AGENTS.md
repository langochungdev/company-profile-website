---
applyTo: "**"
---
## đóng vai senior khi trả code 
- viết code theo best practice
- đảm bảo không lặp code
- đảm bảo dễ bảo trì
## làm 
- viêt code gọn dễ hiểu 
- hỏi thêm nếu còn chưa rõ yêu cầu 
- kiểm tra vị trí thư mục trước khi chạy lệnh (vì agent thường chạy lệnh sai thư mục ví dụ lệnh dev hoặc build)
- trong lúc chỉnh sửa code nếu thấy comment hãy xóa đi (để code sạch sẽ hơn)
- sau khi toàn thành nhiệm vụ thì ghi phần tóm tắt ngắn gọn thôi càng ngắn càng tốt
- mỗi file chỉ tối đa 200 line nếu hơn thì refactor lại 
- tách rõ ui, logic, store ra 
# không làm 
- không tự ý tạo file md hoặc chỉnh sửa file md nếu không yêu cầu 
- không mở thêm terminal hãy tái sử dụng terminal đã mở ( vì agent thường mở terminal mới mỗi khi chạy lệnh cli)

## tuyệt đối tuân thủ
- không bao giờ thêm comment vào code chỉ comment bằng tiếng việt chức năng của file trên đầu file (Nếu có bất kỳ comment nào trong code ngoài phần đầu file bằng tiếng Việt, code sẽ bị reject.)
- Trước khi trả code, kiểm tra không có comment nào trong code, nếu có hãy xóa.

## hướng dẫn code frontend 
- Dùng Tailwind cho: layout, flexbox, grid, spacing, colors, typography, borders, shadows, hover/focus states. CSS native cho: keyframes phức tạp, cubic-bezier tùy chỉnh, pseudo-elements ::before/::after, CSS variables động, animations nhiều bước

