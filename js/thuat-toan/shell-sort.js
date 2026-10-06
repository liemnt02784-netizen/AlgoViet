// =====================================================================
// SHELL SORT
// Cấu trúc file giống insertion-sort.js: code, tao(), ve(), đăng ký.
// Shell Sort = Insertion Sort, nhưng bước nhảy là d thay vì 1.
// =====================================================================
(function () {
  window.AlgoViet = window.AlgoViet || { thuatToan: {} };

  var code = [
    "void shellSort(int a[], int n) {",                 // 1
    "    for (int d = n / 2; d > 0; d /= 2) {",         // 2
    "        for (int i = d; i < n; i++) {",            // 3
    "            int x = a[i], j = i;",                 // 4
    "            while (j >= d && a[j-d] > x) {",       // 5
    "                a[j] = a[j-d];",                   // 6
    "                j -= d;",                          // 7
    "            }",                                    // 8
    "            a[j] = x;",                            // 9
    "        }",                                        // 10
    "    }",                                            // 11
    "}"                                                 // 12
  ];

  // Màu cho từng nhóm (nhóm g dùng màu thứ g). Có 8 màu vì n tối đa 16 nên d tối đa 8.
  var MAU_NHOM = ["#93C5FD", "#FCD34D", "#86EFAC", "#FCA5A5", "#C4B5FD", "#67E8F9", "#F9A8D4", "#FDBA74"];

  function tao(so) {
    var a = so.slice();
    var n = a.length;
    var cacBuoc = [];
    var soSanh = 0;
    var gan = 0;

    var lonNhat = 0;
    for (var m = 0; m < n; m++) {
      if (a[m] > lonNhat) lonNhat = a[m];
    }

    function ghi(dong, giaiThich, bien, vuaDoi, hinh, cauHoi) {
      cacBuoc.push({
        dong: dong, giaiThich: giaiThich, bien: bien, vuaDoi: vuaDoi,
        dem: { soSanh: soSanh, gan: gan }, hinh: hinh, cauHoi: cauHoi
      });
    }

    // d : khoảng cách hiện tại        i : phần tử đang chèn        j : ô trống
    // x : số đang cầm                  hienNhom : true thì tô mỗi nhóm một màu
    function chup(d, i, j, x, soSanhVoi, hienNhom, xong) {
      return {
        a: a.slice(), max: lonNhat, d: d, i: i, j: j, x: x,
        soSanhVoi: soSanhVoi, hienNhom: hienNhom, xong: xong
      };
    }

    // Mô tả các nhóm, ví dụ "nhóm 0 = {0, 5}; nhóm 1 = {1, 6}"
    function moTaNhom(d) {
      var s = "";
      for (var g = 0; g < d; g++) {
        var viTri = [];
        for (var p = g; p < n; p += d) viTri.push(p);
        s += "nhóm " + g + " = {" + viTri.join(", ") + "}";
        if (g < d - 1) s += "; ";
      }
      return s;
    }

    // Vòng ngoài: d = n/2, rồi chia đôi liên tục đến khi d = 0
    // (Math.floor(n / 2) là phép chia lấy phần nguyên như n / 2 trong C)
    for (var d = Math.floor(n / 2); d > 0; d = Math.floor(d / 2)) {
      var soSanhDauD = soSanh;

      if (d === 1) {
        ghi(2, "d = 1: cả mảng là MỘT nhóm duy nhất, đây chính là Insertion Sort thông thường. " +
               "Nhưng dãy đã gần đúng thứ tự nên chạy rất nhanh.",
            { d: d }, ["d"], chup(d, -1, -1, null, -1, true, false), null);
      } else {
        ghi(2, "Khoảng cách d = " + d + ". Các phần tử cách nhau " + d + " ô thuộc cùng một nhóm " +
               "(cùng màu trên hình): " + moTaNhom(d) + ". Mỗi nhóm sẽ được sắp xếp bằng Insertion Sort.",
            { d: d }, ["d"], chup(d, -1, -1, null, -1, true, false), null);
      }

      for (var i = d; i < n; i++) {
        var x = a[i];
        var j = i;
        gan++;
        ghi(4, "Lấy a[" + i + "] = " + x + " ra, gọi là x. Ta chỉ so sánh với các phần tử cùng nhóm, " +
               "cách nhau " + d + " ô về bên trái.",
            { d: d, i: i, x: x, j: j }, ["i", "x", "j"], chup(d, i, j, x, -1, false, false), null);

        while (true) {
          if (j < d) {
            ghi(5, "j = " + j + " nhỏ hơn d = " + d + ": phía trái không còn phần tử nào cùng nhóm, dừng lại.",
                { d: d, i: i, x: x, j: j }, [], chup(d, i, j, x, -1, false, false), null);
            break;
          }

          soSanh++;
          var lonHon = a[j - d] > x;
          var cauHoi = {
            tieuDe: "So sánh a[" + (j - d) + "] = " + a[j - d] + " với x = " + x +
                    " (cách nhau d = " + d + " ô). Số " + a[j - d] + " có bị đẩy sang phải không?",
            luaChon: ["Có, dịch sang phải " + d + " ô", "Không, dừng lại"],
            dung: lonHon ? 0 : 1,
            lyDo: lonHon
              ? a[j - d] + " > " + x + ", nên " + a[j - d] + " nhảy sang vị trí " + j + "."
              : a[j - d] + " không lớn hơn " + x + ", đã tìm được chỗ của x trong nhóm nên dừng."
          };
          var moTa = "So sánh a[" + (j - d) + "] = " + a[j - d] + " với x = " + x + ": " +
                     (lonHon ? a[j - d] + " > " + x + " nên ĐÚNG, dịch " + a[j - d] + " sang phải " + d + " ô."
                             : a[j - d] + " không lớn hơn " + x + " nên SAI, dừng lại.");
          ghi(5, moTa, { d: d, i: i, x: x, j: j, "a[j-d]": a[j - d] }, [],
              chup(d, i, j, x, j - d, false, false), cauHoi);

          if (!lonHon) break;

          a[j] = a[j - d];
          gan++;
          j = j - d;
          ghi(6, "Dịch số " + a[j + d] + " sang vị trí " + (j + d) + " (nhảy " + d + " ô). Ô trống lùi về vị trí " + j + ".",
              { d: d, i: i, x: x, j: j }, ["j"], chup(d, i, j, x, -1, false, false), null);
        }

        a[j] = x;
        gan++;
        ghi(9, "Đặt x = " + x + " vào ô trống (vị trí " + j + ").",
            { d: d, i: i, x: x, j: j }, [], chup(d, i, -1, null, -1, false, false), null);
      }

      ghi(11, "Xong d = " + d + ": bước này tốn " + (soSanh - soSanhDauD) + " phép so sánh " +
              "(tổng cộng đến giờ: " + soSanh + "). Mỗi nhóm đã có thứ tự" +
              (d > 1 ? ", dãy gần đúng thứ tự hơn trước." : ", cả mảng đã xong."),
          { d: d }, [], chup(d, -1, -1, null, -1, true, false), null);
    }

    ghi(12, "Hoàn thành! Tổng cộng " + soSanh + " phép so sánh và " + gan + " phép gán.",
        { n: n }, [], chup(1, -1, -1, null, -1, false, true), null);

    return cacBuoc;
  }

  function ve(sanKhau, h) {
    var html = "";
    for (var p = 0; p < h.a.length; p++) {
      var loai = "da-xet";         // mặc định: nhóm khác, làm mờ đi
      var giaTri = h.a[p];
      var nhan = "";
      var kieu = "";               // style nội tuyến (chỉ dùng khi tô màu theo nhóm)
      var dongNhom = "";           // dòng chữ "nhóm g" dưới cột

      if (h.xong) {
        loai = "xong";
      } else if (h.hienNhom) {
        loai = "chua-xet";
        kieu = "background:" + MAU_NHOM[p % h.d] + ";";
        dongNhom = '<div class="chi-so">nhóm ' + (p % h.d) + '</div>';
      } else if (p === h.j) {
        loai = "cho-chen";
        giaTri = h.x;
        nhan = '<span class="nhan-min">x</span>';
      } else if (p === h.soSanhVoi) {
        loai = "so-sanh";
      } else if (p % h.d === h.i % h.d) {
        loai = "cung-nhom";        // cùng nhóm với phần tử đang chèn
      }

      var conTro = "";
      if (!h.xong && !h.hienNhom) {
        if (p === h.i && p === h.j) conTro = "i,j ▼";
        else if (p === h.j) conTro = "j ▼";
        else if (p === h.i) conTro = "i ▼";
      }

      var cao = Math.round(40 + (giaTri / h.max) * 190);
      html += '<div class="cot-o">' +
                '<div class="con-tro">' + conTro + '</div>' +
                '<div class="nhan-tren">' + nhan + '</div>' +
                '<div class="cot ' + loai + '" style="height:' + cao + 'px;' + kieu + '">' + giaTri + '</div>' +
                '<div class="chi-so">a[' + p + ']</div>' + dongNhom +
              '</div>';
    }
    var tieuDe = h.xong ? "" : '<div class="tieu-d">Khoảng cách d = ' + h.d + '</div>';
    sanKhau.innerHTML = '<div class="khung-cot">' + tieuDe + '<div class="day-cot">' + html + '</div></div>';
  }

  var lyThuyet = `
    <h2>Ý tưởng</h2>
    <p class="vi-du-doi-thuong"><b>Ví dụ đời thường:</b> xếp hàng theo chiều cao. Insertion Sort chỉ cho đổi chỗ với người đứng ngay cạnh, nên người thấp đứng cuối hàng phải đi rất lâu mới lên đầu. Shell Sort cho phép <b>nhảy cóc</b> trước: đổi chỗ những người đứng cách nhau xa, để mọi người nhanh chóng về gần đúng vị trí, rồi mới sắp xếp mịn.</p>

    <h3>Các bước</h3>
    <ol>
      <li>Chọn khoảng cách <code>d = n / 2</code>.</li>
      <li>Các phần tử cách nhau <code>d</code> ô thuộc cùng một <b>nhóm</b> (có đúng <code>d</code> nhóm). Sắp xếp từng nhóm bằng Insertion Sort.</li>
      <li>Giảm <code>d</code> đi một nửa, lặp lại.</li>
      <li>Khi <code>d = 1</code>, cả mảng là một nhóm: đó là Insertion Sort thường, nhưng dãy đã gần đúng thứ tự nên chạy rất nhanh.</li>
    </ol>

    <h3>Cách chọn khoảng cách</h3>
    <p>Code trong slide dùng <code>d = n/2, n/4, ..., 1</code>. Với <code>n = 10</code> ta được d = 5, 2, 1 (đúng dãy của bài tập cuối slide). Với <code>n = 9</code> được d = 4, 2, 1, còn bài tập ở slide 9 ghi d = 5, 2, 1 là một cách chọn khác. Bước cuối <b>bắt buộc d = 1</b> để chắc chắn mảng sắp xếp xong.</p>

    <h3>Số nhóm và số cặp</h3>
    <p>Với khoảng cách <code>d</code> có <code>d</code> nhóm: nhóm <code>g</code> gồm các vị trí <code>g, g + d, g + 2d, ...</code>. Khi mỗi nhóm chỉ có 2 phần tử thì có <code>n − d</code> cặp, mỗi cặp một phép so sánh.</p>

    <h3>Nhận xét</h3>
    <p>Slide nói Shell Sort ít phép so sánh hơn Insertion Sort. Điều đó đúng với mảng lớn. Với mảng nhỏ thì chưa chắc: dãy <code>7 3 15 9 1 18 12 5 16 8</code> tốn 26 phép so sánh với Insertion Sort nhưng 28 phép với Shell Sort. Bạn có thể nhập dãy này vào để kiểm chứng.</p>

    <h3>Độ phức tạp</h3>
    <p>Theo slide: <b>O(n²)</b> trong trường hợp xấu nhất, nhưng thường nhanh hơn Insertion Sort nhiều.</p>`;

  window.AlgoViet.thuatToan["shell-sort"] = {
    ten: "Shell Sort",
    doPhucTap: "O(n²)",
    lyThuyet: lyThuyet,
    viDu: [8, 5, 7, 3, 2, 6, 4, 1],
    cachLam: {
      shell: { ten: "Nhảy cóc theo khoảng cách d", code: code, tao: tao, ve: ve }
    },
    chuThich: {
      shell: [
        ["--tt-da-xet", "Khác nhóm (tạm bỏ qua)"],
        ["--tt-cung-nhom", "Cùng nhóm với phần tử đang xét"],
        ["--tt-so-sanh", "Đang so sánh"],
        ["--xanh", "Ô trống / số x đang chèn"],
        ["--tt-xong", "Hoàn thành"]
      ]
    }
  };
})();
