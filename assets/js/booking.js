/* =========================================================
   BOOKING — everything that turns a visitor into a booking:
   - Booking pop-up: any element with data-book opens it, prefilled
       data-book-type / -item / -title / -summary / -pickup / -destination
   - Hero fare widget [data-hero-book]: tabs, fixed fare preview
   - Popular routes [data-routes]: fixed fares with a vehicle toggle
   - Services [data-services], Fleet [data-fleet], Rate card [data-rates]
   ========================================================= */
(function () {
  "use strict";
  const S = window.SITE;
  const icon = window.icon;
  const CABS = window.CABS || [];
  const ROUTES = window.ROUTES || [];
  const VEH = window.FARE_VEHICLES || [];
  const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bookAttrs = (o) => Object.entries(o).filter(([, v]) => v != null && v !== "").map(([k, v]) => `data-book-${k}="${esc(v)}"`).join(" ");

  /* ================= Booking pop-up ================= */
  const modal = document.createElement("div");
  modal.className = "bmodal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "bmodal-title");
  modal.innerHTML = `
    <div class="bmodal__bg" data-bclose></div>
    <div class="bmodal__panel">
      <button class="bmodal__close" data-bclose aria-label="Close">${icon("close")}</button>
      <p class="eyebrow mt-0">Quick booking</p>
      <h3 id="bmodal-title"></h3>
      <div class="bmodal__summary"></div>
      <div class="bmodal__form"></div>
      <ul class="bmodal__trust">
        <li>${icon("check")} No advance to enquire</li>
        <li>${icon("check")} Free cancellation up to 6 hrs</li>
        <li>${icon("check")} Verified drivers</li>
      </ul>
    </div>`;
  document.body.appendChild(modal);
  let lastFocus = null;

  window.openBooking = (o = {}) => {
    lastFocus = document.activeElement;
    modal.querySelector("#bmodal-title").textContent = o.title || "Get your fare on WhatsApp";
    modal.querySelector(".bmodal__summary").innerHTML = (o.summary || "")
      .split("|").filter(Boolean).map((x) => `<span>${esc(x.trim())}</span>`).join("");
    const form = document.createElement("form");
    form.setAttribute("data-enquiry", "");
    form.setAttribute("aria-label", "Booking form");
    Object.assign(form.dataset, {
      variant: "modal",
      type: o.type || "One-way Taxi",
      source: o.source || `book-${document.body.dataset.page || "site"}`
    });
    ["item", "pickup", "destination", "date", "travellers"].forEach((k) => { if (o[k]) form.dataset[k] = o[k]; });
    if (o.summary) form.dataset.quote = "Seen on website: " + o.summary.split("|").filter(Boolean).join(" · ");
    modal.querySelector(".bmodal__form").replaceChildren(form);
    window.setupEnquiryForm(form);
    window.enhanceDates && window.enhanceDates(form);
    modal.classList.add("is-open");
    document.body.classList.add("modal-open");
    window.lenis && window.lenis.stop();
    setTimeout(() => form.querySelector('input[name="name"]')?.focus({ preventScroll: true }), 350);
  };
  const closeBooking = () => {
    if (!modal.classList.contains("is-open")) return;
    modal.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    window.lenis && window.lenis.start();
    lastFocus && lastFocus.focus({ preventScroll: true });
  };
  modal.addEventListener("click", (e) => { if (e.target.closest("[data-bclose]")) closeBooking(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !document.querySelector(".dp.is-open")) closeBooking();
  });

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-book]");
    if (!b) return;
    e.preventDefault();
    const d = b.dataset;
    window.openBooking({
      type: d.bookType, item: d.bookItem, title: d.bookTitle, summary: d.bookSummary,
      pickup: d.bookPickup, destination: d.bookDestination, date: d.bookDate, source: d.bookSource
    });
  });

  /* ================= Animated number ================= */
  const tweenNumber = (el, to) => {
    const from = +el.dataset.val || 0;
    el.dataset.val = to;
    if (reduce || !from) { el.textContent = inr(to); return; }
    const start = performance.now();
    const dur = 550;
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = inr(Math.round(from + (to - from) * e));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* ================= Hero fare widget ================= */
  document.querySelectorAll("[data-hero-book]").forEach((box) => {
    const tabs = [...box.querySelectorAll(".hb__tab")];
    const pill = box.querySelector(".hb__pill");
    const fareEl = box.querySelector("[data-hb-fare]");
    const fareNote = box.querySelector("[data-hb-note]");
    const drop = box.querySelector('[name="hb-drop"]');
    const pickup = box.querySelector('[name="hb-pickup"]');
    const veh = box.querySelector('[name="hb-vehicle"]');
    const tour = box.querySelector('[name="hb-tour"]');
    const date = box.querySelector('[name="hb-date"]');
    let mode = "one-way";

    if (veh) veh.innerHTML = CABS.map((c) => `<option>${esc(c.name)}</option>`).join("");
    const isIndore = (v) => /^\s*indore\s*$/i.test(v || "");
    // The non-Indore end of the trip (fixed fares are all from/to Indore)
    const otherEnd = () => (isIndore(pickup?.value) ? drop?.value : isIndore(drop?.value) ? pickup?.value : drop?.value) || "";

    const movePill = (t) => {
      if (!pill || !t) return;
      pill.style.width = t.offsetWidth + "px";
      pill.style.transform = `translateX(${t.offsetLeft}px)`;
    };

    const fareIndex = () => {
      const name = veh?.value || "";
      if (/traveller/i.test(name)) return 3;
      if (/innova/i.test(name)) return 2;
      if (/ertiga/i.test(name)) return 1;
      return 0;
    };
    const update = () => {
      box.dataset.mode = mode;
      let fare = null, note = "";
      const cab = CABS.find((c) => c.name === veh?.value) || CABS[0];
      if (mode === "tour") {
        const opt = tour?.selectedOptions[0];
        fare = opt ? +opt.dataset.price : null;
        note = "per car · fuel, driver & parking included";
      } else if (mode === "airport") {
        fare = cab?.airport;
        note = "fixed fare · Indore city ↔ airport";
      } else {
        const place = otherEnd().trim().toLowerCase();
        const r = ROUTES.find((x) => x.to.toLowerCase() === place);
        if (r && mode === "one-way") { fare = r.fares[fareIndex()]; note = `Fixed one-way fare · ${r.km} km · ${r.time}`; }
        else if (r) { fare = r.fares[fareIndex()] * 2 - Math.round(r.fares[fareIndex()] * 0.25); note = `Approx. round trip · same-day return`; }
        else if (place) { fare = null; note = `We'll confirm the exact fare on WhatsApp`; }
        else { fare = null; note = `Choose a drop to see your fare`; }
      }
      const box2 = fareEl.closest(".hb__fare");
      if (fare) { box2.classList.remove("is-empty"); tweenNumber(fareEl, fare); }
      else {
        box2.classList.add("is-empty");
        fareEl.textContent = otherEnd().trim() ? "On request" : "—";
        fareEl.dataset.val = 0;
      }
      fareNote.textContent = note;
    };

    tabs.forEach((t) => t.addEventListener("click", () => {
      mode = t.dataset.mode;
      tabs.forEach((x) => { x.classList.toggle("is-active", x === t); x.setAttribute("aria-selected", String(x === t)); });
      movePill(t);
      if (mode === "airport" && drop && !drop.value) drop.value = "Indore Airport";
      if (mode !== "airport" && drop?.value === "Indore Airport") drop.value = "";
      update();
    }));
    [drop, veh, tour, pickup].forEach((el) => el && el.addEventListener("input", update));
    [veh, tour].forEach((el) => el && el.addEventListener("change", update));
    box.querySelectorAll("[data-hb-quick]").forEach((q) => q.addEventListener("click", () => {
      drop.value = q.dataset.hbQuick; update(); closeList();
    }));

    /* ---- Swap pickup and drop ---- */
    box.querySelector(".hb__swap")?.addEventListener("click", (e) => {
      const t = pickup.value; pickup.value = drop.value; drop.value = t;
      e.currentTarget.classList.remove("spin"); void e.currentTarget.offsetWidth; e.currentTarget.classList.add("spin");
      update();
    });

    /* ---- Custom destination dropdown (combobox) ---- */
    const list = box.querySelector(".hb__list");
    const dropWrap = box.querySelector(".hb__loc--drop");
    let active = -1;
    const options = () => [...list.querySelectorAll("[role=option]")];
    const renderList = () => {
      const q = drop.value.trim().toLowerCase();
      const fi = fareIndex();
      const items = ROUTES.filter((r) => mode === "airport" || r.to !== "Indore Airport")
        .filter((r) => !q || r.to.toLowerCase().includes(q));
      list.innerHTML = items.length
        ? items.map((r, i) => `
          <li role="option" id="hb-opt-${i}" data-value="${esc(r.to)}" aria-selected="false">
            <span class="hb__opticon">${icon("pin")}</span>
            <span class="hb__optname"><strong>${esc(r.to)}</strong><small>${r.km} km · ${esc(r.time)}</small></span>
            <span class="hb__optfare">${inr(r.fares[fi])}</span>
          </li>`).join("")
        : `<li class="hb__optnone">No fixed fare for "${esc(drop.value)}". We'll quote it on WhatsApp.</li>`;
      active = -1;
    };
    const openList = () => {
      renderList();
      dropWrap.classList.add("is-open");
      drop.setAttribute("aria-expanded", "true");
    };
    const closeList = () => {
      dropWrap.classList.remove("is-open");
      drop.setAttribute("aria-expanded", "false");
      drop.removeAttribute("aria-activedescendant");
    };
    const setActive = (i) => {
      const opts = options();
      if (!opts.length) return;
      active = (i + opts.length) % opts.length;
      opts.forEach((o, k) => o.setAttribute("aria-selected", String(k === active)));
      drop.setAttribute("aria-activedescendant", opts[active].id);
      opts[active].scrollIntoView({ block: "nearest" });
    };
    const choose = (val) => { drop.value = val; closeList(); update(); };
    drop.addEventListener("focus", openList);
    drop.addEventListener("click", openList);
    drop.addEventListener("input", () => { openList(); });
    drop.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); if (!dropWrap.classList.contains("is-open")) openList(); setActive(active + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
      else if (e.key === "Enter" && dropWrap.classList.contains("is-open") && active >= 0) { e.preventDefault(); choose(options()[active].dataset.value); }
      else if (e.key === "Escape") closeList();
      else if (e.key === "Tab") closeList();
    });
    box.querySelector(".hb__chev")?.addEventListener("click", () => {
      if (dropWrap.classList.contains("is-open")) closeList(); else { openList(); drop.focus(); }
    });
    list.addEventListener("mousedown", (e) => e.preventDefault()); // keep focus in the input
    list.addEventListener("click", (e) => { const o = e.target.closest("[role=option]"); if (o) choose(o.dataset.value); });
    document.addEventListener("click", (e) => { if (!dropWrap.contains(e.target)) closeList(); });
    veh?.addEventListener("change", () => { if (dropWrap.classList.contains("is-open")) renderList(); });

    box.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();
      const fareTxt = fareEl.closest(".hb__fare").classList.contains("is-empty") ? "" : `${fareEl.textContent}`;
      if (mode === "tour") {
        window.openBooking({
          type: "Tour Package", item: tour.value, date: date?.value, source: "hero-widget",
          title: tour.value, summary: `Tour from Indore|${fareTxt ? "From " + fareTxt + " per car" : ""}`
        });
        return;
      }
      const type = mode === "airport" ? "Airport Transfer" : mode === "round" ? "Cab Booking" : "One-way Taxi";
      const from = pickup.value || "Indore";
      const to = drop.value;
      window.openBooking({
        type, item: veh.value, pickup: from, destination: to, date: date?.value, source: "hero-widget",
        title: to ? `${from} → ${to}` : "Book your cab",
        summary: `${{ "one-way": "One-way", round: "Round trip", airport: "Airport transfer" }[mode]}|${veh.value}|${fareTxt}`
      });
    });

    requestAnimationFrame(() => movePill(box.querySelector(".hb__tab.is-active")));
    window.addEventListener("resize", () => movePill(box.querySelector(".hb__tab.is-active")));
    if (document.fonts) document.fonts.ready.then(() => movePill(box.querySelector(".hb__tab.is-active")));
    update();
  });

  /* ================= Popular routes with vehicle toggle ================= */
  document.querySelectorAll("[data-routes]").forEach((wrap) => {
    const limit = +wrap.dataset.limit || ROUTES.length;
    const list = ROUTES.slice(0, limit);
    wrap.innerHTML = `
      <div class="tabs-wrap" data-reveal>
        <div class="tabs vtoggle" role="tablist" aria-label="Choose vehicle">
          <span class="tabs__pill" aria-hidden="true"></span>
          ${VEH.map((v, i) => `<button class="tab ${i === 0 ? "is-active" : ""}" role="tab" data-v="${i}">${esc(v)}</button>`).join("")}
        </div>
      </div>
      <div class="routes">
        ${list.map((r) => `
          <article class="route" data-reveal>
            <div class="route__media">${r.image ? `<img class="blur-up" src="${S.img(r.image, 500)}" alt="${esc(r.to)}" loading="lazy">` : `<span class="route__icon">${icon("route")}</span>`}</div>
            <div class="route__body">
              <h3><span>Indore</span> ${icon("arrow")} <span>${esc(r.to)}</span></h3>
              <p>${r.km} km · ${esc(r.time)}</p>
            </div>
            <div class="route__price"><small>One-way</small><strong data-fare="${r.fares.join(",")}">${inr(r.fares[0])}</strong></div>
            <button class="btn btn--primary btn--sm route__btn" data-book data-route-to="${esc(r.to)}">Book</button>
          </article>`).join("")}
      </div>
      <p class="rates-note" data-reveal>Fixed fares from Indore city. Tolls, parking and state permits extra at actuals. Placeholder prices — confirm on WhatsApp.</p>`;

    const tabs = [...wrap.querySelectorAll(".tab")];
    const pill = wrap.querySelector(".tabs__pill");
    let vi = 0;
    const movePill = (b) => {
      if (!pill || !b) return;
      pill.style.width = b.offsetWidth + "px";
      pill.style.height = b.offsetHeight + "px";
      pill.style.transform = `translate(${b.offsetLeft}px, ${b.offsetTop}px)`;
    };
    const syncBook = () => wrap.querySelectorAll(".route").forEach((card) => {
      const btn = card.querySelector("[data-book]");
      const to = btn.dataset.routeTo;
      const fare = card.querySelector("[data-fare]").textContent;
      Object.assign(btn.dataset, {
        bookType: to === "Indore Airport" ? "Airport Transfer" : "One-way Taxi",
        bookItem: VEH[vi], bookPickup: "Indore", bookDestination: to,
        bookTitle: `Indore → ${to}`, bookSummary: `One-way|${VEH[vi]}|${fare}`, bookSource: "routes"
      });
    });
    tabs.forEach((t) => t.addEventListener("click", () => {
      vi = +t.dataset.v;
      tabs.forEach((x) => { x.classList.toggle("is-active", x === t); x.setAttribute("aria-selected", String(x === t)); });
      movePill(t);
      wrap.querySelectorAll("[data-fare]").forEach((el) => {
        if (!el.dataset.val) el.dataset.val = el.dataset.fare.split(",")[0];
        tweenNumber(el, +el.dataset.fare.split(",")[vi]);
      });
      setTimeout(syncBook, 600);
    }));
    syncBook();
    requestAnimationFrame(() => movePill(tabs[0]));
    window.addEventListener("resize", () => movePill(wrap.querySelector(".tab.is-active")));
    if (document.fonts) document.fonts.ready.then(() => movePill(wrap.querySelector(".tab.is-active")));
  });

  /* ================= Services ================= */
  document.querySelectorAll("[data-services]").forEach((el) => {
    const list = (window.SERVICES || []).slice(0, +el.dataset.limit || 99);
    el.innerHTML = list.map((s) => `
      <article class="svc" data-reveal>
        <div class="svc__media"><img class="blur-up" src="${S.img(s.image, 500)}" alt="${esc(s.title)}" loading="lazy"></div>
        <div class="svc__body">
          <h3>${esc(s.title)}</h3>
          <p>${esc(s.text)}</p>
          <div class="svc__foot">
            <div class="price"><small>From</small><strong>${esc(s.from)}</strong> <span>${esc(s.unit)}</span></div>
            <button class="btn btn--primary btn--sm" data-book ${bookAttrs({ type: s.enquiry, item: s.item, title: s.title, summary: `${s.title}|From ${s.from} ${s.unit}`, source: "service-" + s.id })}>Book now</button>
          </div>
        </div>
      </article>`).join("");
  });

  /* ================= Fleet ================= */
  document.querySelectorAll("[data-fleet]").forEach((el) => {
    el.innerHTML = CABS.map((c) => `
      <article class="car" data-reveal>
        <div class="car__media">
          <img class="blur-up" src="${S.img(c.image, 480)}" alt="${esc(c.name)}" loading="lazy" style="object-position:${c.focus || "50% 55%"}">
          <span class="car__type">${esc(c.type.split(" · ")[0])} · AC</span>
        </div>
        <div class="car__body">
          <h3>${esc(c.name)}</h3>
          <ul class="car__specs">
            <li>${icon("users")}${c.seats}${c.id === "traveller" ? "+" : ""} seats</li>
            <li>${icon("bag")}${c.bags} bags</li>
          </ul>
          <p class="car__note">${esc(c.note)}</p>
          <div class="car__foot2">
            <p class="car__rate"><strong>₹${c.perKm}</strong>/km</p>
            <button class="btn btn--primary btn--sm car__btn" data-book ${bookAttrs({ type: "One-way Taxi", item: c.name, title: `Book a ${c.name}`, summary: `${c.name}|${c.type}|₹${c.perKm}/km`, source: "fleet" })}>Book ${icon("arrow")}</button>
          </div>
        </div>
      </article>`).join("");
  });

  /* ================= Rate card ================= */
  document.querySelectorAll("[data-rates]").forEach((el) => {
    el.innerHTML = `
      <table class="rates">
        <thead><tr><th>Vehicle</th><th>Seats</th><th>Local (8 hrs / 80 km)</th><th>Outstation (per km)</th><th>Airport drop</th></tr></thead>
        <tbody>${CABS.map((c) => `<tr><td>${esc(c.name)}<small>${esc(c.type)}</small></td><td>${c.seats}</td><td>${inr(c.local8h)}</td><td>₹${c.perKm} / km</td><td>${inr(c.airport)}</td></tr>`).join("")}</tbody>
      </table>`;
  });

  window.watchImages && window.watchImages();
})();
