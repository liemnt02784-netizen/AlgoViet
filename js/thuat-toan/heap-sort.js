// =====================================================================
// HEAP SORT
// Cấu trúc file giống insertion-sort.js: code, tao(), ve(), đăng ký.
// Khác ở chỗ: hàm ve() vẽ một CÁI CÂY (bằng SVG) và một hàng ô cho mảng.
// =====================================================================
(function () {
  window.AlgoViet = window.AlgoViet || { thuatToan: {} };

  var code = [
    "void heapify(int a[], int n, int i) {",                     // 1
    "    int largest = i;",                                      // 2
    "    int left = 2*i + 1;",                                   // 3
    "    int right = 2*i + 2;",                                  // 4
    "    if (left < n && a[left] > a[largest]) largest = left;", // 5
    "    if (right < n && a[right] > a[largest]) largest = right;", // 6
    "    if (largest != i) {",                                   // 7
    "        swap(a[i], a[largest]);",                           // 8
    "        heapify(a, n, largest);",                           // 9
    "    }",                                                     // 10
    "}",                                                         // 11
    "void heapSort(int a[], int n) {",                           // 12
    "    for (int i = n/2 - 1; i >= 0; i--)",                    // 13
    "        heapify(a, n, i);",                                 // 14
    "    for (int i = n - 1; i >= 1; i--) {",                    // 15
    "        swap(a[0], a[i]);",                                 // 16
    "        heapify(a, i, 0);",                                 // 17
    "    }",                                                     // 18
    "}"                                                          // 19
  ];

  function tao(so) {
    var a = so.slice();
    var tong = a.length;         // tổng số phần tử
    var cacBuoc = [];
    var soSanh = 0;              // đếm các lần so sánh a[left] > a[largest] và a[right] > a[largest]
    var gan = 0;                 // ở Heap Sort, đây là SỐ LẦN ĐỔI CHỖ

    function ghi(dong, giaiThich, bien, vuaDoi, hinh, cauHoi) {
      cacBuoc.push({
        dong: dong, giaiThich: giaiThich, bien: bien, vuaDoi: vuaDoi,
        dem: { soSanh: soSanh, gan: gan }, hinh: hinh, cauHoi: cauHoi
      });
    }

    // n       : kích thước "cái tháp" hiện tại (các vị trí từ n trở đi đã bị khóa)
    // i       : vị trí đang chìm xuống      largest : người mạnh nhất tạm thời
    // left,right : hai con (-1 nếu không có)  trao : [p, q] hai vị trí vừa đổi chỗ
    function chup(n, i, largest, left, right, trao) {
      return { a: a.slice(), n: n, i: i, largest: largest, left: left, right: right, trao: trao };
    }

    function viTri(p) {          // hiển thị "-" nếu không có vị trí
      return p < 0 ? "-" : p;
    }

    // ---------------------------------------------------------------
    // heapify: cho số ở vị trí i "chìm xuống" trong tháp gồm n phần tử.
    // Trong code C++ hàm này gọi đệ quy; ở đây dùng vòng lặp while cho dễ ghi bước.
    // ---------------------------------------------------------------
    function heapify(n, i) {
      while (true) {
        var largest = i;
        var left = 2 * i + 1;
        var right = 2 * i + 2;
        var coTrai = left < n;
        var coPhai = right < n;

        // Không có con trái nghĩa là không có cấp dưới: dừng
        if (!coTrai) {
          ghi(2, "Xét vị trí " + i + " (số " + a[i] + "): không có cấp dưới trong tháp nên đã đúng chỗ, dừng.",
              { n: n, i: i, largest: i }, ["i"], chup(n, i, i, -1, -1, null), null);
          return;
        }

        var moTa = "Xét vị trí " + i + " (số " + a[i] + "). Tạm coi " + a[i] + " là mạnh nhất (largest = " + i + "). " +
                   "Con trái ở vị trí " + left + " (số " + a[left] + ")";
        moTa += coPhai ? ", con phải ở vị trí " + right + " (số " + a[right] + ")." : ", không có con phải.";
        ghi(2, moTa, { n: n, i: i, left: left, right: coPhai ? right : "-", largest: largest }, ["i", "largest"],
            chup(n, i, largest, left, coPhai ? right : -1, null), null);

        // So sánh con trái với "vua" hiện tại a[largest]
        soSanh++;
        var cu = largest;
        if (a[left] > a[largest]) largest = left;
        ghi(5, "So sánh con trái a[" + left + "] = " + a[left] + " với a[largest] = " + a[cu] + ": " +
               (largest === left ? a[left] + " lớn hơn nên largest = " + left + "."
                                 : a[left] + " không lớn hơn nên largest vẫn là " + cu + "."),
            { n: n, i: i, left: left, right: coPhai ? right : "-", largest: largest }, largest === cu ? [] : ["largest"],
            chup(n, i, largest, left, coPhai ? right : -1, null), null);

        // So sánh con phải với "vua" hiện tại (có thể vừa đổi ở bước trên)
        if (coPhai) {
          soSanh++;
          var cu2 = largest;
          if (a[right] > a[largest]) largest = right;
          ghi(6, "So sánh con phải a[" + right + "] = " + a[right] + " với a[largest] = " + a[cu2] +
                 " (so với người đang dẫn đầu, không phải lúc nào cũng so với a[i]): " +
                 (largest === right ? a[right] + " lớn hơn nên largest = " + right + "."
                                    : a[right] + " không lớn hơn nên largest vẫn là " + cu2 + "."),
              { n: n, i: i, left: left, right: right, largest: largest }, largest === cu2 ? [] : ["largest"],
              chup(n, i, largest, left, right, null), null);
        }

        // Câu hỏi cho chế độ "Đoán": có phải đổi chỗ không, và đổi với ai?
        var luaChon = ["Không đổi chỗ", "Đổi với con trái (số " + a[left] + ")"];
        if (coPhai) luaChon.push("Đổi với con phải (số " + a[right] + ")");
        var dung = 0;
        if (largest === left) dung = 1;
        if (coPhai && largest === right) dung = 2;
        var cauHoi = {
          tieuDe: "Số " + a[i] + " ở vị trí " + i + " có phải chìm xuống không? Nếu có thì đổi chỗ với ai?",
          luaChon: luaChon,
          dung: dung,
          lyDo: largest === i
            ? a[i] + " đã lớn hơn hoặc bằng cả hai cấp dưới nên không cần đổi chỗ."
            : "Người mạnh nhất trong ba người là số " + a[largest] + ", nên số " + a[i] + " đổi chỗ với nó."
        };

        if (largest === i) {
          ghi(7, "largest = i = " + i + ": số " + a[i] + " lớn hơn hoặc bằng cả hai cấp dưới, không cần đổi chỗ. Dừng.",
              { n: n, i: i, largest: largest }, [], chup(n, i, largest, -1, -1, null), cauHoi);
          return;
        }

        ghi(7, "largest = " + largest + " khác i = " + i + ": có người mạnh hơn " + a[i] + ", phải đổi chỗ.",
            { n: n, i: i, largest: largest }, [], chup(n, i, largest, -1, -1, null), cauHoi);

        // Đổi chỗ a[i] và a[largest]
        var tam = a[i];
        a[i] = a[largest];
        a[largest] = tam;
        gan++;
        ghi(8, "Đổi chỗ: số " + a[i] + " lên vị trí " + i + ", số " + a[largest] + " chìm xuống vị trí " + largest + ".",
            { n: n, i: i, largest: largest }, [], chup(n, i, largest, -1, -1, [i, largest]), null);

        // "heapify(a, n, largest)": tiếp tục ở vị trí mới
        i = largest;
        ghi(9, "Gọi lại Heapify tại vị trí " + i + ": số " + a[i] + " vừa chìm xuống được so tiếp với cấp dưới mới.",
            { n: n, i: i }, ["i"], chup(n, i, -1, -1, -1, null), null);
      }
    }

    // ---------------------------------------------------------------
    // Giai đoạn 1: dựng Max Heap
    // ---------------------------------------------------------------
    var batDau = Math.floor(tong / 2) - 1;
    ghi(13, "Giai đoạn 1: dựng Max Heap. Cho i chạy từ n/2 − 1 = " + batDau + " về 0. " +
            "Các vị trí sau " + batDau + " là lá (không có cấp dưới) nên không cần xử lý.",
        { n: tong, "n/2-1": batDau }, [], chup(tong, -1, -1, -1, -1, null), null);

    for (var i = batDau; i >= 0; i--) {
      ghi(14, "i = " + i + ": gọi Heapify(a, " + tong + ", " + i + ") để số " + a[i] + " chìm xuống đúng chỗ.",
          { n: tong, i: i }, ["i"], chup(tong, i, -1, -1, -1, null), null);
      heapify(tong, i);
    }

    ghi(15, "Đã dựng xong Max Heap: mọi số đều lớn hơn hoặc bằng hai cấp dưới, số lớn nhất " + a[0] + " ở đỉnh. " +
            "Lưu ý: mảng CHƯA được sắp xếp. Giai đoạn 2 mới sắp xếp.",
        { n: tong }, [], chup(tong, -1, -1, -1, -1, null), null);

    // ---------------------------------------------------------------
    // Giai đoạn 2: lần lượt đưa số lớn nhất về cuối
    // ---------------------------------------------------------------
    for (var j = tong - 1; j >= 1; j--) {
      var soLon = a[0];
      var tam2 = a[0];
      a[0] = a[j];
      a[j] = tam2;
      gan++;
      ghi(16, "Đổi đỉnh a[0] = " + soLon + " (số lớn nhất của tháp) với phần tử cuối của tháp a[" + j + "]. " +
              "Số " + soLon + " đã vào đúng chỗ và bị khóa (màu xanh lá). Tháp co lại còn " + j + " phần tử.",
          { n: j, i: j }, [], chup(j, -1, -1, -1, -1, [0, j]), null);

      ghi(17, "Gọi Heapify(a, " + j + ", 0): cho số " + a[0] + " vừa lên đỉnh chìm xuống trong tháp còn " + j + " phần tử.",
          { n: j, i: 0 }, ["n"], chup(j, 0, -1, -1, -1, null), null);
      heapify(j, 0);
    }

    ghi(19, "Hoàn thành! Mảng đã tăng dần. Tổng cộng " + soSanh + " phép so sánh và " + gan + " lần đổi chỗ.",
        { n: tong }, [], chup(0, -1, -1, -1, -1, null), null);

    return cacBuoc;
  }

  // ---------------------------------------------------------------
  // Vẽ: một cái cây (SVG) phía trên, hàng ô của mảng phía dưới
  // ---------------------------------------------------------------

  // Quyết định màu (tên lớp CSS) của vị trí p trong bước h
  function trangThai(p, h) {
    if (h.trao && (p === h.trao[0] || p === h.trao[1])) return "doi-cho";
    if (p >= h.n) return "khoa";                       // đã nằm ngoài tháp: đúng chỗ
    if (p === h.i) return "dang-xet";
    if (p === h.largest) return "so-sanh";
    if (p === h.left || p === h.right) return "la-con";
    return "";
  }

  function ve(sanKhau, h) {
    var tong = h.a.length;

    // Đếm số tầng của cây: tầng t chứa 2^t phần tử
    var soTang = 1;
    while (Math.pow(2, soTang) - 1 < tong) soTang++;
    var cao = soTang * 66 + 16;

    // Bề rộng bản vẽ: dãy ngắn thì vẽ hẹp lại để các nút to, dễ nhìn (tối thiểu 320, tối đa 760)
    var rong = Math.min(760, Math.max(320, Math.pow(2, soTang - 1) * 80));

    // Toạ độ của nút ở vị trí p
    function toaDo(p) {
      var tang = 0;
      while (Math.pow(2, tang + 1) - 1 <= p) tang++;
      var thuTu = p - (Math.pow(2, tang) - 1);         // thứ tự trong tầng
      return {
        x: rong * (thuTu + 0.5) / Math.pow(2, tang),
        y: 30 + tang * 66
      };
    }

    var canh = "";
    var nut = "";
    for (var p = 1; p < tong; p++) {
      var cha = Math.floor((p - 1) / 2);
      var A = toaDo(cha);
      var B = toaDo(p);
      canh += '<line class="cay-canh' + (p >= h.n ? " khoa" : "") + '" x1="' + A.x + '" y1="' + A.y +
              '" x2="' + B.x + '" y2="' + B.y + '"/>';
    }
    for (p = 0; p < tong; p++) {
      var t = toaDo(p);
      nut += '<g class="cay-nut ' + trangThai(p, h) + '">' +
               '<circle cx="' + t.x + '" cy="' + t.y + '" r="21"/>' +
               '<text x="' + t.x + '" y="' + t.y + '">' + h.a[p] + '</text>' +
               '<text class="cay-so" x="' + t.x + '" y="' + (t.y + 33) + '">' + p + '</text>' +
             '</g>';
    }

    var mang = "";
    for (p = 0; p < tong; p++) {
      mang += '<div class="o-mang ' + trangThai(p, h) + (p === h.n && h.n < tong ? " dau-khoa" : "") + '">' +
                '<b>' + h.a[p] + '</b><small>' + p + '</small></div>';
    }

    sanKhau.innerHTML = '<div class="khung-heap">' +
        '<svg viewBox="0 0 ' + rong + ' ' + cao + '" role="img" aria-label="Cây Heap">' + canh + nut + '</svg>' +
        '<div class="hang-mang">' + mang + '</div></div>';
  }

  var lyThuyet = `
    <h2>Ý tưởng</h2>
    <p class="vi-du-doi-thuong"><b>Ví dụ đời thường:</b> một công ty có sơ đồ tổ chức hình tháp, người mạnh nhất làm giám đốc ở đỉnh. Heap Sort lặp lại: (1) sắp tháp sao cho giám đốc luôn là người mạnh nhất, (2) cho giám đốc ra khỏi công ty (đưa về cuối dãy), (3) lấy nhân viên cuối hàng lên ngồi tạm ghế giám đốc rồi để anh ta <b>tụt dần xuống</b> chỗ phù hợp. Lặp đến hết người thì dãy tự tăng dần.</p>

    <h3>Mảng nhìn thành cây</h3>
    <p>Người ở vị trí <code>i</code> có hai cấp dưới: <b>con trái ở <code>2i + 1</code></b> và <b>con phải ở <code>2i + 2</code></b>. Cha của vị trí <code>p</code> là <code>(p − 1) / 2</code> (lấy phần nguyên). <b>Max Heap</b> là cây mà mọi người đều lớn hơn hoặc bằng hai cấp dưới của mình, nên số lớn nhất luôn ở đỉnh <code>a[0]</code>.</p>

    <h3>Heapify: cho một số "chìm xuống"</h3>
    <ol>
      <li><code>largest = i</code> (tạm coi mình là mạnh nhất).</li>
      <li>So với con trái; nếu con trái lớn hơn <code>a[largest]</code> thì <code>largest = left</code>.</li>
      <li>So với con phải; nếu con phải lớn hơn <code>a[largest]</code> (người đang dẫn đầu) thì <code>largest = right</code>.</li>
      <li>Nếu <code>largest</code> khác <code>i</code>: đổi chỗ <code>a[i]</code> với <code>a[largest]</code>, rồi làm tiếp ở vị trí <code>largest</code>.</li>
    </ol>
    <p>Hai phép so sánh đều so với <code>a[largest]</code>, giống một giải đấu 3 người: mình đấu với con trái, người thắng đấu tiếp với con phải.</p>

    <h3>Hai giai đoạn</h3>
    <ul>
      <li><b>Giai đoạn 1: dựng Max Heap.</b> Cho <code>i</code> chạy từ <code>n/2 − 1</code> <i>về</i> 0, mỗi lần gọi Heapify. Đi từ dưới lên vì Heapify cần hai nhánh bên dưới đã là tháp hợp lệ. Các vị trí sau <code>n/2 − 1</code> là lá nên không cần xử lý. Giai đoạn này <b>chưa sắp xếp</b> mảng, chỉ đưa số lớn nhất lên đỉnh.</li>
      <li><b>Giai đoạn 2: sắp xếp.</b> Cho <code>i</code> chạy từ <code>n − 1</code> về 1: đổi <code>a[0]</code> với <code>a[i]</code> (đưa số lớn nhất về ô cuối của tháp, rồi khóa nó lại), sau đó Heapify tại vị trí 0 cho tháp còn <code>i</code> phần tử.</li>
    </ul>

    <h3>Độ phức tạp</h3>
    <p>Mỗi lần chìm xuống đi nhiều nhất bằng chiều cao cây (khoảng <code>log n</code> bước), và làm khoảng <code>n</code> lần, nên Heap Sort có độ phức tạp <b>O(n log n)</b>, nhanh hơn O(n²) của Insertion Sort khi <code>n</code> lớn. Với dãy nhỏ <code>7 3 15 9 1 18 12 5 16 8</code> nó tốn 40 phép so sánh (13 để dựng heap, 27 để sắp xếp), nhiều hơn Insertion Sort (26), vì <code>n</code> còn quá nhỏ để lợi thế lộ ra.</p>`;

  window.AlgoViet.thuatToan["heap-sort"] = {
    ten: "Heap Sort",
    doPhucTap: "O(n log n)",
    lyThuyet: lyThuyet,
    viDu: [2, 7, 4, 9, 1, 5],
    nhanDem: { gan: "lần đổi chỗ" },
    cachLam: {
      heap: { ten: "Dựng Max Heap rồi lấy dần số lớn nhất", code: code, tao: tao, ve: ve }
    },
    chuThich: {
      heap: [
        ["--tt-chua-xet", "Trong tháp"],
        ["--tt-dang-xet", "Đang chìm xuống (i)"],
        ["--tt-so-sanh", "Người mạnh nhất tạm thời (largest)"],
        ["--tt-sai", "Vừa đổi chỗ"],
        ["--tt-xong", "Đã khóa, đúng chỗ"]
      ]
    }
  };
})();
