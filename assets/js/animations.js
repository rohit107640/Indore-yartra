/* =========================================================
   ANIMATIONS — GSAP + ScrollTrigger + Flip + Lenis.
   Progressive enhancement: if this file or the libraries
   fail, an inline failsafe in <head> shows all content.
   ========================================================= */
(function () {
  "use strict";
  const html = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (reduce || !window.gsap || !window.ScrollTrigger) {
    html.classList.remove("js-anim");
    return;
  }
  window.__animReady = true;

  gsap.registerPlugin(ScrollTrigger);
  if (window.Flip) gsap.registerPlugin(Flip);
  gsap.defaults({ ease: "expo.out", duration: 1 });

  /* ---------- Smooth scrolling (Lenis) ---------- */
  if (window.Lenis) {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4
    });
    window.lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Smooth anchor links (#book etc.)
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute("href") === "#") return;
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -90, duration: 1.4 });
    });
  }

  const done = (els) => {
    gsap.utils.toArray(els).forEach((el) => {
      el.classList.add("is-revealed");
      gsap.set(el, { clearProps: "opacity,transform" });
    });
  };

  /* Wait for the preloader (first visit) before the intro plays */
  const whenLoaded = (cb) => {
    if (html.classList.contains("is-loaded")) return cb();
    const mo = new MutationObserver(() => {
      if (html.classList.contains("is-loaded")) { mo.disconnect(); cb(); }
    });
    mo.observe(html, { attributes: true, attributeFilter: ["class"] });
  };

  /* ---------- Hero (home) ---------- */
  const hero = document.querySelector(".hero");
  if (hero) {
    // Split headline lines into words
    hero.querySelectorAll("h1 .line").forEach((line) => {
      line.innerHTML = line.innerHTML
        .split(/(<[^>]+>|\s+)/)
        .map((part) => (!part || /^\s+$/.test(part) || part.startsWith("<") ? part : `<span class="word">${part}</span>`))
        .join("");
    });
    const h1 = hero.querySelector("h1");
    h1.style.visibility = "visible";

    whenLoaded(() => {
      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(hero.querySelectorAll("h1 .word"), { y: 0, duration: 1.2, stagger: 0.06 })
        .to(hero.querySelectorAll("[data-hero-item]"), { opacity: 1, y: 0, duration: 1.1, stagger: 0.1, onComplete: () => done(hero.querySelectorAll("[data-hero-item]")) }, "-=0.85")
        .fromTo(hero.querySelectorAll(".highlight--underline"), { "--u": 0 }, { "--u": 1, duration: 1 }, "-=0.8");
    });

    // Parallax & fade on scroll
    gsap.to(hero.querySelectorAll(".hero__media > *"), {
      yPercent: 12, ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true }
    });
    gsap.to(hero.querySelector(".hero__content"), {
      y: -80, opacity: 0.2, ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true }
    });
  }

  /* ---------- Inner page hero ---------- */
  const pageHero = document.querySelector(".page-hero");
  if (pageHero) {
    whenLoaded(() => {
      const items = pageHero.querySelectorAll("[data-hero-item]");
      gsap.to(items, { opacity: 1, y: 0, duration: 1.1, stagger: 0.09, delay: 0.2, onComplete: () => done(items) });
    });
    const img = pageHero.querySelector(".hero__media img");
    if (img) {
      gsap.to(img, { yPercent: 14, ease: "none", scrollTrigger: { trigger: pageHero, start: "top top", end: "bottom top", scrub: true } });
    }
  }

  /* ---------- Scroll reveals (batched, staggered) ---------- */
  const shown = { opacity: 1, x: 0, y: 0, scale: 1 };
  ScrollTrigger.batch("[data-reveal]:not(.is-revealed)", {
    start: "top 88%",
    once: true,
    onEnter: (batch) => {
      // Elements already scrolled past (fast jump / anchor link) appear instantly;
      // visible ones stagger in, with the total stagger capped so nothing lags.
      const passed = batch.filter((el) => el.getBoundingClientRect().bottom < 0);
      const visible = batch.filter((el) => !passed.includes(el));
      if (passed.length) { gsap.set(passed, shown); done(passed); }
      if (visible.length)
        gsap.to(visible, {
          ...shown, duration: 1.1, overwrite: true,
          stagger: { each: 0.09, amount: Math.min(0.6, 0.09 * (visible.length - 1)) },
          onComplete: () => done(visible)
        });
    }
  });

  /* ---------- Count-up numbers ---------- */
  document.querySelectorAll("[data-count]").forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const decimals = (el.dataset.count.split(".")[1] || "").length;
    const obj = { v: 0 };
    el.textContent = "0";
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          v: end, duration: 2.2, ease: "power3.out",
          onUpdate: () => (el.textContent = obj.v.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }))
        })
    });
  });

  /* ---------- Generic parallax: data-parallax="-10" (yPercent) ---------- */
  document.querySelectorAll("[data-parallax]").forEach((el) => {
    gsap.fromTo(el, { yPercent: -(+el.dataset.parallax || 10) / 2 }, {
      yPercent: (+el.dataset.parallax || 10) / 2, ease: "none",
      scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true }
    });
  });

  /* ---------- Journey route: line draws itself on scroll ---------- */
  const route = document.querySelector("[data-route]");
  if (route) {
    const mask = route.querySelector("[data-route-mask]");
    const len = mask.getTotalLength();
    gsap.set(mask, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(mask, {
      strokeDashoffset: 0, ease: "none",
      scrollTrigger: { trigger: route, start: "top 75%", end: "bottom 45%", scrub: 0.8 }
    });
    route.querySelectorAll("[data-route-stop]").forEach((stop, i) => {
      gsap.from(stop, {
        scale: 0, opacity: 0, transformOrigin: "center", duration: 0.8, ease: "back.out(2)",
        scrollTrigger: { trigger: route, start: `top+=${i * 18}% 70%`, toggleActions: "play none none reverse" }
      });
    });
  }

  /* ---------- Itinerary progress line ---------- */
  document.querySelectorAll(".timeline").forEach((tl) => {
    const bar = tl.querySelector(".timeline__progress");
    if (!bar) return;
    gsap.to(bar, { scaleY: 1, ease: "none", scrollTrigger: { trigger: tl, start: "top 70%", end: "bottom 60%", scrub: true } });
  });

  /* ---------- Marquee: speeds up / skews with scroll velocity ---------- */
  const marquee = document.querySelector(".marquee__track");
  if (marquee) {
    const skew = gsap.quickTo(marquee, "skewX", { duration: 0.5, ease: "power3" });
    ScrollTrigger.create({
      onUpdate: (self) => skew(gsap.utils.clamp(-8, 8, self.getVelocity() / -300))
    });
  }

  /* ---------- Desktop-only micro-interactions ---------- */
  if (finePointer) {
    // Magnetic buttons
    document.querySelectorAll(".btn--magnetic").forEach((btn) => {
      const xTo = gsap.quickTo(btn, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const yTo = gsap.quickTo(btn, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.3);
        yTo((e.clientY - r.top - r.height / 2) * 0.4);
      });
      btn.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
    });

    // Subtle 3D tilt on package cards
    const tilt = (card) => {
      const rx = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3" });
      const ry = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3" });
      const ty = gsap.quickTo(card, "y", { duration: 0.6, ease: "power3" });
      gsap.set(card, { transformPerspective: 1000 });
      card.addEventListener("pointermove", (e) => {
        if (!card.classList.contains("is-revealed")) return;
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        rx(-py * 6); ry(px * 6); ty(-8);
      });
      card.addEventListener("pointerleave", () => { rx(0); ry(0); ty(0); });
    };
    document.querySelectorAll(".pkg-card").forEach(tilt);
  }

  /* Recalculate after images/fonts load */
  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
