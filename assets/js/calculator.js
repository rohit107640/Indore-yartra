/* =========================================================
   TRIP FARE CALCULATOR  —  <div data-fare-calc></div>
   Rules and rates live in assets/js/data/cabs.js (FARE_RULES, CABS, TRIP_PLACES).

   Round trip under packageMinKm (1,000 km)  → FIXED PACKAGE PRICE
       billed km = max(total km, days × minKmPerDay)
       price     = billed km × pkgPerKm + days × driverAllowance  (rounded to ₹50)
   Round trip of packageMinKm or more        → PER-KM ESTIMATE (a range)
       low  = billed km × pkgPerKm + allowance
       high = billed km × perKm    + allowance
       final per-km rate is confirmed on call
   One-way → fixed ROUTES fare if available,
             else max(km, oneWayMinKm) × perKm × oneWayMultiplier (estimate)
   ========================================================= */
(function () {
  "use strict";
  const S = window.SITE;
  const icon = window.icon;
  const CABS = window.CABS || [];
  const R = Object.assign({ minKmPerDay: 250, driverAllowance: 300, packageMinKm: 1000, oneWayMinKm: 60, oneWayMultiplier: 1.4 }, window.FARE_RULES || {});
  const ROUTES = window.ROUTES || [];
  const VEH = window.FARE_VEHICLES || [];
  // which column of ROUTES.fares applies to a vehicle (Amaze uses the sedan fare)
  const fareCol = (c) => { const i = VEH.indexOf(c.name); return i >= 0 ? i : (c.id === "amaze" ? 0 : -1); };
  const PLACES = window.TRIP_PLACES || [];
  const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
  const num = (n) => Math.round(n).toLocaleString("en-IN");
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const tween = (el, to, fmt = inr) => {
    const from = +el.dataset.val || 0;
    el.dataset.val = to;
    if (reduce || from === to) { el.textContent = fmt(to); return; }
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / 500);
      el.textContent = fmt(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  document.querySelectorAll("[data-fare-calc]").forEach((root, idx) => {
    const id = (n) => `fc${idx}-${n}`;
    root.classList.add("fc");
    root.innerHTML = `
      <div class="fc__inputs">
        <div class="fc__row">
          <span class="fc__label">Trip type</span>
          <div class="seg" role="radiogroup" aria-label="Trip type">
            <button type="button" class="seg__btn is-active" data-trip="round" role="radio" aria-checked="true">Round trip</button>
            <button type="button" class="seg__btn" data-trip="oneway" role="radio" aria-checked="false">One-way</button>
          </div>
        </div>

        <div class="fc__grid">
          <div class="field">
            <select id="${id("dest")}" name="fc-dest">
              ${PLACES.map(([n, km]) => `<option value="${km}">${esc(n)} · ${km} km</option>`).join("")}
              <option value="custom">Other — I'll enter km</option>
            </select>
            <label for="${id("dest")}">Destination from Indore</label>
          </div>
          <div class="field">
            <input id="${id("km")}" name="fc-km" type="number" min="1" max="5000" inputmode="numeric" placeholder=" " value="${PLACES[0] ? PLACES[0][1] : 100}">
            <label for="${id("km")}">One-way distance (km)</label>
          </div>
        </div>

        <div class="fc__row" data-only="round">
          <span class="fc__label">Number of days</span>
          <div class="stepper">
            <button type="button" data-days="-1" aria-label="Fewer days">−</button>
            <output id="${id("days")}" aria-live="polite">1</output>
            <button type="button" data-days="1" aria-label="More days">+</button>
          </div>
        </div>

        <div class="fc__row fc__row--col">
          <span class="fc__label">Choose vehicle</span>
          <div class="vpick" role="radiogroup" aria-label="Vehicle">
            ${CABS.map((c, i) => `
              <label class="vpick__item">
                <input type="radio" name="fc-veh-${idx}" value="${c.id}" ${i === 0 ? "checked" : ""}>
                <span class="vpick__card">
                  <span class="vpick__img"><img src="${S.img(c.image, 500)}" alt="" loading="lazy"></span>
                  <span class="vpick__info">
                    <strong>${esc(c.name)}</strong>
                    <small>${esc(c.type.split(" · ")[0])}</small>
                    <span class="vpick__specs">
                      <span>${icon("users")}${c.seats}${c.id === "traveller" ? "+" : ""}</span>
                      <span>${icon("bag")}${c.bags}</span>
                    </span>
                  </span>
                  <span class="vpick__check" aria-hidden="true">${icon("check")}</span>
                </span>
              </label>`).join("")}
          </div>
        </div>
      </div>

      <div class="fc__result" aria-live="polite">
        <div class="fc__distance">
          <div><small>Total distance</small><strong data-o="total">0 km</strong></div>
          <div><small>Days</small><strong data-o="daysTxt">1</strong></div>
        </div>
        <div class="quote">
          <span class="quote__badge" data-o="badge"></span>
          <span class="quote__price"><span data-o="p1">₹0</span><span class="quote__sep">–</span><span data-o="p2">₹0</span></span>
          <span class="quote__break" data-o="break"></span>
          <ul class="quote__points" data-o="points"></ul>
        </div>
        <p class="quote__hint" data-o="hint"></p>
        <button type="button" class="btn btn--primary btn--lg btn--block btn--magnetic" data-o="book"><span data-o="ctaLabel">Book now</span> ${icon("arrow")}</button>
        <p class="fc__note">Tolls, parking, state permits and night charges (10 PM–6 AM) are extra at actuals.</p>
      </div>`;

    const $ = (sel) => root.querySelector(sel);
    const o = (k) => root.querySelector(`[data-o="${k}"]`);
    const dest = $(`#${id("dest")}`);
    const kmIn = $(`#${id("km")}`);
    const daysOut = $(`#${id("days")}`);
    let trip = "round", days = 1, daysTouched = false;

    const vehicle = () => CABS.find((c) => c.id === root.querySelector(`input[name="fc-veh-${idx}"]:checked`)?.value) || CABS[0];
    const r50 = (n) => Math.round(n / 50) * 50;

    const calc = () => {
      const c = vehicle();
      const oneKm = Math.max(1, Math.min(5000, +kmIn.value || 0));
      const total = trip === "round" ? oneKm * 2 : oneKm;
      if (trip === "round" && !daysTouched) days = Math.max(1, Math.ceil(total / 450));
      daysOut.textContent = days;
      root.classList.toggle("is-oneway", trip === "oneway");

      const placeName = dest.value === "custom" ? "" : dest.selectedOptions[0].textContent.split(" · ")[0];
      const allowance = trip === "round" ? days * R.driverAllowance : 0;
      const billed = trip === "round" ? Math.max(total, days * R.minKmPerDay) : Math.max(total, R.oneWayMinKm);
      const dayTxt = `${days} day${days > 1 ? "s" : ""}`;
      let mode, low, high = 0, badge, brk, points, hint = "", cta;

      if (trip === "round" && total < R.packageMinKm) {
        mode = placeName ? "fixed" : "estimate";
        low = r50(billed * (c.pkgPerKm || c.perKm) + allowance);
        badge = placeName ? "Fixed package price" : "Package estimate";
        brk = `Round trip Indore → ${placeName || oneKm + " km"} → Indore · ${dayTxt} · up to ${num(billed)} km`;
        points = ["AC " + c.name + " with driver", "Fuel & driver allowance included", placeName ? "Price fixed, no surprises" : "Exact price confirmed on WhatsApp"];
        hint = `Going ${num(R.packageMinKm)} km or more? Long journeys are priced per km and confirmed on call.`;
        cta = placeName ? `Book at ${inr(low)}` : `Book at ~${inr(low)}`;
      } else if (trip === "round") {
        mode = "range";
        low = r50(billed * (c.pkgPerKm || c.perKm) + allowance);
        high = r50(billed * c.perKm + allowance);
        badge = "Long journey · per-km pricing";
        brk = `About ₹${c.pkgPerKm}–₹${c.perKm}/km × ${num(billed)} km + driver allowance (${dayTxt})`;
        points = ["Final per-km rate confirmed on call", "Depends on route, season & stops", "Same car & driver for the whole trip"];
        cta = "Get my exact quote";
      } else {
        const route = ROUTES.find((r) => r.to === placeName && r.km === oneKm);
        const col = fareCol(c);
        if (route && col >= 0) {
          mode = "oneway-fixed";
          low = route.fares[col];
          badge = "Fixed one-way fare";
          brk = `Indore → ${placeName} · ${num(oneKm)} km · drop only`;
          points = ["AC " + c.name + " with driver", "No return fare charged", "Price fixed, no surprises"];
          cta = `Book at ${inr(low)}`;
        } else {
          mode = "oneway-est";
          const owRate = Math.round(c.perKm * R.oneWayMultiplier * 10) / 10;
          low = r50(billed * owRate);
          badge = "One-way estimate";
          brk = `Indore → ${placeName || num(oneKm) + " km"} · drop only · about ₹${owRate}/km`;
          points = ["One-way rates include the car's return", "Exact fare confirmed on WhatsApp"];
          cta = `Get my exact quote`;
        }
      }

      root.dataset.mode = mode;
      root.querySelector(".quote").classList.toggle("is-range", mode === "range");
      o("total").textContent = `${num(total)} km`;
      o("daysTxt").textContent = trip === "round" ? dayTxt : "Drop";
      o("badge").textContent = badge;
      tween(o("p1"), low);
      if (high) tween(o("p2"), high);
      o("break").textContent = brk;
      o("points").innerHTML = points.map((t) => `<li>${icon("check")}${esc(t)}</li>`).join("");
      o("hint").textContent = hint;
      o("hint").hidden = !hint;
      o("ctaLabel").textContent = cta;

      const priceTxt = mode === "range" ? `${inr(low)}–${inr(high)} (per-km, to confirm)` : `${badge}: ${inr(low)}`;
      o("book").dataset.summary = [
        trip === "round" ? `Round trip · ${dayTxt}` : "One-way",
        c.name, `${num(total)} km`, priceTxt
      ].join("|");
      o("book").dataset.dest = placeName || `${oneKm} km trip`;
      o("book").dataset.veh = c.name;
    };

    root.querySelectorAll(".seg__btn").forEach((b) => b.addEventListener("click", () => {
      trip = b.dataset.trip;
      root.querySelectorAll(".seg__btn").forEach((x) => { x.classList.toggle("is-active", x === b); x.setAttribute("aria-checked", String(x === b)); });
      calc();
    }));
    dest.addEventListener("change", () => {
      if (dest.value !== "custom") kmIn.value = dest.value;
      else { kmIn.value = ""; kmIn.focus(); }
      daysTouched = false;
      calc();
    });
    kmIn.addEventListener("input", () => {
      const match = [...dest.options].find((op) => op.value === kmIn.value);
      dest.value = match ? match.value : "custom";
      daysTouched = false;
      calc();
    });
    root.querySelectorAll("[data-days]").forEach((b) => b.addEventListener("click", () => {
      days = Math.max(1, Math.min(30, days + +b.dataset.days));
      daysTouched = true;
      calc();
    }));
    root.addEventListener("change", (e) => { if (e.target.name?.startsWith("fc-veh")) calc(); });

    o("book").addEventListener("click", () => {
      const b = o("book");
      window.openBooking && window.openBooking({
        type: trip === "round" ? "Cab Booking" : "One-way Taxi",
        item: b.dataset.veh, pickup: "Indore", destination: b.dataset.dest,
        title: `Indore → ${b.dataset.dest}`, summary: b.dataset.summary, source: "fare-calculator"
      });
    });

    calc();
  });
})();
