// =====================================================================
// GIẢI THUẬT HORNER (tính giá trị đa thức)
// Cấu trúc file giống insertion-sort.js: code, tao(), ve(), đăng ký.
//
// Dãy số nhập vào được hiểu đặc biệt: các số ĐẦU là hệ số đa thức
// a[n], a[n-1], ..., a[0] (từ bậc cao xuống bậc thấp), SỐ CUỐI CÙNG
// là giá trị x cần tính P(x). Ví dụ nhập "2 3 5 1 2" nghĩa là
// P(x) = 2x^3 + 3x^2 + 5x + 1, tính tại x = 2.
// =====================================================================
(function () {
  window.AlgoViet = window.AlgoViet || { thuatToan: {} };

  var code = [
    "result = a[n];",                 // 1
    "for (int i = n-1; i >= 0; i--) {", // 2
    "    result = result * x;",       // 3
    "    result = result + a[i];",    // 4
    "}"                                // 5
  ];

  function tao(so) {
    var he = so.slice(0, so.length - 1);   // hệ số a[n] -> a[0]
    var x = so[so.length - 1];
    var n = he.length - 1;                 // bậc đa thức
    var cacBuoc = [];
    var nhan = 0, cong = 0;

    function ghi(dong, giaiThich, bien, vuaDoi, hinh, cauHoi) {
      cacBuoc.push({
        dong: dong, giaiThich: giaiThich, bien: bien, vuaDoi: vuaDoi,
        dem: { soSanh: nhan, gan: cong }, hinh: hinh, cauHoi: cauHoi
      });
    }

    // dangXet: chỉ số hệ số đang cộng vào (-1 nếu chưa có)
    function chup(result, dangXet, xong) {
      return { he: he.slice(), x: x, result: result, dangXet: dangXet, xong: xong };
    }

    var result = he[0];
    ghi(1, "Lấy hệ số cao nhất a[" + n + "] = " + he[0] + " làm giá trị khởi đầu của result.",
        { n: n, x: x, result: result }, ["result"], chup(result, 0, false), null);

    for (var i = 1; i <= n; i++) {
      result = result * x;
      nhan++;
      ghi(3, "Nhân result với x (" + x + "): result = " + (result / x) + " × " + x + " = " + result + ".",
          { result: result }, ["result"], chup(result, i, false), null);

      var heSo = he[i];
      result = result + heSo;
      cong++;
      ghi(4, "Cộng hệ số a[" + (n - i) + "] = " + heSo + ": result = " + (result - heSo) + " + " + heSo + " = " + result + ".",
          { result: result, "a[i]": heSo }, ["result"], chup(result, i, false), null);
    }

    ghi(5, "Hoàn thành! P(" + x + ") = " + result + ". Tốn " + nhan + " phép nhân và " + cong + " phép cộng (so với cách cơ bản tốn " + (2 * n - 1 >= 0 ? 2 * n - 1 : 0) + " phép nhân).",
        { result: result }, [], chup(result, -1, true), null);

    return cacBuoc;
  }

  function ve(sanKhau, h) {
    var html = '<p class="nhan-hang">Hệ số đa thức a[n..0] (x = ' + h.x + '):</p><div class="hang-mang">';
    for (var p = 0; p < h.he.length; p++) {
      var lop = "";
      if (!h.xong && p === h.dangXet) lop = "khoa dau-khoa";
      else if (!h.xong && p < h.dangXet) lop = "";
      html += '<div class="o-mang ' + lop + '"><b>' + h.he[p] + '</b><small>a[' + (h.he.length - 1 - p) + ']</small></div>';
    }
    html += '</div>';
    html += '<p class="nhan-hang">Giá trị result:</p><div class="hang-mang">' +
            '<div class="o-mang ' + (h.xong ? "khoa" : "dang-xet") + '"><b>' + h.result + '</b><small>result</small></div></div>';
    sanKhau.innerHTML = '<div class="khung-heap">' + html + '</div>';
  }

  var lyThuyet = `
    <h2>Ý tưởng</h2>
    <p class="vi-du-doi-thuong"><b>Ví dụ đời thường:</b> thay vì tính riêng từng lũy thừa xⁿ, xⁿ⁻¹... rồi cộng lại (tốn nhiều phép nhân), Horner "gói" đa thức thành nhiều lớp lồng nhau: <code>P(x) = (...((aₙx + aₙ₋₁)x + aₙ₋₂)x + ... + a₁)x + a₀</code>. Mỗi lớp chỉ cần 1 phép nhân với x rồi cộng hệ số tiếp theo.</p>

    <h3>Các bước</h3>
    <ol>
      <li>Gán <code>result = a[n]</code> (hệ số cao nhất).</li>
      <li>Lặp từ hệ số kế tiếp đến hệ số cuối (a[n-1] → a[0]): <code>result = result * x + a[i]</code>.</li>
      <li>Sau vòng lặp, <code>result</code> chính là <code>P(x)</code>.</li>
    </ol>

    <h3>So sánh với cách tính cơ bản</h3>
    <table>
      <tr><th>Cách tính</th><th>Số phép nhân</th><th>Số phép cộng</th></tr>
      <tr><td>Cơ bản (tính riêng từng lũy thừa)</td><td>2n − 1</td><td>n</td></tr>
      <tr><td>Horner</td><td>n</td><td>n</td></tr>
    </table>
    <p>Horner giảm số phép nhân gần <b>một nửa</b> so với cách tính cơ bản — vì không cần tính riêng từng lũy thừa xⁿ, xⁿ⁻¹... nữa.</p>

    <h3>Lưu ý khi dùng trang này</h3>
    <p>Ô nhập "dãy số" ở trên được hiểu là: các số <b>đầu tiên là hệ số</b> từ bậc cao xuống bậc thấp (a[n] → a[0]), còn <b>số cuối cùng là giá trị x</b> cần tính. Ví dụ nhập <code>2 3 5 1 2</code> nghĩa là tính <code>P(x) = 2x³ + 3x² + 5x + 1</code> tại <code>x = 2</code>.</p>`;

  window.AlgoViet.thuatToan["horner"] = {
    ten: "Đa thức và Horner",
    doPhucTap: "O(n)",
    lyThuyet: lyThuyet,
    viDu: [2, 3, 5, 1, 2],
    gioiHan: { min: 1, max: 20, soLuongMax: 6, soLuongMin: 3 },
    ghiChuNhap: "Hệ số a[n]..a[0], SỐ CUỐI là x (1-20, 3-6 số)",
    nhanDem: { soSanh: "phép nhân", gan: "phép cộng" },
    cachLam: {
      horner: { ten: "Giải thuật Horner", code: code, tao: tao, ve: ve }
    },
    chuThich: {
      horner: [
        ["--tt-dang-xet", "Giá trị result hiện tại"],
        ["--tt-xong", "Đang cộng hệ số này / đã hoàn thành"]
      ]
    }
  };
})();
