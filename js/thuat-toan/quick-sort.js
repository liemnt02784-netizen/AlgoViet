// =====================================================================
// QUICK SORT (sắp xếp nhanh, chia để trị)
// Cấu trúc file giống insertion-sort.js: code, tao(), ve(), đăng ký.
//
// Bản cài đặt này KHÔNG tách hàm phân hoạch riêng: pivot lấy phần tử
// GIỮA đoạn [l, r], dùng 2 con trỏ i, j quét từ 2 đầu vào giữa, đổi
// chỗ khi gặp cặp sai thứ tự, rồi đệ quy xuống 2 đoạn con.
// =====================================================================
(function () {
  window.AlgoViet = window.AlgoViet || { thuatToan: {} };

  var code = [
    "void quickSort(int a[], int l, int r){", // 1
    "    int p = a[(l+r)/2];",                // 2
    "    int i = l, j = r;",                  // 3
    "    while (i < j){",                     // 4
    "        while (a[i] < p){",              // 5
    "            i++;",                       // 6
    "        }",                              // 7
    "        while (a[j] > p){",              // 8
    "            j--;",                       // 9
    "        }",                              // 10
    "        if (i <= j){",                   // 11
    "            int temp = a[i];",           // 12
    "            a[i] = a[j];",               // 13
    "            a[j] = temp;",               // 14
    "            i++;",                       // 15
    "            j--;",                       // 16
    "        }",                              // 17
    "    }",                                  // 18
    "    if (i < r){",                        // 19
    "        quickSort(a, i, r);",            // 20
    "    }",                                  // 21
    "    if (l < j){",                        // 22
    "        quickSort(a, l, j);",            // 23
    "    }",                                  // 24
    "}"                                       // 25
  ];

  function tao(so) {
    var a = so.slice();
    var n = a.length;
    var cacBuoc = [];
    var soSanh = 0;
    var gan = 0;

    var lonNhat = 0;
    for (var m0 = 0; m0 < n; m0++) {
      if (a[m0] > lonNhat) lonNhat = a[m0];
    }

    function ghi(dong, giaiThich, bien, vuaDoi, hinh, cauHoi) {
      cacBuoc.push({
        dong: dong, giaiThich: giaiThich, bien: bien, vuaDoi: vuaDoi,
        dem: { soSanh: soSanh, gan: gan }, hinh: hinh, cauHoi: cauHoi
      });
    }

    // "Chụp ảnh" trạng thái để vẽ.
    //   l, r      : đoạn đang xét (ngoài đoạn này được làm mờ)
    //   p         : giá trị pivot của đoạn hiện tại (-1 nếu chưa chọn)
    //   pivotIdx  : VỊ TRÍ hiện tại của pivot trong mảng (-1 nếu chưa chọn).
    //               Phải theo dõi riêng vì pivot có thể bị đổi chỗ sang ô khác.
    //   i, j      : hai con trỏ quét (-1 nếu chưa có)
    //   soSanhVoi : vị trí đang so sánh với pivot (-1 nếu không có)
    //   doiA,doiB : hai vị trí vừa đổi chỗ cho nhau (-1 nếu không có)
    function chup(l, r, p, pivotIdx, i, j, soSanhVoi, doiA, doiB, xong) {
      return {
        a: a.slice(), max: lonNhat, l: l, r: r, p: p, pivotIdx: pivotIdx, i: i, j: j,
        soSanhVoi: soSanhVoi, doiA: doiA, doiB: doiB, xong: xong
      };
    }

    ghi(1, "Gọi quickSort(a, 0, " + (n - 1) + ") để sắp xếp toàn bộ mảng.",
        { l: 0, r: n - 1 }, [], chup(0, n - 1, -1, -1, -1, -1, -1, -1, -1, false), null);

    function chay(l, r) {
      var mid = Math.floor((l + r) / 2);
      var p = a[mid];
      var pivotIdx = mid;          // vị trí hiện tại của pivot, cập nhật mỗi khi bị đổi chỗ
      gan++;
      ghi(2, "Đoạn [" + l + ", " + r + "]: chọn pivot p = a[" + mid + "] = " + p + " (phần tử ở giữa).",
          { l: l, r: r, p: p }, ["p"], chup(l, r, p, pivotIdx, -1, -1, mid, -1, -1, false), null);

      var i = l, j = r;
      ghi(3, "Đặt i = " + l + ", j = " + r + ", quét từ hai đầu vào giữa.",
          { l: l, r: r, p: p, i: i, j: j }, ["i", "j"], chup(l, r, p, pivotIdx, i, j, -1, -1, -1, false), null);

      while (i < j) {
        while (true) {
          soSanh++;
          if (a[i] < p) {
            ghi(6, "a[" + i + "] = " + a[i] + " < p (" + p + ") nên tăng i lên " + (i + 1) + ".",
                { i: i, "a[i]": a[i], p: p }, ["i"], chup(l, r, p, pivotIdx, i, j, i, -1, -1, false), null);
            i++;
          } else {
            ghi(5, "Dừng quét i tại i = " + i + " vì a[" + i + "] = " + a[i] + " không nhỏ hơn p (" + p + ").",
                { i: i, "a[i]": a[i], p: p }, [], chup(l, r, p, pivotIdx, i, j, i, -1, -1, false), null);
            break;
          }
        }
        while (true) {
          soSanh++;
          if (a[j] > p) {
            ghi(9, "a[" + j + "] = " + a[j] + " > p (" + p + ") nên giảm j xuống " + (j - 1) + ".",
                { j: j, "a[j]": a[j], p: p }, ["j"], chup(l, r, p, pivotIdx, i, j, j, -1, -1, false), null);
            j--;
          } else {
            ghi(8, "Dừng quét j tại j = " + j + " vì a[" + j + "] = " + a[j] + " không lớn hơn p (" + p + ").",
                { j: j, "a[j]": a[j], p: p }, [], chup(l, r, p, pivotIdx, i, j, j, -1, -1, false), null);
            break;
          }
        }

        if (i <= j) {
          if (i !== j) {
            var tam = a[i]; a[i] = a[j]; a[j] = tam;
            gan += 3;
            // pivot nằm trong 2 ô vừa đổi chỗ thì phải cập nhật lại vị trí của nó
            if (pivotIdx === i) pivotIdx = j;
            else if (pivotIdx === j) pivotIdx = i;
            ghi(13, "i (" + i + ") <= j (" + j + "): đổi chỗ a[" + i + "] và a[" + j + "].",
                { i: i, j: j }, ["a[i]", "a[j]"], chup(l, r, p, pivotIdx, i, j, -1, i, j, false), null);
          } else {
            ghi(11, "i == j (" + i + "), không cần đổi chỗ.",
                { i: i, j: j }, [], chup(l, r, p, pivotIdx, i, j, -1, -1, -1, false), null);
          }
          i++; j--;
          ghi(16, "Dịch i++ , j-- để tiếp tục quét (i = " + i + ", j = " + j + ").",
              { i: i, j: j }, ["i", "j"], chup(l, r, p, pivotIdx, i, j, -1, -1, -1, false), null);
        }
      }

      ghi(18, "Dừng vì i (" + i + ") >= j (" + j + "). Đoạn [" + l + ", " + r + "] đã chia theo pivot: " +
              "bên trái ≤ " + p + ", bên phải ≥ " + p + ".",
          { l: l, r: r, i: i, j: j }, [], chup(l, r, p, pivotIdx, i, j, -1, -1, -1, false), null);

      if (i < r) {
        ghi(20, "Đệ quy sắp xếp đoạn bên phải [" + i + ", " + r + "].",
            { l: i, r: r }, [], chup(l, r, p, pivotIdx, i, j, -1, -1, -1, false), null);
        chay(i, r);
      }
      if (l < j) {
        ghi(23, "Đệ quy sắp xếp đoạn bên trái [" + l + ", " + j + "].",
            { l: l, r: j }, [], chup(l, r, p, pivotIdx, i, j, -1, -1, -1, false), null);
        chay(l, j);
      }
    }

    chay(0, n - 1);

    ghi(25, "Hoàn thành! Mảng đã được sắp xếp tăng dần: " + a.join(", ") + ".",
        { n: n }, [], chup(0, n - 1, -1, -1, -1, -1, -1, -1, -1, true), null);

    return cacBuoc;
  }

  function ve(sanKhau, h) {
    var html = "";
    for (var p = 0; p < h.a.length; p++) {
      var loai = "chua-xet";
      var giaTri = h.a[p];
      var nhan = "";

      if (h.xong) {
        loai = "xong";
      } else if (p < h.l || p > h.r) {
        loai = "da-xet";          // ngoài đoạn [l, r] đang xét: làm mờ
      } else if (p === h.doiA || p === h.doiB) {
        loai = "cung-nhom";        // vừa đổi chỗ
      } else if (p === h.pivotIdx) {
        loai = "la-min";           // đang là pivot: nổi bật rõ nhất để dễ theo dõi
        nhan = '<span class="nhan-min">p</span>';
      } else if (p === h.soSanhVoi) {
        loai = "so-sanh";          // đang so sánh với pivot
      }

      var conTro = "";
      if (!h.xong) {
        if (p === h.i && p === h.j) conTro = "i,j ▼";
        else if (p === h.i) conTro = "i ▼";
        else if (p === h.j) conTro = "j ▼";
      }

      var cao = Math.round(40 + (giaTri / h.max) * 190);
      html += '<div class="cot-o">' +
                '<div class="con-tro">' + conTro + '</div>' +
                '<div class="nhan-tren">' + nhan + '</div>' +
                '<div class="cot ' + loai + '" style="height:' + cao + 'px">' + giaTri + '</div>' +
                '<div class="chi-so">a[' + p + ']</div>' +
              '</div>';
    }
    sanKhau.innerHTML = '<div class="day-cot">' + html + '</div>';
  }

  var lyThuyet = `
    <h2>Ý tưởng</h2>
    <p class="vi-du-doi-thuong"><b>Ví dụ đời thường:</b> giống trò chơi xếp hạng chiều cao. Chọn 1 bạn làm mốc (pivot), những ai thấp hơn đứng bên trái, cao hơn đứng bên phải. Sau đó lặp lại trò chơi này cho từng nhóm nhỏ hơn, đến khi mỗi nhóm chỉ còn 1 người.</p>

    <h3>Các bước (bản cài đặt này)</h3>
    <ol>
      <li><b>Chọn pivot:</b> lấy phần tử ở giữa đoạn, <code>p = a[(l+r)/2]</code>.</li>
      <li><b>Quét hai đầu:</b> con trỏ <code>i</code> từ trái đi sang phải, dừng khi gặp số <code>≥ p</code>. Con trỏ <code>j</code> từ phải đi sang trái, dừng khi gặp số <code>≤ p</code>.</li>
      <li><b>Đổi chỗ:</b> nếu <code>i ≤ j</code>, đổi chỗ <code>a[i]</code> và <code>a[j]</code>, rồi dịch <code>i++, j--</code>.</li>
      <li><b>Lặp lại</b> bước 2-3 cho đến khi <code>i ≥ j</code>. Lúc này đoạn đã được chia: bên trái toàn số <code>≤ p</code>, bên phải toàn số <code>≥ p</code>.</li>
      <li><b>Đệ quy:</b> gọi lại chính <code>quickSort</code> cho đoạn <code>[i, r]</code> và đoạn <code>[l, j]</code>.</li>
    </ol>
    <p><b>Khác với các thuật toán Sắp xếp khác:</b> Quick Sort không gộp 2 mảng con lại (không cần bước "trộn" như Merge Sort) — việc chia theo pivot ở bước 2-3 đã sắp đúng tương đối giữa 2 bên, nên chỉ cần đệ quy xuống rồi xong, không làm gì thêm.</p>

    <h3>Độ phức tạp</h3>
    <table>
      <tr><th>Trường hợp</th><th>Khi nào</th><th>Độ phức tạp</th></tr>
      <tr><td>Trung bình</td><td>Pivot chia đôi mảng khá đều</td><td>O(n log n)</td></tr>
      <tr><td>Xấu nhất</td><td>Pivot luôn là số nhỏ/lớn nhất (mảng đã gần như có thứ tự, chọn pivot tệ)</td><td>O(n²)</td></tr>
    </table>
    <p>Vì bản này chọn pivot là phần tử <b>ở giữa</b> (không phải đầu hay cuối), nên với dữ liệu đã gần sắp xếp sẵn thì ít rơi vào trường hợp xấu nhất hơn so với chọn pivot ở đầu/cuối mảng.</p>`;

  window.AlgoViet.thuatToan["quick-sort"] = {
    ten: "Quick Sort",
    doPhucTap: "O(n log n)",
    lyThuyet: lyThuyet,
    viDu: [7, 3, 15, 9, 1, 18, 12, 5],
    cachLam: {
      chiaDeTri: { ten: "Chia để trị (pivot giữa)", code: code, tao: tao, ve: ve }
    },
    chuThich: {
      chiaDeTri: [
        ["--tt-chua-xet", "Trong đoạn [l, r] đang xét"],
        ["--tt-da-xet", "Ngoài đoạn [l, r] đang xét"],
        ["--tt-min", "Pivot (vị trí có thể đổi khi bị hoán đổi)"],
        ["--tt-so-sanh", "Đang so sánh với pivot (i hoặc j)"],
        ["--tt-cung-nhom", "Vừa đổi chỗ"],
        ["--tt-xong", "Hoàn thành"]
      ]
    }
  };
})();
