# Hệ thống trích xuất nội dung trang web

> Hệ thống dùng backend là .NET 8 để để xử lý yêu cầu phía server và frontend là ReactJS để làm phần giao diện. Cho phép người dùng xem được thông tin hệ thoogn sgoomf thông tin CPU Ram ổ cúng của server 

##  Yêu cầu môi trường

Để chạy được dự án cần cài đặt sẵn trên máy:

- [.NET SDK 8.0](https://dotnet.microsoft.com/download)
- [Node.js 22+](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

##  Hướng dẫn chạy dự án

### Backend (`/be` folder)

1 **Clone** dự án về máy:
   ```bash
   git clone https://github.com/vudinhdangkhoa/HienThitaiNguyen
   ```
2 Mở thư mục `be` bằng Visual Studio Code.

3 Mở terminal tại thư mục `be` và chạy lệnh sau:
   ```bash
   dotnet watch run --no-hot-reload
   ```
4 Sau khi chạy thành công, trình duyệt sẽ mở giao diện Swagger UI của Web API để kiểm thử các endpoint.

### Frontend (`/fe` folder)
1 Mở một cửa sổ VS Code mới và mở thư mục fe.

2 Mở terminal (chế độ Command Prompt - CMD) và chạy lệnh:
  ```bash
  npm i
```
để cài đặt các dependencies.

3 Tiếp theo, chạy:
  ```bash
  npm start
  ```
để khởi động frontend. Ứng dụng web sẽ được mở trong trình duyệt mặc định .
