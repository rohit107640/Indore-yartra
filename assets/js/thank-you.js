/* =========================================================
   THANK-YOU PAGE
   Greets the visitor, shows a summary of their enquiry and
   opens WhatsApp after a short, visible countdown (they can
   choose to stay). Direct visits get a simple chat prompt.
   ========================================================= */
(function () {
  "use strict";
  const icon = window.icon;
  const $ = (s) => document.querySelector(s);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const SECONDS = 6;

  let data = null;
  try { data = JSON.parse(sessionStorage.getItem("iy-enquiry") || "null"); } catch (e) {}

  const waBtn = $("[data-ty-wa]");
  const title = $("[data-ty-title]");
  const lead = $("[data-ty-lead]");
  const count = $("[data-ty-count]");
  const stay = $("[data-ty-stay]");
  const ringBar = $(".ty__ringbar");
  const card = $(".ty__card");

  /* ---------- Opened directly (no enquiry in this visit) ---------- */
  if (!data) {
    card.classList.add("is-plain");
    $("[data-ty-eyebrow]").textContent = "We're here to help";
    title.textContent = "Thank you for visiting!";
    lead.textContent = "Have a question, or want a quote for your trip? Message us on WhatsApp and we'll reply within minutes.";
    $("[data-ty-steps]").hidden = true;
    stay.hidden = true;
    waBtn.href = window.waLink("Hi! I'd like to plan a trip.");
    waBtn.target = "_blank";
    waBtn.rel = "noopener";
    waBtn.querySelector("span:last-child").textContent = "Chat on WhatsApp";
    return;
  }

  /* ---------- After an enquiry ---------- */
  const first = (data.name || "").trim().split(/\s+/)[0];
  title.textContent = first ? `Thank you, ${first}!` : "Thank you!";
  $("[data-ty-saved]").textContent = data.saved ? "Saved securely with us" : "Your trip details are ready to send";
  waBtn.href = data.wa;

  // Enquiry summary chips
  const fmtDate = (d) => {
    if (!d) return "";
    const dt = new Date(d + "T00:00");
    return isNaN(dt) ? d : dt.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  };
  const route = data.isCab && (data.pickup || data.destination)
    ? `${data.pickup || "Indore"} → ${data.destination || "To be confirmed"}` : "";
  const chips = [
    [data.isCab ? "route" : "pin", route || data.item],
    [data.isCab ? "car" : "", data.isCab ? data.item : ""],
    ["calendar", fmtDate(data.date)],
    ["users", data.travellers ? `${data.travellers} traveller${data.travellers > 1 ? "s" : ""}` : ""],
    ["check", data.type]
  ].filter(([, v]) => v);
  if (chips.length) {
    const ul = $("[data-ty-summary]");
    ul.innerHTML = chips.map(([ic, v]) => `<li>${ic ? icon(ic) : ""}<span>${esc(v)}</span></li>`).join("");
    ul.hidden = false;
  }

  // Countdown with a progress ring on the button
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const C = 2 * Math.PI * 15;
  if (ringBar) { ringBar.style.strokeDasharray = C; ringBar.style.strokeDashoffset = C; }
  let left = SECONDS, timer = null, cancelled = false;
  const go = () => {
    if (cancelled) return;
    try { sessionStorage.removeItem("iy-enquiry"); } catch (e) {}
    count.textContent = "Opening WhatsApp…";
    location.href = data.wa;
  };
  const tick = () => {
    if (cancelled) return;
    count.textContent = left > 0 ? `Opening WhatsApp in ${left}s…` : "Opening WhatsApp…";
    if (ringBar) {
      ringBar.style.transition = reduce ? "none" : "stroke-dashoffset 1s linear";
      ringBar.style.strokeDashoffset = C * Math.max(0, left - 1) / SECONDS;
    }
    if (left <= 0) return go();
    left--;
    timer = setTimeout(tick, 1000);
  };
  setTimeout(tick, 900); // let the success animation play first

  stay.addEventListener("click", () => {
    cancelled = true;
    clearTimeout(timer);
    card.classList.add("is-paused");
    count.textContent = "Tap the green button whenever you're ready";
    stay.hidden = true;
    if (ringBar) { ringBar.style.transition = "none"; ringBar.style.strokeDashoffset = C; }
  });
  waBtn.addEventListener("click", () => { cancelled = true; clearTimeout(timer); });
})();
