// =====================================================================
// HƯỚNG DẪN SỬ DỤNG (tutorial)
//
// Làm mờ màn hình, chiếu sáng lần lượt từng khu vực, mỗi khu vực một thẻ giải thích.
// Tự chạy ở lần đầu vào trang; muốn xem lại thì bấm nút "? Hướng dẫn".
// =====================================================================
(function () {   // (hàm bọc ngoài chạy ngay: để tên biến trong file không đụng file khác)

  // Danh sách các bước hướng dẫn.
  //   chon     : khu vực cần chiếu sáng (viết theo kiểu CSS: #id hoặc .tên-lớp); null = không chiếu
  //   tieuDe   : tiêu đề của thẻ giải thích
  //   noiDung  : nội dung giải thích
  var CAC_BUOC = [
    { chon: null, tieuDe: "Chào bạn đến với AlgoViet 👋",
      noiDung: "Mình sẽ chỉ nhanh cách dùng trang này trong khoảng 1 phút. Bấm Tiếp để bắt đầu, hoặc Bỏ qua nếu bạn đã biết." },
    { chon: "#chon-cach", tieuDe: "1. Chọn cách làm",
      noiDung: "Một bài toán có thể có nhiều cách giải. Bấm để đổi cách, rồi so sánh số phép tính của từng cách." },
    { chon: "#du-lieu", tieuDe: "2. Nhập dữ liệu",
      noiDung: "Gõ dãy số của bạn rồi bấm Chạy. Không biết nhập gì thì bấm Ví dụ mẫu hoặc Ngẫu nhiên." },
    { chon: "#san-khau", tieuDe: "3. Khung minh họa",
      noiDung: "Đây là nơi thuật toán chạy. Mỗi màu là một trạng thái, xem chú thích màu ngay phía trên." },
    { chon: ".giai-thich", tieuDe: "4. Lời giải thích",
      noiDung: "Mỗi bước có một câu nói rõ chuyện gì đang xảy ra, kèm con số cụ thể." },
    { chon: ".trinh-phat", tieuDe: "5. Điều khiển",
      noiDung: "Phát để tự chạy, Lùi và Tiến để đi từng bước, kéo thanh để nhảy tới bước bất kỳ. Phím tắt: Space, ← và →." },
    { chon: "#code", tieuDe: "6. Code C++",
      noiDung: "Dòng code đang chạy được tô xanh, để bạn nối hình minh họa với từng dòng code." },
    { chon: "#khu-bien", tieuDe: "7. Biến và bộ đếm",
      noiDung: "Giá trị các biến sau mỗi bước (biến vừa đổi có ghi chú) và số phép so sánh, phép gán đã dùng." },
    { chon: ".cong-tac", tieuDe: "8. Đoán bước tiếp theo",
      noiDung: "Bật lên thì web sẽ dừng lại hỏi bạn trước mỗi bước quan trọng. Đây là cách tốt nhất để kiểm tra mình đã hiểu thật chưa." },
    { chon: ".tab", tieuDe: "9. Ý tưởng và lý thuyết",
      noiDung: "Muốn đọc ý tưởng, ví dụ đời thường và độ phức tạp thì mở tab này." },
    { chon: "#nut-phat", tieuDe: "Sẵn sàng rồi!",
      noiDung: 'Bấm Phát để xem thuật toán chạy. Muốn xem lại hướng dẫn thì bấm nút "? Hướng dẫn" ở góc trên.' }
  ];

  // Tên dùng để nhớ trong trình duyệt rằng người dùng đã xem hướng dẫn
  var KHOA = "algoviet-da-xem-huong-dan";

  var vt = 0;        // đang ở bước hướng dẫn thứ mấy
  var nen = null;    // lớp nền mờ che toàn màn hình
  var den = null;    // ô chiếu sáng khu vực đang được giới thiệu
  var the = null;    // thẻ giải thích

  // Tạo ba lớp (nền mờ, ô chiếu sáng, thẻ) và gắn vào trang
  function taoKhung() {
    nen = document.createElement("div");
    nen.className = "hd-nen";
    den = document.createElement("div");
    den.className = "hd-den";
    the = document.createElement("div");
    the.className = "hd-the";
    the.setAttribute("role", "dialog");
    the.setAttribute("aria-modal", "true");
    document.body.appendChild(nen);
    document.body.appendChild(den);
    document.body.appendChild(the);

    nen.onclick = ketThuc;
    window.addEventListener("resize", veLai);
    document.addEventListener("keydown", phim, true);
  }

  // Chỉ lấy những bước mà khu vực của nó đang hiện trên trang
  // (ví dụ trên điện thoại có khu vực bị ẩn thì bỏ bước đó)
  function cacBuocCo() {
    var ds = [];
    for (var k = 0; k < CAC_BUOC.length; k++) {
      var b = CAC_BUOC[k];
      if (!b.chon) {
        ds.push(b);
      } else {
        var el = document.querySelector(b.chon);
        if (el && el.offsetParent !== null) ds.push(b);
      }
    }
    return ds;
  }

  // Hiện bước hướng dẫn thứ vt
  function hien() {
    var ds = cacBuocCo();
    var b = ds[vt];
    var el = b.chon ? document.querySelector(b.chon) : null;
    if (el) el.scrollIntoView({ block: "center", behavior: "instant" });

    var html = '<div class="hd-so">' + (vt + 1) + "/" + ds.length + "</div>" +
               "<h3>" + b.tieuDe + "</h3>" +
               "<p>" + b.noiDung + "</p>" +
               '<div class="hd-nut">' +
                 '<button class="nut" data-l="bo">Bỏ qua</button>' +
                 "<span></span>" +
                 (vt > 0 ? '<button class="nut" data-l="truoc">← Trước</button>' : "") +
                 '<button class="nut nut-chinh" data-l="tiep">' + (vt === ds.length - 1 ? "Bắt đầu học" : "Tiếp →") + "</button>" +
               "</div>";
    the.innerHTML = html;

    the.querySelector('[data-l="bo"]').onclick = ketThuc;
    the.querySelector('[data-l="tiep"]').onclick = tiep;
    var nutTruoc = the.querySelector('[data-l="truoc"]');
    if (nutTruoc) nutTruoc.onclick = truoc;
    veLai();
    the.querySelector('[data-l="tiep"]').focus();
  }

  // Đặt ô chiếu sáng quanh khu vực, và đặt thẻ giải thích cạnh đó
  function veLai() {
    if (!the) return;
    var b = cacBuocCo()[vt];
    var el = (b && b.chon) ? document.querySelector(b.chon) : null;

    if (!el) {   // bước giới thiệu chung: thẻ nằm giữa màn hình
      den.style.cssText = "top:50%;left:50%;width:0;height:0";
      the.style.cssText = "top:" + (window.innerHeight / 2 - 90) + "px;left:" + Math.max(12, window.innerWidth / 2 - 170) + "px";
      return;
    }

    var r = el.getBoundingClientRect();   // vị trí và kích thước của khu vực
    var le = 8;                           // chừa viền quanh khu vực
    den.style.cssText = "top:" + (r.top - le) + "px;left:" + (r.left - le) + "px;width:" +
                        (r.width + 2 * le) + "px;height:" + (r.height + 2 * le) + "px";

    var rong = Math.min(340, window.innerWidth - 24);
    var cao = the.offsetHeight || 180;
    var top = r.bottom + 16;                                   // ưu tiên đặt thẻ bên dưới
    if (top + cao > window.innerHeight - 12) {                 // không đủ chỗ thì đặt bên trên
      top = Math.max(12, r.top - cao - 16);
    }
    var left = Math.min(Math.max(12, r.left), window.innerWidth - rong - 12);
    the.style.cssText = "top:" + top + "px;left:" + left + "px;width:" + rong + "px";
  }

  function tiep() {
    if (vt < cacBuocCo().length - 1) {
      vt++;
      hien();
    } else {
      ketThuc();
    }
  }

  function truoc() {
    if (vt > 0) {
      vt--;
      hien();
    }
  }

  // Phím: Esc = thoát, → hoặc Enter = tiếp, ← = trước, Space bị chặn để khỏi phát ngầm phía sau
  function phim(e) {
    if (!the) return;
    if (e.key === "Escape") ketThuc();
    else if (e.key === "ArrowRight" || e.key === "Enter") tiep();
    else if (e.key === "ArrowLeft") truoc();
    else if (e.key !== " ") return;
    e.preventDefault();
    e.stopPropagation();
  }

  // Đóng hướng dẫn và nhớ là người dùng đã xem
  function ketThuc() {
    if (nen) nen.remove();
    if (den) den.remove();
    if (the) the.remove();
    nen = null;
    den = null;
    the = null;
    window.removeEventListener("resize", veLai);
    document.removeEventListener("keydown", phim, true);
    try {
      localStorage.setItem(KHOA, "1");
    } catch (e) {
      // trình duyệt chặn lưu trữ: bỏ qua
    }
  }

  function batDau() {
    if (the) return;   // đang mở rồi thì thôi
    vt = 0;
    taoKhung();
    hien();
  }

  window.AlgoViet.huongDan = { batDau: batDau };
  document.getElementById("nut-huong-dan").onclick = batDau;

  // Lần đầu vào trang (chưa xem hướng dẫn) thì tự mở sau 0,4 giây
  var daXem = false;
  try {
    daXem = (localStorage.getItem(KHOA) === "1");
  } catch (e) {
    // không đọc được thì coi như chưa xem
  }
  if (!daXem) setTimeout(batDau, 400);
})();
