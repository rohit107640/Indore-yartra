/* =========================================================
   DATE PICKER — a modern calendar that replaces every
   <input type="date"> on the page (forms are rendered by enquiry.js).
   - The original input becomes hidden and keeps the ISO value (YYYY-MM-DD)
   - Popover on desktop, bottom sheet on phones
   - Quick picks: Today, Tomorrow, This weekend
   - Keyboard: arrows move, Enter selects, Esc closes
   ========================================================= */
(function () {
  "use strict";
  const icon = window.icon;
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const pad = (n) => String(n).padStart(2, "0");
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = (s) => { const [y, m, d] = (s || "").split("-").map(Number); return y ? new Date(y, m - 1, d) : null; };
  const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const pretty = (d) => `${WD[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
  const today = () => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const sameDay = (a, b) => a && b && a.getTime() === b.getTime();
  const phone = () => window.matchMedia("(max-width: 600px)").matches;

  let open = null; // currently open picker

  function enhance(input) {
    if (input.dataset.dp) return;
    input.dataset.dp = "1";
    const field = input.closest(".field");
    const label = field?.querySelector("label");
    const min = parse(input.min) || today();

    // Visible read-only display input (keeps the floating label behaviour)
    const display = document.createElement("input");
    display.type = "text";
    display.readOnly = true;
    display.placeholder = " ";
    display.className = "dp-input";
    display.id = input.id;
    display.dataset.for = input.name;
    display.setAttribute("aria-haspopup", "dialog");
    display.setAttribute("aria-expanded", "false");
    display.setAttribute("autocomplete", "off");
    input.removeAttribute("id");
    input.type = "hidden";
    input.before(display);
    field?.classList.add("field--date");
    field?.insertAdjacentHTML("beforeend", `<span class="dp-icon" aria-hidden="true">${icon("calendar")}</span>`);

    // Popup
    const pop = document.createElement("div");
    pop.className = "dp";
    pop.setAttribute("role", "dialog");
    pop.setAttribute("aria-label", (label?.textContent || "Choose date").replace("*", "").trim());
    pop.innerHTML = `
      <div class="dp__handle" aria-hidden="true"></div>
      <div class="dp__head">
        <button type="button" class="dp__nav" data-dp-prev aria-label="Previous month">${icon("chevron-left")}</button>
        <div class="dp__title" aria-live="polite"></div>
        <button type="button" class="dp__nav" data-dp-next aria-label="Next month">${icon("chevron-right")}</button>
      </div>
      <div class="dp__week">${DAYS.map((d) => `<span>${d}</span>`).join("")}</div>
      <div class="dp__viewport"><div class="dp__grid" role="grid"></div></div>
      <div class="dp__quick">
        <button type="button" data-dp-quick="0">Today</button>
        <button type="button" data-dp-quick="1">Tomorrow</button>
        <button type="button" data-dp-quick="weekend">This weekend</button>
        <button type="button" class="dp__clear" data-dp-clear>Clear</button>
      </div>`;
    field.appendChild(pop);

    const grid = pop.querySelector(".dp__grid");
    const title = pop.querySelector(".dp__title");
    let view = new Date((parse(input.value) || min).getFullYear(), (parse(input.value) || min).getMonth(), 1);
    let focusDay = parse(input.value) || min;

    const render = (dir = 0) => {
      const y = view.getFullYear(), m = view.getMonth();
      title.textContent = `${MONTHS[m]} ${y}`;
      const first = new Date(y, m, 1);
      const offset = (first.getDay() + 6) % 7; // Monday first
      const days = new Date(y, m + 1, 0).getDate();
      const sel = parse(input.value);
      const t = today();
      let html = "";
      for (let i = 0; i < offset; i++) html += `<span class="dp__day is-empty"></span>`;
      for (let d = 1; d <= days; d++) {
        const date = new Date(y, m, d);
        const dis = date < min;
        const cls = ["dp__day", dis && "is-disabled", sameDay(date, t) && "is-today", sameDay(date, sel) && "is-selected", (date.getDay() % 6 === 0) && "is-weekend"].filter(Boolean).join(" ");
        html += `<button type="button" class="${cls}" data-date="${iso(date)}" ${dis ? "disabled" : ""} tabindex="${sameDay(date, focusDay) ? 0 : -1}" aria-label="${pretty(date)}" ${sameDay(date, sel) ? 'aria-selected="true"' : ""}>${d}</button>`;
      }
      grid.innerHTML = html;
      pop.querySelector("[data-dp-prev]").disabled = y === min.getFullYear() && m <= min.getMonth();
      if (dir) {
        grid.classList.remove("slide-left", "slide-right");
        void grid.offsetWidth;
        grid.classList.add(dir > 0 ? "slide-left" : "slide-right");
      }
    };

    const set = (date) => {
      input.value = date ? iso(date) : "";
      display.value = date ? pretty(date) : "";
      field.classList.remove("has-error");
      const err = field.querySelector(".field__error");
      if (err) err.textContent = "";
      input.dispatchEvent(new Event("change", { bubbles: true }));
    };

    const show = () => {
      if (open && open !== api) open.hide();
      // Phones: bottom sheet lives on <body> so no transformed parent can trap it
      if (phone() && pop.parentElement !== document.body) document.body.appendChild(pop);
      if (!phone() && pop.parentElement !== field) field.appendChild(pop);
      const sel = parse(input.value);
      focusDay = sel || min;
      view = new Date(focusDay.getFullYear(), focusDay.getMonth(), 1);
      render();
      // Open upwards if there's no room below (desktop)
      const r = display.getBoundingClientRect();
      pop.classList.toggle("is-up", !phone() && window.innerHeight - r.bottom < 400 && r.top > 400);
      pop.classList.add("is-open");
      field.classList.add("is-active");
      display.setAttribute("aria-expanded", "true");
      document.body.classList.toggle("dp-sheet-open", phone());
      if (phone() && window.lenis) window.lenis.stop();
      open = api;
      requestAnimationFrame(() => grid.querySelector('[tabindex="0"]')?.focus({ preventScroll: true }));
    };
    const hide = (refocus) => {
      pop.classList.remove("is-open");
      field.classList.remove("is-active");
      display.setAttribute("aria-expanded", "false");
      document.body.classList.remove("dp-sheet-open");
      if (window.lenis) window.lenis.start();
      if (open === api) open = null;
      if (refocus) display.focus({ preventScroll: true });
    };
    const api = { hide, pop, display };

    display.addEventListener("click", () => (pop.classList.contains("is-open") ? hide() : show()));
    display.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") { e.preventDefault(); show(); }
    });

    pop.addEventListener("click", (e) => {
      e.stopPropagation();
      const day = e.target.closest(".dp__day[data-date]");
      if (day && !day.disabled) { set(parse(day.dataset.date)); render(); setTimeout(() => hide(true), 160); return; }
      if (e.target.closest("[data-dp-prev]")) { view.setMonth(view.getMonth() - 1); render(-1); }
      if (e.target.closest("[data-dp-next]")) { view.setMonth(view.getMonth() + 1); render(1); }
      const q = e.target.closest("[data-dp-quick]");
      if (q) {
        let d = today();
        if (q.dataset.dpQuick === "weekend") { const dow = d.getDay(); d = addDays(d, dow === 6 || dow === 0 ? 0 : 6 - dow); }
        else d = addDays(d, +q.dataset.dpQuick);
        if (d < min) d = min;
        set(d); hide(true);
      }
      if (e.target.closest("[data-dp-clear]")) { set(null); hide(true); }
    });

    pop.addEventListener("keydown", (e) => {
      const btn = e.target.closest(".dp__day[data-date]");
      if (e.key === "Escape") { e.preventDefault(); hide(true); return; }
      if (!btn) return;
      const move = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
      if (move) {
        e.preventDefault();
        let next = addDays(parse(btn.dataset.date), move);
        if (next < min) return;
        focusDay = next;
        const dir = next.getMonth() !== view.getMonth() || next.getFullYear() !== view.getFullYear() ? (move > 0 ? 1 : -1) : 0;
        view = new Date(next.getFullYear(), next.getMonth(), 1);
        render(dir);
        grid.querySelector(`[data-date="${iso(next)}"]`)?.focus();
      }
    });

    // Swipe months on touch
    let sx = null;
    grid.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
    grid.addEventListener("touchend", (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) pop.querySelector(dx < 0 ? "[data-dp-next]" : "[data-dp-prev]").click();
      sx = null;
    });

    if (input.value) set(parse(input.value));
  }

  // Close on outside click / tap on sheet backdrop
  document.addEventListener("click", (e) => {
    if (open && !open.pop.contains(e.target) && e.target !== open.display) open.hide();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && open) open.hide(true); });

  document.querySelectorAll('input[type="date"]:not([data-native])').forEach(enhance);
  window.enhanceDates = (root = document) => root.querySelectorAll('input[type="date"]:not([data-native])').forEach(enhance);
})();
