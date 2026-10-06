// =====================================================================
// APP.JS: NỐI GIAO DIỆN VỚI THUẬT TOÁN VÀ TRÌNH PHÁT
//
// Việc của file này:
//   1. Xem địa chỉ trang (hoc.html?tt=insertion-sort) để biết đang học thuật toán nào
//   2. Điền tên, lý thuyết, thanh bên... của thuật toán đó lên trang
//   3. Gắn hành động cho các nút (Chạy, Ví dụ mẫu, Phát, Lùi, Tiến, các tab...)
// =====================================================================
(function () {   // (hàm bọc ngoài chạy ngay: để tên biến trong file không đụng file khác)

  function $(id) {
    return document.getElementById(id);   // viết tắt: lấy một thẻ HTML theo id
  }

  var AV = window.AlgoViet;                 // đối tượng chung chứa mọi thứ của AlgoViet
  var TP = AV.TrinhPhat;                    // trình phát từng bước

  // 1. Đọc tham số "tt" trong địa chỉ. Không có hoặc sai thì dùng "tim-min".
  var id = new URLSearchParams(location.search).get("tt") || "tim-min";
  var TT = AV.thuatToan[id] || AV.thuatToan["tim-min"];   // TT = thuật toán đang học

  // 2. Điền thông tin của thuật toán lên trang
  document.title = "AlgoViet - " + TT.ten;
  $("ten-thuat-toan").textContent = TT.ten;
  $("do-phuc-tap").textContent = TT.doPhucTap;
  $("ly-thuyet").innerHTML = TT.lyThuyet;
  if (TT.nhanDem && TT.nhanDem.gan) {
    $("dem-gan").nextElementSibling.textContent = TT.nhanDem.gan;   // đổi nhãn bộ đếm thứ 2
  }
  AV.veThanhBen($("thanh-ben"), AV.thuatToan[id] ? id : "tim-min");

  // Danh sách tên các cách làm của thuật toán (for...in: duyệt qua từng tên trong đối tượng)
  var tenCach = [];
  for (var ten in TT.cachLam) {
    tenCach.push(ten);
  }
  var htmlCach = "";
  for (var i = 0; i < tenCach.length; i++) {
    htmlCach += '<button data-cach="' + tenCach[i] + '" class="' + (i === 0 ? "dang-chon" : "") +
                '" aria-pressed="' + (i === 0) + '">' + TT.cachLam[tenCach[i]].ten + "</button>";
  }
  $("chon-cach").innerHTML = htmlCach;
  $("chon-cach").closest(".nhom").hidden = tenCach.length < 2;   // chỉ 1 cách thì ẩn ô chọn
  var cachDangChon = tenCach[0];

  // ---------------------------------------------------------------
  // Đọc và kiểm tra dãy số người dùng nhập.
  // Trả về { so: [...] } nếu hợp lệ, hoặc { loi: "..." } nếu sai.
  // ---------------------------------------------------------------
  function docDuLieu() {
    var chu = $("du-lieu").value.trim();
    if (!chu) return { loi: "Hãy nhập dãy số, ví dụ: 7 2 9 4" };

    var phan = chu.split(/[\s,;]+/);       // tách theo dấu cách, dấu phẩy, dấu chấm phẩy
    var so = [];
    for (var k = 0; k < phan.length; k++) {
      var p = phan[k];
      if (p === "") continue;              // bỏ qua phần rỗng
      if (!/^\d+$/.test(p)) {
        return { loi: '"' + p + '" không phải số nguyên dương. Chỉ nhập các số từ 1 đến 99, cách nhau bằng dấu cách hoặc dấu phẩy.' };
      }
      var v = Number(p);
      if (v < 1 || v > 99) return { loi: "Số " + v + " nằm ngoài khoảng 1 đến 99." };
      so.push(v);
    }
    if (so.length < 2) return { loi: "Cần ít nhất 2 số để so sánh." };
    if (so.length > 16) return { loi: "Bạn nhập " + so.length + " số, tối đa 16 số để hình còn dễ nhìn." };
    return { so: so };
  }

  // ---------------------------------------------------------------
  // Bấm "Chạy": đọc dữ liệu, chạy thuật toán (tao), nạp danh sách bước vào trình phát
  // ---------------------------------------------------------------
  function chay() {
    var kq = docDuLieu();
    $("loi").textContent = kq.loi || "";
    if (kq.loi) return;

    var cach = TT.cachLam[cachDangChon];
    TP.nap(cach, cach.tao(kq.so));
    TP.capNhatDiem();

    // Chú thích màu phía trên khung minh họa
    var htmlChuThich = "";
    var ds = TT.chuThich[cachDangChon];
    for (var k = 0; k < ds.length; k++) {
      htmlChuThich += '<span><i style="background:var(' + ds[k][0] + ')"></i>' + ds[k][1] + "</span>";
    }
    $("chu-thich").innerHTML = htmlChuThich;
  }

  // ---------------------------------------------------------------
  // Chọn cách làm. Trong hàm này, "this" chính là nút vừa được bấm.
  // ---------------------------------------------------------------
  function chonCach() {
    var cacNut = document.querySelectorAll("#chon-cach button");
    for (var k = 0; k < cacNut.length; k++) {
      var laNutNay = (cacNut[k] === this);
      cacNut[k].classList.toggle("dang-chon", laNutNay);
      cacNut[k].setAttribute("aria-pressed", laNutNay);
    }
    cachDangChon = this.dataset.cach;
    chay();
  }
  var nutCach = document.querySelectorAll("#chon-cach button");
  for (var c = 0; c < nutCach.length; c++) {
    nutCach[c].onclick = chonCach;
  }

  // ---------------------------------------------------------------
  // Các nút nhập dữ liệu
  // ---------------------------------------------------------------
  $("nut-chay").onclick = chay;

  $("du-lieu").addEventListener("keydown", function (e) {
    if (e.key === "Enter") chay();
  });

  $("nut-mau").onclick = function () {
    $("du-lieu").value = TT.viDu.join(" ");
    chay();
  };

  $("nut-ngau-nhien").onclick = function () {
    var n = 5 + Math.floor(Math.random() * 4);         // 5 đến 8 số
    var so = [];
    for (var k = 0; k < n; k++) {
      so.push(1 + Math.floor(Math.random() * 60));     // mỗi số từ 1 đến 60
    }
    $("du-lieu").value = so.join(" ");
    chay();
  };

  $("che-do-doan").onchange = function () {
    TP.cheDoDoan = $("che-do-doan").checked;
    TP.daTraLoi = {};
    TP.capNhatDiem();
    TP.anCauHoi();
  };

  // ---------------------------------------------------------------
  // Các nút của trình phát
  // ---------------------------------------------------------------
  $("nut-dau").onclick = function () {
    TP.dung();
    TP.toi(0);
  };
  $("nut-lui").onclick = function () {
    TP.dung();
    TP.lui();
  };
  $("nut-phat").onclick = function () {
    TP.batTat();
  };
  $("nut-tien").onclick = function () {
    TP.dung();
    TP.tien();
  };
  $("nut-cuoi").onclick = function () {
    TP.dung();
    TP.anCauHoi();
    TP.vt = TP.buoc.length - 1;
    TP.hien();
  };
  $("tien-do").oninput = function () {      // kéo thanh tiến độ
    TP.dung();
    TP.anCauHoi();
    TP.vt = Number($("tien-do").value);
    TP.hien();
  };

  // ---------------------------------------------------------------
  // Phím tắt: Space = phát/dừng, mũi tên phải/trái = tiến/lùi một bước
  // ---------------------------------------------------------------
  document.addEventListener("keydown", function (e) {
    if (e.target.matches("input, select, textarea") || $("tab-chay").hidden) return;
    if (e.key === " ") {
      e.preventDefault();
      TP.batTat();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      TP.dung();
      TP.tien();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      TP.dung();
      TP.lui();
    }
  });

  // ---------------------------------------------------------------
  // Chuyển tab: Chạy thử / Luyện tập / Ý tưởng & lý thuyết ("this" là nút tab vừa bấm)
  // ---------------------------------------------------------------
  function chonTab() {
    var cacNut = document.querySelectorAll(".tab button");
    for (var k = 0; k < cacNut.length; k++) {
      cacNut[k].classList.toggle("dang-chon", cacNut[k] === this);
    }
    var cacTab = ["chay", "luyen-tap", "ly-thuyet"];
    for (var j = 0; j < cacTab.length; j++) {
      $("tab-" + cacTab[j]).hidden = (this.dataset.tab !== cacTab[j]);
    }
    TP.dung();
  }
  var nutTab = document.querySelectorAll(".tab button");
  for (var t = 0; t < nutTab.length; t++) {
    nutTab[t].onclick = chonTab;
  }

  // Menu thuật toán trên điện thoại
  $("nut-menu").onclick = function () {
    $("thanh-ben").classList.toggle("mo");
  };

  // ---------------------------------------------------------------
  // Khi mở trang: điền ví dụ mẫu và chạy luôn
  // ---------------------------------------------------------------
  $("du-lieu").value = TT.viDu.join(" ");
  chay();
  AV.luyenTap.khoiTao(TT);
})();
