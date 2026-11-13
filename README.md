# Indore Yatra — Tours & Travels website

A fast, animated static website (HTML + CSS + JavaScript, no build step) for a tour & travels business in Indore. It covers cabs and taxis (Indore city tours, Ujjain and Omkareshwar trips, one-way drops, airport pickup and drop, outstation trips and Force Traveller hire) and tour packages across Indore, Madhya Pradesh and nearby states, covering both sightseeing and darshan. Visitors can browse tour packages and cabs and send an enquiry. Each enquiry is **saved in Firebase Firestore** and then **opens WhatsApp** with the details already typed in.

## Project structure

```
indore-yatra-website/
├── index.html            Home
├── services.html         All services
├── packages.html         Tour packages (filters + fare calculator)
├── package.html          One package (?id=...)
├── cabs.html             Cabs & taxi (fare calculator, fleet, rates, booking)
├── gallery.html          Photo gallery
├── about.html            About us (linked from the footer)
├── contact.html          Contact, map and FAQ
├── thank-you.html        Shown after an enquiry, then opens WhatsApp
├── credits.html          Photo credits
├── 404.html              Page not found
│
├── assets/
│   ├── css/
│   │   ├── style.css         Main styles
│   │   └── responsive.css    Phone / tablet / desktop rules
│   ├── js/
│   │   ├── config.js         ★ Business name, phone, WhatsApp, address
│   │   ├── firebase-config.js★ Firebase keys + saving enquiries
│   │   ├── main.js           Header, footer, menu, slideshow, transitions
│   │   ├── animations.js     Scroll animations (GSAP + Lenis)
│   │   ├── booking.js        Booking pop-up, Home fare widget, routes, fleet
│   │   ├── calculator.js     Trip fare calculator
│   │   ├── enquiry.js        Forms, validation, WhatsApp message
│   │   ├── datepicker.js     Calendar date picker
│   │   ├── packages.js       Package cards, filters, package page
│   │   ├── gallery.js        Gallery photos + lightbox
│   │   ├── thank-you.js      Thank-you page
│   │   └── data/
│   │       ├── packages.js   ★ Tour packages
│   │       ├── cabs.js       ★ Fleet, services, route fares, fare rules
│   │       └── photos.js     Photo list (Wikimedia) with credits
│   └── images/
│       ├── favicon.svg
│       ├── cars/   places/   team/   ← put your own photos here
│       └── README.md
│
├── firebase/
│   └── firestore.rules   Database security rules
├── firebase.json         Firebase Hosting + Firestore config
├── .gitignore
└── README.md
```

★ = the files you'll edit most.

## 1. Edit your business details

Everything is in **`assets/js/config.js`**: name, **WhatsApp number** (digits with country code, e.g. `919876543210`), phone, email, address, hours and social links. The header, footer, buttons and forms all read from it.

- **Packages:** `assets/js/data/packages.js`. Add or edit an object. `category` is `indore`, `mp` or `nearby`. Set `featured: true` to show it on the home page.
- **Cabs, services & fares:** `assets/js/data/cabs.js`. This holds the fleet (`CABS`), the service cards (`SERVICES`) and fixed one-way fares from Indore (`ROUTES`, with one fare per vehicle). The Home fare widget and route cards read these prices.
- **Fleet photos:** the car photos are real Dzire, Amaze, Ertiga, Innova Crysta and Force Traveller photos from Wikimedia Commons. Photos of **your own cars** will convert better; set `image` to `assets/images/my-dzire.jpg` and so on.
- **Trip fare calculator** (Cabs and Tour Packages pages, `assets/js/calculator.js`). The rules are in `FARE_RULES` and `CABS` in `assets/js/data/cabs.js`:
  - **Round trip under 1,000 km** (`packageMinKm`): a **fixed package price** = billed km × the vehicle's `pkgPerKm` + driver allowance, rounded to ₹50. Billed km = the higher of the total km and days × `minKmPerDay`.
  - **Round trip of 1,000 km or more:** **per-km pricing**, shown as an estimated range (`pkgPerKm` to `perKm`). The final per-km rate is confirmed on call.
  - **One-way:** fixed `ROUTES` fare where available; otherwise an estimate of km × `perKm` × `oneWayMultiplier`.
  - `minKmPerDay` (250) and `driverAllowance` (₹300/day) are placeholders. Set them to your real policy, or to 0 to switch them off.
  - **Destinations and distances:** `TRIP_PLACES`.
