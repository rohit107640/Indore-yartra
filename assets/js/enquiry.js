/* =========================================================
   ENQUIRY FORMS
   Renders forms into <form data-enquiry ...>, validates,
   saves to Firebase Firestore, then sends the visitor to
   thank-you.html which opens WhatsApp with the message filled in.

   Form attributes:
     data-variant = "full" | "quick" | "side"
     data-type    = "Tour Package" | "Cab Booking" | "General"  (default selection)
     data-lock-type  -> hide the type selector
     data-item    = pre-selected package / vehicle name
     data-source  = page name saved with the enquiry
   ========================================================= */
(function () {
  "use strict";
  const S = window.SITE;
  const icon = window.icon;
  const PKGS = window.PACKAGES || [];
  const CATS = window.CATEGORIES || {};
  const CABS = window.CABS || [];
  const TYPES = ["Tour Package", "One-way Taxi", "Cab Booking", "Airport Transfer", "General"];
  const TYPE_LABELS = { "Tour Package": "Tour package", "One-way Taxi": "One-way taxi", "Cab Booking": "Round trip / outstation cab", "Airport Transfer": "Airport pickup / drop", "General": "Something else" };
  const isCab = (t) => ["One-way Taxi", "Cab Booking", "Airport Transfer"].includes(t);
  window.isCabType = isCab;
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Option lists ---------- */
  const packageOptions = () =>
    Object.entries(CATS).map(([key, c]) =>
      `<optgroup label="${c.label}">${PKGS.filter((p) => p.category === key).map((p) => `<option>${esc(p.title)}</option>`).join("")}</optgroup>`
    ).join("") + `<option>Custom / other trip</option>`;
  const cabOptions = () => CABS.map((c) => `<option>${esc(c.name)}</option>`).join("") + `<option>Not sure — suggest one</option>`;
  const itemOptions = (type) =>
    `<option value="" disabled selected hidden></option>` +
    (isCab(type) ? cabOptions() : type === "Tour Package" ? packageOptions() : `<option>General question</option><option>Wedding / event transport</option><option>Corporate travel</option>`);
  const itemLabel = (t) => (isCab(t) ? "Vehicle" : t === "General" ? "Topic" : "Package");

  /* ---------- Field builders ---------- */
  let uid = 0;
  const field = (name, label, input, cls = "") => {
    const id = `f-${name}-${++uid}`;
    return `<div class="field ${cls}">${input.replace("%ID%", id)}<label for="${id}">${label}</label><span class="field__error" aria-live="polite"></span></div>`;
  };
  const text = (name, label, attrs = "", cls = "") =>
    field(name, label, `<input id="%ID%" name="${name}" placeholder=" " ${attrs}>`, cls);
  const select = (name, label, options, cls = "") =>
    field(name, label, `<select id="%ID%" name="${name}">${options}</select>`, cls);

  const checkSvg = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  const submitBtn = (label, cls = "btn--lg btn--block", ic = "whatsapp") => `
    <button type="submit" class="btn btn--primary ${cls}">
      <span class="btn__label">${label}</span><span class="btn__icon">${icon(ic)}</span>
      <span class="btn__spinner" aria-hidden="true"></span>
      <span class="btn__check">${checkSvg}Sent!</span>
    </button>`;

  const honeypot = `<input class="hp" type="text" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">`;

  function render(form, keep = {}) {
    const v = form.dataset.variant || "full";
    const type = TYPES.includes(form.dataset.type) ? form.dataset.type : "Tour Package";
    const lock = form.hasAttribute("data-lock-type");
    const d = { ...form.dataset, ...keep };
    const typeSel = lock
      ? `<input type="hidden" name="type" value="${type}">`
      : select("type", "I'm looking for", TYPES.map((t) => `<option value="${t}" ${t === type ? "selected" : ""}>${TYPE_LABELS[t]}</option>`).join(""), v === "full" ? "" : "full");

    if (v === "quick") {
      form.innerHTML = `
        <div class="form-grid">
          ${text("name", "Your name", 'autocomplete="name" required')}
          ${text("phone", "Mobile number", 'type="tel" inputmode="numeric" autocomplete="tel" required')}
          ${typeSel}
          ${text("date", "Travel date", `type="date" min="${today}"`)}
          ${submitBtn("Get a quote", "", "arrow")}
        </div>${honeypot}<p class="form-status" role="status"></p>`;
      return;
    }

    const compact = v === "side" || v === "modal";
    const cab = isCab(type);
    const airport = type === "Airport Transfer";
    form.innerHTML = `
      <div class="form-grid">
        ${text("name", "Your name *", `autocomplete="name" required value="${esc(d.name)}"`)}
        ${text("phone", "Mobile number *", `type="tel" inputmode="numeric" autocomplete="tel" required value="${esc(d.phone)}"`)}
        ${compact ? "" : text("email", "Email (optional)", `type="email" autocomplete="email" value="${esc(d.email)}"`, lock ? "full" : "")}
        ${typeSel}
        ${cab ? text("pickup", airport ? "Pickup (address / airport)" : "Pickup location", `value="${esc(d.pickup || "Indore")}" autocomplete="street-address"`) : ""}
        ${cab ? text("destination", airport ? "Drop (address / airport)" : "Drop location", `value="${esc(d.destination || (airport ? "Indore Airport" : ""))}"`) : ""}
        ${select("item", itemLabel(type), itemOptions(type))}
        ${text("date", cab ? "Pickup date" : "Travel date", `type="date" min="${today}" value="${esc(d.date)}"`)}
        ${text("travellers", "Travellers", `type="number" min="1" max="100" inputmode="numeric" value="${esc(d.travellers || 2)}"`)}
        ${cab ? "" : text("pickup", "Pickup city", `value="${esc(d.pickup || "Indore")}" autocomplete="address-level2"`)}
        ${v === "modal" ? `<input type="hidden" name="message" value="${esc(d.quote)}">` : field("message", airport ? "Flight number / time (optional)" : "Anything else? (optional)", '<textarea id="%ID%" name="message" rows="3" placeholder=" " maxlength="1000"></textarea>', "full")}
      </div>
      ${honeypot}
      <div class="form-foot">
        ${submitBtn(v === "modal" ? "Confirm on WhatsApp" : compact ? "Enquire on WhatsApp" : "Send enquiry")}
        <p class="form-note">${icon("whatsapp")} No payment now. We confirm the fare and driver on WhatsApp.</p>
        <p class="form-status" role="status"></p>
      </div>`;

    // Pre-select item
    const item = d.item;
    const sel = form.querySelector('select[name="item"]');
    if (sel && item) {
      if (![...sel.options].some((o) => o.value === item)) sel.insertAdjacentHTML("beforeend", `<option>${esc(item)}</option>`);
      sel.value = item;
    }

    // Changing the trip type rebuilds the form, keeping what was typed
    const typeSelect = form.querySelector('select[name="type"]');
    typeSelect?.addEventListener("change", () => {
      const keepVals = {};
      ["name", "phone", "email", "date", "travellers"].forEach((n) => { if (form.elements.namedItem(n)) keepVals[n] = form.elements.namedItem(n).value; });
      form.dataset.type = typeSelect.value;
      delete form.dataset.item;
      render(form, keepVals);
      window.enhanceDates && window.enhanceDates(form);
      form.querySelector('select[name="type"]')?.focus();
    });
  }

  /* ---------- Validation ---------- */
  const cleanPhone = (v) => v.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
  function validate(form) {
    const errors = {};
    const val = (n) => (form.elements.namedItem(n)?.value || "").trim();
    if (val("name").length < 2) errors.name = "Please enter your name.";
    if (!/^[6-9]\d{9}$/.test(cleanPhone(val("phone")))) errors.phone = "Enter a valid 10-digit mobile number.";
    if (val("email") && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val("email"))) errors.email = "That email doesn't look right.";
    if (val("date") && val("date") < today) errors.date = "Please choose a future date.";
    if (form.elements.travellers) {
      const t = +val("travellers");
      if (!Number.isInteger(t) || t < 1 || t > 100) errors.travellers = "1 to 100 travellers.";
    }

    form.querySelectorAll(".field").forEach((f) => {
      const input = f.querySelector("input, select, textarea");
      const msg = errors[input?.name || input?.dataset.for];
      f.classList.toggle("has-error", !!msg);
      f.querySelector(".field__error").textContent = msg || "";
      input?.setAttribute("aria-invalid", msg ? "true" : "false");
      if (msg) { f.classList.remove("shake"); void f.offsetWidth; f.classList.add("shake"); }
    });
    const first = form.querySelector(".has-error input, .has-error select, .has-error textarea");
    if (first) first.focus({ preventScroll: false });
    return !first;
  }

  /* ---------- Data + WhatsApp message ---------- */
  function collect(form) {
    const val = (n) => (form.elements.namedItem(n)?.value || "").trim().slice(0, n === "message" ? 1000 : 120);
    return {
      name: val("name").slice(0, 80),
      phone: cleanPhone(val("phone")),
      email: val("email"),
      type: TYPES.includes(val("type")) ? val("type") : "General",
      item: val("item"),
      date: val("date"),
      travellers: form.elements.travellers ? Math.max(1, parseInt(val("travellers"), 10) || 1) : 1,
      pickup: val("pickup").slice(0, 80),
      destination: val("destination"),
      message: val("message"),
      source: (form.dataset.source || document.body.dataset.page || "website").slice(0, 60)
    };
  }

  function buildMessage(d) {
    const opt = (cond, line) => (cond ? line : null);
    const lines = [
      `*New enquiry — ${S.name}* 🚌`,
      ``,
      `*Name:* ${d.name}`,
      `*Phone:* ${d.phone}`,
      opt(d.email, `*Email:* ${d.email}`),
      `*Looking for:* ${TYPE_LABELS[d.type] || d.type}`,
      opt(d.item, `*${isCab(d.type) ? "Vehicle" : "Package"}:* ${d.item}`),
      opt(d.date, `*${isCab(d.type) ? "Pickup date" : "Travel date"}:* ${new Date(d.date + "T00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`),
      opt(d.travellers, `*Travellers:* ${d.travellers}`),
      opt(d.pickup, `*Pickup:* ${d.pickup}`),
      opt(d.destination, `*Drop:* ${d.destination}`),
      opt(d.message, `*Message:* ${d.message}`)
    ];
    return lines.filter((l) => l !== null).join("\n");
  }

  const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]);

  async function saveToFirebase(data) {
    const mod = await import(new URL("assets/js/firebase-config.js", location.href).href);
    return mod.saveEnquiry(data);
  }

  /* ---------- Submit ---------- */
  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const btn = form.querySelector('button[type="submit"]');
    const status = form.querySelector(".form-status");
    if (btn.disabled) return;
    if (form.elements.company?.value) return; // spam bot filled the honeypot
    if (!validate(form)) return;

    const data = collect(form);
    btn.disabled = true;
    btn.classList.add("is-loading");
    status.textContent = "";
    status.classList.remove("is-error");

    let saved = false;
    try {
      await withTimeout(saveToFirebase(data), 7000);
      saved = true;
    } catch (err) {
      // Never lose a lead: continue to WhatsApp even if saving failed.
      console.warn("[enquiry] Firestore save skipped/failed:", err.message);
    }

    const message = buildMessage(data);
    try {
      sessionStorage.setItem("iy-enquiry", JSON.stringify({
        name: data.name, wa: window.waLink(message), saved,
        type: TYPE_LABELS[data.type] || data.type, item: data.item, pickup: data.pickup,
        destination: data.destination, date: data.date, travellers: data.travellers, isCab: isCab(data.type)
      }));
    } catch (err) {}

    btn.classList.remove("is-loading");
    btn.classList.add("is-success");
    setTimeout(() => (window.leavePage ? window.leavePage("thank-you.html") : (location.href = "thank-you.html")), 650);
  }

  function setup(form) {
    if (form.dataset.ready) return;
    form.dataset.ready = "1";
    render(form);
    form.noValidate = true;
    form.addEventListener("submit", onSubmit);
    form.addEventListener("input", (e) => {
      const f = e.target.closest(".field");
      if (f?.classList.contains("has-error")) { f.classList.remove("has-error"); f.querySelector(".field__error").textContent = ""; }
    });
  }
  window.setupEnquiryForm = setup;
  document.querySelectorAll("form[data-enquiry]").forEach(setup);

})();
