// 숙소 상세 페이지. 예시(샘플) 데이터예요. 실제 가격·후기 연동 전까지 데모로 봐주세요.
(function () {
  var el = document.getElementById("sd");
  if (!el) return;
  var id = new URLSearchParams(location.search).get("id") || "";

  // data.js STAYS에서 사진 파일명(14-okura.jpg → okura)으로 찾기
  var found = null;
  var stays = typeof STAYS !== "undefined" ? STAYS : [];
  stays.forEach(function (g) {
    g.items.forEach(function (it) {
      var m = it[2].match(/\/(?:\d+-)+(.+)\.jpg$/);
      if (m && m[1] === id) found = { name: it[0], area: it[1], img: it[2], kind: it[3], country: g.country };
    });
  });

  // 마퀴 8곳: 직접 쓴 예시 가격·후기 + 도시 사진
  var FEATURED = {
    okura:     { price: "₩780,000~", extra: "assets/night/1-tokyo.jpg",   reviews: [["미나 · 2026.09", "로비에 들어서는 순간 왜 유명한지 알겠더라고요. 고층 방에서 보는 도쿄 타워가 최고였어요."], ["Kevin · 2026.07", "조용하고 정갈한 분위기. 위치도 역에서 가까워서 짐 옮기기 편했어요."]] },
    chelsea:   { price: "₩460,000~", extra: "assets/night/4-newyork.jpg", reviews: [["수진 · 2026.08", "인테리어가 정말 독특해요. 사진이랑 똑같이 생겨서 계속 사진 찍었어요."], ["Tomás · 2026.06", "방은 작은 편이지만 분위기 하나는 뉴욕 최고. 위치도 어디든 걸어다니기 좋았어요."]] },
    lutetia:   { price: "₩1,050,000~", extra: "assets/night/2-paris.jpg", reviews: [["지은 · 2026.05", "파리에서 제일 좋았던 숙소. 아침 조식 공간이 영화 세트 같아요."], ["Camille · 2026.04", "리모델링 이후 훨씬 환해졌어요. 생제르맹이라 저녁 산책이 최고예요."]] },
    savoy:     { price: "₩890,000~", extra: "assets/night/2-london.jpg",  reviews: [["Daniel · 2026.09", "클래식함 그 자체. 직원분들 서비스가 정말 세심해요."], ["유나 · 2026.03", "애프터눈 티가 유명하다고 해서 했는데 호텔 로비만으로도 갈 가치가 있어요."]] },
    metropole: { price: "₩380,000~", extra: "assets/places/10-hanoi.jpg", reviews: [["성민 · 2026.10", "역사가 느껴지는 호텔이에요. 호안끼엠까지 걸어서 5분. 풀장이 조용해서 좋았어요."], ["Linh · 2026.08", "방은 조금 낡은 느낌도 있지만 그게 매력이에요. 직원분들이 친절해요."]] },
    peninsula: { price: "₩490,000~", extra: "assets/night/3-bangkok.jpg", reviews: [["혜진 · 2026.07", "강변 뷰가 압도적이에요. 셔틀보트 타고 밖에 나가는 것도 재밌었어요."], ["Ploy · 2026.05", "수영장에서 보는 짜오프라야강 노을이 기억에 남아요. 조식도 훌륭해요."]] },
    parkhyatt: { price: "₩950,000~", extra: "assets/night/3-sydney.jpg",  reviews: [["지호 · 2026.09", "하버 브리지가 창밖으로 꽉 차게 보여요. 위치만으로 충분했어요."], ["Emma · 2026.06", "미니멀하고 차분한 분위기. 더 록스 지역이라 구시가지 산책이 좋아요."]] },
    icdanang:  { price: "₩620,000~", extra: "assets/places/10-danang.jpg", reviews: [["태윤 · 2026.08", "리조트 자체가 관광지예요. 프라이빗 비치까지 케이블카 타고 내려가요."], ["Mai · 2026.04", "사진보다 실물이 더 좋아요. 쉬러 가기에 최고의 선택이었어요."]] }
,
    mbs:       { price: "₩720,000~", extra: "assets/night/1-singapore.jpg", reviews: [["Elena · 2026.09", "옥상 인피니티 풀에서 보는 야경이 정말 압도적이에요. 한 번쯤 꼭 묵어볼 만해요."], ["Kai · 2026.07", "위치도 서비스도 훌륭했어요. 가격대는 있지만 그만한 경험이었습니다."]] },
    burjalarab:{ price: "₩1,600,000~", extra: "assets/places/8-dubai.jpg", reviews: [["Omar · 2026.10", "돛 모양 건물 안에서의 하루가 상상 이상이었어요. 인생 호텔로 꼽을 만합니다."], ["Sofia · 2026.08", "로비부터 객실까지 모든 게 특별했어요. 특별한 날에 딱 맞는 곳이에요."]] },
    wbarcelona:{ price: "₩520,000~", extra: "assets/places/3-barcelona.jpg", reviews: [["Marta · 2026.09", "해변 뷰 객실에서 본 일몰이 잊히지 않아요. 바르셀로네타 산책도 바로예요."], ["Diego · 2026.06", "해변까지 1분. 루프톱 바 분위기도 최고였습니다."]] },
    danieli:   { price: "₩690,000~", extra: "", reviews: [["Chiara · 2026.10", "곤돌라가 오가는 풍경을 보며 맞는 아침이 영화 같았어요."], ["Liam · 2026.08", "클래식한 베네치아 궁전 분위기 그 자체. 위치도 산 마르코에서 가까워요."]] }
  };

  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  if (!found) {
    el.innerHTML = '<p class="meta" style="padding:40px 0">찾으려는 숙소가 아직 없어요. <a href="stay.html">숙소 목록으로 돌아가기</a></p>';
    return;
  }

  var f = FEATURED[id];
  var price = f ? f.price : (found.kind === "호스텔" ? "₩45,000~" : found.kind === "리조트" ? "₩380,000~" : "₩250,000~");
  var reviews = f ? f.reviews : [
    ["여행자 A · 2026년", esc(found.area.split(" ")[0]) + " 지역이랑 가까워서 움직이기 편했어요. 사진이랑 실물이 비슷해요."],
    ["여행자 B · 2026년", "직원분들이 친절했어요. 다음에 " + esc(found.country) + " 오면 또 묵고 싶어요."]
  ];

  // 동네 현지인 친구 매칭 (예시 프로필). 실제 가입자가 아니에요.
  var FRIENDS_BY_CITY = {
    "도쿄": [{ name: "하루", badge: "도쿄 토박이", img: "assets/people/4-locals-1.jpg", line: "골목 카페와 작은 서점을 찾아다녀요" }],
    "방콕": [{ name: "소피", badge: "야시장 마스터", img: "assets/people/8-locals-3.jpg", line: "시장 구경과 야시장을 좋아해요" }],
    "파리": [{ name: "Emma", badge: "파리 카페 헌터", img: "assets/people/7-locals-2.jpg", line: "베이커리와 미술관을 좋아해요" }],
    "시드니": [{ name: "리아", badge: "브런치 러버", img: "assets/people/11-locals-6.jpg", line: "해변 산책과 브런치를 좋아해요" }],
    "로마": [{ name: "루카", badge: "골목 산책러", img: "assets/people/10-locals-5.jpg", line: "현지 음식과 숨은 명소를 찾아다녀요" }],
    "서울": [{ name: "민준", badge: "맛집 헌터", img: "assets/people/9-locals-4.jpg", line: "맛집과 사진 찍기를 좋아해요" }]
  };
  var cityFriends = FRIENDS_BY_CITY[(found.area.split(" ")[0] || "")] || [];
  var friendHtml = cityFriends.length
    ? cityFriends.map(function (fr) {
        return '<a class="sd-friend" href="friends.html"><img src="' + fr.img + '" alt="' + esc(fr.name) + ' 예시 프로필 사진 (AI로 만든 가상 인물)" width="52" height="52" loading="lazy"><span class="sd-friend-tx"><b>' + esc(fr.name) + ' <span class="fp-badge">' + esc(fr.badge) + '</span></b><small>' + esc(fr.line) + '</small></span><span class="sd-friend-cta">채팅하기</span></a>';
      }).join("")
    : '<p class="meta">이 도시의 예시 친구는 아직 준비 중이에요. <a href="friends.html">친구 찾기</a>에서 먼저 만나 볼 수 있어요.</p>';

  var gallery = '<div class="sd-gallery">' +
    '<figure><img src="' + found.img + '" alt="' + esc(found.name) + '"><figcaption>숙소 사진 (예시)</figcaption></figure>' +
    (f && f.extra ? '<figure><img src="' + f.extra + '" alt="주변 지역"><figcaption>주변 지역 (예시)</figcaption></figure>' : '') +
    (f ? '<figure><img src="' + found.img + '" alt="' + esc(found.name) + '" style="filter:saturate(.92) hue-rotate(6deg)"><figcaption>객실 무드 (예시)</figcaption></figure>' : '') +
    '</div>';

  var reviewHtml = reviews.map(function (r) {
    return '<article class="rv"><div class="stars" aria-label="별점 5점">★★★★★</div><p>“' + r[1] + '”</p><div class="who">' + r[0] + '</div></article>';
  }).join("");

  el.innerHTML =
    '<a class="sd-back" href="stay.html">← 숙소 목록으로</a>' +
    gallery +
    '<div class="sd-main"><div><h1>' + esc(found.name) + '</h1><p class="meta">' + esc(found.area) + ' · ' + esc(found.country) + ' · ' + esc(found.kind) + '</p></div>' +
    '<div class="sd-wishwrap"><button class="wish" type="button" data-stay="' + esc(id) + '" aria-label="찜하기" aria-pressed="false"><svg viewBox="0 0 24 24"><path d="M12 21C12 21 3 14.5 3 8.8 3 5.6 5.4 3.5 8 3.5c1.7 0 3.1.9 4 2.3.9-1.4 2.3-2.3 4-2.3 2.6 0 5 2.1 5 5.3C21 14.5 12 21 12 21z"/></svg></button></div></div>' +
    '<div class="sd-price"><b>' + price + '</b> <span>· 1박 기준 (예시 가격)</span><small>세금·시즌에 따라 달라져요. 예약 연동 전 샘플이에요.</small></div>' +
    '<div class="sd-sec"><h2>이 숙소의 후기 <span class="meta" style="font-size:13px">(예시)</span></h2><div class="rv-grid">' + reviewHtml + '</div></div>' +
    '<div class="sd-sec"><h2>이 동네 현지인 친구 <span class="meta" style="font-size:13px">(예시)</span></h2><div class="sd-friends">' + friendHtml + '</div></div>' +
    '<p class="sd-note">이 페이지의 가격과 후기는 서비스 방향을 보여주기 위한 예시예요.</p>';

  document.title = found.name + " | rululala";
  if (window.RuluWish) window.RuluWish.wire(el);
})();
