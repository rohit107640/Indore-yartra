/* =========================================================
   MAIN — shared layout (header, footer, floating buttons),
   icons, navigation, image loading, page transitions.
   Works without GSAP; animations.js adds the motion layer.
   ========================================================= */
(function () {
  "use strict";
  const S = window.SITE;
  const body = document.body;
  const page = body.dataset.page || "";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Icons (inline SVG, Lucide-style) ---------- */
  const P = {
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    "arrow-up-right": '<path d="M7 17 17 7M7 7h10v10"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    rupee: '<path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a5 5 0 0 0 0-10"/>',
    headset: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
    plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
    route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
    city: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2M10 6h4M10 10h4M10 14h4M10 18h4"/>',
    bag: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    "chevron-left": '<path d="m15 18-6-6 6-6"/>',
    "chevron-right": '<path d="m9 18 6-6-6-6"/>',
    "chevron-down": '<path d="m6 9 6 6 6-6"/>',
    swap: '<path d="M7 4v16M3 8l4-4 4 4M17 20V4M13 16l4 4 4-4"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><path d="M17.5 6.5h.01"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    youtube: '<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
    star: '<path fill="currentColor" stroke="none" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
    whatsapp: '<path fill="currentColor" stroke="none" d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>'
  };
  const icon = (name, cls = "") =>
    `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ""}</svg>`;
  window.icon = icon;

  const waLink = (text) =>
    `https://wa.me/${S.whatsapp}${text ? "?text=" + encodeURIComponent(text) : ""}`;
  window.waLink = waLink;

  /* ---------- Header ---------- */
  const NAV = [
    ["home", "Home", "index.html"],
    ["services", "Services", "services.html"],
    ["packages", "Tour Packages", "packages.html"],
    ["cabs", "Cabs & Taxi", "cabs.html"],
    ["gallery", "Gallery", "gallery.html"],
    ["contact", "Contact", "contact.html"]
  ];
  const logo = `
    <a href="index.html" class="logo" aria-label="${S.fullName} home">
      <span class="logo__mark" aria-hidden="true">
        <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="currentColor"/><path d="M9 26c5-9 9-13 13-13s6 3 9 8" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="28" cy="13" r="3" fill="#fff"/></svg>
      </span>
      <span class="logo__text"><strong>${S.name}</strong><small>${S.tagline}</small></span>
    </a>`;

  const headerEl = document.getElementById("site-header");
  if (headerEl) {
    headerEl.outerHTML = `
    <header class="header" id="header">
      <div class="container header__inner">
        ${logo}
        <nav class="nav" aria-label="Main">
          <ul class="nav__list">
            ${NAV.map(([key, label, href]) => `<li><a href="${href}" class="nav__link ${page === key ? "is-active" : ""}" ${page === key ? 'aria-current="page"' : ""}>${label}</a></li>`).join("")}
          </ul>
          <span class="nav__pill" aria-hidden="true"></span>
        </nav>
        <div class="header__actions">
          <a href="tel:${S.phoneLink}" class="hcall" aria-label="Call ${S.phone}">
            <span class="hcall__icon">${icon("phone")}</span>
            <span class="hcall__num">${S.phone}</span>
          </a>
          <a href="contact.html" class="btn btn--primary btn--sm btn--magnetic">Plan my trip</a>
          <button class="burger" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span></button>
        </div>
      </div>
    </header>
    <div class="mobile-menu" id="mobile-menu" aria-hidden="true">
      <nav aria-label="Mobile">
        <ul>
          ${NAV.map(([key, label, href], i) => `<li style="--i:${i}"><a href="${href}" class="${page === key ? "is-active" : ""}">${label}<span>${icon("arrow")}</span></a></li>`).join("")}
        </ul>
      </nav>
      <div class="mobile-menu__foot" style="--i:${NAV.length}">
        <a href="tel:${S.phoneLink}" class="btn btn--light">${icon("phone")} Call us</a>
        <a href="${waLink("Hi! I'd like to plan a trip.")}" class="btn btn--whatsapp" target="_blank" rel="noopener">${icon("whatsapp")} WhatsApp</a>
      </div>
    </div>`;
  }

  /* ---------- Footer ---------- */
  const footerEl = document.getElementById("site-footer");
  if (footerEl) {
    const year = new Date().getFullYear();
    footerEl.outerHTML = `
    <footer class="footer">
      <div class="footer__cta container">
        <div>
          <p class="eyebrow eyebrow--light">Ready when you are</p>
          <h2 class="footer__title">Let's plan your next journey.</h2>
        </div>
        <div class="footer__cta-actions">
          <a href="contact.html" class="btn btn--primary btn--lg btn--magnetic">Send an enquiry ${icon("arrow")}</a>
          <a href="${waLink("Hi! I'd like to plan a trip.")}" target="_blank" rel="noopener" class="btn btn--glass btn--lg">${icon("whatsapp")} Chat on WhatsApp</a>
        </div>
      </div>
      <div class="container footer__grid">
        <div class="footer__brand">
          ${logo}
          <p>Temple darshan, heritage tours and cabs from Indore — across Madhya Pradesh and its neighbouring states.</p>
          <div class="footer__social">
            <a href="${S.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${icon("instagram")}</a>
            <a href="${S.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${icon("facebook")}</a>
            <a href="${S.social.youtube}" target="_blank" rel="noopener" aria-label="YouTube">${icon("youtube")}</a>
          </div>
        </div>
        <div>
          <h3>Explore</h3>
          <ul>${NAV.map(([, label, href]) => `<li><a href="${href}">${label}</a></li>`).join("")}<li><a href="about.html">About us</a></li></ul>
        </div>
        <div>
          <h3>Popular trips</h3>
          <ul>
            <li><a href="package.html?id=ujjain-mahakal-darshan">Ujjain Mahakal Darshan</a></li>
            <li><a href="package.html?id=ujjain-omkareshwar">Ujjain & Omkareshwar</a></li>
            <li><a href="package.html?id=indore-temple-darshan">Indore Temple Darshan</a></li>
            <li><a href="package.html?id=omkareshwar-maheshwar">Omkareshwar & Maheshwar</a></li>
            <li><a href="package.html?id=somnath-dwarka">Somnath & Dwarka</a></li>
          </ul>
        </div>
        <div>
          <h3>Get in touch</h3>
          <ul class="footer__contact">
            <li>${icon("pin")}<span>${S.address}</span></li>
            <li>${icon("phone")}<a href="tel:${S.phoneLink}">${S.phone}</a></li>
            <li>${icon("mail")}<a href="mailto:${S.email}">${S.email}</a></li>
            <li>${icon("clock")}<span>${S.hours}</span></li>
          </ul>
        </div>
      </div>
      <div class="container footer__bottom">
        <p>© ${year} ${S.fullName}. All rights reserved.</p>
        <p><a href="credits.html">Photo credits</a> · Made with care in Indore, Madhya Pradesh.</p>
      </div>
    </footer>`;
  }

  /* ---------- Floating buttons and transition bar ---------- */
  body.insertAdjacentHTML(
    "beforeend",
    `<a href="${waLink("Hi! I'd like to know more about your tours.")}" class="float-wa" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
       ${icon("whatsapp")}<span class="float-wa__tip">Chat with us</span>
     </a>
     <a href="tel:${S.phoneLink}" class="float-call" aria-label="Call us">${icon("phone")}</a>
     <div class="route-bar" aria-hidden="true"></div>
     <nav class="mbar" aria-label="Quick actions">
       <a href="tel:${S.phoneLink}" class="mbar__item mbar__item--call">${icon("phone")}<span>Call now</span></a>
       <a href="${waLink("Hi! I'd like to book a cab / tour.")}" class="mbar__item mbar__item--wa" target="_blank" rel="noopener">${icon("whatsapp")}<span>WhatsApp</span></a>
       <button class="mbar__cta" data-book data-book-type="One-way Taxi" data-book-title="Book a cab or tour" data-book-source="mobile-bar">${icon("car")}<span>Book now</span></button>
     </nav>`
  );
  document.documentElement.classList.add("is-loaded");

  /* ---------- WhatsApp greeting bubble: once per visit, after a short delay ---------- */
  (function waGreeting() {
    let seen = false;
    try { seen = sessionStorage.getItem("iy-wa-greet") === "1"; } catch (e) {}
    if (seen || page === "thanks") return;
    const el = document.createElement("div");
    el.className = "wagreet";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", "Chat with us on WhatsApp");
    el.innerHTML = `
      <button class="wagreet__close" aria-label="Close">${icon("close")}</button>
      <div class="wagreet__head">
        <span class="wagreet__avatar">${icon("whatsapp")}</span>
        <div><strong>${S.name}</strong><small><i></i>Usually replies in 5 minutes</small></div>
      </div>
      <p class="wagreet__msg">Namaste 🙏 Planning a trip or need a cab? Send us your route and we'll share the fare right away.</p>
      <a class="btn btn--whatsapp btn--block" href="${waLink("Hi! I'd like a fare for my trip.")}" target="_blank" rel="noopener">${icon("whatsapp")} Chat on WhatsApp</a>`;
    document.body.appendChild(el);
    const hide = () => { el.classList.remove("is-open"); try { sessionStorage.setItem("iy-wa-greet", "1"); } catch (e) {} };
    el.querySelector(".wagreet__close").addEventListener("click", hide);
    el.querySelector("a").addEventListener("click", hide);
    // Desktop: after 9s. Phones: after 9s AND once the visitor has scrolled past the first screen.
    const phone = () => window.matchMedia("(max-width: 768px)").matches;
    let timeUp = false, shown = false;
    const tryShow = () => {
      if (shown || !timeUp) return;
      if (phone() && window.scrollY < window.innerHeight * 0.9) return;
      if (document.body.classList.contains("modal-open") || document.body.classList.contains("menu-open")) return;
      shown = true;
      el.classList.add("is-open");
      window.removeEventListener("scroll", tryShow);
    };
    setTimeout(() => { timeUp = true; tryShow(); }, 9000);
    window.addEventListener("scroll", tryShow, { passive: true });
  })();

  /* ---------- Hero slideshow: crossfades through destinations ---------- */
  document.querySelectorAll("[data-slideshow]").forEach((show) => {
    const slides = [...show.querySelectorAll(".slide")];
    const cap = document.querySelector("[data-slide-caption]");
    const dots = document.querySelector("[data-slide-dots]");
    if (slides.length < 2) return;
    let i = 0, timer = null;
    const DELAY = reduceMotion ? 8000 : 5500;
    if (dots) {
      dots.innerHTML = slides.map((s, n) => `<button aria-label="Show ${s.dataset.place}" class="${n === 0 ? "is-active" : ""}"><span></span></button>`).join("");
      dots.style.setProperty("--dur", DELAY + "ms");
    }
    const setCaption = (s) => {
      if (!cap) return;
      cap.classList.remove("is-in");
      setTimeout(() => {
        cap.querySelector("strong").textContent = s.dataset.place;
        cap.querySelector("small").textContent = s.dataset.meta || "";
        cap.classList.add("is-in");
      }, 250);
    };
    const go = (n) => {
      const prev = slides[i];
      i = (n + slides.length) % slides.length;
      const next = slides[i];
      // make sure the next image is loading
      [next, slides[(i + 1) % slides.length]].forEach((sl) => {
        const img = sl.querySelector("img[data-src]");
        if (img) {
          if (img.dataset.srcset) img.srcset = img.dataset.srcset;
          img.src = img.dataset.src; img.removeAttribute("data-src");
        }
      });
      prev.classList.remove("is-active");
      prev.classList.add("is-leaving");
      setTimeout(() => prev.classList.remove("is-leaving"), 1600);
      next.classList.add("is-active");
      setCaption(next);
      dots?.querySelectorAll("button").forEach((b, k) => {
        b.classList.toggle("is-active", k === i);
        if (k === i) { b.classList.remove("run"); void b.offsetWidth; b.classList.add("run"); }
      });
    };
    const start = () => { clearInterval(timer); timer = setInterval(() => go(i + 1), DELAY); };
    dots?.querySelectorAll("button").forEach((b, k) => b.addEventListener("click", () => { go(k); start(); }));
    document.addEventListener("visibilitychange", () => (document.hidden ? clearInterval(timer) : start()));
    // preload the second slide after the page is ready
    window.addEventListener("load", () => {
      const img = slides[1].querySelector("img[data-src]");
      if (img) {
        if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        img.src = img.dataset.src; img.removeAttribute("data-src");
      }
    });
    setCaption(slides[0]);
    dots?.querySelector("button")?.classList.add("run");
    start();
  });

  /* ---------- Icons placeholders: <i data-icon="phone"></i> ---------- */
  document.querySelectorAll("[data-icon]").forEach((el) => {
    el.outerHTML = icon(el.dataset.icon, el.className);
  });

  /* ---------- Fill contact placeholders: data-site="phone" etc. ---------- */
  document.querySelectorAll("[data-site]").forEach((el) => {
    const key = el.dataset.site;
    if (key === "tel") el.href = `tel:${S.phoneLink}`;
    else if (key === "mailto") el.href = `mailto:${S.email}`;
    else if (key === "wa") el.href = waLink(el.dataset.waText || "Hi! I'd like to plan a trip.");
    else if (S[key]) el.textContent = S[key];
  });

  /* ---------- Header: solid on scroll, hide on scroll down ---------- */
  const header = document.getElementById("header");
  let lastY = window.scrollY;
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    if (header) {
      header.classList.toggle("is-scrolled", y > 40);
      const menuOpen = body.classList.contains("menu-open");
      if (!menuOpen) header.classList.toggle("is-hidden", y > 400 && y > lastY + 2);
      if (y < lastY - 2) header.classList.remove("is-hidden");
    }
    document.querySelector(".float-wa")?.classList.toggle("is-visible", y > 300);
    lastY = y;
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* Nav hover pill (desktop) */
  const nav = document.querySelector(".nav");
  const pill = document.querySelector(".nav__pill");
  if (nav && pill) {
    const movePill = (link) => {
      if (!link) { pill.style.opacity = 0; return; }
      const r = link.getBoundingClientRect();
      const n = nav.getBoundingClientRect();
      pill.style.opacity = 1;
      pill.style.width = r.width + "px";
      pill.style.transform = `translateX(${r.left - n.left}px)`;
    };
    const active = nav.querySelector(".is-active");
    nav.querySelectorAll(".nav__link").forEach((l) => l.addEventListener("mouseenter", () => movePill(l)));
    nav.addEventListener("mouseleave", () => movePill(active));
    window.addEventListener("load", () => movePill(active));
    window.addEventListener("resize", () => movePill(active));
    if (document.fonts) document.fonts.ready.then(() => movePill(active));
  }

  /* Mobile menu */
  const burger = document.querySelector(".burger");
  const menu = document.getElementById("mobile-menu");
  const setMenu = (open) => {
    body.classList.toggle("menu-open", open);
    burger?.setAttribute("aria-expanded", String(open));
    burger?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu?.setAttribute("aria-hidden", String(!open));
    header?.classList.remove("is-hidden");
    if (window.lenis) open ? window.lenis.stop() : window.lenis.start();
  };
  burger?.addEventListener("click", () => setMenu(!body.classList.contains("menu-open")));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  window.matchMedia("(min-width: 1025px)").addEventListener("change", (e) => e.matches && setMenu(false));

  /* ---------- Blur-up image loading ---------- */
  const markLoaded = (img) => img.classList.add("is-loaded");
  window.watchImages = (root = document) => {
    root.querySelectorAll("img.blur-up:not(.is-loaded)").forEach((img) => {
      if (img.complete && img.naturalWidth) markLoaded(img);
      else {
        img.addEventListener("load", () => markLoaded(img), { once: true });
        img.addEventListener("error", () => { img.classList.add("is-loaded", "is-broken"); }, { once: true });
      }
    });
  };
  window.watchImages();
  // Catch images rendered later by other scripts (packages, cabs, gallery)
  document.addEventListener("load", (e) => {
    if (e.target.tagName === "IMG" && e.target.classList.contains("blur-up")) markLoaded(e.target);
  }, true);
  document.addEventListener("error", (e) => {
    if (e.target.tagName === "IMG" && e.target.classList.contains("blur-up")) e.target.classList.add("is-loaded", "is-broken");
  }, true);
  document.addEventListener("DOMContentLoaded", () => window.watchImages());

  /* ---------- Button ripple ---------- */
  document.addEventListener("pointerdown", (e) => {
    const btn = e.target.closest(".btn");
    if (!btn || reduceMotion) return;
    const r = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 2;
    const span = document.createElement("span");
    span.className = "ripple";
    span.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
    btn.appendChild(span);
    setTimeout(() => span.remove(), 650);
  });

  /* ---------- Page transitions ----------
     Leaving: content softly fades/lifts out while a thin progress line runs across the top.
     Arriving: content fades/settles in (the <head> script adds .is-entering early). */
  const root = document.documentElement;
  try { sessionStorage.removeItem("iy-transition"); } catch (e) {}
  if (root.classList.contains("is-entering")) {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      root.classList.add("is-entered");
      root.classList.remove("is-entering");
      setTimeout(() => root.classList.remove("is-entered"), 900);
    }));
  }
  window.leavePage = (href) => {
    try { sessionStorage.setItem("iy-transition", "1"); } catch (err) {}
    root.classList.add("is-leaving");
    setTimeout(() => (location.href = href), 380);
  };
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a || reduceMotion) return;
    const href = a.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("tel:") || href.startsWith("mailto:") || a.target === "_blank" || a.hasAttribute("download")) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search && url.hash) return;
    e.preventDefault();
    window.leavePage(url.href);
  });
  // Back/forward cache: never come back to a faded-out page
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) root.classList.remove("is-leaving", "is-entering");
  });

  /* ---------- Testimonials slider ---------- */
  document.querySelectorAll("[data-slider]").forEach((slider) => {
    const track = slider.querySelector(".slider__track");
    if (!track) return;
    const step = () => (track.firstElementChild?.getBoundingClientRect().width || 300) + 24;
    const go = (dir) => {
      const max = track.scrollWidth - track.clientWidth - 4;
      if (dir > 0 && track.scrollLeft >= max) track.scrollTo({ left: 0, behavior: "smooth" });
      else track.scrollBy({ left: dir * step(), behavior: "smooth" });
    };
    slider.querySelector("[data-prev]")?.addEventListener("click", () => go(-1));
    slider.querySelector("[data-next]")?.addEventListener("click", () => go(1));

    // Drag to scroll on desktop
    let down = false, startX = 0, startLeft = 0, moved = false;
    track.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse") return;
      down = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft;
      track.classList.add("is-dragging");
    });
    window.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      track.scrollLeft = startLeft - dx;
    });
    window.addEventListener("pointerup", () => {
      if (!down) return;
      down = false;
      track.classList.remove("is-dragging");
      // snap to the nearest card
      const s = step();
      track.scrollTo({ left: Math.round(track.scrollLeft / s) * s, behavior: "smooth" });
    });
    track.addEventListener("click", (e) => { if (moved) e.preventDefault(); }, true);

    // Autoplay, paused on hover / focus / when off-screen
    if (!reduceMotion) {
      let paused = false, visible = false;
      slider.addEventListener("mouseenter", () => (paused = true));
      slider.addEventListener("mouseleave", () => (paused = false));
      slider.addEventListener("focusin", () => (paused = true));
      slider.addEventListener("focusout", () => (paused = false));
      new IntersectionObserver(([en]) => (visible = en.isIntersecting)).observe(slider);
      setInterval(() => { if (!paused && visible && !down) go(1); }, 5000);
    }
  });

  /* ---------- Simple accordion (itinerary, FAQ) ---------- */
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-accordion-btn]");
    if (!btn) return;
    const item = btn.closest(".acc");
    const open = item.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(open));
  });

  /* ---------- Map embed ---------- */
  document.querySelectorAll("[data-map]").forEach((el) => {
    el.innerHTML = `<iframe title="Office location on map" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${encodeURIComponent(S.mapQuery)}&output=embed"></iframe>`;
  });
})();

/* Keep the tapped tab visible when a tab bar scrolls sideways (mobile) */
document.addEventListener("click", (e) => {
  const tab = e.target.closest(".tabs .tab");
  if (!tab) return;
  const bar = tab.parentElement;
  if (bar.scrollWidth <= bar.clientWidth) return;
  bar.scrollTo({ left: tab.offsetLeft - (bar.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
});
