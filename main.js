/* ===== 공통 탭 (WAI-ARIA tabs: roving tabindex, 방향키, Home/End) ===== */
function setupTabs(tabList, panel, prefix, labels, onSelect) {
  const tabs = [];
  panel.setAttribute("role", "tabpanel");
  panel.tabIndex = 0;

  const select = (i, focus) => {
    tabs.forEach((b, k) => {
      const on = k === i;
      b.setAttribute("aria-selected", on);
      b.tabIndex = on ? 0 : -1;
    });
    panel.setAttribute("aria-labelledby", tabs[i].id);
    onSelect(i);
    if (focus) tabs[i].focus();
  };

  labels.forEach((label, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = tabList.classList.contains("tabs") ? "tab" : "stab";
    b.id = `${prefix}-tab-${i}`;
    b.setAttribute("role", "tab");
    b.setAttribute("aria-controls", panel.id);
    b.textContent = label;
    b.onclick = () => select(i, false);
    b.addEventListener("keydown", (e) => {
      const last = tabs.length - 1;
      const next = {
        ArrowRight: i === last ? 0 : i + 1,
        ArrowLeft: i === 0 ? last : i - 1,
        Home: 0,
        End: last,
      }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      select(next, true);
    });
    tabs.push(b);
    tabList.appendChild(b);
  });
  select(0, false);
}

/* ===== 도시 탭 (world.html) ===== */
const regionTabs = document.querySelector(".tabs");
const cityBox = document.getElementById("cities");

if (regionTabs && cityBox) {
  setupTabs(regionTabs, cityBox, "region", REGIONS.map((r) => r.name), (i) => {
    cityBox.innerHTML = REGIONS[i].cities
      .map(([city, country]) => {
        const sp = typeof SPOTS !== "undefined" ? SPOTS[city] : null;
        if (sp) {
          return `<div class="city has-photo has-spots"><div class="cph"><img src="${sp.img}" alt="${sp.alt}" loading="lazy"></div><b>${city}</b><small>${country}</small><ul class="spots">${sp.spots
            .map(([n, d]) => `<li><b>${n}</b><span>${d}</span></li>`)
            .join("")}</ul></div>`;
        }
        const p = typeof PARKS !== "undefined" ? PARKS[country] : null;
        return `<div class="city${p ? " has-photo" : ""}">${
          p ? `<div class="cph"><img src="${p.img}" alt="${p.park} 사진" loading="lazy"></div>` : ""
        }<b>${city}</b><small>${country}</small>${
          p ? `<small class="cpark">${p.park} · ${p.loc}</small>` : ""
        }</div>`;
      })
      .join("");
  });
}

/* ===== 숙소 탭 (stay.html) ===== */
const stayTabs = document.querySelector(".stabs");
const stayBox = document.getElementById("stays");

