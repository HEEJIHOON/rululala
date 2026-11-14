// 지도 페이지(map.html) 전용이에요.
// 지도 타일은 OpenStreetMap, 장소 데이터는 Overpass API(공개 서버)에서 실시간으로 가져와요. 키나 비용이 없어요.
// 친구는 실제 위치가 아니라 '활동 지역 예시'로만 보여요. 실제 회원 위치는 앞으로 본인 동의를 받은 활동 지역만 표시해야 해요.
(function () {
  "use strict";
  var mapEl = document.getElementById("map");
  if (!mapEl || typeof L === "undefined") return;

  // 도시 좌표는 OpenStreetMap Nominatim 검색 결과(도시 중심)예요. data.js의 REGIONS와 키가 같아요.
  var CITIES = {
    "도쿄|일본": [35.6769, 139.7639], "오사카|일본": [34.6938, 135.5015], "후쿠오카|일본": [33.5839, 130.3797],
    "방콕|태국": [13.7525, 100.4935], "치앙마이|태국": [18.7883, 98.9859], "다낭|베트남": [16.0685, 108.224],
    "하노이|베트남": [21.0283, 105.854], "타이베이|대만": [25.0375, 121.5637], "싱가포르|싱가포르": [1.3571, 103.8195],
    "발리|인도네시아": [-8.6653, 115.2176], "파리|프랑스": [48.8535, 2.3484], "런던|영국": [51.5074, -0.1278],
    "바르셀로나|스페인": [41.3826, 2.1771], "로마|이탈리아": [41.8933, 12.4829], "베를린|독일": [52.5174, 13.3951],
    "프라하|체코": [50.0875, 14.4213], "리스본|포르투갈": [38.7078, -9.1366], "뉴욕|미국": [40.7127, -74.006],
    "로스앤젤레스|미국": [34.0537, -118.2428], "밴쿠버|캐나다": [49.2609, -123.114], "멕시코시티|멕시코": [19.3208, -99.1515],
    "부에노스아이레스|아르헨티나": [-34.6096, -58.3888], "시드니|호주": [-33.8698, 151.2083], "멜버른|호주": [-37.8142, 144.9632],
    "오클랜드|뉴질랜드": [-36.8521, 174.7632], "두바이|아랍에미리트": [25.1948, 55.2782], "이스탄불|튀르키예": [41.0064, 28.9759],
    "마라케시|모로코": [31.6258, -7.9892], "케이프타운|남아프리카공화국": [-33.9288, 18.4172], "서울|대한민국": [37.5667, 126.9783]
  };

  var CATS = {
    sight: { label: "관광지", sub: "둘러볼 명소", color: "#2f9e6e" },
    stay: { label: "숙소", sub: "머물 만한 곳", color: "#3b7dd8" },
    friend: { label: "현지인 친구", sub: "예시 활동 지역", color: "#7c6ff2" }
  };

  // friends.js의 예시 프로필과 같은 5명이에요. 실제 위치가 아니라 도시 중심 근처의 '활동 지역 예시'로만 표시해요.
  var FRIENDS = [
    { id: "p1", name: "하루", city: "도쿄", country: "일본", emoji: "\uD83C\uDF38", tags: ["카페", "산책", "사진"] },
    { id: "p2", name: "민준", city: "서울", country: "대한민국", emoji: "\uD83D\uDCF7", tags: ["맛집", "사진", "전시"] },
    { id: "p3", name: "Emma", city: "파리", country: "프랑스", emoji: "\uD83E\uDD50", tags: ["카페", "전시", "산책"] },
    { id: "p4", name: "루카", city: "로마", country: "이탈리아", emoji: "\uD83C\uDF5D", tags: ["맛집", "산책"] },
    { id: "p5", name: "소피", city: "방콕", country: "태국", emoji: "\uD83C\uDF34", tags: ["맛집", "쇼핑", "사진"] }
  ];

  var statusEl = document.getElementById("map-status");
  var citySel = document.getElementById("map-city");
  var catBox = document.getElementById("map-cats");
  var cache = {};
  // 도시별 장소 스냅샷 파일 이름이에요. assets/map/poi-<슬러그>.json
  var SLUGS = {
    "도쿄|일본": "tokyo", "오사카|일본": "osaka", "후쿠오카|일본": "fukuoka",
    "방콕|태국": "bangkok", "치앙마이|태국": "chiangmai", "다낭|베트남": "danang",
    "하노이|베트남": "hanoi", "타이베이|대만": "taipei", "싱가포르|싱가포르": "singapore",
    "발리|인도네시아": "bali", "파리|프랑스": "paris", "런던|영국": "london",
    "바르셀로나|스페인": "barcelona", "로마|이탈리아": "rome", "베를린|독일": "berlin",
    "프라하|체코": "prague", "리스본|포르투갈": "lisbon", "뉴욕|미국": "newyork",
    "로스앤젤레스|미국": "losangeles", "밴쿠버|캐나다": "vancouver", "멕시코시티|멕시코": "mexicocity",
    "부에노스아이레스|아르헨티나": "buenosaires", "시드니|호주": "sydney", "멜버른|호주": "melbourne",
    "오클랜드|뉴질랜드": "auckland", "두바이|아랍에미리트": "dubai", "이스탄불|튀르키예": "istanbul",
    "마라케시|모로코": "marrakesh", "케이프타운|남아프리카공화국": "capetown", "서울|대한민국": "seoul"
  };
  var currentKey = null;
  var currentCats = { sight: true, stay: true, friend: true };
  var loadToken = 0;
  var snapAll = null;

  var map = L.map(mapEl, { scrollWheelZoom: true }).setView([33.5, 126.5], 3);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> 기여자 · 장소 데이터 © OSM 기여자'
  }).addTo(map);

  var layers = {};
  Object.keys(CATS).forEach(function (k) { layers[k] = L.layerGroup().addTo(map); });

  // 도시 선택 상자: data.js의 REGIONS를 지역별로 묶어요.
  if (typeof REGIONS !== "undefined") {
    REGIONS.forEach(function (region) {
      var g = document.createElement("optgroup");
      g.label = region.name;
      region.cities.forEach(function (pair) {
        var key = pair[0] + "|" + pair[1];
        if (!CITIES[key]) return;
        var o = document.createElement("option");
        o.value = key;
        o.textContent = pair[0] + ", " + pair[1];
        g.appendChild(o);
      });
      if (g.children.length) citySel.appendChild(g);
    });
  }
  // 서울은 친구 예시 때문에 추가해요.
  (function () {
    var o = document.createElement("option");
    o.value = "서울|대한민국";
    o.textContent = "서울, 대한민국";
    citySel.appendChild(o);
  })();

  function pin(cat) {
    return L.divIcon({
      className: "mp mp-" + cat,
      html: "",
      iconSize: [26, 26], iconAnchor: [13, 24], popupAnchor: [0, -21]
    });
  }

  // 카테고리 칩
  Object.keys(CATS).forEach(function (k) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "map-cat";
    b.setAttribute("aria-pressed", "true");
    b.innerHTML = '<span class="dot" style="background:' + CATS[k].color + '"></span><span class="map-cat-tx"><b>' + CATS[k].label + '</b><small>' + CATS[k].sub + '</small></span>';
    b.addEventListener("click", function () {
      currentCats[k] = !currentCats[k];
      b.setAttribute("aria-pressed", String(currentCats[k]));
      if (currentCats[k]) map.addLayer(layers[k]);
      else map.removeLayer(layers[k]);
    });
    catBox.appendChild(b);
  });

  function setStatus(text, retry) {
    statusEl.textContent = text;
    if (retry) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = "다시 시도";
      b.addEventListener("click", function () { loadCity(currentKey, true); });
      statusEl.appendChild(b);
    }
  }

  // 친구의 '활동 지역 예시' 위치: 도시 중심에서 id만큼 결정적으로 살짝 옮겨요. 실제 위치가 아니에요.
  function friendPoint(f) {
    var c = CITIES[f.city + "|" + f.country];
    if (!c) return null;
    var h = 0, i;
    for (i = 0; i < f.id.length; i++) h = (h * 31 + f.id.charCodeAt(i)) >>> 0;
    var ang = (h % 360) * Math.PI / 180;
    var d = 0.6 + (h % 600) / 1000; // 0.6~1.2km
    var dLat = d / 111.32;
    var dLng = d / (111.32 * Math.cos(c[0] * Math.PI / 180));
    return [c[0] + dLat * Math.sin(ang), c[1] + dLng * Math.cos(ang)];
  }

  function renderFriends() {
    layers.friend.clearLayers();
    FRIENDS.forEach(function (f) {
      var p = friendPoint(f);
      if (!p) return;
      L.circle(p, { radius: 1100, color: "#7c6ff2", weight: 1, dashArray: "4 4", fillColor: "#7c6ff2", fillOpacity: 0.08 })
        .addTo(layers.friend);
      L.marker(p, { icon: pin("friend") })
        .addTo(layers.friend)
        .bindPopup("<b>" + f.emoji + " " + f.name + "</b> (예시)<br>" + f.city + ", " + f.country + "<br>" +
          "<span style='color:#787574;font-size:12px'>활동 지역 예시예요. 실제 위치가 아니에요.</span>");
    });
  }

  function classify(tags) {
    if (!tags) return null;
    if (/^(hotel|hostel|guest_house)$/.test(tags.tourism || "")) return "stay";
    if (/^(attraction|museum|gallery|viewpoint)$/.test(tags.tourism || "")) return "sight";
    return null;
  }

  function renderPois(elements) {
    ["sight", "stay"].forEach(function (k) { layers[k].clearLayers(); });
    var counts = { sight: 0, stay: 0 };
    var seen = {};
    (elements || []).forEach(function (el) {
      var t = el.tags || {};
      var cat = classify(t);
      var name = t.name;
      if (!cat || !name || counts[cat] >= 25) return;
      var skey = cat + ":" + name;
      if (seen[skey]) return;
      seen[skey] = 1;
      counts[cat]++;
      var extra = t.cuisine ? " · " + String(t.cuisine).replace(/_/g, " ") : "";
      L.marker([el.lat, el.lon], { icon: pin(cat) })
        .addTo(layers[cat])
        .bindPopup("<b>" + name.replace(/</g, "&lt;") + "</b><br><span style='color:#787574;font-size:12px'>" + CATS[cat].label + extra + "</span>");
    });
    return counts;
  }

  function loadCity(key, force) {
    var c = CITIES[key];
    if (!c) return;
    currentKey = key;
    map.flyTo(c, 13, { duration: 0.8 });
    renderFriends();
    if (!force && cache[key]) {
      var cc = renderPois(cache[key]);
      setStatus(key.split("|")[0] + " · 숙소 " + cc.stay + "곳, 관광지 " + cc.sight + "곳을 찾았어요.");
      return;
    }
    var token = ++loadToken;
    setStatus("장소를 불러오는 중이에요…");
    // 먼저 미리 만들어 둔 장소 스냅샷(assets/map/pois.json[도시])을 읽어요. 없으면 실시간으로 조회해요.
    (snapAll || (snapAll = fetch("assets/map/pois.json")
      .then(function (r) { if (!r.ok) throw new Error("http " + r.status); return r.json(); })))
      .then(function (all) { return all[SLUGS[key]]; })
      .then(function (elements) {
        if (token !== loadToken) return;
        if (!elements || !elements.length) throw new Error("empty");
        cache[key] = elements;
        var counts = renderPois(elements);
        setStatus(key.split("|")[0] + " · 숙소 " + counts.stay + "곳, 관광지 " + counts.sight + "곳을 찾았어요.");
      })
      .catch(function () { loadLive(key, c, token); });
  }

  // 스냅샷이 없을 때 쓰는 실시간 조회예요. 공개 Overpass 서버는 가끔 바빠요. 하나가 실패하면 다음 서버로 넘겨요.
  function loadLive(key, c, token) {
    var q = "[out:json][timeout:15];(" +
      'node["tourism"~"^(attraction|museum|gallery|viewpoint)$"]["name"](around:6000,' + c[0] + "," + c[1] + ");" +
      'node["tourism"~"^(hotel|hostel|guest_house)$"]["name"](around:3000,' + c[0] + "," + c[1] + ");" +
      ");out body 150;";
    var ENDPOINTS = [
      "https://overpass-api.de/api/interpreter",
      "https://overpass.kumi.systems/api/interpreter",
      "https://overpass.private.coffee/api/interpreter"
    ];
    var body = "data=" + encodeURIComponent(q);
    function tryEndpoint(i) {
      if (token !== loadToken) return;
      if (i >= ENDPOINTS.length) {
        setStatus("장소 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.", true);
        return;
      }
      var ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
      var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 45000) : 0;
      fetch(ENDPOINTS[i], {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body,
        signal: ctrl ? ctrl.signal : undefined
      })
        .then(function (r) { if (!r.ok) throw new Error("http " + r.status); return r.json(); })
        .then(function (data) {
          clearTimeout(timer);
          if (token !== loadToken) return;
          cache[key] = data.elements || [];
          var counts = renderPois(cache[key]);
          var total = counts.sight + counts.stay;
          setStatus(total
            ? key.split("|")[0] + " · 숙소 " + counts.stay + "곳, 관광지 " + counts.sight + "곳을 찾았어요."
            : "이 도시에서는 아직 장소 데이터를 찾지 못했어요.", !total);
        })
        .catch(function () {
          clearTimeout(timer);
          tryEndpoint(i + 1);
        });
    }
    tryEndpoint(0);
  }

  citySel.addEventListener("change", function () { loadCity(citySel.value); });

  // 첫 화면: 도쿄
  citySel.value = "도쿄|일본";
  loadCity("도쿄|일본");
})();
