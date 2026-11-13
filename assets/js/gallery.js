/* =========================================================
   GALLERY — masonry grid, filters and a zoom-from-thumbnail
   lightbox. Add photos to the list below (Unsplash id or a
   local path like "assets/images/trip-1.jpg").
   ========================================================= */
(function () {
  "use strict";
  const S = window.SITE;
  const PHOTOS = [
    { img: "jetski", cat: "fun", title: "Jet ski on the backwaters", place: "Hanuwantiya" },
    { img: "mahakal", cat: "spiritual", title: "Mahakaleshwar Temple", place: "Ujjain" },
    { img: "rangpanchami", cat: "fun", title: "Rangpanchami gher", place: "Indore" },
    { img: "kayaking", cat: "fun", title: "Kayaking with friends", place: "River & lake trips" },
    { img: "beefalls", cat: "nature", title: "Bee Falls", place: "Pachmarhi" },
    { img: "rajwada", cat: "heritage", title: "Rajwada Palace", place: "Indore" },
    { img: "tentcity", cat: "fun", title: "Jal Mahotsav tent city", place: "Hanuwantiya" },
    { img: "omkareshwar", cat: "spiritual", title: "Omkareshwar on the Narmada", place: "Omkareshwar" },
    { img: "poha", cat: "fun", title: "Indori poha", place: "Indore food walks" },
    { img: "mandu-monsoon", cat: "nature", title: "Roopmati Pavilion in the monsoon", place: "Mandu" },
    { img: "bhedaghat-boat", cat: "fun", title: "Boat ride through the Marble Rocks", place: "Bhedaghat, Jabalpur" },
    { img: "hanuwantiya", cat: "fun", title: "Hot-air balloon", place: "Hanuwantiya" },
    { img: "patalpani", cat: "nature", title: "Patalpani Waterfall", place: "Near Indore" },
    { img: "bonfire", cat: "fun", title: "Bonfire nights", place: "Camping trips" },
    { img: "mandu", cat: "heritage", title: "Jahaz Mahal", place: "Mandu" },
    { img: "ramghat", cat: "spiritual", title: "Ram Ghat on the Shipra", place: "Ujjain" },
    { img: "tiger", cat: "nature", title: "Tiger sighting on safari", place: "Bandhavgarh" },
    { img: "speedboat", cat: "fun", title: "Speed boat ride", place: "Hanuwantiya" },
    { img: "maheshwar", cat: "heritage", title: "Maheshwar ghats & Ahilya Fort", place: "Maheshwar" },
    { img: "sarafa", cat: "fun", title: "Sarafa night market", place: "Indore" },
    { img: "khajrana", cat: "spiritual", title: "Khajrana Ganesh Temple", place: "Indore" },
    { img: "pachmarhi", cat: "nature", title: "Satpura valleys", place: "Pachmarhi" },
    { img: "parasailing", cat: "fun", title: "Parasailing", place: "Water sports trips" },
    { img: "khajuraho", cat: "heritage", title: "Jagadambi Temple", place: "Khajuraho" },
    { img: "bhedaghat", cat: "nature", title: "Marble Rocks", place: "Bhedaghat" },
    { img: "gwalior", cat: "heritage", title: "Gwalior Fort", place: "Gwalior" },
    { img: "kanha", cat: "nature", title: "Sambar deer", place: "Kanha National Park" },
    { img: "sanchi", cat: "heritage", title: "The Great Stupa", place: "Sanchi" },
    { img: "somnath", cat: "spiritual", title: "Somnath Temple", place: "Gujarat" },
    { img: "tincha", cat: "nature", title: "Tincha Falls", place: "Near Indore" },
    { img: "ellora", cat: "heritage", title: "Kailasa Temple, Ellora", place: "Maharashtra" }
  ];

  const grid = document.querySelector("[data-gallery]");
  if (!grid) return;
  const imgUrl = (id, w) => S.img(id, w);

  grid.innerHTML = PHOTOS.map((p, i) => `
    <figure tabindex="0" data-cat="${p.cat}" data-i="${i}" data-reveal>
      <img class="blur-up" src="${imgUrl(p.img, 700)}" alt="${p.title}" loading="lazy" decoding="async">
      <figcaption>${p.title}<small>${p.place}</small></figcaption>
    </figure>`).join("");
  window.watchImages && window.watchImages(grid);

  /* ---------- Filters ---------- */
  const tabs = document.querySelector("[data-gallery-tabs]");
  const pill = tabs?.querySelector(".tabs__pill");
  const btns = tabs ? [...tabs.querySelectorAll(".tab")] : [];
  const movePill = (b) => {
    if (!pill || !b) return;
    pill.style.width = b.offsetWidth + "px";
    pill.style.height = b.offsetHeight + "px";
    pill.style.transform = `translate(${b.offsetLeft}px, ${b.offsetTop}px)`;
  };
  let visible = PHOTOS.map((_, i) => i);
  btns.forEach((b) => b.addEventListener("click", () => {
    const f = b.dataset.filter;
    btns.forEach((x) => { x.classList.toggle("is-active", x === b); x.setAttribute("aria-selected", String(x === b)); });
    movePill(b);
    const figs = [...grid.children];
    const show = () => {
      figs.forEach((fig) => (fig.style.display = f === "all" || fig.dataset.cat === f ? "" : "none"));
      visible = figs.filter((fig) => fig.style.display !== "none").map((fig) => +fig.dataset.i);
      figs.forEach((fig) => fig.classList.add("is-revealed"));
      if (window.gsap) {
        gsap.fromTo(figs.filter((x) => x.style.display !== "none"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.04, ease: "expo.out", clearProps: "transform,opacity" });
        window.ScrollTrigger && ScrollTrigger.refresh();
      }
    };
    if (window.gsap) gsap.to(grid, { opacity: 0, duration: 0.25, onComplete: () => { show(); gsap.set(grid, { opacity: 1 }); } });
    else show();
  }));
  movePill(tabs?.querySelector(".tab.is-active"));
  window.addEventListener("resize", () => movePill(tabs?.querySelector(".tab.is-active")));
  if (document.fonts) document.fonts.ready.then(() => movePill(tabs?.querySelector(".tab.is-active")));

  /* ---------- Lightbox with zoom-from-thumbnail ---------- */
  const lb = document.querySelector("[data-lightbox]");
  const lbImg = lb.querySelector("[data-lb-img]");
  const lbCap = lb.querySelector("[data-lb-cap]");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let current = 0, lastFocus = null;

  const setPhoto = (i) => {
    current = i;
    const p = PHOTOS[i];
    lbImg.src = imgUrl(p.img, 1800);
    lbImg.alt = p.title;
    lbCap.textContent = `${p.title} — ${p.place}`;
  };

  const zoomFrom = (thumb) => {
    if (reduce || !thumb || !lbImg.animate) return;
    const run = () => {
      const a = thumb.getBoundingClientRect();
      const b = lbImg.getBoundingClientRect();
      if (!b.width) return;
      const dx = a.left + a.width / 2 - (b.left + b.width / 2);
      const dy = a.top + a.height / 2 - (b.top + b.height / 2);
      const s = a.width / b.width;
      lbImg.animate(
        [{ transform: `translate(${dx}px, ${dy}px) scale(${s})`, borderRadius: "18px" }, { transform: "none" }],
        { duration: 650, easing: "cubic-bezier(.22,1,.36,1)" }
      );
    };
    // Show the already-loaded thumbnail immediately, swap to the large one when ready
    if (lbImg.complete && lbImg.naturalWidth) run();
    else lbImg.addEventListener("load", run, { once: true });
  };

  const open = (i, thumb) => {
    lastFocus = document.activeElement;
    // start with the cached thumbnail so the zoom is instant
    lbImg.src = thumb.querySelector("img").currentSrc;
    lbImg.alt = PHOTOS[i].title;
    lbCap.textContent = `${PHOTOS[i].title} — ${PHOTOS[i].place}`;
    current = i;
    lb.classList.add("is-open");
    document.body.style.overflow = "hidden";
    window.lenis && window.lenis.stop();
    zoomFrom(thumb);
    const big = new Image();
    big.src = imgUrl(PHOTOS[i].img, 1800);
    big.onload = () => { if (current === i) lbImg.src = big.src; };
    lb.querySelector(".lightbox__close").focus({ preventScroll: true });
  };
  const close = () => {
    lb.classList.remove("is-open");
    document.body.style.overflow = "";
    window.lenis && window.lenis.start();
    lastFocus && lastFocus.focus({ preventScroll: true });
  };
  const step = (dir) => {
    const pos = visible.indexOf(current);
    const next = visible[(pos + dir + visible.length) % visible.length];
    if (lbImg.animate && !reduce) {
      lbImg.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: `translateX(${-dir * 40}px)` }], { duration: 200, easing: "ease-in" })
        .onfinish = () => {
          setPhoto(next);
          lbImg.animate([{ opacity: 0, transform: `translateX(${dir * 40}px)` }, { opacity: 1, transform: "none" }], { duration: 450, easing: "cubic-bezier(.22,1,.36,1)" });
        };
    } else setPhoto(next);
  };

  grid.addEventListener("click", (e) => {
    const fig = e.target.closest("figure");
    if (fig) open(+fig.dataset.i, fig);
  });
  grid.addEventListener("keydown", (e) => {
    const fig = e.target.closest("figure");
    if (fig && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); open(+fig.dataset.i, fig); }
  });
  lb.querySelectorAll("[data-lb-close]").forEach((el) => el.addEventListener("click", close));
  lb.querySelector("[data-lb-prev]").addEventListener("click", () => step(-1));
  lb.querySelector("[data-lb-next]").addEventListener("click", () => step(1));
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });
  // Swipe on touch devices
  let sx = null;
  lb.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    sx = null;
  });
})();
