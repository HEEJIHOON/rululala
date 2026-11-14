// 찜하기: 이 브라우저에만 저장돼요. 하트는 .wish[data-stay]에 자동으로 연결돼요.
(function () {
  var KEY = "rululala-wish";
  function read() { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; } }
  function write(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }
  function paint(btn) {
    var on = read().indexOf(btn.dataset.stay) >= 0;
    btn.classList.toggle("on", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  }
  function wire(root) {
    (root || document).querySelectorAll(".wish[data-stay]").forEach(function (btn) {
      if (btn._wishWired) return;
      btn._wishWired = true;
      paint(btn);
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var l = read(), i = l.indexOf(btn.dataset.stay);
        if (i >= 0) l.splice(i, 1); else l.push(btn.dataset.stay);
        write(l);
        document.querySelectorAll('.wish[data-stay="' + btn.dataset.stay + '"]').forEach(paint);
        btn.classList.remove("pop"); void btn.offsetWidth; btn.classList.add("pop");
      });
    });
  }
  window.RuluWish = { wire: wire };
  wire(document);
})();
