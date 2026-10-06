// =====================================================================
// TRANG CHỦ: hiển thị lưới các thuật toán và ô tìm kiếm
// Dữ liệu lấy từ danh-sach.js (AlgoViet.danhSach).
// =====================================================================
(function () {   // (hàm bọc ngoài chạy ngay: để tên biến trong file không đụng file khác)

  var AV = window.AlgoViet;
  var khung = document.getElementById("danh-sach-nhom");

  // Bỏ dấu tiếng Việt và đổi thành chữ thường, để gõ "cay" cũng tìm ra "cây"
  function boDau(s) {
    return s.normalize("NFD")                      // tách dấu ra khỏi chữ cái
            .replace(/[̀-ͯ]/g, "")       // xóa các dấu
            .replace(/đ/g, "d").replace(/Đ/g, "D")
            .toLowerCase();
  }

  // Vẽ lưới thẻ. Chỉ hiện các thuật toán khớp với từ khóa (từ khóa rỗng thì hiện hết).
  function ve(tuKhoa) {
    var k = boDau(tuKhoa || "");
    var tong = 0;          // tổng số thuật toán tìm thấy
    var html = "";

    for (var g = 0; g < AV.danhSach.length; g++) {
      var nhom = AV.danhSach[g];

      // Lọc các thuật toán của nhóm này theo từ khóa
      var muc = [];
      for (var m = 0; m < nhom.muc.length; m++) {
        var thuatToan = nhom.muc[m];
        var vanBan = boDau(thuatToan.ten + " " + thuatToan.moTa + " " + nhom.nhom);
        if (!k || vanBan.indexOf(k) !== -1) muc.push(thuatToan);
      }
      tong += muc.length;
      if (muc.length === 0) continue;    // nhóm không có thuật toán nào khớp thì bỏ qua

      html += '<h2 class="ten-nhom">' + nhom.nhom + '</h2><div class="luoi-the">';
      for (var j = 0; j < muc.length; j++) {
        var t = muc[j];
        var lop = t.co ? "" : "chua-co";
        var thuocTinh = t.co ? 'href="hoc.html?tt=' + t.id + '"' : 'aria-disabled="true"';
        var nhanCuoi = t.co ? '<span class="vao-hoc">Học ngay →</span>' : '<span class="sap-co-nhan">Sắp có</span>';
        html += '<a class="the-thuat-toan ' + lop + '" ' + thuocTinh + ">" +
                  '<div class="hinh-the">' + AV.hinhNhom[nhom.hinh] + "</div>" +
                  "<h3>" + t.ten + "</h3>" +
                  "<p>" + t.moTa + "</p>" +
                  '<div class="nhan-the"><span class="huy-hieu">' + t.doPhucTap + '</span><span class="do-kho">' + t.doKho + "</span>" + nhanCuoi + "</div>" +
                "</a>";
      }
      html += "</div>";
    }

    khung.innerHTML = html;
    document.getElementById("khong-thay").hidden = tong > 0;   // không thấy gì thì hiện thông báo
  }

  // Mỗi lần gõ vào ô tìm kiếm thì vẽ lại lưới
  document.getElementById("tim").addEventListener("input", function () {
    ve(document.getElementById("tim").value);
  });

  ve("");   // lúc mới mở trang: hiện tất cả
})();
