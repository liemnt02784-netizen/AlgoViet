// =====================================================================
// MERGE SORT (sắp xếp trộn) — có 2 cách làm: Đệ quy và Không đệ quy
// Cấu trúc file giống insertion-sort.js: code, tao(), ve(), đăng ký.
// Cả 2 cách đều dùng chung 1 hàm merge() để trộn 2 đoạn đã có thứ tự,
// nên dùng chung 1 hàm ghi bước "thucHienMerge" và 1 hàm ve() để vẽ.
// =====================================================================
(function () {
  window.AlgoViet = window.AlgoViet || { thuatToan: {} };

  // ---------------------------------------------------------------
  // Hàm dùng chung: thực hiện việc trộn đoạn [l,mid] và [mid+1,r] của
  // mảng a, vừa trộn vừa ghi lại từng bước qua callback ghi(...).
  // Số dòng code (3,5,6,8,9,10) khớp với hàm merge() hiển thị ở phần code
  // của CẢ 2 cách làm (đệ quy và không đệ quy) vì merge() giống hệt nhau.
  // ---------------------------------------------------------------
  function thucHienMerge(a, l, mid, r, ghi, chup, dem) {
    var out = [];
    var i = l, j = mid + 1, k = 0;
    ghi(3, "Bắt đầu trộn [" + l + "," + mid + "] và [" + (mid + 1) + "," + r + "]: i=" + i + ", j=" + j + ", k=0.",
        { i: i, j: j }, ["i", "j"], chup(l, r, mid, i, j, k, out, false), null);

    while (i <= mid && j <= r) {
      dem.soSanh++;
      if (a[i] <= a[j]) {
        out[k] = a[i];
        ghi(5, "a[" + i + "]=" + a[i] + " ≤ a[" + j + "]=" + a[j] + " nên lấy a[" + i + "] vào output[" + k + "].",
            { i: i, j: j, k: k }, ["output"], chup(l, r, mid, i, j, k, out, false), null);
        i++;
      } else {
        out[k] = a[j];
        ghi(6, "a[" + i + "]=" + a[i] + " > a[" + j + "]=" + a[j] + " nên lấy a[" + j + "] vào output[" + k + "].",
            { i: i, j: j, k: k }, ["output"], chup(l, r, mid, i, j, k, out, false), null);
        j++;
      }
      k++; dem.gan++;
    }
    while (i <= mid) {
      out[k] = a[i];
      ghi(8, "Hết nửa phải, chép nốt a[" + i + "]=" + a[i] + " vào output[" + k + "].",
          { i: i, k: k }, ["output"], chup(l, r, mid, i, j, k, out, false), null);
      i++; k++; dem.gan++;
    }
    while (j <= r) {
      out[k] = a[j];
      ghi(9, "Hết nửa trái, chép nốt a[" + j + "]=" + a[j] + " vào output[" + k + "].",
          { j: j, k: k }, ["output"], chup(l, r, mid, i, j, k, out, false), null);
      j++; k++; dem.gan++;
    }
    for (var t = 0; t < out.length; t++) {
      a[l + t] = out[t];
      dem.gan++;
    }
    ghi(10, "Chép output trở lại a[" + l + ".." + r + "]: " + a.slice(l, r + 1).join(", ") + ".",
        {}, [], chup(l, r, mid, -1, -1, -1, out, false), null);
  }

  // dangXet i,j: con trỏ đang so sánh; kOut: vị trí vừa ghi vào output
  // Mảng chính vẽ dạng BIỂU ĐỒ CỘT (giống Insertion/Shell/Heap/Quick Sort)
  // để dễ nhìn ra thứ tự to nhỏ; mảng output (tạm) vẽ dạng ô số bên dưới.
  function ve(sanKhau, h) {
    var html = "";
    for (var p = 0; p < h.a.length; p++) {
      var loai = "chua-xet";
      if (h.xong) loai = "xong";
      else if (p < h.l || p > h.r) loai = "da-xet";       // ngoài đoạn đang trộn: làm mờ
      else if (p === h.i) loai = "dang-xet";               // con trỏ i (nửa trái)
      else if (p === h.j) loai = "so-sanh";                 // con trỏ j (nửa phải)
      else if (p >= h.l && p <= h.mid) loai = "da-xep";    // thuộc nửa trái
      else loai = "cung-nhom";                              // thuộc nửa phải

      var conTro = "";
      if (!h.xong) {
        if (p === h.i && p === h.j) conTro = "i,j ▼";
        else if (p === h.i) conTro = "i ▼";
        else if (p === h.j) conTro = "j ▼";
      }

      var cao = Math.round(40 + (h.a[p] / h.max) * 190);
      html += '<div class="cot-o">' +
                '<div class="con-tro">' + conTro + '</div>' +
                '<div class="nhan-tren"></div>' +
                '<div class="cot ' + loai + '" style="height:' + cao + 'px">' + h.a[p] + '</div>' +
                '<div class="chi-so">a[' + p + ']</div>' +
              '</div>';
    }
    var khung = '<div class="day-cot">' + html + '</div>';

    if (h.output) {
      var hangO = '<p class="nhan-hang">output (đoạn [' + h.l + ',' + h.r + ']):</p><div class="hang-mang">';
      var soO = h.r - h.l + 1;
      for (var o = 0; o < soO; o++) {
        var gt = (o < h.output.length) ? h.output[o] : null;
        var lopO = (o === h.kOut) ? "khoa dau-khoa" : (gt !== undefined && gt !== null ? "la-con" : "");
        hangO += '<div class="o-mang ' + lopO + '"><b>' + (gt === undefined || gt === null ? "·" : gt) + '</b></div>';
      }
      hangO += '</div>';
      khung += '<div class="khung-heap">' + hangO + '</div>';
    }

    sanKhau.innerHTML = khung;
  }

  // =================================================================
  // CÁCH 1: ĐỆ QUY
  // =================================================================
  var codeDeQuy = [
    "void merge(int a[], int left, int mid, int right) {", // 1
    "    int b[100];",                                      // 2
    "    int i = left, j = mid+1, k = 0;",                  // 3
    "    while (i <= mid && j <= right) {",                 // 4
    "        if (a[i] <= a[j]) b[k++] = a[i++];",           // 5
    "        else b[k++] = a[j++];",                        // 6
    "    }",                                                // 7
    "    while (i <= mid)   b[k++] = a[i++];",              // 8
    "    while (j <= right) b[k++] = a[j++];",              // 9
    "    for (int t = 0; t < k; t++) a[left+t] = b[t];",    // 10
    "}",                                                    // 11
    "",                                                      // 12
    "void mergeSort(int a[], int l, int r) {",              // 13
    "    if (l >= r) return;",                              // 14
    "    int mid = (l+r)/2;",                                // 15
    "    mergeSort(a, l, mid);",                             // 16
    "    mergeSort(a, mid+1, r);",                           // 17
    "    merge(a, l, mid, r);",                              // 18
    "}"                                                      // 19
  ];

  function taoDeQuy(so) {
    var a = so.slice();
    var n = a.length;
    var cacBuoc = [];
    var dem = { soSanh: 0, gan: 0 };
    var lonNhat = 0;
    for (var m0 = 0; m0 < n; m0++) { if (a[m0] > lonNhat) lonNhat = a[m0]; }

    function ghi(dong, giaiThich, bien, vuaDoi, hinh, cauHoi) {
      cacBuoc.push({ dong: dong, giaiThich: giaiThich, bien: bien, vuaDoi: vuaDoi,
        dem: { soSanh: dem.soSanh, gan: dem.gan }, hinh: hinh, cauHoi: cauHoi });
    }
    function chup(l, r, mid, i, j, kOut, output, xong) {
      return { a: a.slice(), max: lonNhat, l: l, r: r, mid: mid, i: i, j: j, kOut: kOut, output: output ? output.slice() : null, xong: xong };
    }

    ghi(13, "Gọi mergeSort(a, 0, " + (n - 1) + ") để sắp xếp toàn bộ mảng.",
        { l: 0, r: n - 1 }, [], chup(0, n - 1, -1, -1, -1, -1, null, false), null);

    function chay(l, r) {
      if (l >= r) {
        ghi(14, "Đoạn [" + l + "," + r + "] chỉ còn 0 hoặc 1 phần tử, đã có thứ tự, dừng đệ quy.",
            { l: l, r: r }, [], chup(l, r, -1, -1, -1, -1, null, false), null);
        return;
      }
      var mid = Math.floor((l + r) / 2);
      ghi(15, "Đoạn [" + l + "," + r + "]: chia đôi tại mid = " + mid + ".",
          { l: l, r: r, mid: mid }, ["mid"], chup(l, r, mid, -1, -1, -1, null, false), null);

      ghi(16, "Đệ quy sắp xếp nửa trái [" + l + "," + mid + "].",
          { l: l, r: mid }, [], chup(l, r, mid, -1, -1, -1, null, false), null);
      chay(l, mid);

      ghi(17, "Đệ quy sắp xếp nửa phải [" + (mid + 1) + "," + r + "].",
          { l: mid + 1, r: r }, [], chup(l, r, mid, -1, -1, -1, null, false), null);
      chay(mid + 1, r);

      ghi(18, "Trộn 2 nửa đã có thứ tự lại với nhau bằng merge(a, " + l + ", " + mid + ", " + r + ").",
          { l: l, mid: mid, r: r }, [], chup(l, r, mid, -1, -1, -1, null, false), null);
      thucHienMerge(a, l, mid, r, ghi, chup, dem);
    }

    chay(0, n - 1);

    ghi(19, "Hoàn thành! Mảng đã được sắp xếp tăng dần: " + a.join(", ") + ".",
        {}, [], chup(0, n - 1, -1, -1, -1, -1, null, true), null);

    return cacBuoc;
  }

  // =================================================================
  // CÁCH 2: KHÔNG ĐỆ QUY (trộn theo độ dài đoạn len = 1,2,4,8,...)
  // =================================================================
  var codeKhongDeQuy = [
    "void merge(int a[], int left, int mid, int right) {", // 1
    "    int b[100];",                                      // 2
    "    int i = left, j = mid+1, k = 0;",                  // 3
    "    while (i <= mid && j <= right) {",                 // 4
    "        if (a[i] <= a[j]) b[k++] = a[i++];",           // 5
    "        else b[k++] = a[j++];",                        // 6
    "    }",                                                // 7
    "    while (i <= mid)   b[k++] = a[i++];",              // 8
    "    while (j <= right) b[k++] = a[j++];",              // 9
    "    for (int t = 0; t < k; t++) a[left+t] = b[t];",    // 10
    "}",                                                    // 11
    "",                                                      // 12
    "void mergeSort(int a[], int n) {",                     // 13
    "    for (int len = 1; len < n; len *= 2) {",           // 14
    "        for (int left = 0; left < n-1; left += 2*len) {", // 15
    "            int mid = min(left+len-1, n-1);",          // 16
    "            int right = min(left+2*len-1, n-1);",      // 17
    "            merge(a, left, mid, right);",              // 18
    "        }",                                            // 19
    "    }",                                                // 20
    "}"                                                     // 21
  ];

  function taoKhongDeQuy(so) {
    var a = so.slice();
    var n = a.length;
    var cacBuoc = [];
    var dem = { soSanh: 0, gan: 0 };
    var lonNhat = 0;
    for (var m0 = 0; m0 < n; m0++) { if (a[m0] > lonNhat) lonNhat = a[m0]; }

    function ghi(dong, giaiThich, bien, vuaDoi, hinh, cauHoi) {
      cacBuoc.push({ dong: dong, giaiThich: giaiThich, bien: bien, vuaDoi: vuaDoi,
        dem: { soSanh: dem.soSanh, gan: dem.gan }, hinh: hinh, cauHoi: cauHoi });
    }
    function chup(l, r, mid, i, j, kOut, output, xong) {
      return { a: a.slice(), max: lonNhat, l: l, r: r, mid: mid, i: i, j: j, kOut: kOut, output: output ? output.slice() : null, xong: xong };
    }

    for (var len = 1; len < n; len *= 2) {
      ghi(14, "Độ dài đoạn len = " + len + ": trộn từng cặp đoạn dài " + len + " phần tử lại với nhau.",
          { len: len }, ["len"], chup(0, n - 1, -1, -1, -1, -1, null, false), null);

      for (var left = 0; left < n - 1; left += 2 * len) {
        var mid = Math.min(left + len - 1, n - 1);
        var right = Math.min(left + 2 * len - 1, n - 1);
        ghi(17, "Cặp đoạn [" + left + "," + mid + "] và [" + (mid + 1) + "," + right + "] (right = " + right + ").",
            { left: left, mid: mid, right: right }, ["mid", "right"], chup(left, right, mid, -1, -1, -1, null, false), null);

        if (mid >= right) {
          ghi(18, "Nửa phải rỗng (mid ≥ right), không cần trộn, bỏ qua.",
              { left: left, mid: mid, right: right }, [], chup(left, right, mid, -1, -1, -1, null, false), null);
          continue;
        }
        ghi(18, "Trộn bằng merge(a, " + left + ", " + mid + ", " + right + ").",
            { left: left, mid: mid, right: right }, [], chup(left, right, mid, -1, -1, -1, null, false), null);
        thucHienMerge(a, left, mid, right, ghi, chup, dem);
      }
    }

    ghi(21, "Hoàn thành! Mảng đã được sắp xếp tăng dần: " + a.join(", ") + ".",
        {}, [], chup(0, n - 1, -1, -1, -1, -1, null, true), null);

    return cacBuoc;
  }

  var lyThuyet = `
    <h2>Ý tưởng</h2>
    <p class="vi-du-doi-thuong"><b>Ví dụ đời thường:</b> giống việc gộp 2 chồng bài đã xếp sẵn theo thứ tự thành 1 chồng duy nhất — mỗi lần chỉ cần nhìn lá trên cùng của 2 chồng, lấy lá nhỏ hơn đặt xuống trước. Merge Sort chia mảng thành những đoạn nhỏ (coi như đã "sắp xếp" khi chỉ còn 1 phần tử), rồi gộp (trộn) dần các đoạn đã sắp xếp lại với nhau.</p>

    <h3>Hai cách cài đặt</h3>
    <ul>
      <li><b>Đệ quy:</b> chia đôi đoạn [l, r] liên tục (gọi lại chính <code>mergeSort</code>) cho đến khi chỉ còn 0-1 phần tử, rồi trộn ngược lên dần theo từng cặp đoạn con.</li>
      <li><b>Không đệ quy:</b> không chia bằng đệ quy, mà bắt đầu trộn các đoạn độ dài 1, rồi độ dài 2, rồi 4, 8... (nhân đôi mỗi vòng) cho đến khi độ dài đoạn ≥ n. Cho ra đúng kết quả giống hệt bản đệ quy, chỉ khác thứ tự thực hiện các lần trộn.</li>
    </ul>

    <h3>Hàm merge() — trái tim của thuật toán</h3>
    <p>Trộn 2 đoạn <b>đã có thứ tự</b> <code>[left, mid]</code> và <code>[mid+1, right]</code> thành 1 đoạn có thứ tự: dùng 2 con trỏ <code>i, j</code> chạy trên 2 đoạn, mỗi bước so sánh <code>a[i]</code> với <code>a[j]</code>, lấy số nhỏ hơn đưa vào mảng tạm <code>output</code>, rồi chép <code>output</code> trở lại mảng gốc.</p>

    <h3>Độ phức tạp</h3>
    <p>Cả 2 cách đều <b>O(n log n)</b> ở mọi trường hợp (tốt nhất, trung bình, xấu nhất) — vì luôn chia đôi đều đặn, không phụ thuộc dữ liệu đầu vào như Quick Sort.</p>`;

  window.AlgoViet.thuatToan["merge-sort"] = {
    ten: "Merge Sort",
    doPhucTap: "O(n log n)",
    lyThuyet: lyThuyet,
    viDu: [12, 2, 8, 5, 1, 6, 4, 15],
    cachLam: {
      deQuy: { ten: "Đệ quy", code: codeDeQuy, tao: taoDeQuy, ve: ve },
      khongDeQuy: { ten: "Không đệ quy", code: codeKhongDeQuy, tao: taoKhongDeQuy, ve: ve }
    },
    chuThich: {
      deQuy: [
        ["--tt-da-xet", "Ngoài đoạn [l, r] đang xét"],
        ["--tt-dang-xet", "Con trỏ i (nửa trái)"],
        ["--tt-so-sanh", "Con trỏ j (nửa phải)"],
        ["--tt-min", "Vừa ghi vào output"],
        ["--tt-xong", "Hoàn thành"]
      ],
      khongDeQuy: [
        ["--tt-da-xet", "Ngoài đoạn đang trộn"],
        ["--tt-dang-xet", "Con trỏ i (nửa trái)"],
        ["--tt-so-sanh", "Con trỏ j (nửa phải)"],
        ["--tt-min", "Vừa ghi vào output"],
        ["--tt-xong", "Hoàn thành"]
      ]
    }
  };
})();
