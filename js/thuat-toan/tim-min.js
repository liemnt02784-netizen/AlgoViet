// =====================================================================
// TÌM SỐ NHỎ NHẤT: 2 cách (tuần tự và theo cặp / đấu loại)
//
// Mỗi cách làm gồm 3 phần (xem thêm insertion-sort.js để đọc ví dụ ngắn hơn):
//   code   : các dòng code C++ hiển thị cho người học
//   tao(a) : chạy thuật toán trên mảng a và GHI LẠI từng bước vào một danh sách
//   ve(..) : vẽ MỘT bước ra màn hình
//
// Một bước có dạng:
//   { dong, giaiThich, bien, vuaDoi, dem: {soSanh, gan}, hinh, cauHoi }
// =====================================================================
(function () {   // (hàm bọc ngoài chạy ngay: để tên biến trong file không đụng file khác)
  window.AlgoViet = window.AlgoViet || { thuatToan: {} };

  // ------------------------------------------------------------------
  // CÁCH 1: TUẦN TỰ
  // ------------------------------------------------------------------
  var codeTuanTu = [
    "int timMin(int a[], int n) {",         // dòng 1
    "    int min = a[0];",                  // dòng 2
    "    for (int i = 1; i < n; i++) {",    // dòng 3
    "        if (a[i] < min) {",            // dòng 4
    "            min = a[i];",              // dòng 5
    "        }",                            // dòng 6
    "    }",                                // dòng 7
    "    return min;",                      // dòng 8
    "}"                                     // dòng 9
  ];

  function taoTuanTu(a) {
    var n = a.length;
    var buoc = [];                // danh sách các bước
    var soSanh = 0;               // đếm số phép so sánh
    var gan = 0;                  // đếm số phép gán
    var minIdx = 0;               // vị trí của số nhỏ nhất hiện tại
    var min = a[0];

    // "Chụp ảnh" trạng thái để vẽ
    //   i          : vị trí đang xét (-1 nếu chưa có)
    //   cacCotSoSanh : danh sách vị trí đang so sánh
    //   daXet      : các vị trí từ 0 đến daXet-1 đã xét xong
    function chup(i, cacCotSoSanh, daXet, xong) {
      return { a: a, i: i, minIdx: minIdx, soSanh: cacCotSoSanh, daXet: daXet, xong: xong };
    }

    gan++;
    buoc.push({
      dong: 2, bien: { min: min, i: "-" }, vuaDoi: ["min"], dem: { soSanh: soSanh, gan: gan },
      giaiThich: "Bắt đầu: tạm coi phần tử đầu tiên a[0] = " + a[0] + " là nhỏ nhất, nên min = " + a[0] + ".",
      hinh: chup(-1, [], 1, false)
    });

    for (var i = 1; i < n; i++) {
      buoc.push({
        dong: 3, bien: { min: min, i: i, "a[i]": a[i] }, vuaDoi: ["i"], dem: { soSanh: soSanh, gan: gan },
        giaiThich: "Xét phần tử tiếp theo: i = " + i + ", a[" + i + "] = " + a[i] + ".",
        hinh: chup(i, [], i, false)
      });

      soSanh++;
      var nhoHon = a[i] < min;
      buoc.push({
        dong: 4, bien: { min: min, i: i, "a[i]": a[i] }, vuaDoi: [], dem: { soSanh: soSanh, gan: gan },
        giaiThich: nhoHon
          ? "So sánh a[" + i + "] = " + a[i] + " với min = " + min + ": " + a[i] + " < " + min + " nên ĐÚNG, sẽ cập nhật min."
          : "So sánh a[" + i + "] = " + a[i] + " với min = " + min + ": " + a[i] + " không nhỏ hơn " + min + " nên SAI, min giữ nguyên.",
        hinh: chup(i, [i, minIdx], i, false),
        cauHoi: {
          tieuDe: "So sánh a[" + i + "] = " + a[i] + " với min = " + min + ". Theo bạn min có đổi không?",
          luaChon: ["Có, min = " + a[i], "Không, min vẫn = " + min],
          dung: nhoHon ? 0 : 1,
          lyDo: nhoHon
            ? "Vì " + a[i] + " < " + min + ", nên min được cập nhật thành " + a[i] + "."
            : "Vì " + a[i] + " ≥ " + min + ", điều kiện a[i] < min sai, nên min giữ nguyên " + min + "."
        }
      });

      if (nhoHon) {
        var cu = min;
        min = a[i];
        minIdx = i;
        gan++;
        buoc.push({
          dong: 5, bien: { min: min, i: i, "a[i]": a[i] }, vuaDoi: ["min"], dem: { soSanh: soSanh, gan: gan },
          giaiThich: "Cập nhật min từ " + cu + " thành " + min + '. Nhãn "min" chuyển sang cột a[' + i + "].",
          hinh: chup(i, [], i + 1, false)
        });
      }
    }

    buoc.push({
      dong: 8, bien: { min: min, i: n }, vuaDoi: [], dem: { soSanh: soSanh, gan: gan },
      giaiThich: "Đã xét hết " + n + " phần tử. Kết quả min = " + min + ". Đã dùng " + soSanh +
                 " phép so sánh, đúng bằng n − 1 = " + (n - 1) + ".",
      hinh: chup(-1, [], n, true)
    });
    return buoc;
  }

  // Vẽ một bước của cách tuần tự: mỗi phần tử là một cột
  function veTuanTu(sanKhau, h) {
    var lon = 0;                                   // số lớn nhất, để tính chiều cao cột
    for (var m = 0; m < h.a.length; m++) {
      if (h.a[m] > lon) lon = h.a[m];
    }

    var html = "";
    for (var k = 0; k < h.a.length; k++) {
      var v = h.a[k];

      var lop = "chua-xet";                        // tên lớp CSS quyết định màu cột
      if (h.xong) lop = (k === h.minIdx) ? "xong" : "da-xet";
      else if (h.soSanh.indexOf(k) !== -1) lop = "so-sanh";
      else if (k === h.minIdx) lop = "la-min";
      else if (k === h.i) lop = "dang-xet";
      else if (k < h.daXet) lop = "da-xet";

      var nhan = "";                               // nhãn nhỏ phía trên cột
      if (h.xong && k === h.minIdx) nhan = '<span class="nhan-xong">✓ min</span>';
      else if (k === h.minIdx) nhan = '<span class="nhan-min">min</span>';

      var cao = Math.round(40 + (v / lon) * 190);
      var conTro = (k === h.i && !h.xong) ? "i ▼" : "";
      html += '<div class="cot-o">' +
                '<div class="con-tro">' + conTro + "</div>" +
                '<div class="nhan-tren">' + nhan + "</div>" +
                '<div class="cot ' + lop + '" style="height:' + cao + 'px" aria-label="a[' + k + "] = " + v + '">' + v + "</div>" +
                '<div class="chi-so">a[' + k + "]</div>" +
              "</div>";
    }
    sanKhau.innerHTML = '<div class="day-cot">' + html + "</div>";
  }

  // ------------------------------------------------------------------
  // CÁCH 2: THEO CẶP (ĐẤU LOẠI)
  // ------------------------------------------------------------------
  var codeTheoCap = [
    "int timMinTheoCap(int a[], int n) {",              // dòng 1
    "    while (n > 1) {",                              // dòng 2
    "        int m = 0;",                               // dòng 3
    "        for (int i = 0; i + 1 < n; i += 2) {",     // dòng 4
    "            if (a[i] < a[i+1]) a[m++] = a[i];",    // dòng 5
    "            else               a[m++] = a[i+1];",  // dòng 6
    "        }",                                        // dòng 7
    "        if (n % 2 == 1) a[m++] = a[n-1];",         // dòng 8
    "        n = m;",                                   // dòng 9
    "    }",                                            // dòng 10
    "    return a[0];",                                 // dòng 11
    "}"                                                 // dòng 12
  ];

  function taoTheoCap(a) {
    var buoc = [];
    var soSanh = 0;
    var gan = 0;

    // vong[r]       : các số của vòng r (vòng 0 là mảng ban đầu)
    // trangThai[r]  : trạng thái từng số của vòng r: "thang" | "thua" | "di-thang" | "xong" | ""
    var vong = [a.slice()];
    var dongDau = [];
    for (var q = 0; q < a.length; q++) dongDau.push("");
    var trangThai = [dongDau];

    // Sao chép mảng 2 chiều (mỗi mảng con được sao riêng)
    function saoChep2Chieu(m) {
      var kq = [];
      for (var k = 0; k < m.length; k++) kq.push(m[k].slice());
      return kq;
    }

    // "Chụp ảnh" trạng thái hiện tại để vẽ
    //   dangDau : [vòng, vị trí] của cặp đang so sánh (null nếu không có)
    //   moi     : vị trí số vừa lên vòng mới (-1 nếu không có)
    function chup(dangDau, moi, xong) {
      return { vong: saoChep2Chieu(vong), trangThai: saoChep2Chieu(trangThai), dangDau: dangDau, moi: moi, xong: xong };
    }

    buoc.push({
      dong: 1, bien: { n: a.length }, vuaDoi: [], dem: { soSanh: soSanh, gan: gan },
      giaiThich: "Ý tưởng: chia " + a.length + ' số thành từng cặp để "thi đấu", số nhỏ hơn đi tiếp vào vòng sau, giống giải đấu loại trực tiếp.',
      hinh: chup(null, -1, false)
    });

    var cur = a.slice();      // các số của vòng hiện tại
    var r = 0;                // số thứ tự vòng (bắt đầu từ 0)
    while (cur.length > 1) {
      buoc.push({
        dong: 2, bien: { vong: r + 1, n: cur.length, m: 0 }, vuaDoi: ["vong"], dem: { soSanh: soSanh, gan: gan },
        giaiThich: "Vòng " + (r + 1) + ": còn " + cur.length + " số, ghép thành " + Math.floor(cur.length / 2) +
                   " cặp" + (cur.length % 2 ? ", dư 1 số" : "") + ".",
        hinh: chup(null, -1, false)
      });
      vong.push([]);
      trangThai.push([]);
      var sau = vong[r + 1];          // các số đi tiếp vào vòng sau
      var ttSau = trangThai[r + 1];

      for (var i = 0; i + 1 < cur.length; i += 2) {
        var x = cur[i];
        var y = cur[i + 1];
        soSanh++;
        var traiThang = x < y;

        var lyDo;
        if (traiThang) lyDo = "Vì " + x + " < " + y + ", số " + x + " nhỏ hơn nên đi tiếp.";
        else if (x === y) lyDo = "Hai số bằng nhau, điều kiện a[i] < a[i+1] sai nên code chọn số bên phải (" + y + ").";
        else lyDo = "Vì " + y + " < " + x + ", số " + y + " nhỏ hơn nên đi tiếp.";

        buoc.push({
          dong: 5, bien: { vong: r + 1, i: i, "a[i]": x, "a[i+1]": y, m: sau.length }, vuaDoi: ["i"],
          dem: { soSanh: soSanh, gan: gan },
          giaiThich: "Cặp (" + x + ", " + y + "): so sánh " + x + " < " + y + "? " + (traiThang ? "Đúng" : "Sai") + ".",
          hinh: chup([r, i], -1, false),
          cauHoi: {
            tieuDe: "Cặp (" + x + ", " + y + "): số nào đi tiếp vào vòng sau?",
            luaChon: [x + " (bên trái)", y + " (bên phải)"],
            dung: traiThang ? 0 : 1,
            lyDo: lyDo
          }
        });

        var thang = traiThang ? x : y;
        trangThai[r][i] = traiThang ? "thang" : "thua";
        trangThai[r][i + 1] = traiThang ? "thua" : "thang";
        sau.push(thang);
        ttSau.push("");
        gan++;
        buoc.push({
          dong: traiThang ? 5 : 6, bien: { vong: r + 1, i: i, m: sau.length }, vuaDoi: ["m"],
          dem: { soSanh: soSanh, gan: gan },
          giaiThich: thang + " thắng cặp này và đi tiếp lên vòng " + (r + 2) + "; " + (traiThang ? y : x) + " bị loại.",
          hinh: chup(null, sau.length - 1, false)
        });
      }

      if (cur.length % 2 === 1) {    // số lẻ: số cuối không có cặp, đi thẳng lên
        var le = cur[cur.length - 1];
        trangThai[r][cur.length - 1] = "di-thang";
        sau.push(le);
        ttSau.push("");
        gan++;
        buoc.push({
          dong: 8, bien: { vong: r + 1, m: sau.length }, vuaDoi: ["m"], dem: { soSanh: soSanh, gan: gan },
          giaiThich: "Số " + le + " không có cặp nên đi thẳng lên vòng " + (r + 2) + " mà không cần so sánh.",
          hinh: chup(null, sau.length - 1, false)
        });
      }
      cur = sau.slice();
      r++;
    }

    trangThai[r][0] = "xong";
    buoc.push({
      dong: 11, bien: { min: cur[0] }, vuaDoi: ["min"], dem: { soSanh: soSanh, gan: gan },
      giaiThich: "Chỉ còn 1 số: min = " + cur[0] + ". Đã dùng " + soSanh + " phép so sánh, cũng bằng n − 1 = " +
                 (a.length - 1) + " như cách tuần tự.",
      hinh: chup(null, -1, true)
    });
    return buoc;
  }

  // Vẽ một bước của cách theo cặp: mỗi vòng là một hàng, mỗi cặp là một khung 2 ô
  function veTheoCap(sanKhau, h) {
    var html = "";
    for (var r = 0; r < h.vong.length; r++) {
      var ds = h.vong[r];
      if (ds.length === 0) continue;       // vòng sau chưa có ai đi tiếp thì chưa vẽ

      // Vẽ các ô số của vòng r
      var o = [];
      for (var k = 0; k < ds.length; k++) {
        var lop = h.trangThai[r][k] || "";
        if (h.dangDau && h.dangDau[0] === r && (k === h.dangDau[1] || k === h.dangDau[1] + 1)) lop = "so-sanh";
        if (r === h.vong.length - 1 && k === h.moi) lop += " moi";
        o.push('<div class="o-so ' + lop + '">' + ds[k] + "</div>");
      }

      // Gom thành từng cặp 2 ô
      var nhom = "";
      for (var j = 0; j < o.length; j += 2) {
        var dangDau = h.dangDau && h.dangDau[0] === r && h.dangDau[1] === j;
        nhom += '<div class="cap ' + (dangDau ? "dang-dau" : "") + '">' + o[j] + (o[j + 1] || "") + "</div>";
      }
      html += '<div class="vong"><div class="ten-vong">Vòng ' + (r + 1) + "</div>" + nhom + "</div>";
    }
    sanKhau.innerHTML = '<div class="dau-loai">' + html + "</div>";
  }

  // ------------------------------------------------------------------
  // Phần lý thuyết (HTML). Dấu ` ` cho phép viết chuỗi nhiều dòng.
  // ------------------------------------------------------------------
  var lyThuyet = `
    <h2>Ý tưởng</h2>
    <p class="vi-du-doi-thuong"><b>Ví dụ đời thường:</b> muốn tìm bạn thấp nhất lớp, bạn đứng cạnh người đầu hàng và nhớ chiều cao của họ. Đi dọc hàng, gặp ai thấp hơn người đang nhớ thì nhớ người đó. Đi hết hàng, người đang nhớ chính là bạn thấp nhất.</p>
    <h3>Cách 1: Tuần tự</h3>
    <p>Gán <code>min = a[0]</code>, sau đó lần lượt so sánh từng phần tử còn lại với <code>min</code>; phần tử nào nhỏ hơn thì cập nhật <code>min</code>.</p>
    <h3>Cách 2: Theo cặp (đấu loại)</h3>
    <p>Ghép các phần tử thành từng cặp, số nhỏ hơn mỗi cặp đi tiếp vào vòng sau, lặp lại cho đến khi chỉ còn một số. Số lẻ không có cặp thì đi thẳng.</p>
    <h3>Số phép so sánh</h3>
    <p>Mỗi phép so sánh loại đúng một phần tử khỏi cuộc đua, mà cần loại <b>n − 1</b> phần tử, nên cả hai cách đều dùng đúng <b>n − 1</b> phép so sánh. Độ phức tạp: <b>O(n)</b>.</p>
    <h3>So sánh hai cách</h3>
    <table>
      <tr><th>Tiêu chí</th><th>Tuần tự</th><th>Theo cặp</th></tr>
      <tr><td>Số phép so sánh</td><td>n − 1</td><td>n − 1</td></tr>
      <tr><td>Độ phức tạp</td><td>O(n)</td><td>O(n)</td></tr>
      <tr><td>Dễ đọc, dễ cài đặt</td><td>Cao</td><td>Trung bình</td></tr>
      <tr><td>Bộ nhớ dùng thêm</td><td>1 biến (min)</td><td>Thêm biến phụ cho mỗi vòng</td></tr>
      <tr><td>Chạy song song</td><td>Không</td><td>Được: các cặp trong một vòng độc lập nhau</td></tr>
    </table>`;

  // Hàm tính đáp án đúng cho bài điền chỗ trống: số nhỏ nhất của mảng
  function dapAnDung(a) {
    var min = a[0];
    for (var i = 1; i < a.length; i++) {
      if (a[i] < min) min = a[i];
    }
    return min;
  }

  // ------------------------------------------------------------------
  // Đăng ký thuật toán vào web
  // ------------------------------------------------------------------
  window.AlgoViet.thuatToan["tim-min"] = {
    ten: "Tìm số nhỏ nhất",
    doPhucTap: "O(n)",
    lyThuyet: lyThuyet,
    viDu: [7, 2, 9, 4],

    // Bài "điền vào chỗ trống" (tab Luyện tập)
    luyenTap: {
      dienCho: {
        // {0}...{4} là các ô trống; dongVongLap là chỉ số dòng "for" (để chèn ghi vết)
        mau: [
          "int timMin(int a[], int n) {",
          "    int min = {0};",
          "    for (int i = {1}; {2}; i++) {",
          "        if ({3}) {",
          "            min = {4};",
          "        }",
          "    }",
          "    return min;",
          "}"
        ],
        oTrong: [
          { dapAn: "a[0]", goiY: "Ban đầu ta tạm coi phần tử nào là nhỏ nhất? (phần tử đầu tiên của mảng có chỉ số mấy?)" },
          { dapAn: "1", goiY: "a[0] đã được dùng làm min rồi, nên vòng lặp bắt đầu xét từ chỉ số nào?" },
          { dapAn: "i < n", goiY: "Phần tử cuối cùng là a[n-1]. Vòng lặp phải chạy khi i còn nhỏ hơn bao nhiêu?" },
          { dapAn: "a[i] < min", goiY: "Khi nào thì phải cập nhật min? Khi phần tử đang xét như thế nào so với min?" },
          { dapAn: "a[i]", goiY: "min mới chính là giá trị của phần tử nào?" }
        ],
        dongVongLap: 2,
        bienChoPhep: ["a", "n", "i", "min"],
        vet: "{ 'i': i, 'a[i]': __a[i], 'min (trước khi xét)': min }",
        boTest: [[7, 2, 9, 4], [9, 8, 7, 6], [1, 5, 3], [4, 4, 4], [8, 3, 6, 3, 1], [5]],
        dapAnDung: dapAnDung
      }
    },

    cachLam: {
      tuanTu: { ten: "Tuần tự", code: codeTuanTu, tao: taoTuanTu, ve: veTuanTu },
      theoCap: { ten: "Theo cặp (đấu loại)", code: codeTheoCap, tao: taoTheoCap, ve: veTheoCap }
    },

    // Chú thích màu: [tên biến CSS, nội dung]
    chuThich: {
      tuanTu: [["--tt-chua-xet", "Chưa xét"], ["--tt-dang-xet", "Đang xét (i)"], ["--tt-so-sanh", "Đang so sánh"],
               ["--tt-min", "min hiện tại"], ["--tt-da-xet", "Đã xét"], ["--tt-xong", "Kết quả"]],
      theoCap: [["--tt-chua-xet", "Chưa thi đấu"], ["--tt-so-sanh", "Đang so sánh"], ["--tt-dang-xet", "Thắng, đi tiếp"],
                ["--tt-da-xet", "Bị loại"], ["--xanh-nhat", "Không có cặp, đi thẳng"], ["--tt-xong", "Kết quả"]]
    }
  };
})();
