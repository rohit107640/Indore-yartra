/* =========================================================
   SITE CONFIG — edit this file to update business details.
   Everything (header, footer, WhatsApp, call buttons) reads from here.
   ========================================================= */
window.SITE = {
  name: "Indore Yatra",
  fullName: "Indore Yatra Tours & Travels",
  tagline: "Tours & Travels",

  // WhatsApp number: country code + number, digits only (no +, no spaces).
  whatsapp: "919730592488",

  phone: "+91 97305 92488",       // shown on site
  phoneLink: "+919730592488",     // used in tel: links
  email: "hello.indoreyatra@gmail.com",
  address: "242, New Gouri Nagar, Sukhliya, Indore",
  mapQuery: "New Gouri Nagar, Sukhliya, Indore",
  hours: "Mon – Sun · 8:00 AM – 9:00 PM",

  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/"
  }
};

/* Helper: get an image URL at roughly the width needed.
   Accepts a key from assets/js/data/photos.js (e.g. "mahakal"),
   a local path (e.g. "assets/images/ujjain.jpg"), or an Unsplash photo id. */
const IMG_STEPS = [500, 960, 1280, 1920, 3840]; // sizes Wikimedia serves
const DPR = Math.min(2, window.devicePixelRatio || 1);
const fitStep = (want, original) => {
  const ok = IMG_STEPS.filter((s) => !original || s <= original);
  return ok.find((s) => s >= want) || ok[ok.length - 1] || IMG_STEPS[0];
};
window.SITE.img = function (id, w = 1200) {
  if (!id) return "";
  const photo = window.PHOTOS && window.PHOTOS[id];
  if (photo) {
    if (!photo.src.includes("{w}")) return photo.src; // already the original file
    // ask for ~2x the display size on retina screens, never more than the original
    return photo.src.replace("{w}", fitStep(Math.round(w * DPR), photo.w));
  }
  if (id.includes("/") || id.includes(".")) return id;
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${Math.round(w * DPR)}&q=80`;
};

/* srcset for large images (heroes, banners): lets the browser pick the sharpest fit */
window.SITE.srcset = function (id) {
  const photo = window.PHOTOS && window.PHOTOS[id];
  if (!photo || !photo.src.includes("{w}")) return "";
  return IMG_STEPS.filter((s) => s >= 960 && s <= (photo.w || 99999)).map((s) => `${photo.src.replace("{w}", s)} ${s}w`).join(", ");
};
