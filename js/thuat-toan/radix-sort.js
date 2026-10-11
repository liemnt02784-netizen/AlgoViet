// =====================================================================
// RADIX SORT (sắp xếp theo từng chữ số)
// Cấu trúc file giống insertion-sort.js: code, tao(), ve(), đăng ký.
//
// Ý tưởng khác hẳn các thuật toán Sắp xếp khác: KHÔNG so sánh hai phần tử
// với nhau. Thay vào đó, xét lần lượt từng CHỮ SỐ (đơn vị, chục, trăm...)
// và dùng Counting Sort (đếm phân phối) để xếp theo đúng chữ số đó.
// Vì Counting Sort ổn định (stable), thứ tự của các chữ số đã xếp trước
// không bị xáo trộn, nên làm xong hết các chữ số thì cả dãy đã có thứ tự.
// =====================================================================
(function () {
  window.AlgoViet = window.AlgoViet || { thuatToan: {} };

  var code = [
    "void countingSortTheoChuSo(int a[], int n, int viTri) {", // 1
    "    int output[100];",                                    // 2
    "    int dem[10] = {0};",                                  // 3
    "    for (int i = 0; i < n; i++) {",                       // 4
    "        int chuSo = (a[i] / viTri) % 10;",                // 5
    "        dem[chuSo]++;",                                   // 6
    "    }",                                                   // 7
    "    for (int i = 1; i < 10; i++) {",                      // 8
    "        dem[i] += dem[i-1];",                             // 9
    "    }",                                                   // 10
    "    for (int i = n - 1; i >= 0; i--) {",                  // 11
    "        int chuSo = (a[i] / viTri) % 10;",                // 12
    "        output[dem[chuSo] - 1] = a[i];",                  // 13
    "        dem[chuSo]--;",                                   // 14
    "    }",                                                   // 15
    "    for (int i = 0; i < n; i++) {",                       // 16
    "        a[i] = output[i];",                               // 17
    "    }",                                                   // 18
    "}",                                                       // 19
    "",                                                         // 20
    "void radixSort(int a[], int n) {",                        // 21
    "    int maxVal = a[0];",                                  // 22
    "    for (int i = 1; i < n; i++) {",                       // 23
    "        if (a[i] > maxVal) maxVal = a[i];",               // 24
    "    }",                                                   // 25
    "    for (int viTri = 1; maxVal / viTri > 0; viTri *= 10) {", // 26
    "        countingSortTheoChuSo(a, n, viTri);",             // 27
    "    }",                                                   // 28
    "}"                                                        // 29
  ];

  var TEN_HANG = ["đơn vị", "chục", "trăm", "nghìn", "chục nghìn", "trăm nghìn"];

  function tenHang(viTri) {
    var bac = String(viTri).length - 1;   // viTri = 1 -> bậc 0, 10 -> bậc 1, 100 -> bậc 2...
    return TEN_HANG[bac] || ("10^" + bac);
  }

  function tao(so) {
    var a = so.slice();
    var n = a.length;
    var cacBuoc = [];
    var gan = 0;      // đếm số phép gán (dem[]++, output[...]=a[i], a[i]=output[i]...)

    function ghi(dong, giaiThich, bien, vuaDoi, hinh, cauHoi) {
      cacBuoc.push({
        dong: dong, giaiThich: giaiThich, bien: bien, vuaDoi: vuaDoi,
        dem: { soSanh: 0, gan: gan },   // Radix Sort không so sánh phần tử nào với nhau, nên luôn là 0
        hinh: hinh, cauHoi: cauHoi
      });
    }

    // "Chụp ảnh" trạng thái để vẽ.
    //   mang    : mảng chính hiện tại
    //   viTri   : chữ số đang xét là 1 (đơn vị), 10 (chục), 100 (trăm)... (-1 nếu chưa bắt đầu)
    //   demMang : mảng đếm 10 ô (ứng với ngăn 0..9), null nếu chưa dùng tới
    //   output  : mảng kết quả đang được điền dần, các ô chưa điền là null
    //   dangXet : vị trí i trong "mang" đang được xử lý (-1 nếu không có)
    //   dangDoi : vị trí trong "output" vừa được điền (-1 nếu không có)
    //   demVuaDoi : chữ số (0-9) vừa thay đổi trong demMang (-1 nếu không có)
    function chup(mang, viTri, demMang, output, dangXet, dangDoi, demVuaDoi, xong) {
      return {
        mang: mang.slice(), viTri: viTri, demMang: demMang ? demMang.slice() : null,
        output: output ? output.slice() : null, dangXet: dangXet, dangDoi: dangDoi,
        demVuaDoi: demVuaDoi, xong: xong
      };
    }

    var maxVal = a[0];
    for (var m = 1; m < n; m++) {
      if (a[m] > maxVal) maxVal = a[m];
    }
    ghi(22, "Tìm số lớn nhất trong mảng để biết cần xét bao nhiêu chữ số. Số lớn nhất là " + maxVal +
            ", có " + String(maxVal).length + " chữ số, nên cần " + String(maxVal).length + " lượt xếp.",
        { n: n, maxVal: maxVal }, [], chup(a, -1, null, null, -1, -1, -1, false), null);

    for (var viTri = 1; Math.floor(maxVal / viTri) > 0; viTri *= 10) {
      ghi(26, "Bắt đầu lượt xét chữ số hàng " + tenHang(viTri) + " (viTri = " + viTri + "). " +
              "Mảng hiện tại: " + a.join(", ") + ".",
          { viTri: viTri }, ["viTri"], chup(a, viTri, null, null, -1, -1, -1, false), null);

      // Bước 1: đếm số lần xuất hiện của mỗi chữ số (0-9)
      var dem = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (var i = 0; i < n; i++) {
        var chuSo = Math.floor(a[i] / viTri) % 10;
        dem[chuSo]++;
        gan++;
        ghi(6, "Chữ số hàng " + tenHang(viTri) + " của a[" + i + "] = " + a[i] + " là " + chuSo +
               ". Tăng dem[" + chuSo + "] lên " + dem[chuSo] + ".",
            { i: i, "a[i]": a[i], chuSo: chuSo }, ["chuSo"], chup(a, viTri, dem, null, i, -1, chuSo, false), null);
      }

      // Bước 2: cộng dồn mảng đếm
      var demTruoc = dem.slice();
      for (var c = 1; c < 10; c++) {
        dem[c] += dem[c - 1];
        gan++;
      }
      ghi(9, "Cộng dồn mảng đếm: dem[c] += dem[c-1], để biết mỗi chữ số kết thúc ở vị trí nào trong mảng kết quả. " +
              "Trước: " + demTruoc.join(",") + "  →  Sau: " + dem.join(","),
          { dem: dem.join(",") }, ["dem"], chup(a, viTri, dem, null, -1, -1, -1, false), null);

      // Bước 3: duyệt ngược, đặt vào output
      var output = [];
      for (var o = 0; o < n; o++) output.push(null);
      for (var j = n - 1; j >= 0; j--) {
        var cs = Math.floor(a[j] / viTri) % 10;
        var viTriMoi = dem[cs] - 1;
        output[viTriMoi] = a[j];
        gan++;
        var dungSai = dem[cs];
        dem[cs]--;
        gan++;
        ghi(13, "Xét a[" + j + "] = " + a[j] + " (chữ số " + cs + "). Đặt vào output[" + viTriMoi + "] " +
                "(vì dem[" + cs + "] = " + dungSai + "), rồi giảm dem[" + cs + "] còn " + dem[cs] + ".",
            { j: j, "a[j]": a[j], chuSo: cs, "output_vt": viTriMoi }, ["output_vt"],
            chup(a, viTri, dem, output, j, viTriMoi, cs, false), null);
      }

      // Bước 4: sao chép output trở lại mảng a
      for (var k = 0; k < n; k++) {
        a[k] = output[k];
      }
      gan += n;
      ghi(17, "Sao chép output trở lại mảng a. Sau lượt xét chữ số hàng " + tenHang(viTri) + ": " + a.join(", ") + ".",
          { mang: a.join(",") }, ["mang"], chup(a, viTri, null, output, -1, -1, -1, false), null);
    }

    ghi(29, "Hoàn thành! Đã xét hết các chữ số, mảng đã tăng dần: " + a.join(", ") + ". " +
            "Lưu ý: 0 phép so sánh trong suốt quá trình, vì Radix Sort không so sánh hai phần tử với nhau.",
        { n: n }, [], chup(a, -1, null, null, -1, -1, -1, true), null);

    return cacBuoc;
  }

  // Vẽ một bước: hàng mảng chính, hàng mảng đếm (nếu có), hàng output (nếu có)
  function ve(sanKhau, h) {
    function hangO(mang, kieu) {
      var html = "";
      for (var p = 0; p < mang.length; p++) {
        var v = mang[p];
        var lop = "";
        if (kieu === "mang" && p === h.dangXet) lop = "dang-xet";
        if (kieu === "dem" && p === h.demVuaDoi) lop = "doi-cho";
        if (kieu === "output") {
          if (v === null) lop = "";
          else if (p === h.dangDoi) lop = "khoa dau-khoa";
          else lop = "la-con";
        }
        var hienThi = (v === null) ? "·" : v;
        html += '<div class="o-mang ' + lop + '"><b>' + hienThi + '</b><small>' + (kieu === "dem" ? p : p) + '</small></div>';
      }
      return html;
    }

    var html = "";
    if (h.viTri > 0) {
      html += '<div class="tieu-d">Đang xét chữ số hàng ' + tenHang(h.viTri) + ' (viTri = ' + h.viTri + ')</div>';
    }
    html += '<p class="nhan-hang">Mảng a:</p><div class="hang-mang">' + hangO(h.mang, "mang") + '</div>';
    if (h.demMang) {
      html += '<p class="nhan-hang">Mảng đếm dem[0..9]:</p><div class="hang-mang">' + hangO(h.demMang, "dem") + '</div>';
    }
    if (h.output) {
      html += '<p class="nhan-hang">Mảng output:</p><div class="hang-mang">' + hangO(h.output, "output") + '</div>';
    }
    sanKhau.innerHTML = '<div class="khung-heap">' + html + '</div>';
  }

  var lyThuyet = `
    <h2>Ý tưởng</h2>
    <p class="vi-du-doi-thuong"><b>Ví dụ đời thường:</b> Radix Sort <b>không so sánh hai số với nhau</b>. Nó xếp theo từng <b>chữ số một</b>, giống như xếp các lá thư vào 10 ngăn theo chữ số hàng đơn vị trước, rồi gom lại và xếp tiếp theo chữ số hàng chục, rồi hàng trăm... cho đến chữ số lớn nhất.</p>

    <h3>Ví dụ: xếp <code>170, 45, 75, 90, 802, 24, 2, 66</code></h3>
    <p><b>Chữ số hàng đơn vị:</b> 170→0, 90→0, 802→2, 2→2, 24→4, 45→5, 75→5, 66→6. Bỏ vào ngăn theo đúng thứ tự xuất hiện, lấy ra theo ngăn 0→9: <code>170, 90, 802, 2, 24, 45, 75, 66</code>.</p>
    <p><b>Chữ số hàng chục:</b> xếp tiếp dãy trên theo chữ số hàng chục, được <code>802, 2, 24, 45, 66, 170, 75, 90</code>.</p>
    <p><b>Chữ số hàng trăm:</b> xếp tiếp, được <code>2, 24, 45, 66, 75, 90, 170, 802</code> — đã tăng dần hoàn toàn.</p>

    <h3>Vì sao không làm rối thứ tự đã xếp trước?</h3>
    <p>Vì thuật toán đếm phân phối ở mỗi bước là <b>ổn định (stable)</b>: hai số có cùng chữ số đang xét thì giữ nguyên thứ tự tương đối như trước khi xếp bước đó. Nhờ vậy thứ tự đúng theo các chữ số thấp hơn (đã xếp ở bước trước) không bị xáo trộn.</p>

    <h3>Cách cài đặt: Counting Sort cho từng chữ số</h3>
    <p>Mỗi lượt gồm 4 bước, với <code>viTri</code> là 1 (đơn vị), 10 (chục), 100 (trăm)...:</p>
    <ol>
      <li><b>Đếm:</b> với mỗi số, lấy chữ số đang xét <code>(a[i] / viTri) % 10</code>, tăng <code>dem[chữ số]</code>.</li>
      <li><b>Cộng dồn:</b> <code>dem[i] += dem[i-1]</code>, để biết mỗi chữ số kết thúc ở vị trí nào trong mảng kết quả.</li>
      <li><b>Đặt vào đúng chỗ:</b> duyệt mảng <b>từ cuối lên đầu</b> (để giữ ổn định), đặt từng số vào <code>output[dem[chữ số] - 1]</code>, rồi giảm <code>dem[chữ số]</code>.</li>
      <li><b>Sao chép lại:</b> chép <code>output</code> trở lại mảng <code>a</code>.</li>
    </ol>
    <p>Lặp lại 4 bước này cho từng chữ số, từ hàng đơn vị đến chữ số lớn nhất của số lớn nhất trong mảng.</p>

    <h3>Độ phức tạp</h3>
    <p>Gọi <code>d</code> là số chữ số của số lớn nhất trong mảng. Mỗi lượt (ứng với 1 chữ số) tốn <b>O(n)</b>, và có <code>d</code> lượt, nên tổng là <b>O(d × n)</b>. Nếu <code>d</code> là hằng số (ví dụ số luôn có ít hơn 10 chữ số) thì xem như <b>O(n)</b> — nhanh hơn hẳn O(n log n) của các thuật toán so sánh. Đổi lại, Radix Sort chỉ dùng được cho <b>số nguyên</b> (hoặc dữ liệu có thứ tự ký tự/chữ số rõ ràng), và <b>không so sánh</b> hai phần tử nào với nhau — vì vậy bộ đếm "phép so sánh" trên màn hình luôn là 0, đây là điểm khác biệt lớn nhất so với các thuật toán Sắp xếp khác.</p>`;

  window.AlgoViet.thuatToan["radix-sort"] = {
    ten: "Radix Sort",
    doPhucTap: "O(d·n)",
    lyThuyet: lyThuyet,
    viDu: [720, 355, 436, 457, 657, 329, 839],
    gioiHan: { min: 1, max: 999, soLuongMax: 10 },
    nhanDem: { gan: "phép gán" },
    cachLam: {
      theoChuSo: { ten: "Xếp theo từng chữ số", code: code, tao: tao, ve: ve }
    },
    chuThich: {
      theoChuSo: [
        ["--tt-dang-xet", "Số đang xét trong mảng a"],
        ["--tt-sai", "Chữ số vừa thay đổi trong dem[]"],
        ["--tt-xong", "Ô output vừa được đặt"],
        ["--tt-chua-xet", "Ô output đã đặt từ trước"]
      ]
    }
  };
})();
