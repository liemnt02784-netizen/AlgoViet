// Danh sách thuật toán của AlgoViet, chia theo chủ đề (không chia theo tuần học).
//   co: true  -> đã có trang học
//   không ghi co (hoặc co: false) -> hiện nhãn "sắp có"
//
// File này chỉ gán dữ liệu vào đối tượng chung window.AlgoViet để các file khác dùng.

window.AlgoViet = window.AlgoViet || { thuatToan: {} };

window.AlgoViet.danhSach = [
  {
    nhom: "Tìm kiếm và so sánh", hinh: "cot",
    muc: [
      { id: "tim-min", ten: "Tìm số nhỏ nhất", doPhucTap: "O(n)", doKho: "Dễ", co: true,
        moTa: "So sánh tuần tự hoặc chia cặp đấu loại để tìm phần tử nhỏ nhất." },
      { id: "top-k", ten: "Top-K phần tử lớn nhất", doPhucTap: "O(n·k)", doKho: "Vừa",
        moTa: "Ba cách: sắp xếp, chọn k lần và chèn dần vào nhóm top-k." },
      { id: "tim-kiem-tuan-tu", ten: "Tìm kiếm tuần tự", doPhucTap: "O(n)", doKho: "Dễ",
        moTa: "Duyệt từng phần tử, xem trường hợp tốt nhất, xấu nhất, trung bình." },
    ],
  },
  {
    nhom: "Sắp xếp", hinh: "cot",
    muc: [
      { id: "insertion-sort", ten: "Insertion Sort", doPhucTap: "O(n²)", doKho: "Dễ", co: true,
        moTa: "Chèn từng phần tử vào đúng chỗ, như xếp bài trên tay." },
      { id: "shell-sort", ten: "Shell Sort", doPhucTap: "O(n²)", doKho: "Vừa", co: true,
        moTa: "Insertion Sort nhưng cho các phần tử nhảy cóc theo khoảng cách d trước." },
      { id: "heap-sort", ten: "Heap Sort", doPhucTap: "O(n log n)", doKho: "Khó", co: true,
        moTa: "Dựng Max Heap (cây), rồi lần lượt đưa số lớn nhất về cuối dãy." },
    ],
  },
  {
    nhom: "Đệ quy", hinh: "cay",
    muc: [
      { id: "fibonacci", ten: "Fibonacci", doPhucTap: "O(2ⁿ) và O(n)", doKho: "Vừa",
        moTa: "Cây gọi hàm đệ quy cho thấy vì sao tính lại nhiều lần, so với vòng lặp." },
      { id: "uscln", ten: "USCLN Euclid", doPhucTap: "O(log n)", doKho: "Dễ",
        moTa: "Chia lấy dư liên tiếp, xem từng lời gọi đệ quy xếp chồng." },
    ],
  },
  {
    nhom: "Đa thức và ma trận", hinh: "luoi",
    muc: [
      { id: "horner", ten: "Đa thức và Horner", doPhucTap: "O(n)", doKho: "Dễ",
        moTa: "Tính giá trị đa thức, so sánh số phép nhân 2n − 1 với n." },
      { id: "nhan-ma-tran", ten: "Nhân ma trận", doPhucTap: "O(n³)", doKho: "Vừa",
        moTa: "Hàng nhân cột, điền dần từng ô của ma trận kết quả." },
      { id: "strassen", ten: "Strassen", doPhucTap: "O(n^2,81)", doKho: "Khó",
        moTa: "Chia khối, 7 phép nhân thay cho 8." },
      { id: "gauss-jordan", ten: "Gauss-Jordan", doPhucTap: "O(n³)", doKho: "Vừa",
        moTa: "Giải hệ phương trình bằng biến đổi hàng, từng bước một." },
    ],
  },
  {
    nhom: "Độ phức tạp", hinh: "duong-cong",
    muc: [
      { id: "dem-vong-lap", ten: "Đếm vòng lặp", doPhucTap: "O(1) đến O(n³)", doKho: "Dễ",
        moTa: "Đếm số lần câu lệnh chạy và suy ra độ phức tạp O()." },
    ],
  },
];

// Hình minh họa nhỏ cho mỗi nhóm (SVG, dùng màu xanh của giao diện)
window.AlgoViet.hinhNhom = {
  cot: '<svg viewBox="0 0 64 40" aria-hidden="true"><rect x="4" y="18" width="10" height="20" rx="2" fill="#CBD5E1"/><rect x="18" y="26" width="10" height="12" rx="2" fill="#F59E0B"/><rect x="32" y="6" width="10" height="32" rx="2" fill="#CBD5E1"/><rect x="46" y="14" width="10" height="24" rx="2" fill="#1565C0"/></svg>',
  cay: '<svg viewBox="0 0 64 40" aria-hidden="true"><path d="M32 8 L16 22 M32 8 L48 22 M16 22 L9 34 M16 22 L23 34" stroke="#90A4BE" stroke-width="2"/><circle cx="32" cy="8" r="5" fill="#1565C0"/><circle cx="16" cy="22" r="5" fill="#F59E0B"/><circle cx="48" cy="22" r="5" fill="#CBD5E1"/><circle cx="9" cy="34" r="4" fill="#CBD5E1"/><circle cx="23" cy="34" r="4" fill="#CBD5E1"/></svg>',
  luoi: '<svg viewBox="0 0 64 40" aria-hidden="true"><g fill="#CBD5E1"><rect x="10" y="4" width="10" height="9" rx="2"/><rect x="23" y="4" width="10" height="9" rx="2"/><rect x="36" y="4" width="10" height="9" rx="2"/><rect x="10" y="16" width="10" height="9" rx="2"/><rect x="36" y="16" width="10" height="9" rx="2"/><rect x="10" y="28" width="10" height="9" rx="2"/><rect x="23" y="28" width="10" height="9" rx="2"/></g><rect x="23" y="16" width="10" height="9" rx="2" fill="#1565C0"/><rect x="36" y="28" width="10" height="9" rx="2" fill="#16A34A"/></svg>',
  "duong-cong": '<svg viewBox="0 0 64 40" aria-hidden="true"><path d="M6 36 H58 M6 36 V4" stroke="#90A4BE" stroke-width="2"/><path d="M8 34 L56 26" stroke="#16A34A" stroke-width="2.5" fill="none"/><path d="M8 34 Q40 32 52 6" stroke="#1565C0" stroke-width="2.5" fill="none"/><path d="M8 34 Q24 33 30 4" stroke="#F59E0B" stroke-width="2.5" fill="none"/></svg>',
};

// Vẽ thanh bên trái (dùng chung cho trang học): từng nhóm, trong mỗi nhóm là các thuật toán.
//   khung        : thẻ HTML sẽ chứa thanh bên
//   idDangChon   : thuật toán đang học (được tô xanh)
window.AlgoViet.veThanhBen = function (khung, idDangChon) {
  var html = "";
  for (var g = 0; g < window.AlgoViet.danhSach.length; g++) {
    var nhom = window.AlgoViet.danhSach[g];
    html += "<h3>" + nhom.nhom + "</h3>";
    for (var m = 0; m < nhom.muc.length; m++) {
      var muc = nhom.muc[m];
      if (muc.co) {
        var lop = (muc.id === idDangChon) ? "dang-chon" : "";
        html += '<a href="hoc.html?tt=' + muc.id + '" class="' + lop + '">' + muc.ten + "</a>";
      } else {
        html += '<a class="sap-co" aria-disabled="true">' + muc.ten + " <small>sắp có</small></a>";
      }
    }
  }
  khung.innerHTML = html;
};
