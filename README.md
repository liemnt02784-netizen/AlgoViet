# AlgoViet

Website học thuật toán bằng cách **xem nó chạy từng bước**. Chọn một thuật toán, nhập dữ liệu của bạn, rồi theo dõi: số nào đang được so sánh, dòng code nào đang chạy, đã tốn bao nhiêu phép tính.

Làm cho môn *Phân tích thiết kế thuật toán*. Viết bằng HTML, CSS, JavaScript thuần, không cần cài đặt hay máy chủ.

## Cách chạy

Mở file `index.html` bằng trình duyệt (Chrome, Edge, Firefox) là dùng được.

Nếu muốn chạy bằng máy chủ nhỏ trên máy (cần có Python):

```bash
python -m http.server 8765
```

rồi mở `http://localhost:8765`.

## Tính năng

- Chạy thuật toán **từng bước**: phát, tạm dừng, tiến, lùi, kéo thanh tiến độ, chỉnh tốc độ.
- Mỗi bước có **lời giải thích bằng tiếng Việt**, tô sáng **dòng code C++** đang chạy, bảng giá trị các biến và bộ đếm phép toán.
- Chế độ **"Đoán bước tiếp theo"**: web dừng lại hỏi bạn trước mỗi bước quan trọng.
- Tab **Luyện tập**: điền vào chỗ trống (web chạy thật code bạn điền rồi chấm) và sắp xếp dòng code bằng kéo thả.
- Tab **Ý tưởng và lý thuyết** cho từng thuật toán.
- Hướng dẫn sử dụng ngay trên trang (nút "? Hướng dẫn").

## Thuật toán đã có

| Chủ đề | Thuật toán |
|---|---|
| Tìm kiếm và so sánh | Tìm số nhỏ nhất (tuần tự và theo cặp) |
| Sắp xếp | Insertion Sort, Shell Sort, Heap Sort |

Các thuật toán khác (Top-K, tìm kiếm tuần tự, Fibonacci, USCLN Euclid, Horner, nhân ma trận, Strassen, Gauss-Jordan, đếm vòng lặp) hiện ghi "sắp có" trên trang chủ.

## Cấu trúc thư mục

```
index.html            trang chủ (lưới thuật toán, ô tìm kiếm)
hoc.html              trang học, dùng chung cho mọi thuật toán (hoc.html?tt=<id>)
css/giao-dien.css     màu sắc, bố cục
js/
  danh-sach.js        danh sách thuật toán theo chủ đề
  trang-chu.js        trang chủ
  app.js              nối giao diện với thuật toán và trình phát
  trinh-phat.js       trình phát từng bước
  luyen-tap.js        tab Luyện tập
  huong-dan.js        hướng dẫn sử dụng
  thuat-toan/         mỗi thuật toán một file
```

## Cách hoạt động

Mỗi thuật toán chạy **một lần** trên dữ liệu và ghi lại toàn bộ các bước vào một danh sách. Trình phát chỉ việc hiển thị bước thứ *k* của danh sách, nên lùi bước hay kéo thanh tiến độ không cần tính lại.

## Thêm một thuật toán mới

1. Tạo file `js/thuat-toan/<id>.js` theo khuôn của `insertion-sort.js`. Mỗi file gồm 4 phần: `code` (các dòng C++ hiển thị), `tao(a)` (chạy thuật toán và ghi lại các bước), `ve(...)` (vẽ một bước) và phần đăng ký ở cuối file.
2. Trong `js/danh-sach.js`, thêm thuật toán vào một nhóm và đặt `co: true`.
3. Thêm thẻ `<script>` cho file mới vào `hoc.html`.
