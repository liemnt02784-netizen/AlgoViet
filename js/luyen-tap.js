// =====================================================================
// LUYỆN TẬP
//   A. Điền vào chỗ trống: người dùng điền code, web CHẠY THẬT code đó rồi chấm
//   B. Sắp xếp dòng code: kéo thả (hoặc bấm mũi tên) cho đúng thứ tự
// =====================================================================
(function () {   // (hàm bọc ngoài chạy ngay: để tên biến trong file không đụng file khác)

  function $(id) {
    return document.getElementById(id);   // viết tắt: lấy một thẻ HTML theo id
  }

  // Đổi các ký tự đặc biệt của HTML (& < >) để hiển thị đúng khi chèn vào trang
  function thoat(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Bỏ hết khoảng trắng để so sánh đáp án ("i < n" và "i<n" coi như giống nhau)
  function chuan(s) {
    return s.replace(/\s+/g, "");
  }

  // Biến danh sách thẻ HTML (NodeList) thành mảng thường để dễ duyệt
  function thanhMang(danhSachThe) {
    var mang = [];
    for (var i = 0; i < danhSachThe.length; i++) mang.push(danhSachThe[i]);
    return mang;
  }

  // ==================================================================
  // A. ĐIỀN VÀO CHỖ TRỐNG
  // ==================================================================
  // Mẫu code có các chỗ "{0}", "{1}"... là ô trống. Sau khi người dùng điền,
  // web ghép lại thành code hoàn chỉnh, đổi sang JavaScript rồi chạy thử
  // (C và JavaScript giống nhau ở các biểu thức đơn giản như a[i] < min).
  function khoiTaoDien(bt) {
    var khung = $("code-dien");
    var soGoiY = 0;    // đã bấm gợi ý bao nhiêu lần

    // Vẽ code, thay mỗi {số} bằng một ô nhập
    var html = "";
    for (var k = 0; k < bt.mau.length; k++) {
      var dongHtml = thoat(bt.mau[k]).replace(/\{(\d+)\}/g, function (khop, so) {
        var o = bt.oTrong[Number(so)];
        var rong = Math.max(4, o.dapAn.length + 2);
        return '<input class="o-trong" data-o="' + so + '" size="' + rong +
               '" spellcheck="false" autocomplete="off" aria-label="Ô trống số ' + (Number(so) + 1) + '">';
      });
      html += '<div><span class="so-dong">' + (k + 1) + "</span><span>" + dongHtml + "</span></div>";
    }
    khung.innerHTML = html;

    // Lấy danh sách các ô nhập
    function cacO() {
      return thanhMang(khung.querySelectorAll(".o-trong"));
    }

    $("nut-kiem-tra-dien").onclick = function () {
      kiemTra();
    };
    khung.addEventListener("keydown", function (e) {
      if (e.key === "Enter") kiemTra();
    });

    // Nút Gợi ý: mỗi lần bấm hiện gợi ý cho ô đầu tiên còn sai (hoặc chưa được gợi ý)
    $("nut-goi-y-dien").onclick = function () {
      var ds = cacO();
      var o = null;
      for (var i = 0; i < ds.length; i++) {
        var dapAn = bt.oTrong[Number(ds[i].dataset.o)].dapAn;
        if (chuan(ds[i].value) !== chuan(dapAn) && !ds[i].dataset.daGoiY) {
          o = ds[i];
          break;
        }
      }
      if (o === null) {
        for (var j = 0; j < ds.length; j++) {
          if (!ds[j].dataset.daGoiY) {
            o = ds[j];
            break;
          }
        }
      }
      if (!o) {
        $("kq-dien").innerHTML = '<p class="ghi-chu-nho">Đã hiện hết gợi ý.</p>';
        return;
      }
      o.dataset.daGoiY = "1";
      soGoiY++;
      o.focus();
      var so = Number(o.dataset.o);
      $("kq-dien").innerHTML = '<div class="kq goi-y">💡 <b>Gợi ý cho ô ' + (so + 1) + ":</b> " + bt.oTrong[so].goiY + "</div>";
    };

    // Nút Xem đáp án: điền sẵn đáp án mẫu vào các ô
    $("nut-dap-an-dien").onclick = function () {
      var ds = cacO();
      for (var i = 0; i < ds.length; i++) {
        ds[i].value = bt.oTrong[Number(ds[i].dataset.o)].dapAn;
        ds[i].className = "o-trong";
      }
      $("kq-dien").innerHTML = '<div class="kq goi-y">Đã điền đáp án mẫu. Bấm <b>Kiểm tra</b> để xem nó chạy đúng trên mọi bộ dữ liệu. Nhớ: đáp án khác mẫu mà chạy đúng vẫn được tính là đúng.</div>';
    };

    // Nút Làm lại: xóa hết các ô
    $("nut-lam-lai-dien").onclick = function () {
      var ds = cacO();
      for (var i = 0; i < ds.length; i++) {
        ds[i].value = "";
        ds[i].className = "o-trong";
        delete ds[i].dataset.daGoiY;
      }
      $("kq-dien").innerHTML = "";
      soGoiY = 0;
    };

    // Chấm bài: kiểm tra từng bước theo thứ tự rồi chạy thật
    function kiemTra() {
      var ds = cacO();
      var cacGiaTri = [];
      for (var i = 0; i < ds.length; i++) {
        cacGiaTri.push(ds[i].value.trim());
        ds[i].className = "o-trong";
      }

      // Bước 1: còn ô nào để trống không?
      var trong = [];
      for (var a = 0; a < ds.length; a++) {
        if (!ds[a].value.trim()) trong.push(ds[a]);
      }
      if (trong.length) {
        for (var b = 0; b < trong.length; b++) trong[b].classList.add("o-sai");
        trong[0].focus();
        $("kq-dien").innerHTML = '<div class="kq sai">Còn ' + trong.length + " ô chưa điền (tô đỏ).</div>";
        return;
      }

      // Bước 2: mỗi ô chỉ được chứa biểu thức đơn giản, dùng đúng các biến của bài
      for (var c = 0; c < ds.length; c++) {
        var loi = kiemTraBieuThuc(ds[c].value, bt.bienChoPhep);
        if (loi) {
          ds[c].classList.add("o-sai");
          ds[c].focus();
          $("kq-dien").innerHTML = '<div class="kq sai">Ô ' + (Number(ds[c].dataset.o) + 1) + ": " + loi + "</div>";
          return;
        }
      }

      // Bước 3: chạy thật code trên nhiều bộ dữ liệu
      var kq = chayCode(bt, cacGiaTri);
      if (kq.loiCuPhap) {
        $("kq-dien").innerHTML = '<div class="kq sai">Code chưa đúng cú pháp, máy không chạy được. Kiểm tra lại dấu ngoặc và phép so sánh trong các ô.<br><small>' +
                                 thoat(kq.loiCuPhap) + "</small></div>";
        return;
      }

      var sai = [];   // các bộ dữ liệu mà code chạy sai
      for (var d = 0; d < kq.ketQua.length; d++) {
        if (!kq.ketQua[d].dung) sai.push(kq.ketQua[d]);
      }
      var tong = kq.ketQua.length;

      if (sai.length === 0) {
        for (var e = 0; e < ds.length; e++) ds[e].classList.add("o-dung");
        var ghiGoiY = soGoiY ? " (đã dùng " + soGoiY + " gợi ý)" : "";
        $("kq-dien").innerHTML = '<div class="kq dung">🎉 <b>Chính xác!</b> Code của bạn chạy đúng cả ' + tong + "/" + tong +
                                 " bộ dữ liệu" + ghiGoiY + ".</div>" + bangTest(kq.ketQua);
        return;
      }

      // Sai: chỉ ra bộ dữ liệu sai đầu tiên, kèm bảng vết từng vòng lặp
      var t = sai[0];
      var html = '<div class="kq sai"><b>Chưa đúng:</b> sai ' + sai.length + "/" + tong + " bộ dữ liệu. " + t.thongBao + "</div>" +
                 bangTest(kq.ketQua);
      if (t.vet.length) {
        html += '<h4 class="tieu-de-vet">Code của bạn chạy thế nào với a = [' + t.a.join(", ") + "]</h4>" + bangVet(t);
      }
      html += '<p class="ghi-chu-nho">Nhìn bảng trên để tìm vòng lặp đầu tiên mà giá trị khác với điều bạn mong đợi. Bí quá thì bấm <b>Gợi ý</b>.</p>';
      $("kq-dien").innerHTML = html;
    }
  }

  // Kiểm tra một ô: chỉ cho phép số, tên biến và các phép toán đơn giản.
  // Trả về câu báo lỗi, hoặc chuỗi rỗng "" nếu hợp lệ.
  function kiemTraBieuThuc(bieuThuc, bienChoPhep) {
    if (!/^[A-Za-z0-9_\[\]\s+\-*\/%<>=!&|().]*$/.test(bieuThuc)) {
      return "chỉ dùng số, tên biến và các phép toán + - * / % < > = ! & |.";
    }
    var cacTen = bieuThuc.match(/[A-Za-z_]\w*/g) || [];    // tất cả các từ giống tên biến
    for (var i = 0; i < cacTen.length; i++) {
      if (bienChoPhep.indexOf(cacTen[i]) === -1) {
        return 'không có biến tên "' + thoat(cacTen[i]) + '". Các biến dùng được: ' + bienChoPhep.join(", ") + ".";
      }
    }
    return "";
  }

  // Tạo bản sao của mảng nhưng có "giám sát": mỗi lần code đọc ra NGOÀI mảng
  // (a[-1], a[n]...) thì ghi lại vào danh sách raNgoai.
  // Đây là chỗ DUY NHẤT dùng tính năng nâng cao của JavaScript (Proxy).
  // Lý do: C không báo lỗi khi đọc ngoài mảng nhưng đó là lỗi nghiêm trọng, nên web phải tự bắt.
  function taoMangGiamSat(goc, raNgoai) {
    return new Proxy(goc.slice(), {
      get: function (mang, khoa) {
        var laChiSo = (typeof khoa === "string" && /^-?\d+$/.test(khoa));
        if (laChiSo && (Number(khoa) < 0 || Number(khoa) >= goc.length)) {
          raNgoai.push(Number(khoa));
        }
        return mang[khoa];
      }
    });
  }

  // Ghép code người dùng điền thành hàm JavaScript hoàn chỉnh rồi chạy trên từng bộ dữ liệu
  function chayCode(bt, cacGiaTri) {
    // Thay {0}, {1}... bằng nội dung các ô
    var dong = [];
    for (var k = 0; k < bt.mau.length; k++) {
      dong.push(bt.mau[k].replace(/\{(\d+)\}/g, function (khop, so) {
        return cacGiaTri[Number(so)];
      }));
    }
    // Chèn đoạn ghi vết và chống lặp vô hạn ngay sau dòng "for (...) {"
    dong[bt.dongVongLap] += ' if (++__dem > 10000) throw new Error("LAP_VO_HAN"); __vet.push(' + bt.vet + ");";

    // Bỏ dòng đầu (khai báo hàm) và dòng cuối "}", đổi "int" thành "let", rồi tạo hàm mới
    var js = dong.slice(1, dong.length - 1).join("\n").replace(/\bint\s+/g, "let ");
    var ham;
    try {
      ham = new Function("a", "n", "__a", "__vet", "let __dem = 0;\n" + js);   // new Function = biến chuỗi thành hàm chạy được
    } catch (e) {
      return { loiCuPhap: e.message };
    }

    var ketQua = [];
    for (var m = 0; m < bt.boTest.length; m++) {
      var goc = bt.boTest[m];
      var raNgoai = [];
      var a = taoMangGiamSat(goc, raNgoai);
      var vet = [];
      var mongDoi = bt.dapAnDung(goc);

      try {
        var nhan = ham(a, goc.length, goc, vet);
        var dung = (nhan === mongDoi && raNgoai.length === 0);
        var thongBao = "";
        if (raNgoai.length) {
          thongBao = "Với a = [" + goc.join(", ") + "] (n = " + goc.length + "), code đọc a[" + raNgoai[0] +
                     "] nằm <b>ngoài mảng</b> (chỉ có a[0] đến a[" + (goc.length - 1) + "]). Kiểm tra lại điều kiện vòng lặp.";
        } else if (!dung) {
          thongBao = "Với a = [" + goc.join(", ") + "], kết quả mong đợi là <b>" + mongDoi +
                     "</b> nhưng code của bạn trả về <b>" + (nhan === undefined ? "không xác định" : nhan) + "</b>.";
        }
        ketQua.push({ a: goc, mongDoi: mongDoi, nhan: nhan, dung: dung, thongBao: thongBao, vet: vet, ngoaiMang: raNgoai.length > 0 });
      } catch (e) {
        var lap = (e.message === "LAP_VO_HAN");
        ketQua.push({
          a: goc, mongDoi: mongDoi, nhan: lap ? "lặp mãi" : "lỗi", dung: false, vet: vet.slice(0, 12),
          thongBao: lap
            ? "Với a = [" + goc.join(", ") + "], vòng lặp <b>không bao giờ dừng</b>. Điều kiện dừng hoặc bước nhảy của i có vấn đề."
            : "Code bị lỗi khi chạy: " + thoat(e.message)
        });
      }
    }
    return { ketQua: ketQua };
  }

  // Bảng kết quả trên các bộ dữ liệu
  function bangTest(ds) {
    var html = '<table class="bang-test"><tr><th>Bộ dữ liệu</th><th>Mong đợi</th><th>Code của bạn</th><th></th></tr>';
    for (var i = 0; i < ds.length; i++) {
      var t = ds[i];
      var cotNhan = (t.nhan === undefined ? "?" : t.nhan) + (t.ngoaiMang ? ' <span class="ngoai-mang">(đọc ngoài mảng)</span>' : "");
      html += '<tr class="' + (t.dung ? "" : "dong-sai") + '"><td>[' + t.a.join(", ") + "]</td><td>" + t.mongDoi +
              "</td><td>" + cotNhan + "</td><td>" + (t.dung ? "✓" : "✗") + "</td></tr>";
    }
    return html + "</table>";
  }

  // Bảng "vết": giá trị các biến ở từng lần lặp, để thấy code chạy sai ở đâu
  function bangVet(t) {
    var cot = [];                          // tên các cột (lấy từ lần lặp đầu tiên)
    var mau = t.vet[0] || {};
    for (var ten in mau) cot.push(ten);

    var html = '<table class="bang-test bang-vet"><tr><th>Lần lặp</th>';
    for (var c = 0; c < cot.length; c++) html += "<th>" + cot[c] + "</th>";
    html += "</tr>";

    for (var k = 0; k < t.vet.length; k++) {
      html += "<tr><td>" + (k + 1) + "</td>";
      for (var j = 0; j < cot.length; j++) {
        var giaTri = t.vet[k][cot[j]];
        html += "<td>" + (giaTri === undefined ? '<span class="ngoai-mang">ngoài mảng</span>' : giaTri) + "</td>";
      }
      html += "</tr>";
    }
    html += '</table><p class="ghi-chu-nho">Giá trị ở mỗi dòng là lúc bắt đầu lần lặp đó. Kết quả cuối cùng: <b>' +
            t.nhan + "</b>, mong đợi: <b>" + t.mongDoi + "</b>.</p>";
    return html;
  }

  // ==================================================================
  // B. SẮP XẾP DÒNG CODE
  // ==================================================================
  function khoiTaoSapXep(TT) {
    // Danh sách tên các cách làm
    var cach = [];
    for (var ten in TT.cachLam) cach.push(ten);

    var htmlCach = "";
    for (var i = 0; i < cach.length; i++) {
      htmlCach += '<button data-cach="' + cach[i] + '" class="' + (i === 0 ? "dang-chon" : "") + '">' + TT.cachLam[cach[i]].ten + "</button>";
    }
    $("chon-code-sap-xep").innerHTML = htmlCach;
    $("chon-code-sap-xep").hidden = cach.length < 2;

    var dung = [];            // thứ tự đúng của các dòng
    var ds = $("ds-sap-xep"); // danh sách các dòng (thẻ ol)
    var dangKeo = null;       // dòng đang được kéo bằng chuột

    // Hai mảng có giống hệt nhau không?
    function giongNhau(x, y) {
      for (var k = 0; k < x.length; k++) {
        if (x[k] !== y[k]) return false;
      }
      return true;
    }

    // Xáo trộn các dòng code rồi vẽ ra. Xáo lại nếu vô tình ra đúng thứ tự.
    function xao(code) {
      dung = code.slice();
      var tron;
      do {
        tron = code.slice().sort(function () { return Math.random() - 0.5; });
      } while (code.length > 2 && giongNhau(tron, code));
      ve(tron);
      $("kq-sap-xep").innerHTML = "";
    }

    // Vẽ danh sách các dòng. Thụt lề của dòng code được giữ bằng padding.
    function ve(cacDong) {
      var html = "";
      for (var k = 0; k < cacDong.length; k++) {
        var d = cacDong[k];
        var thut = (d.length - d.trimStart().length) * 4;
        html += '<li draggable="true">' +
                  '<span class="tay-keo" aria-hidden="true">⋮⋮</span>' +
                  '<code style="padding-left:' + thut + 'px">' + thoat(d.trim()) + "</code>" +
                  '<span class="nut-dich">' +
                    '<button class="len" title="Đưa lên" aria-label="Đưa dòng này lên">▲</button>' +
                    '<button class="xuong" title="Đưa xuống" aria-label="Đưa dòng này xuống">▼</button>' +
                  "</span>" +
                "</li>";
      }
      ds.innerHTML = html;
      var cacLi = ds.querySelectorAll("li");
      for (var j = 0; j < cacLi.length; j++) {
        cacLi[j].dataset.dong = cacDong[j];   // nhớ nội dung dòng để lúc chấm so sánh
      }
    }

    // Bỏ màu đúng/sai trên tất cả các dòng
    function boDanhDau() {
      var cacLi = ds.querySelectorAll("li");
      for (var k = 0; k < cacLi.length; k++) cacLi[k].classList.remove("dung", "sai");
    }

    // Nút ▲ ▼ (dùng được trên điện thoại và bằng bàn phím)
    ds.addEventListener("click", function (e) {
      var li = e.target.closest("li");
      if (!li) return;
      if (e.target.classList.contains("len") && li.previousElementSibling) {
        li.parentNode.insertBefore(li, li.previousElementSibling);
      } else if (e.target.classList.contains("xuong") && li.nextElementSibling) {
        li.parentNode.insertBefore(li.nextElementSibling, li);
      } else {
        return;
      }
      e.target.focus();
      boDanhDau();
    });

    // Kéo thả bằng chuột
    ds.addEventListener("dragstart", function (e) {
      dangKeo = e.target.closest("li");
      dangKeo.classList.add("dang-keo");
      e.dataTransfer.effectAllowed = "move";
    });
    ds.addEventListener("dragend", function () {
      if (dangKeo) dangKeo.classList.remove("dang-keo");
      dangKeo = null;
      boDanhDau();
    });
    ds.addEventListener("dragover", function (e) {
      e.preventDefault();
      var li = e.target.closest("li");
      if (!li || li === dangKeo) return;
      var r = li.getBoundingClientRect();
      var chenTruoc = e.clientY < r.top + r.height / 2;   // chuột ở nửa trên của dòng
      li.parentNode.insertBefore(dangKeo, chenTruoc ? li : li.nextSibling);
    });

    // Nút Kiểm tra
    $("nut-kiem-tra-sap-xep").onclick = function () {
      var hienTai = ds.querySelectorAll("li");
      var soDung = 0;
      var saiDau = -1;   // vị trí dòng sai đầu tiên
      for (var k = 0; k < hienTai.length; k++) {
        // So sánh nội dung dòng (hai dòng "}" giống nhau đổi chỗ cho nhau vẫn tính đúng)
        var ok = (hienTai[k].dataset.dong === dung[k]);
        hienTai[k].classList.toggle("dung", ok);
        hienTai[k].classList.toggle("sai", !ok);
        if (ok) soDung++;
        else if (saiDau === -1) saiDau = k;
      }
      if (soDung === dung.length) {
        $("kq-sap-xep").innerHTML = '<div class="kq dung">🎉 <b>Chính xác!</b> Cả ' + dung.length + " dòng đều đúng thứ tự.</div>";
      } else {
        $("kq-sap-xep").innerHTML = '<div class="kq sai">Đúng vị trí ' + soDung + "/" + dung.length + " dòng. Dòng " + (saiDau + 1) +
          ' là dòng đầu tiên chưa đúng chỗ. Gợi ý: đọc từ trên xuống, hỏi "máy cần làm gì trước?" (khai báo, rồi lặp, rồi trả kết quả).</div>';
      }
    };

    $("nut-xao-lai").onclick = function () {
      xao(dung);
    };

    $("nut-dap-an-sap-xep").onclick = function () {
      ve(dung);
      $("kq-sap-xep").innerHTML = '<div class="kq goi-y">Đây là thứ tự đúng. Bấm <b>Xáo lại</b> để thử tự làm lại.</div>';
    };

    // Chọn code của cách làm khác
    $("chon-code-sap-xep").onclick = function (e) {
      var nut = e.target.closest("button");
      if (!nut) return;
      var cacNut = $("chon-code-sap-xep").querySelectorAll("button");
      for (var k = 0; k < cacNut.length; k++) {
        cacNut[k].classList.toggle("dang-chon", cacNut[k] === nut);
      }
      xao(TT.cachLam[nut.dataset.cach].code);
    };

    xao(TT.cachLam[cach[0]].code);
  }

  // ==================================================================
  // Hàm khởi tạo: app.js gọi hàm này một lần khi mở trang
  // ==================================================================
  window.AlgoViet.luyenTap = {
    khoiTao: function (TT) {
      var coDien = !!(TT.luyenTap && TT.luyenTap.dienCho);   // thuật toán này có bài điền chỗ trống không?
      if (coDien) khoiTaoDien(TT.luyenTap.dienCho);
      khoiTaoSapXep(TT);
      $("nut-bt-dien").hidden = !coDien;

      // Chọn hiện bài nào: "dien" hoặc "sap-xep"
      function chon(loai) {
        $("bt-dien").hidden = (loai !== "dien");
        $("bt-sap-xep").hidden = (loai !== "sap-xep");
        $("nut-bt-dien").classList.toggle("dang-chon", loai === "dien");
        $("nut-bt-sap-xep").classList.toggle("dang-chon", loai === "sap-xep");
      }
      $("nut-bt-dien").onclick = function () { chon("dien"); };
      $("nut-bt-sap-xep").onclick = function () { chon("sap-xep"); };
      chon(coDien ? "dien" : "sap-xep");
    }
  };
})();
