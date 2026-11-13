/* 질문으로 시작하기 (미리보기): 도시 -> 궁금한 것 -> 예시 프로필 -> 수정 가능한 첫 질문 -> 데모 채팅 열기.
   프로필 데이터는 friends.js의 PEOPLE을 그대로 읽어요(복사본 없음). 예시 프로필과 브라우저 안 데모예요. 실제 현지인에게 전달되지 않아요. */
(function () {
  var box = document.getElementById("ask");
  if (!box) return;
  var cityEl = box.querySelector("[data-ask=city]"), topicEl = box.querySelector("[data-ask=topic]"),
      outEl = box.querySelector("[data-ask=out]");
  // 주제는 프로필 태그가 직접 말해 주는 것만 둬요. 태그가 같아도 전문성이나 거주 확인은 아니에요.
  var TOPICS = [
    ["맛집", ["맛집"], function (c) { return c + "에서 직접 자주 가 보신 맛집이 있으면 알려주실 수 있나요?"; }],
    ["카페", ["카페"], function (c) { return c + "에서 직접 가 보신 카페 중에 좋았던 곳이 있나요?"; }],
    ["산책·사진", ["산책", "사진"], function (c) { return c + "에서 직접 걸어 보신 곳 중에 산책하기나 사진 찍기 좋았던 곳이 있나요?"; }],
    ["전시·미술관", ["전시"], function (c) { return c + "에서 가 보신 전시나 미술관 중에 기억에 남는 곳이 있나요?"; }],
    ["쇼핑", ["쇼핑"], function (c) { return c + "에서 직접 가 보신 시장이나 쇼핑 장소 중에 좋았던 곳이 있나요?"; }],
    ["여행 이야기", [], function (c) { return "안녕하세요! " + c + " 여행을 계획 중이에요. 직접 해 보신 경험 중에 이야기해 주실 만한 게 있을까요?"; }]
  ];
  var st = { city: null, topic: null }, PEOPLE = null;
  function chip(label, on, fn) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "ask-chip"; b.textContent = label;
    b.setAttribute("aria-pressed", on ? "true" : "false");
    b.addEventListener("click", fn);
    return b;
  }
  function cities() { var o = []; PEOPLE.forEach(function (p) { if (o.indexOf(p.city) < 0) o.push(p.city); }); return o; }
  function draw() {
    cityEl.innerHTML = ""; topicEl.innerHTML = ""; outEl.innerHTML = "";
    cities().forEach(function (c) { cityEl.appendChild(chip(c, st.city === c, function () { st.city = c; draw(); })); });
    topicEl.parentNode.hidden = !st.city;
    if (!st.city) return;
    TOPICS.forEach(function (t, i) { topicEl.appendChild(chip(t[0], st.topic === i, function () { st.topic = i; draw(); })); });
    if (st.topic == null) return;
    var need = TOPICS[st.topic][1];
    var p = PEOPLE.filter(function (x) {
      return x.city === st.city && (!need.length || need.some(function (t) { return x.tags.indexOf(t) >= 0; }));
    })[0];
    if (!p) {
      outEl.innerHTML = '<div class="ask-card"><b class="ask-none">이 도시와 주제에 맞는 예시 프로필이 아직 없어요.</b>' +
        '<p class="ask-note">다른 주제를 고르거나 <a href="friends.html">친구 찾기</a>에서 직접 찾아보세요. 지금 보여드리는 프로필은 예시예요.</p></div>';
      return;
    }
    outEl.innerHTML =
      '<div class="ask-card"><div class="ask-who"><b></b><span class="ask-tag">예시 프로필</span><small></small></div>' +
      '<label class="ask-lab" for="askDraft">첫 질문 (대화를 열기 전에 고칠 수 있어요)</label>' +
      '<textarea id="askDraft" rows="3" maxlength="500"></textarea>' +
      '<div class="ask-actions"><button type="button" class="btn ask-open">데모 채팅 열기</button></div>' +
      '<p class="ask-note">데모 채팅 창이 열리고 입력칸에 이 질문이 채워져요. 보내기는 직접 눌러야 하고, 지금은 이 브라우저 안에서만 동작해서 실제 현지인에게 전달되지 않아요. 주제 태그가 같다는 뜻일 뿐, 전문성이나 거주 여부를 확인한 것은 아니에요.</p></div>';
    outEl.querySelector(".ask-who b").textContent = p.name + " · " + p.city;
    outEl.querySelector(".ask-who small").textContent = p.age + "세 · " + p.tags.join(", ");
    outEl.querySelector("textarea").value = TOPICS[st.topic][2](st.city);
    outEl.querySelector(".ask-open").addEventListener("click", function () {
      var v = outEl.querySelector("textarea").value.trim();
      if (!v) return;
      try { sessionStorage.setItem("rululala_ask", JSON.stringify({ pid: p.id, text: v })); } catch (e) {}
      location.href = "friends.html";
    });
  }
  fetch("friends.js").then(function (r) { return r.text(); }).then(function (t) {
    var m = t.match(/const PEOPLE=(\[[\s\S]*?\n\]);/);
    PEOPLE = m ? new Function("return " + m[1])() : null;
    if (!PEOPLE) throw 0;
    draw();
  }).catch(function () { cityEl.textContent = "예시 프로필을 불러오지 못했어요."; });
})();
