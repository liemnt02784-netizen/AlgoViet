// =====================================================================
// GIẢI THUẬT STRASSEN (nhân 2 ma trận 2x2 bằng 7 phép nhân thay vì 8)
// Cấu trúc file giống insertion-sort.js: code, tao(), ve(), đăng ký.
//
// Dãy số nhập vào được hiểu đặc biệt: 4 số ĐẦU là ma trận A (A11,A12,
// A21,A22), 4 số SAU là ma trận B (B11,B12,B21,B22) — giống hệt cách
// nhập của trang "Nhân ma trận".
// =====================================================================
(function () {
  window.AlgoViet = window.AlgoViet || { thuatToan: {} };

  var code = [
    "P1 = (A11+A22) * (B11+B22);", // 1
    "P2 = (A21+A22) * B11;",       // 2
    "P3 = A11 * (B12-B22);",       // 3
    "P4 = A22 * (B21-B11);",       // 4
    "P5 = (A11+A12) * B22;",       // 5
    "P6 = (A21-A11) * (B11+B12);", // 6
    "P7 = (A12-A22) * (B21+B22);", // 7
    "",                             // 8
    "C11 = P1 + P4 - P5 + P7;",    // 9
    "C12 = P3 + P5;",              // 10
    "C21 = P2 + P4;",              // 11
    "C22 = P1 + P3 - P2 + P6;"     // 12
  ];

  function tao(so) {
    var A11 = so[0], A12 = so[1], A21 = so[2], A22 = so[3];
    var B11 = so[4], B12 = so[5], B21 = so[6], B22 = so[7];
    var cacBuoc = [];
    var nhan = 0, gan = 0;
    var P = [null, null, null, null, null, null, null]; // P1..P7
    var C = [null, null, null, null]; // C11,C12,C21,C22

    function ghi(dong, giaiThich, bien, vuaDoi, hinh, cauHoi) {
      cacBuoc.push({
        dong: dong, giaiThich: giaiThich, bien: bien, vuaDoi: vuaDoi,
        dem: { soSanh: nhan, gan: gan }, hinh: hinh, cauHoi: cauHoi
      });
    }

    function chup(dangTinh, xong) {
      return {
        A: [A11, A12, A21, A22], B: [B11, B12, B21, B22],
        P: P.slice(), C: C.slice(), dangTinh: dangTinh, xong: xong
      };
    }

    P[0] = (A11 + A22) * (B11 + B22); nhan++; gan += 2;
    ghi(1, "P1 = (A11+A22) × (B11+B22) = (" + (A11+A22) + ") × (" + (B11+B22) + ") = " + P[0] + ".", {P1:P[0]}, ["P1"], chup(0, false), null);

    P[1] = (A21 + A22) * B11; nhan++; gan++;
    ghi(2, "P2 = (A21+A22) × B11 = (" + (A21+A22) + ") × " + B11 + " = " + P[1] + ".", {P2:P[1]}, ["P2"], chup(1, false), null);

    P[2] = A11 * (B12 - B22); nhan++; gan++;
    ghi(3, "P3 = A11 × (B12−B22) = " + A11 + " × (" + (B12-B22) + ") = " + P[2] + ".", {P3:P[2]}, ["P3"], chup(2, false), null);

    P[3] = A22 * (B21 - B11); nhan++; gan++;
    ghi(4, "P4 = A22 × (B21−B11) = " + A22 + " × (" + (B21-B11) + ") = " + P[3] + ".", {P4:P[3]}, ["P4"], chup(3, false), null);

    P[4] = (A11 + A12) * B22; nhan++; gan++;
    ghi(5, "P5 = (A11+A12) × B22 = (" + (A11+A12) + ") × " + B22 + " = " + P[4] + ".", {P5:P[4]}, ["P5"], chup(4, false), null);

    P[5] = (A21 - A11) * (B11 + B12); nhan++; gan += 2;
    ghi(6, "P6 = (A21−A11) × (B11+B12) = (" + (A21-A11) + ") × (" + (B11+B12) + ") = " + P[5] + ".", {P6:P[5]}, ["P6"], chup(5, false), null);

    P[6] = (A12 - A22) * (B21 + B22); nhan++; gan += 2;
    ghi(7, "P7 = (A12−A22) × (B21+B22) = (" + (A12-A22) + ") × (" + (B21+B22) + ") = " + P[6] + ".", {P7:P[6]}, ["P7"], chup(6, false), null);

    C[0] = P[0] + P[3] - P[4] + P[6]; gan += 3;
    ghi(9, "C11 = P1+P4−P5+P7 = (" + P[0] + ")+(" + P[3] + ")−(" + P[4] + ")+(" + P[6] + ") = " + C[0] + ".", {C11:C[0]}, ["C11"], chup(-1, false), null);

    C[1] = P[2] + P[4]; gan++;
    ghi(10, "C12 = P3+P5 = (" + P[2] + ")+(" + P[4] + ") = " + C[1] + ".", {C12:C[1]}, ["C12"], chup(-1, false), null);

    C[2] = P[1] + P[3]; gan++;
    ghi(11, "C21 = P2+P4 = (" + P[1] + ")+(" + P[3] + ") = " + C[2] + ".", {C21:C[2]}, ["C21"], chup(-1, false), null);

    C[3] = P[0] + P[2] - P[1] + P[5]; gan += 3;
    ghi(12, "C22 = P1+P3−P2+P6 = (" + P[0] + ")+(" + P[2] + ")−(" + P[1] + ")+(" + P[5] + ") = " + C[3] + ".", {C22:C[3]}, ["C22"], chup(-1, true), null);

    return cacBuoc;
  }

  function ve(sanKhau, h) {
    function oMang(gt, lop) {
      return '<div class="o-mang ' + (lop||"") + '"><b>' + gt + '</b></div>';
    }
    var html = "";
    html += '<p class="nhan-hang">Ma trận A</p><div class="hang-mang">' + oMang(h.A[0]) + oMang(h.A[1]) + '</div>' +
            '<div class="hang-mang">' + oMang(h.A[2]) + oMang(h.A[3]) + '</div>';
    html += '<p class="nhan-hang">Ma trận B</p><div class="hang-mang">' + oMang(h.B[0]) + oMang(h.B[1]) + '</div>' +
            '<div class="hang-mang">' + oMang(h.B[2]) + oMang(h.B[3]) + '</div>';

    html += '<p class="nhan-hang">P1 .. P7 (chỉ 7 phép nhân, thay vì 8)</p><div class="hang-mang">';
    for (var i = 0; i < 7; i++) {
      var gt = h.P[i] === null ? "·" : h.P[i];
      var lop = (i === h.dangTinh) ? "dang-xet" : (h.P[i] !== null ? "khoa" : "");
      html += '<div class="o-mang ' + lop + '"><b>' + gt + '</b><small>P' + (i+1) + '</small></div>';
    }
    html += '</div>';

    if (h.C[0] !== null) {
      html += '<p class="nhan-hang">Ma trận kết quả C</p>' +
        '<div class="hang-mang">' + oMang(h.C[0] === null ? "·" : h.C[0], h.xong ? "khoa" : "so-sanh") + oMang(h.C[1] === null ? "·" : h.C[1], h.xong ? "khoa" : "") + '</div>' +
        '<div class="hang-mang">' + oMang(h.C[2] === null ? "·" : h.C[2]) + oMang(h.C[3] === null ? "·" : h.C[3], h.xong ? "khoa" : "") + '</div>';
    }

    sanKhau.innerHTML = '<div class="khung-heap">' + html + '</div>';
  }

  var lyThuyet = `
    <h2>Ý tưởng</h2>
    <p class="vi-du-doi-thuong"><b>Vì sao cần Strassen?</b> Nhân ma trận thông thường tốn O(n³), chủ yếu vì số phép <b>nhân</b> rất nhiều (phép nhân tốn kém hơn phép cộng/trừ). Strassen dùng <b>chia để trị</b>: chia mỗi ma trận thành 4 khối, rồi tổ hợp khéo léo chỉ cần <b>7 phép nhân</b> thay vì 8 phép nhân như cách chia khối thông thường (đổi lại phải cộng/trừ nhiều hơn).</p>

    <h3>Công thức 7 phép nhân</h3>
    <p><code>P1..P7</code> được tính từ các tổ hợp cộng/trừ của A11,A12,A21,A22 và B11,B12,B21,B22 (xem code bên dưới). Sau đó ghép lại:</p>
    <p><code>C11=P1+P4−P5+P7</code>, <code>C12=P3+P5</code>, <code>C21=P2+P4</code>, <code>C22=P1+P3−P2+P6</code>.</p>

    <h3>Độ phức tạp</h3>
    <p>Áp dụng đệ quy liên tục trên các khối nhỏ hơn, độ phức tạp giảm từ O(n³) xuống <b>O(n^log₂7) ≈ O(n^2,81)</b>.</p>

    <h3>Lưu ý khi dùng trang này</h3>
    <p>Để dễ hình dung, trang này minh họa đúng 1 tầng công thức Strassen trên ma trận 2×2 (không đệ quy xuống khối nhỏ hơn nữa). Ô nhập "dãy số" giống hệt trang Nhân ma trận: <b>4 số đầu</b> là ma trận A, <b>4 số sau</b> là ma trận B.</p>`;

  window.AlgoViet.thuatToan["strassen"] = {
    ten: "Strassen",
    doPhucTap: "O(n^2,81)",
    lyThuyet: lyThuyet,
    viDu: [1, 2, 3, 4, 5, 6, 7, 8],
    gioiHan: { min: 1, max: 9, soLuongMax: 8, soLuongMin: 8 },
    ghiChuNhap: "4 số đầu = ma trận A, 4 số sau = ma trận B (mỗi số 1-9, đúng 8 số)",
    nhanDem: { soSanh: "phép nhân", gan: "phép cộng/trừ" },
    cachLam: {
      chiaKhoi: { ten: "Chia khối, 7 phép nhân", code: code, tao: tao, ve: ve }
    },
    chuThich: {
      chiaKhoi: [
        ["--tt-dang-xet", "P đang tính"],
        ["--tt-xong", "Đã tính xong"],
        ["--tt-so-sanh", "Ô C đang ghép từ P1..P7"]
      ]
    }
  };
})();
