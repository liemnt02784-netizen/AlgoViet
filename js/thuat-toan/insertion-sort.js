// =====================================================================
// INSERTION SORT (sắp xếp chèn)
//
// Một file thuật toán của AlgoViet gồm 4 phần:
//   1. code     : các dòng code C++ hiển thị cho người học
//   2. tao(so)  : CHẠY thuật toán trên mảng "so" và GHI LẠI từng bước vào một danh sách
//   3. ve(...)  : vẽ MỘT bước ra màn hình (các cột số)
//   4. đăng ký  : (ở cuối file) đưa 3 thứ trên vào "AlgoViet.thuatToan"
//
// Trình phát (trinh-phat.js) chỉ việc đọc danh sách bước rồi hiển thị,
// nên bấm "Lùi" không cần tính lại gì cả.
// =====================================================================
(function () {
  window.AlgoViet = window.AlgoViet || { thuatToan: {} };

  // ---------------------------------------------------------------
  // 1. Code C++ hiển thị. Mỗi phần tử là một dòng, đếm số dòng từ 1.
  // ---------------------------------------------------------------
  var code = [
    "void insertionSort(int a[], int n) {",          // dòng 1
    "    for (int i = 1; i < n; i++) {",             // dòng 2
    "        int x = a[i];",                         // dòng 3
    "        int k;",                                // dòng 4
    "        for (k = i; k > 0 && a[k-1] > x; k--)", // dòng 5
    "            a[k] = a[k-1];",                    // dòng 6
    "        a[k] = x;",                             // dòng 7
    "    }",                                         // dòng 8
    "}"                                              // dòng 9
  ];

  // ---------------------------------------------------------------
  // 2. Chạy thuật toán và ghi lại từng bước
  // ---------------------------------------------------------------
  function tao(so) {
    var a = so.slice();          // slice() = sao chép mảng (để không làm hỏng mảng gốc)
    var n = a.length;
    var cacBuoc = [];            // danh sách các bước sẽ trả về
    var soSanh = 0;              // đếm số lần tính a[k-1] > x
    var gan = 0;                 // đếm số phép gán (x = a[i], a[k] = a[k-1], a[k] = x)

    // Tìm số lớn nhất để các cột có chiều cao cố định, không nhảy lên xuống mỗi bước
    var lonNhat = 0;
    for (var m = 0; m < n; m++) {
      if (a[m] > lonNhat) lonNhat = a[m];
    }

    // Thêm một bước vào danh sách.
    //   dong      : dòng code đang chạy (để tô sáng)
    //   giaiThich : câu giải thích bằng tiếng Việt
    //   bien      : các biến và giá trị của chúng (hiện ở bảng biến)
    //   vuaDoi    : tên các biến vừa thay đổi (để đánh dấu)
    //   hinh      : dữ liệu để hàm ve() vẽ
    //   cauHoi    : câu hỏi cho chế độ "Đoán bước tiếp theo" (có thể là null)
    function ghi(dong, giaiThich, bien, vuaDoi, hinh, cauHoi) {
      cacBuoc.push({
        dong: dong,
        giaiThich: giaiThich,
        bien: bien,
        vuaDoi: vuaDoi,
        dem: { soSanh: soSanh, gan: gan },
        hinh: hinh,
        cauHoi: cauHoi
      });
    }

    // "Chụp ảnh" trạng thái hiện tại của mảng để vẽ
    //   i, k : vị trí đang chèn và vị trí ô trống   (-1 nếu chưa có)
    //   x    : số đang cầm trên tay                  (null nếu chưa có)
    //   vung : các ô từ 0 đến "vung" là phần đã sắp xếp
    function chup(i, k, x, soSanhVoi, vung, xong) {
      return {
        a: a.slice(), max: lonNhat,
        i: i, k: k, x: x,
        soSanhVoi: soSanhVoi, vung: vung, xong: xong
      };
    }

    ghi(2, "Bắt đầu: phần tử đầu a[0] = " + a[0] + " coi như đã có thứ tự (dãy 1 phần tử luôn có thứ tự). " +
           "Từ i = 1, ta lần lượt chèn từng phần tử vào đúng chỗ trong phần bên trái.",
        { n: n }, [], chup(-1, -1, null, -1, 0, false), null);

    for (var i = 1; i < n; i++) {
      var x = a[i];
      var k = i;
      gan++;
      ghi(3, "Lấy a[" + i + "] = " + x + " ra, gọi là x. Ô số " + i + " thành ô trống; " +
             "ta tìm chỗ cho x trong phần bên trái.",
          { i: i, x: x, k: k }, ["i", "x", "k"], chup(i, k, x, -1, i, false), null);

      // Vòng lặp: while (true) ... break  tương đương với điều kiện  k > 0 && a[k-1] > x
      while (true) {
        if (k === 0) {
          ghi(5, "k = 0: đã chạm đầu mảng, không còn số nào bên trái để so sánh nên dừng.",
              { i: i, x: x, k: k }, [], chup(i, k, x, -1, i, false), null);
          break;
        }

        soSanh++;
        var lonHon = a[k - 1] > x;
        var cauHoi = {
          tieuDe: "So sánh a[" + (k - 1) + "] = " + a[k - 1] + " với x = " + x +
                  ". Số " + a[k - 1] + " có bị đẩy sang phải không?",
          luaChon: ["Có, dịch sang phải", "Không, dừng lại"],
          dung: lonHon ? 0 : 1,
          lyDo: lonHon
            ? a[k - 1] + " > " + x + ", nên " + a[k - 1] + " phải nhường chỗ (dịch sang phải)."
            : a[k - 1] + " không lớn hơn " + x + ", đã tìm được chỗ của x nên dừng."
        };
        var moTa = "So sánh a[" + (k - 1) + "] = " + a[k - 1] + " với x = " + x + ": " +
                   (lonHon ? a[k - 1] + " > " + x + " nên ĐÚNG, phải dịch " + a[k - 1] + " sang phải."
                           : a[k - 1] + " không lớn hơn " + x + " nên SAI, dừng lại.");
        ghi(5, moTa, { i: i, x: x, k: k, "a[k-1]": a[k - 1] }, [],
            chup(i, k, x, k - 1, i, false), cauHoi);

        if (!lonHon) break;

        // dịch a[k-1] sang ô k, ô trống lùi về k-1
        a[k] = a[k - 1];
        gan++;
        k = k - 1;
        ghi(6, "Dịch số " + a[k + 1] + " sang phải một ô. Ô trống lùi về vị trí " + k + ".",
            { i: i, x: x, k: k }, ["k"], chup(i, k, x, -1, i, false), null);
      }

      a[k] = x;
      gan++;
      ghi(7, "Đặt x = " + x + " vào ô trống (vị trí " + k + "). Bây giờ a[0.." + i + "] đã có thứ tự.",
          { i: i, x: x, k: k }, [], chup(i, -1, null, -1, i, false), null);
    }

    ghi(9, "Hoàn thành! Đã dùng " + soSanh + " phép so sánh và " + gan + " phép gán cho " + n + " phần tử.",
        { n: n }, [], chup(-1, -1, null, -1, n - 1, true), null);

    return cacBuoc;
  }

  // ---------------------------------------------------------------
  // 3. Vẽ một bước: mỗi phần tử của mảng là một cột
  //    Màu của cột do tên lớp CSS quyết định (xem giao-dien.css)
  // ---------------------------------------------------------------
  function ve(sanKhau, h) {
    var html = "";
    for (var p = 0; p < h.a.length; p++) {
      var loai = "chua-xet";       // tên lớp CSS => màu cột
      var giaTri = h.a[p];
      var nhan = "";               // nhãn nhỏ phía trên cột

      if (h.xong) {
        loai = "xong";
      } else if (p === h.k) {
        loai = "cho-chen";         // ô trống: vẽ bóng mờ của x
        giaTri = h.x;
        nhan = '<span class="nhan-min">x</span>';
      } else if (p === h.soSanhVoi) {
        loai = "so-sanh";
      } else if (p <= h.vung) {
        loai = "da-xep";           // phần bên trái đã sắp xếp
      }

      var conTro = "";             // mũi tên chỉ vị trí i và k
      if (!h.xong) {
        if (p === h.i && p === h.k) conTro = "i,k ▼";
        else if (p === h.k) conTro = "k ▼";
        else if (p === h.i) conTro = "i ▼";
      }

      var cao = Math.round(40 + (giaTri / h.max) * 190);   // chiều cao cột theo giá trị
      html += '<div class="cot-o">' +
                '<div class="con-tro">' + conTro + '</div>' +
                '<div class="nhan-tren">' + nhan + '</div>' +
                '<div class="cot ' + loai + '" style="height:' + cao + 'px">' + giaTri + '</div>' +
                '<div class="chi-so">a[' + p + ']</div>' +
              '</div>';
    }
    sanKhau.innerHTML = '<div class="day-cot">' + html + '</div>';
  }

  // ---------------------------------------------------------------
  // Phần lý thuyết (HTML). Dấu ` ` cho phép viết chuỗi nhiều dòng.
  // ---------------------------------------------------------------
  var lyThuyet = `
    <h2>Ý tưởng</h2>
    <p class="vi-du-doi-thuong"><b>Ví dụ đời thường:</b> bạn cầm các lá bài trên tay và rút từng lá từ bộ bài trên bàn. Mỗi lá rút ra, bạn <b>chèn vào đúng chỗ</b> trong phần bài đã xếp sẵn, đẩy các lá lớn hơn sang phải để nhường chỗ.</p>

    <h3>Các bước</h3>
    <p>Giả sử <code>a[0..i-1]</code> đã có thứ tự. Lấy <code>x = a[i]</code>, so sánh với các số bên trái từ gần đến xa: số nào lớn hơn <code>x</code> thì dịch sang phải một ô. Gặp số nhỏ hơn hoặc bằng <code>x</code> (hoặc hết mảng) thì đặt <code>x</code> vào ô trống. Khi đó <code>a[0..i]</code> đã có thứ tự.</p>

    <h3>Hiểu điều kiện <code>k &gt; 0 &amp;&amp; a[k-1] &gt; x</code></h3>
    <ul>
      <li><code>k &gt; 0</code>: còn ô bên trái để so sánh (tránh đọc <code>a[-1]</code> nằm ngoài mảng).</li>
      <li><code>a[k-1] &gt; x</code>: số bên trái lớn hơn <code>x</code> nên phải nhường chỗ. Dùng <code>&gt;</code> chứ không phải <code>&gt;=</code> để hai số bằng nhau không bị đảo chỗ.</li>
    </ul>
    <p>Thứ tự hai vế rất quan trọng: C kiểm tra từ trái sang phải và dừng ngay khi vế trái sai, nên khi <code>k = 0</code> máy không bao giờ đụng tới <code>a[-1]</code>.</p>
    <p><b>Lưu ý khi tự cài đặt:</b> phải khai báo <code>int k;</code> <i>trước</i> vòng for. Slide khai báo <code>k</code> ngay trong for nên dòng <code>a[k] = x;</code> phía sau sẽ báo lỗi biên dịch.</p>

    <h3>Độ phức tạp</h3>
    <table>
      <tr><th>Trường hợp</th><th>Khi nào</th><th>Số phép so sánh</th></tr>
      <tr><td>Tốt nhất</td><td>Mảng đã tăng dần sẵn</td><td>n − 1, tức O(n)</td></tr>
      <tr><td>Xấu nhất</td><td>Mảng giảm dần</td><td>n(n − 1)/2, tức O(n²)</td></tr>
      <tr><td>Trung bình</td><td>Mảng ngẫu nhiên</td><td>O(n²)</td></tr>
    </table>
    <p>Ví dụ: dãy <code>7 3 15 9 1 18 12 5 16 8</code> tốn 26 phép so sánh và 19 lần dịch (bộ đếm trên màn hình hiện 37 phép gán vì còn tính thêm <code>x = a[i]</code> và <code>a[k] = x</code> của mỗi lần chèn).</p>`;

  // ---------------------------------------------------------------
  // 4. Đăng ký thuật toán vào web
  // ---------------------------------------------------------------
  window.AlgoViet.thuatToan["insertion-sort"] = {
    ten: "Insertion Sort",
    doPhucTap: "O(n²)",
    lyThuyet: lyThuyet,
    viDu: [5, 2, 4, 6, 1, 3],
    cachLam: {
      chen: { ten: "Chèn từng phần tử", code: code, tao: tao, ve: ve }
    },
    chuThich: {
      chen: [
        ["--tt-chua-xet", "Chưa xét"],
        ["--tt-da-xep", "Đã sắp xếp (bên trái)"],
        ["--tt-so-sanh", "Đang so sánh"],
        ["--xanh", "Ô trống / số x đang chèn"],
        ["--tt-xong", "Hoàn thành"]
      ]
    }
  };
})();
