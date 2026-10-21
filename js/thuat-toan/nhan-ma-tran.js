// =====================================================================
// NHÂN MA TRẬN (minh họa cố định 2 ma trận vuông 2x2)
// Cấu trúc file giống insertion-sort.js: code, tao(), ve(), đăng ký.
//
// Dãy số nhập vào được hiểu đặc biệt: 4 số ĐẦU là ma trận A (hàng 1,
// hàng 2), 4 số SAU là ma trận B. Ví dụ "1 2 3 4 5 6 7 8" nghĩa là
// A = [[1,2],[3,4]], B = [[5,6],[7,8]].
// =====================================================================
(function () {
  window.AlgoViet = window.AlgoViet || { thuatToan: {} };

  var code = [
    "for (int i = 0; i < n; i++)",            // 1
    "  for (int j = 0; j < n; j++) {",        // 2
    "    R[i][j] = 0;",                       // 3
    "    for (int k = 0; k < n; k++)",        // 4
    "      R[i][j] += A[i][k] * B[k][j];",    // 5
    "  }"                                     // 6
  ];

  function tao(so) {
    var n = 2;
    var A = [[so[0], so[1]], [so[2], so[3]]];
    var B = [[so[4], so[5]], [so[6], so[7]]];
    var R = [[0, 0], [0, 0]];
    var cacBuoc = [];
    var nhan = 0, gan = 0;

    function ghi(dong, giaiThich, bien, vuaDoi, hinh, cauHoi) {
      cacBuoc.push({
        dong: dong, giaiThich: giaiThich, bien: bien, vuaDoi: vuaDoi,
        dem: { soSanh: nhan, gan: gan }, hinh: hinh, cauHoi: cauHoi
      });
    }

    // i,j: ô R[i][j] đang tính; k: chỉ số đang nhân (-1 nếu chưa nhân)
    function chup(i, j, k, xong) {
      return { A: A, B: B, R: R.map(function (r) { return r.slice(); }), i: i, j: j, k: k, xong: xong };
    }

    for (var i = 0; i < n; i++) {
      for (var j = 0; j < n; j++) {
        R[i][j] = 0;
        gan++;
        ghi(3, "Bắt đầu tính R[" + i + "][" + j + "], gán về 0.",
            { i: i, j: j }, ["R"], chup(i, j, -1, false), null);

        for (var k = 0; k < n; k++) {
          var tich = A[i][k] * B[k][j];
          nhan++;
          R[i][j] += tich;
          gan++;
          ghi(5, "R[" + i + "][" + j + "] += A[" + i + "][" + k + "] (" + A[i][k] + ") × B[" + k + "][" + j + "] (" + B[k][j] + ") = " + tich +
                  "  →  R[" + i + "][" + j + "] = " + R[i][j] + ".",
              { i: i, j: j, k: k, "R[i][j]": R[i][j] }, ["R"], chup(i, j, k, false), null);
        }
      }
    }

    ghi(6, "Hoàn thành! Ma trận kết quả R đã được điền đầy đủ.",
        {}, [], chup(-1, -1, -1, true), null);

    return cacBuoc;
  }

  function veMaTran(nhan, mang, lop) {
    var html = '<p class="nhan-hang">' + nhan + '</p>';
    for (var r = 0; r < mang.length; r++) {
      html += '<div class="hang-mang">';
      for (var c = 0; c < mang[r].length; c++) {
        html += '<div class="o-mang ' + lop(r, c) + '"><b>' + mang[r][c] + '</b></div>';
      }
      html += '</div>';
    }
    return html;
  }

  function ve(sanKhau, h) {
    var html = "";
    html += veMaTran("Ma trận A", h.A, function (r, c) {
      if (h.xong) return "";
      if (r === h.i && c === h.k) return "dang-xet";
      if (r === h.i) return "la-con";
      return "";
    });
    html += veMaTran("Ma trận B", h.B, function (r, c) {
      if (h.xong) return "";
      if (r === h.k && c === h.j) return "dang-xet";
      if (c === h.j) return "la-con";
      return "";
    });
    html += veMaTran("Ma trận kết quả R", h.R, function (r, c) {
      if (h.xong) return "khoa";
      if (r === h.i && c === h.j) return "so-sanh";
      return "";
    });
    sanKhau.innerHTML = '<div class="khung-heap">' + html + '</div>';
  }

  var lyThuyet = `
    <h2>Ý tưởng</h2>
    <p class="vi-du-doi-thuong"><b>Quy tắc:</b> ma trận A (m×n) nhân được với ma trận B (n×p) khi <b>số cột của A = số hàng của B</b>. Mỗi ô R[i][j] của kết quả bằng <b>hàng i của A</b> nhân từng phần tử với <b>cột j của B</b> rồi cộng lại.</p>

    <h3>Các bước</h3>
    <ol>
      <li>Duyệt từng ô kết quả R[i][j] (2 vòng lặp i, j).</li>
      <li>Với mỗi ô, gán R[i][j] = 0.</li>
      <li>Vòng lặp k: cộng dồn A[i][k] × B[k][j] vào R[i][j].</li>
    </ol>
    <p><b>Lưu ý:</b> nhân ma trận <b>không có tính giao hoán</b> — A×B thường khác B×A.</p>

    <h3>Độ phức tạp</h3>
    <p>3 vòng lặp lồng nhau (i, j, k đều chạy n lần) → <b>O(n³)</b> phép nhân và phép cộng.</p>

    <h3>Lưu ý khi dùng trang này</h3>
    <p>Ô nhập "dãy số" được hiểu là: <b>4 số đầu</b> là ma trận A (2×2, theo từng hàng), <b>4 số sau</b> là ma trận B (2×2). Ví dụ nhập <code>1 2 3 4 5 6 7 8</code> nghĩa là A = [[1,2],[3,4]], B = [[5,6],[7,8]].</p>`;

  window.AlgoViet.thuatToan["nhan-ma-tran"] = {
    ten: "Nhân ma trận",
    doPhucTap: "O(n³)",
    lyThuyet: lyThuyet,
    viDu: [1, 2, 3, 4, 5, 6, 7, 8],
    gioiHan: { min: 1, max: 9, soLuongMax: 8, soLuongMin: 8 },
    ghiChuNhap: "4 số đầu = ma trận A, 4 số sau = ma trận B (mỗi số 1-9, đúng 8 số)",
    nhanDem: { soSanh: "phép nhân", gan: "phép gán" },
    cachLam: {
      hangNhanCot: { ten: "Hàng nhân cột", code: code, tao: tao, ve: ve }
    },
    chuThich: {
      hangNhanCot: [
        ["--tt-dang-xet", "Phần tử đang nhân (A) / được nhân (B)"],
        ["--tt-so-sanh", "Ô R[i][j] đang tính"],
        ["--tt-min", "Hàng của A / cột của B đang dùng"],
        ["--tt-xong", "Hoàn thành"]
      ]
    }
  };
})();
