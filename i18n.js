// 홈(메인) 화면 언어 설정이에요. 선택은 이 브라우저에만 저장돼요.
(function () {
  "use strict";
  var sel = document.getElementById("lang-sel");
  if (!sel) return;

  // [CSS 선택자, 대상(text|placeholder), 사전 키]
  var BINDINGS = [
    ['.rail a.ri[href="index.html"] .rl', "text", "nav_home"],
    ['.rail a.ri[href="friends.html"] .rl', "text", "nav_friends"],
    ['.rail a.ri[href="world.html"] .rl', "text", "nav_world"],
    ['.rail a.ri[href="map.html"] .rl', "text", "nav_map"],
    ['.rail a.ri[href="stay.html"] .rl', "text", "nav_stay"],
    ['.rail a.ri[href="safe.html"] .rl', "text", "nav_safe"],
    ['.rail .rail-auth .t-out-rl', "text", "nav_login"],
    ['.rail .rail-auth .t-in-rl', "text", "nav_mypage"],
    [".tb-login.tb-out", "text", "nav_login"],
    [".tb-login.tb-in", "text", "nav_mypage"],
    [".tb-search input", "placeholder", "search_ph"],
    [".friends-row .band-head h2", "text", "h_chat"],
    [".stay-marquee .band-head h2 .i18n-stays", "text", "h_stays"],
    ["#home-map .band-head h2", "text", "h_map"],
    [".demo-note", "text", "demo_note"],
    ["#home-map .map-sub", "text", "map_sub"],
    ['.cats a.cat[href="world.html"]', "textAfterEmoji", "cat_world"],
    ['.cats a.cat[href="friends.html"]:nth-of-type(2)', "textAfterEmoji", "cat_friends"],
    ['.cats a.cat[href="stay.html"]', "textAfterEmoji", "cat_stay"],
    ['.cats a.cat[href="safe.html"]', "textAfterEmoji", "cat_safe"],
    ['.cats a.cat[href="friends.html"]:nth-of-type(5)', "textAfterEmoji", "cat_chat"],
    [".ask h2", "text", "h_ask"],
    [".ask-sub", "text", "ask_sub"],
    ['.ask .ask-step:nth-of-type(1) > span', "text", "ask_step1"],
    ['.ask .ask-step:nth-of-type(2) > span', "text", "ask_step2"],
    [".band-head.static h2", "text", "h_how"],
    [".steps li:nth-child(1) h3", "text", "step1_h"],
    [".steps li:nth-child(1) p", "text", "step1_p"],
    [".steps li:nth-child(2) h3", "text", "step2_h"],
    [".steps li:nth-child(2) p", "text", "step2_p"],
    [".steps li:nth-child(3) h3", "text", "step3_h"],
    [".steps li:nth-child(3) p", "text", "step3_p"],
    [".steps li:nth-child(4) h3", "text", "step4_h"],
    [".steps li:nth-child(4) p", "text", "step4_p"]
  ];

  var STR = {
    en: {
      nav_home: "Home", nav_friends: "Friends", nav_world: "Cities", nav_map: "Map", nav_stay: "Stays", nav_safe: "Safety",
      nav_login: "Log in", nav_mypage: "My page",
      search_ph: "Where to? Search cities or friends",
      h_chat: "Local Chat", h_stays: "Recommended Stays", h_map: "Explore on the Map", h_ask: "Ask Someone Who Lives There", h_how: "How It Works",
      demo_note: "Sample profiles. Names, ratings and review counts are all examples, not real members.",
      map_sub: "Pick a city to see its stays, sights and local friends living nearby on the map. Friend activity areas are samples.",
      cat_world: "Cities", cat_friends: "Find friends", cat_stay: "Stays", cat_safe: "Safety tips", cat_chat: "Local chat",
      ask_sub: "Pick a city and a topic, and we'll draft your first question. This preview uses sample profiles.",
      ask_step1: "1. City", ask_step2: "2. Topic",
      step1_h: "Pick a city", step1_p: "Browse destinations by region, like Europe or Asia, on the Cities page. Typing a city name in the home search takes you straight to finding friends.",
      step2_h: "Find friends", step2_p: "Find local friends who fit you with city, interest and rating filters and search. You can check their bio, interests and rating on the profile first.",
      step3_h: "Say hello", step3_p: "Send a message to a friend. For now this is a demo that works only in this browser. If the first word feels hard, pick an icebreaker like restaurant tips or hidden spots.",
      step4_h: "Leave a review", step4_p: "Log in and leave a star rating and review for friends you've messaged. For now, reviews are stored only in your browser."
    },
    ja: {
      nav_home: "ホーム", nav_friends: "友達", nav_world: "都市", nav_map: "地図", nav_stay: "宿泊", nav_safe: "安全",
      nav_login: "ログイン", nav_mypage: "マイページ",
      search_ph: "どこへ行きますか？都市や友達を検索してみてください",
      h_chat: "現地人チャット", h_stays: "おすすめ宿泊先", h_map: "地図で見る", h_ask: "住んでいる人に聞いてみよう", h_how: "出会い方",
      demo_note: "サンプルプロフィールです。名前・評価・レビュー数はすべて例で、実際の会員ではありません。",
      map_sub: "都市を選ぶと、その都市の宿泊先・観光地と近くに住む現地人の友達を地図で見られます。友達の活動エリア表示はサンプルです。",
      cat_world: "都市", cat_friends: "友達を探す", cat_stay: "宿泊", cat_safe: "安全の心得", cat_chat: "現地人チャット",
      ask_sub: "都市と聞きたいテーマを選ぶと、最初の質問を作ります。サンプルプロフィールで見せるプレビューです。",
      ask_step1: "1. 都市", ask_step2: "2. 聞きたいこと",
      step1_h: "都市を選ぶ", step1_p: "都市ページでヨーロッパ・アジアなど地域別の旅行先を眺めてみましょう。ホームの検索窓に都市名を入れても友達探しにつながります。",
      step2_h: "友達を探す", step2_p: "都市・興味・評価のフィルターと検索で、合いそうな現地の友達を探しましょう。プロフィールで紹介・興味・評価を先に確認できます。",
      step3_h: "挨拶する", step3_p: "友達にメッセージを送ってみましょう。今はこのブラウザ内だけで動くデモです。最初の一言が難しければ、グルメや隠れスポットのアイスブレイク質問が使えます。",
      step4_h: "レビューを残す", step4_p: "ログインして、メッセージを送った友達に星とレビューを残せます。今のレビューは自分のブラウザにだけ保存されます。"
    },
    zh: {
      nav_home: "首页", nav_friends: "朋友", nav_world: "城市", nav_map: "地图", nav_stay: "住宿", nav_safe: "安全",
      nav_login: "登录", nav_mypage: "我的主页",
      search_ph: "要去哪里？搜索城市或朋友吧",
      h_chat: "本地人聊天", h_stays: "推荐住宿", h_map: "在地图上查看", h_ask: "问问住在那里的人", h_how: "如何相遇",
      demo_note: "示例资料。名字、评分、评价数均为示例，并非真实会员。",
      map_sub: "选择城市后，可以在地图上查看该城市的住宿、景点和住在附近的本地朋友。朋友活动区域为示例。",
      cat_world: "城市", cat_friends: "找朋友", cat_stay: "住宿", cat_safe: "安全须知", cat_chat: "本地人聊天",
      ask_sub: "选择城市和感兴趣的话题，我们为您拟好第一个问题。这是用示例资料展示的预览。",
      ask_step1: "1. 城市", ask_step2: "2. 想知道的",
      step1_h: "选择城市", step1_p: "在城市页面按欧洲、亚洲等地区浏览旅行目的地。在首页搜索框输入城市名也可以直接去找朋友。",
      step2_h: "找朋友", step2_p: "用城市、兴趣、评分筛选和搜索，找到合得来的本地朋友。可以先在资料页查看介绍、兴趣和评分。",
      step3_h: "打个招呼", step3_p: "给朋友发消息吧。目前这只是在此浏览器内运行的演示。第一句话难开口时，可以选择美食推荐、隐藏景点等破冰问题。",
      step4_h: "留下评价", step4_p: "登录后可以给聊过天的朋友留下星级和评价。目前评价只保存在您的浏览器中。"
    }
  };

  function eachEl(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  }
  function setAfterEmoji(el, text) {
    // 아이콘 span 다음의 텍스트 노드만 바꿔요.
    var nodes = el.childNodes, i;
    for (i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeType === 3 && nodes[i].textContent.trim()) {
        if (!el.dataset.i18nOrig) el.dataset.i18nOrig = nodes[i].textContent;
        nodes[i].textContent = text;
        return;
      }
    }
  }
  function apply(lang) {
    var dict = lang === "ko" ? null : STR[lang];
    BINDINGS.forEach(function (b) {
      eachEl(b[0]).forEach(function (el) {
        var val = dict ? (dict[b[2]] || null) : null;
        if (b[1] === "placeholder") {
          if (!el.dataset.i18nOrig) el.dataset.i18nOrig = el.getAttribute("placeholder") || "";
          el.setAttribute("placeholder", val || el.dataset.i18nOrig);
        } else if (b[1] === "textAfterEmoji") {
          if (!el.dataset.i18nOrig) {
            var nodes = el.childNodes;
            for (var i = 0; i < nodes.length; i++) {
              if (nodes[i].nodeType === 3 && nodes[i].textContent.trim()) { el.dataset.i18nOrig = nodes[i].textContent; break; }
            }
          }
          setAfterEmoji(el, val || el.dataset.i18nOrig || "");
        } else {
          if (!el.dataset.i18nOrig) el.dataset.i18nOrig = el.textContent;
          if (val || el.dataset.i18nOrig) el.textContent = val || el.dataset.i18nOrig;
        }
      });
    });
    document.documentElement.lang = lang === "ko" ? "ko" : lang;
  }

  var saved = "ko";
  try { saved = localStorage.getItem("rululala-lang") || "ko"; } catch (e) {}
  if (!STR[saved]) saved = "ko";
  sel.value = saved;
  sel.addEventListener("change", function () {
    try { localStorage.setItem("rululala-lang", sel.value); } catch (e) {}
    apply(sel.value);
  });
  // 공통 스크립트가 그려 놓은 메뉴 뒤에 실행되도록 한 박자 늦게 적용해요.
  setTimeout(function () { apply(saved); }, 0);
})();
