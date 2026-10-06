// =====================================================================
// TRÌNH PHÁT TỪNG BƯỚC
//
// Mỗi thuật toán đã ghi sẵn một danh sách các bước (xem hàm tao() trong
// js/thuat-toan/*.js). File này chỉ việc HIỂN THỊ bước thứ "vt" của danh sách đó.
// Vì danh sách đã có sẵn nên Lùi bước hay kéo thanh tiến độ không cần tính lại.
//
// Cách đọc file: "TrinhPhat" là một đối tượng gồm các biến (buoc, vt, ...) và các
// hàm (nap, hien, toi, ...). Các file khác gọi chúng bằng TrinhPhat.hien(), v.v.
// =====================================================================
(function () {   // (hàm bọc ngoài chạy ngay: để tên biến trong file không đụng file khác)

  function $(id) {
    return document.getElementById(id);   // viết tắt: lấy một thẻ HTML theo id
  }

  var TrinhPhat = {
    buoc: [],            // danh sách tất cả các bước
    vt: 0,               // vị trí bước đang hiển thị (bắt đầu từ 0)
    dangPhat: false,     // đang tự động phát hay không
    hen: null,           // "hẹn giờ" của lần phát kế tiếp
    cach: null,          // cách làm đang dùng (có code, tao, ve)
    cheDoDoan: false,    // có bật chế độ "Đoán bước tiếp theo" không
    daTraLoi: {},        // lưu các câu đã trả lời: { số bước: đúng/sai }

    // Nạp một danh sách bước mới (khi người dùng bấm Chạy)
    nap: function (cach, buoc) {
      TrinhPhat.dung();
      TrinhPhat.cach = cach;
      TrinhPhat.buoc = buoc;
      TrinhPhat.vt = 0;
      TrinhPhat.daTraLoi = {};
      $("tien-do").max = buoc.length - 1;
      TrinhPhat.anCauHoi();
      TrinhPhat.veCode();
      TrinhPhat.hien();
    },

    // Vẽ khung code C++ (mỗi dòng một thẻ div, có đánh số dòng)
    veCode: function () {
      var html = "";
      for (var k = 0; k < TrinhPhat.cach.code.length; k++) {
        var dong = TrinhPhat.cach.code[k].replace(/&/g, "&amp;").replace(/</g, "&lt;");
        html += '<div data-dong="' + (k + 1) + '"><span class="so-dong">' + (k + 1) + "</span><span>" + dong + "</span></div>";
      }
      $("code").innerHTML = html;
    },

    // Hiển thị bước thứ vt: hình, lời giải thích, dòng code, bảng biến, bộ đếm
    hien: function () {
      var b = TrinhPhat.buoc[TrinhPhat.vt];

      TrinhPhat.cach.ve($("san-khau"), b.hinh);                      // vẽ hình
      $("so-buoc").textContent = "Bước " + (TrinhPhat.vt + 1) + "/" + TrinhPhat.buoc.length;
      $("giai-thich").textContent = b.giaiThich;

      // Tô sáng dòng code đang chạy
      var cacDong = document.querySelectorAll("#code div");
      for (var i = 0; i < cacDong.length; i++) {
        cacDong[i].classList.toggle("dang-chay", Number(cacDong[i].dataset.dong) === b.dong);
      }

      // Bảng giá trị các biến (biến vừa đổi được đánh dấu)
      var htmlBien = "";
      for (var ten in b.bien) {
        var vuaDoi = b.vuaDoi.indexOf(ten) !== -1;
        htmlBien += '<tr class="' + (vuaDoi ? "vua-doi" : "") + '"><td>' + ten + "</td><td>" + b.bien[ten] + "</td></tr>";
      }
      $("bang-bien").innerHTML = htmlBien;

      $("dem-so-sanh").textContent = b.dem.soSanh;
      $("dem-gan").textContent = b.dem.gan;
      $("tien-do").value = TrinhPhat.vt;

      var nhanNut = "▶ Phát";
      if (TrinhPhat.dangPhat) nhanNut = "❚❚ Tạm dừng";
      else if (TrinhPhat.vt === TrinhPhat.buoc.length - 1) nhanNut = "↻ Xem lại";
      $("nut-phat").textContent = nhanNut;
    },

    // Đi tới bước "dich". Nếu đang bật chế độ đoán và bước kế tiếp có câu hỏi
    // chưa trả lời thì hỏi trước (và chưa đi tiếp).
    // Trả về true nếu đã đi tới bước mới, false nếu đang chờ trả lời.
    toi: function (dich) {
      dich = Math.max(0, Math.min(TrinhPhat.buoc.length - 1, dich));
      if (dich > TrinhPhat.vt) {
        var b = TrinhPhat.buoc[TrinhPhat.vt + 1];
        var daTra = TrinhPhat.daTraLoi[TrinhPhat.vt + 1] !== undefined;
        if (dich === TrinhPhat.vt + 1 && TrinhPhat.cheDoDoan && b.cauHoi && !daTra) {
          TrinhPhat.dung();
          TrinhPhat.hoi(TrinhPhat.vt + 1);
          return false;
        }
      }
      TrinhPhat.anCauHoi();
      TrinhPhat.vt = dich;
      TrinhPhat.hien();
      return true;
    },

    tien: function () {
      if (TrinhPhat.vt >= TrinhPhat.buoc.length - 1) {
        TrinhPhat.dung();
        return;
      }
      TrinhPhat.toi(TrinhPhat.vt + 1);
    },

    lui: function () {
      TrinhPhat.toi(TrinhPhat.vt - 1);
    },

    // Bắt đầu tự động phát
    phat: function () {
      if (TrinhPhat.vt === TrinhPhat.buoc.length - 1) {   // đang ở cuối thì phát lại từ đầu
        TrinhPhat.anCauHoi();
        TrinhPhat.vt = 0;
      }
      TrinhPhat.dangPhat = true;
      TrinhPhat.hien();
      TrinhPhat.hen = setTimeout(TrinhPhat.chayTiep, Number($("toc-do").value));
    },

    // Được gọi sau mỗi khoảng thời gian khi đang phát: tiến một bước rồi hẹn giờ cho lần sau
    chayTiep: function () {
      if (!TrinhPhat.dangPhat) return;
      if (TrinhPhat.vt >= TrinhPhat.buoc.length - 1) {
        TrinhPhat.dung();
        return;
      }
      var ok = TrinhPhat.toi(TrinhPhat.vt + 1);
      if (ok) TrinhPhat.hen = setTimeout(TrinhPhat.chayTiep, Number($("toc-do").value));
    },

    dung: function () {
      TrinhPhat.dangPhat = false;
      clearTimeout(TrinhPhat.hen);
      if (TrinhPhat.buoc.length) {
        $("nut-phat").textContent = (TrinhPhat.vt === TrinhPhat.buoc.length - 1) ? "↻ Xem lại" : "▶ Phát";
      }
    },

    // Nút Phát/Tạm dừng: đang phát thì dừng, đang dừng thì phát
    batTat: function () {
      if (TrinhPhat.dangPhat) TrinhPhat.dung();
      else TrinhPhat.phat();
    },

    // ---------- Chế độ "Đoán bước tiếp theo" ----------

    // Hiện câu hỏi của bước vtBuoc
    hoi: function (vtBuoc) {
      var q = TrinhPhat.buoc[vtBuoc].cauHoi;
      var hop = $("cau-hoi");
      hop.hidden = false;
      hop.querySelector(".tieu-de").textContent = "❓ " + q.tieuDe;

      var phanHoi = hop.querySelector(".phan-hoi");
      phanHoi.textContent = "";
      phanHoi.className = "phan-hoi";

      var ds = hop.querySelector(".lua-chon");
      ds.innerHTML = "";
      for (var k = 0; k < q.luaChon.length; k++) {
        ds.appendChild(taoNutLuaChon(vtBuoc, k, q.luaChon[k]));
      }
      ds.querySelector("button").focus();
    },

    // Người dùng chọn đáp án số "chon": chấm đúng/sai và hiện lời giải thích
    traLoi: function (vtBuoc, chon) {
      var q = TrinhPhat.buoc[vtBuoc].cauHoi;
      var dung = (chon === q.dung);
      TrinhPhat.daTraLoi[vtBuoc] = dung;

      var cacNut = $("cau-hoi").querySelectorAll(".lua-chon button");
      for (var k = 0; k < cacNut.length; k++) {
        cacNut[k].disabled = true;
        if (k === q.dung) cacNut[k].classList.add("chon-dung");
        else if (k === chon) cacNut[k].classList.add("chon-sai");
      }

      var phanHoi = $("cau-hoi").querySelector(".phan-hoi");
      phanHoi.className = "phan-hoi " + (dung ? "dung" : "sai");
      phanHoi.textContent = (dung ? "✓ Đúng! " : "✗ Chưa đúng. ") + q.lyDo;

      TrinhPhat.capNhatDiem();
      // Hiện bước đó nhưng vẫn giữ hộp câu hỏi để người dùng đọc phản hồi
      TrinhPhat.vt = vtBuoc;
      TrinhPhat.hien();
    },

    // Cập nhật dòng "Đoán đúng 3/4"
    capNhatDiem: function () {
      var tong = 0;
      var dung = 0;
      for (var buoc in TrinhPhat.daTraLoi) {
        tong++;
        if (TrinhPhat.daTraLoi[buoc]) dung++;
      }
      $("diem").textContent = tong ? "Đoán đúng " + dung + "/" + tong : "";
    },

    anCauHoi: function () {
      $("cau-hoi").hidden = true;
    }
  };

  // Tạo một nút lựa chọn đáp án. Viết thành hàm riêng để mỗi nút "nhớ" đúng số k của nó
  // (nếu viết thẳng trong vòng for, mọi nút sẽ dùng chung giá trị k cuối cùng).
  function taoNutLuaChon(vtBuoc, k, nhan) {
    var nut = document.createElement("button");
    nut.textContent = nhan;
    nut.onclick = function () {
      TrinhPhat.traLoi(vtBuoc, k);
    };
    return nut;
  }

  window.AlgoViet.TrinhPhat = TrinhPhat;   // để các file khác dùng được
})();
