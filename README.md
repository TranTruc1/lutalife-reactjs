# LUTA LIFE – website (React + Vite + Tailwind)

Trang giới thiệu và bán sản phẩm hỗ trợ huyết áp – tim mạch cho cộng đồng người Việt tại Hoa Kỳ.

## Chạy trên máy

Yêu cầu Node.js 18 trở lên.

```bash
npm install
npm run dev      # chạy thử, mở URL Vite in ra
npm run build    # tạo bản phát hành trong dist/
npm run lint     # kiểm tra code
```

## Cấu trúc

| Đường dẫn | Nội dung |
|---|---|
| `src/App.jsx` | Định tuyến các trang |
| `src/components/` | Các khối giao diện (Navbar, Hero, sản phẩm, dịch vụ, form…) |
| `src/data/products.json` | Danh sách sản phẩm (giá, ảnh, mô tả) |
| `src/data/services.json` | Bài viết dịch vụ – mỗi bài có đường dẫn `/<slug>` |
| `public/` | Ảnh, logo, favicon |

Định dạng các khối nội dung bài viết (heading, paragraph, image, list, quote, gallery, video) xem trong `data.txt`.
Có thể soạn bài trực quan tại trang nội bộ `/ngungonzzxz` rồi chép JSON vào `services.json`.

## Đơn hàng và lịch hẹn

Form **Đặt lịch tư vấn** và **Đặt hàng** gửi thẳng vào Google Sheet qua Google Apps Script
(biến `SHEET_URL` trong `BookAnAppointment.jsx` và `ProductOrderForm.jsx`). Website không còn dùng backend riêng.

## Triển khai

Repo được kết nối với Vercel: mỗi lần `git push` lên nhánh `main`, Vercel tự build và cập nhật
https://lutalife-reactjs.vercel.app
