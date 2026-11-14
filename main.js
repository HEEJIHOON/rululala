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
    const sid = (img.match(/\d+-(.+)\.jpg$/) || [])[1] || "";
    return `<div class="stc-w"><a class="stc" href="stay-detail.html?id=${sid}"><img src="${img}" alt="${name} 사진" loading="lazy"><span class="cap"><b>${name}</b><small>${kind} · ${area}</small></span></a><button class="wish" type="button" data-stay="${sid}" aria-label="${name} 찜하기" aria-pressed="false">${HEART}</button></div>`;
  };

  setupTabs(stayTabs, stayBox, "stay", STAYS.map((s) => s.country), (n) => {
    stayBox.innerHTML = STAYS[n].items.map(([name, area, img, kind]) => card(name, area, img, kind)).join("");
    if (window.RuluWish) window.RuluWish.wire(stayBox);
  });
}
