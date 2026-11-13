/* =========================================================
   PACKAGES & CABS — renders cards, filter tabs, the package
   detail page (package.html?id=...), cab fleet and rates.
   ========================================================= */
(function () {
  "use strict";
  const S = window.SITE;
  const PKGS = window.PACKAGES || [];
  const CATS = window.CATEGORIES || {};
  const icon = window.icon;
  const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Package card ---------- */
  const card = (p) => `
    <article class="pkg-card" data-category="${p.category}" data-interests="${(p.interests || []).join(" ")}" data-reveal>
      <div class="pkg-card__media">
        <img class="blur-up" src="${S.img(p.image, 720)}" alt="${esc(p.title)}" loading="lazy" decoding="async" width="720" height="540">
        <span class="pkg-card__tag">${esc(p.tag || CATS[p.category]?.label || "")}</span>
        <span class="pkg-card__days">${icon("calendar")}${esc(p.days)} · ${esc(CATS[p.category]?.short || "")}</span>
      </div>
      <div class="pkg-card__body">
        <h3><a href="package.html?id=${p.id}">${esc(p.title)}</a></h3>
        <p>${esc(p.summary)}</p>
        <div class="pkg-card__hl">${p.highlights.slice(0, 3).map((h) => `<span>${esc(h)}</span>`).join("")}</div>
        ${p.for ? `<p class="pkg-card__for">${icon("users")}Great for ${p.for.map(esc).join(" · ")}</p>` : ""}
        <div class="pkg-card__foot">
          <div class="price"><small>Starting from</small><strong>${inr(p.price)}</strong> <span>/ person</span></div>
          <span class="pkg-card__go" aria-hidden="true">${icon("arrow")}</span>
        </div>
      </div>
    </article>`;

  document.querySelectorAll("[data-pkg-list]").forEach((el) => {
    let list = PKGS.slice();
    if (el.dataset.featured !== undefined) list = list.filter((p) => p.featured);
    if (el.dataset.category) list = list.filter((p) => p.category === el.dataset.category);
    if (el.dataset.related !== undefined) {
      // Same category first, then others; never the current package
      const cur = PKGS.find((p) => p.id === new URLSearchParams(location.search).get("id"));
      list = list.filter((p) => p !== cur);
      if (cur) list.sort((a, b) => (b.category === cur.category) - (a.category === cur.category));
    }
    if (el.dataset.limit) list = list.slice(0, +el.dataset.limit);
    el.innerHTML = list.map(card).join("") || `<p class="pkg-empty">No packages yet.</p>`;
  });

  /* Category counts: <span data-cat-count="mp"></span> */
  document.querySelectorAll("[data-cat-count]").forEach((el) => {
    const n = PKGS.filter((p) => p.category === el.dataset.catCount).length;
    el.textContent = `${n} ${n === 1 ? "package" : "packages"}`;
  });

  /* ---------- Filters: region tabs + interest chips (combined) ---------- */
  const INTERESTS = { all: "All", spiritual: "Spiritual", fun: "Fun & adventure", nature: "Nature", heritage: "Heritage", wildlife: "Wildlife" };
  document.querySelectorAll("[data-pkg-tabs]").forEach((tabs) => {
    const grid = document.querySelector(tabs.dataset.pkgTabs);
    if (!grid) return;
    const pill = tabs.querySelector(".tabs__pill");
    const buttons = [...tabs.querySelectorAll(".tab")];
    const chipsWrap = document.querySelector(`[data-pkg-interests="${tabs.dataset.pkgTabs}"]`);
    const empty = document.createElement("p");
    empty.className = "pkg-empty";
    empty.hidden = true;
    grid.after(empty);
    const state = { region: "all", interest: "all" };

    buttons.forEach((b) => {
      const f = b.dataset.filter;
      const n = f === "all" ? PKGS.length : PKGS.filter((p) => p.category === f).length;
      b.insertAdjacentHTML("beforeend", ` <small>${n}</small>`);
    });
    if (chipsWrap) {
      chipsWrap.innerHTML = Object.entries(INTERESTS).map(([k, label]) =>
        `<button type="button" class="chip ${k === "all" ? "is-active" : ""}" data-interest="${k}" aria-pressed="${k === "all"}">${label}</button>`).join("");
    }

    const movePill = (btn) => {
      if (!pill || !btn) return;
      pill.style.width = btn.offsetWidth + "px";
      pill.style.height = btn.offsetHeight + "px";
      pill.style.transform = `translate(${btn.offsetLeft}px, ${btn.offsetTop}px)`;
    };

    const apply = (animate) => {
      const cards = [...grid.children];
      const Flip = window.Flip;
      const canFlip = animate && Flip && window.gsap && !matchMedia("(prefers-reduced-motion: reduce)").matches;
      const fstate = canFlip ? Flip.getState(cards) : null;
      let shown = 0;
      cards.forEach((c) => {
        const ok = (state.region === "all" || c.dataset.category === state.region) &&
          (state.interest === "all" || c.dataset.interests.split(" ").includes(state.interest));
        c.classList.toggle("is-hidden", !ok);
        if (ok) shown++;
      });
      empty.hidden = shown > 0;
      empty.textContent = "No trips match that combination yet. Try another filter, or ask us for a custom trip.";
      if (canFlip) {
        cards.forEach((c) => c.classList.add("is-revealed"));
        Flip.from(fstate, {
          duration: 0.7, ease: "expo.out", scale: true, absolute: true, stagger: 0.03,
          onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.6, ease: "expo.out", stagger: 0.05 }),
          onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.35, ease: "power2.in" }),
          onComplete: () => window.ScrollTrigger && ScrollTrigger.refresh()
        });
      }
      buttons.forEach((b) => {
        const on = b.dataset.filter === state.region;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-selected", String(on));
        if (on) movePill(b);
      });
      chipsWrap?.querySelectorAll(".chip").forEach((c) => {
        const on = c.dataset.interest === state.interest;
        c.classList.toggle("is-active", on);
        c.setAttribute("aria-pressed", String(on));
      });
      const url = new URL(location.href);
      state.region === "all" ? url.searchParams.delete("cat") : url.searchParams.set("cat", state.region);
      state.interest === "all" ? url.searchParams.delete("type") : url.searchParams.set("type", state.interest);
      history.replaceState(null, "", url);
    };

    buttons.forEach((b) => b.addEventListener("click", () => { state.region = b.dataset.filter; apply(true); }));
    chipsWrap?.addEventListener("click", (e) => {
      const c = e.target.closest(".chip");
      if (c) { state.interest = c.dataset.interest; apply(true); }
    });

    const q = new URLSearchParams(location.search);
    if (buttons.some((b) => b.dataset.filter === q.get("cat"))) state.region = q.get("cat");
    if (INTERESTS[q.get("type")]) state.interest = q.get("type");
    apply(false);
    window.addEventListener("resize", () => movePill(tabs.querySelector(".tab.is-active")));
    if (document.fonts) document.fonts.ready.then(() => movePill(tabs.querySelector(".tab.is-active")));
  });

  /* ---------- Package detail page ---------- */
  const detail = document.querySelector("[data-pkg-detail]");
  if (detail) {
    const id = new URLSearchParams(location.search).get("id");
    const p = PKGS.find((x) => x.id === id);
    if (!p) {
      document.querySelector("[data-pkg-hero]").innerHTML = `
        <div class="container"><h1 data-hero-item>Package not found</h1>
        <p data-hero-item>The trip you're looking for may have moved. Browse all our packages instead.</p></div>`;
      detail.innerHTML = `<div class="not-found-inline"><a class="btn btn--primary btn--lg" href="packages.html">View all packages ${icon("arrow")}</a></div>`;
    } else {
      document.title = `${p.title} | ${S.fullName}`;
      document.querySelector('meta[name="description"]')?.setAttribute("content", p.summary);
      const heroImg = document.querySelector("[data-pkg-hero-img]");
      heroImg.src = S.img(p.image, 1920);
      heroImg.alt = p.title;
      document.querySelector("[data-pkg-hero]").innerHTML = `
        <div class="container">
          <nav class="breadcrumb" aria-label="Breadcrumb" data-hero-item>
            <a href="index.html">Home</a><span aria-hidden="true">/</span>
            <a href="packages.html?cat=${p.category}">${esc(CATS[p.category].label)}</a><span aria-hidden="true">/</span>
            <span>${esc(p.title)}</span>
          </nav>
          <h1 data-hero-item>${esc(p.title)}</h1>
          <p data-hero-item>${esc(p.summary)}</p>
          <div class="detail__meta" data-hero-item>
            <span class="meta-chip">${icon("calendar")}${esc(p.days)}</span>
            <span class="meta-chip">${icon("pin")}Pickup from Indore</span>
            <span class="meta-chip">${icon("rupee")}From ${inr(p.price)} / person</span>
          </div>
        </div>`;

      detail.querySelector("[data-pkg-body]").innerHTML = `
        <section class="detail__block" data-reveal>
          <p class="eyebrow">Highlights</p>
          <h2>What you'll experience</h2>
          <ul class="hl-grid">${p.highlights.map((h) => `<li>${icon("check")}${esc(h)}</li>`).join("")}</ul>
        </section>
        <section class="detail__block">
          <p class="eyebrow" data-reveal>Itinerary</p>
          <h2 data-reveal>Day-by-day plan</h2>
          <div class="timeline">
            <span class="timeline__progress" aria-hidden="true"></span>
            ${p.itinerary.map((d, i) => `
              <div class="acc ${i === 0 ? "is-open" : ""}" data-reveal>
                <span class="acc__dot">${String(i + 1).padStart(2, "0")}</span>
                <button class="acc__btn" data-accordion-btn aria-expanded="${i === 0}">${esc(d.title)}${icon("chevron-right")}</button>
                <div class="acc__panel"><div><p>${esc(d.text)}</p></div></div>
              </div>`).join("")}
          </div>
        </section>
        <section class="detail__block incl-grid">
          <div class="incl incl--yes" data-reveal>
            <h3>${icon("check")} Inclusions</h3>
            <ul>${p.inclusions.map((x) => `<li>${icon("check")}${esc(x)}</li>`).join("")}</ul>
          </div>
          <div class="incl incl--no" data-reveal>
            <h3>${icon("close")} Exclusions</h3>
            <ul>${p.exclusions.map((x) => `<li>${icon("close")}${esc(x)}</li>`).join("")}</ul>
          </div>
        </section>`;

      const bookCard = detail.querySelector("[data-book-card]");
      bookCard.querySelector("[data-book-price]").textContent = inr(p.price);
      const form = bookCard.querySelector("[data-enquiry]");
      if (form) form.dataset.item = p.title;
    }
  }

})();