if (stayTabs && stayBox) {
  const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21C12 21 3 14.5 3 8.8 3 5.6 5.4 3.5 8 3.5c1.7 0 3.1.9 4 2.3.9-1.4 2.3-2.3 4-2.3 2.6 0 5 2.1 5 5.3C21 14.5 12 21 12 21z"/></svg>';
  const card = (name, area, img, kind) => {
    const sid = (img.match(/(?:\d+-)+(.+)\.jpg$/) || [])[1] || "";
    return `<div class="stc-w"><a class="stc" href="stay-detail.html?id=${sid}"><img src="${img}" alt="${name} 사진" loading="lazy"><span class="cap"><b>${name}</b><small>${kind} · ${area}</small></span></a><button class="wish" type="button" data-stay="${sid}" aria-label="${name} 찜하기" aria-pressed="false">${HEART}</button></div>`;
  };

  const renderMain = (n) => {
    stayBox.innerHTML = STAYS[n].items.map(([name, area, img, kind]) => card(name, area, img, kind)).join("");
    if (window.RuluWish) window.RuluWish.wire(stayBox);
  };

  /* 가성비 HOT · 게스트하우스 섹션 (나라 탭과 함께 바뀜) */
  const hotBox = document.getElementById("staysHot");
  const ghBox = document.getElementById("staysGh");
  const hotSec = document.getElementById("secHot");
  const ghSec = document.getElementById("secGh");
  const pcard = (it) => {
    if (it.photoSource) return `<div class="stc-w"><a class="stc" href="${it.photoSource}" target="_blank" rel="noopener"><img src="${it[2]}" alt="${it[0]} 과거 촬영 사진" loading="lazy"><span class="cap"><b>${it[0]}</b><small>${it[3]} · ${it[1]}</small><small>사진·출처 보기 ↗</small></span></a></div>`;
    return card(...it.slice(0,4));
  };
  STAYS.forEach((c) => {
    window.STAY_HOT[c.country] = c.items.filter(it => it[3] !== "리조트").slice(1,4);
    if (!window.STAY_HOT[c.country].length) window.STAY_HOT[c.country] = c.items.slice(0,3);
    window.GUESTHOUSES[c.country] = c.items.filter(it => it[3] === "호스텔" || it[3] === "게스트하우스");
  });
  (window.GUEST_PHOTOS || []).forEach(p => { const it=[p.name,p.area,p.image,p.kind]; it.photoSource=p.source; window.GUESTHOUSES[p.country].push(it); });
  const renderSub = (n) => {
    const c = STAYS[n].country;
    const hot = (window.STAY_HOT || {})[c] || [];
    const gh = (window.GUESTHOUSES || {})[c] || [];
    if (hotSec) hotSec.hidden = !hot.length;
    if (ghSec) ghSec.hidden = false;
    if (hotBox) hotBox.innerHTML = hot.map(pcard).join("");
    if (ghBox) ghBox.innerHTML = gh.length ? gh.map(pcard).join("") : `<p class="ss-empty">${c} 게스트하우스 사진을 준비 중이에요. 다른 나라 탭에서도 둘러보세요.</p>`;
  };

  document.querySelectorAll(".stay-collection").forEach(el => { if(window.RuluWish) window.RuluWish.wire(el); });
  let curTab = 0;
  setupTabs(stayTabs, stayBox, "stay", STAYS.map((s) => s.country), (n) => {
    curTab = n;
    renderMain(n);
    renderSub(n);
  });

  /* ===== 숙소 검색 바 (데모: 실제 예약·재고 데이터 없음) ===== */
  const ssBar = document.getElementById("ssbar");
  if (ssBar) {
    const dest = document.getElementById("ss-dest");
    const dIn = document.getElementById("ss-in");
    const dOut = document.getElementById("ss-out");
    const nightsEl = document.getElementById("ss-nights");
    const gbtn = document.getElementById("ss-gbtn");
    const pop = document.getElementById("ss-pop");
    const gsum = document.getElementById("ss-gsum");
    const res = document.getElementById("ss-res");
    const G = { rooms: 1, adults: 2, kids: 0 };
    document.addEventListener("keydown", e => { if (e.key === "Escape") { pop.hidden = true; gbtn.setAttribute("aria-expanded", "false"); } });
    const DOW = "일월화수목금토";
    const iso = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
    const fmt = (v) => { const d = new Date(v + "T00:00:00"); return `${d.getMonth() + 1}월 ${d.getDate()}일(${DOW[d.getDay()]})`; };
    const syncNights = () => {
      if (!dIn.value) return;
      if (!dOut.value || dOut.value <= dIn.value) { const d = new Date(dIn.value + "T00:00:00"); d.setDate(d.getDate() + 1); dOut.value = iso(d); }
      dOut.min = iso(new Date(new Date(dIn.value + "T00:00:00").getTime() + 864e5));
      nightsEl.textContent = Math.round((new Date(dOut.value + "T00:00:00") - new Date(dIn.value + "T00:00:00")) / 864e5) + "박";
    };
    const now = new Date();
    dIn.value = iso(now); dIn.min = iso(now);
    const tm = new Date(now); tm.setDate(tm.getDate() + 1);
    dOut.value = iso(tm);
    syncNights();
    dIn.addEventListener("change", syncNights);
    dOut.addEventListener("change", syncNights);

    const sumGuests = () => { gsum.textContent = `객실 ${G.rooms}개, 성인 ${G.adults}명, 어린이 ${G.kids}명`; };
    const togglePop = (open) => { pop.hidden = open === undefined ? !pop.hidden : !open; gbtn.setAttribute("aria-expanded", String(!pop.hidden)); };
    gbtn.addEventListener("click", () => togglePop());
    document.getElementById("ss-done").addEventListener("click", () => togglePop(false));
    document.addEventListener("click", (e) => { if (!pop.hidden && !e.target.closest(".ssf-guests")) togglePop(false); });
    pop.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-d]");
      if (!b) return;
      const k = b.closest(".ssrow").dataset.k;
      const lim = { rooms: [1, 4], adults: [1, 8], kids: [0, 4] }[k];
      G[k] = Math.min(lim[1], Math.max(lim[0], G[k] + Number(b.dataset.d)));
      if (G.adults < G.rooms) { G.adults = G.rooms; document.getElementById("ss-adults").textContent = G.adults; }
      document.getElementById("ss-" + k).textContent = G[k];
      sumGuests();
    });

    ssBar.addEventListener("submit", (e) => {
      e.preventDefault();
      togglePop(false);
      syncNights();
      const q = dest.value.trim();
      const base = `${fmt(dIn.value)} - ${fmt(dOut.value)} · ${nightsEl.textContent} · 객실 ${G.rooms}개, 성인 ${G.adults}명${G.kids ? `, 어린이 ${G.kids}명` : ""}`;
      if (!q) {
        res.hidden = false; res.textContent = `${base} · 날짜·인원 조건 미리보기, 실제 재고 미확인`;
        stayTabs.hidden = false;
        renderMain(curTab);
        renderSub(curTab);
        return;
      }
      const hits = [];
      STAYS.forEach((c) => c.items.forEach((it) => {
        if (c.country.includes(q) || it[0].includes(q) || it[1].includes(q)) hits.push(it);
      }));
      Object.keys(window.STAY_HOT || {}).forEach((c) => STAY_HOT[c].forEach((it) => {
        if (c.includes(q) || it[0].includes(q) || it[1].includes(q)) hits.push(it);
      }));
      Object.keys(window.GUESTHOUSES || {}).forEach((c) => GUESTHOUSES[c].forEach((it) => {
        if (c.includes(q) || it[0].includes(q) || it[1].includes(q)) hits.push(it);
      }));
      stayTabs.hidden = true;
      if (hotSec) hotSec.hidden = true;
      if (ghSec) ghSec.hidden = true;
      res.hidden = false;
      const unique = hits.filter((it,i,a) => a.findIndex(x => x[0] === it[0]) === i);
      const ok = `<span class="ssok">객실 재고 미연동</span>`;
      if (unique.length) {
        res.textContent = `“${q}” 검색 결과 ${unique.length}개 · ${base} · 실제 객실 재고·요금 미확인`;
        stayBox.innerHTML = unique.map(([name, area, img, kind]) => {
          const photo = (window.GUEST_PHOTOS || []).find(p => p.image === img);
          const it = [name,area,img,kind]; if(photo) it.photoSource=photo.source;
          const h = pcard(it);
          return h.replace('<div class="stc-w">', `<div class="stc-w">${ok}`);
        }).join("");
      } else {
        res.textContent = `“${q}” 검색 결과가 없어요 · ${base} · 다른 도시나 나라 이름으로 검색해 보세요`;
        stayBox.innerHTML = "";
      }
      if (window.RuluWish) window.RuluWish.wire(stayBox);
    });

    dest.addEventListener("input", () => { if (!dest.value.trim() && !res.hidden) ssBar.requestSubmit(); });
  }
}