- **Tour interests:** each package has `interests` (spiritual / fun / nature / heritage / wildlife) for the filter chips, and `for` (Family, Friends, Couples) shown on the card.
- **Hero slideshow:** edit the slides (photo, place name, subtitle) in `index.html`, inside `data-slideshow`. It changes every 5.5 seconds.
- **Gallery photos:** the list at the top of `assets/js/gallery.js`
- **Images:** photos of the places (Mahakaleshwar, Omkareshwar, Rajwada and so on) come from Wikimedia Commons and are listed in `assets/js/data/photos.js`. Their licences require credit, which `credits.html` provides, so keep that page if you keep the photos. A few generic photos (cars and similar) are from Unsplash. To use your own photos, put files in `assets/images/` and set an image to the path (e.g. `"assets/images/ujjain.jpg"`).

## 2. Connect Firebase (save enquiries)

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project**.
2. **Build → Firestore Database → Create database**: choose **Production mode** and location **asia-south1 (Mumbai)**.
3. **Project settings → Your apps → Web (`</>`)**: register an app and copy the `firebaseConfig` values into **`assets/js/firebase-config.js`**.
4. **Firestore → Rules**: paste the contents of **`firebase/firestore.rules`** and click **Publish**. These rules let the website only *create* valid enquiries. Nobody can read or change them from the browser.
5. View enquiries in **Firestore → Data → `enquiries`**. Each one has `status: "new"` and a `createdAt` time.

Until Firebase is configured, forms still work. They just skip saving and go straight to WhatsApp, and the browser console shows a warning.

**Optional extra spam protection:** enable **App Check** with reCAPTCHA v3 in the Firebase console.

## 3. Run locally

Any static server works:

```bash
python3 -m http.server 5500
```

Then open http://localhost:5500.

## 4. Deploy

**Firebase Hosting** (recommended, since you are already on Firebase):

```bash
npm install -g firebase-tools
firebase login
firebase init      # choose Hosting + Firestore, select your project, keep existing files
firebase deploy
```

You can also upload the folder to **Netlify**, **Vercel** or **GitHub Pages**. No build is needed.

## How booking works

- Every **Book** button (services, routes, fleet, the mobile bottom bar) opens a booking pop-up, prefilled with the trip, vehicle and fare (`assets/js/booking.js`).
- The visitor only types a name and phone number, then taps **Confirm on WhatsApp**.

## How the enquiry flow works

1. The visitor fills a form (`assets/js/enquiry.js` validates name, a 10-digit Indian mobile number, date and so on).
2. The enquiry is saved to Firestore (`assets/js/firebase-config.js`). This waits up to 7 seconds; if saving fails, the lead is still sent on.
3. The visitor lands on `thank-you.html`, which opens `wa.me/<your number>` with a formatted message. They tap **Send**.

## Animations

GSAP + ScrollTrigger + Flip and Lenis (smooth scroll) load from a CDN. All motion is in `assets/js/animations.js`:

- page transitions: content softly fades and lifts out and back in, with a thin progress line at the top (no full-screen cover)
- hero word-by-word reveal, Ken Burns zoom and parallax
- scroll reveals, count-up stats, self-drawing route line
- filter animations, magnetic buttons, 3D card tilt and lightbox zoom
- a custom date picker (`assets/js/datepicker.js`): a popover calendar on desktop and a bottom sheet on phones, with Today / Tomorrow / This weekend shortcuts

Animations switch off automatically for visitors who choose **reduced motion** in their device settings. If the CDN fails to load, all content still shows.
