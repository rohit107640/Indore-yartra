/* =========================================================
   FLEET, SERVICES & ROUTE FARES — edit prices here.
   All prices are placeholders (₹). Change them to your real rates.
   ========================================================= */

/* ---------- Fleet ---------- */
window.CABS = [
  { id: "dzire", pkgPerKm: 10, name: "Swift Dzire", type: "Sedan", seats: 4, bags: 2, image: "car-dzire", perKm: 11, local8h: 1800, airport: 599, note: "Our most booked car" },
  { id: "amaze", pkgPerKm: 10, name: "Honda Amaze", type: "Sedan", seats: 4, bags: 2, image: "car-amaze", perKm: 11, local8h: 1800, airport: 599, note: "Comfortable, with a big boot" },
  { id: "ertiga", pkgPerKm: 12.5, name: "Maruti Ertiga", type: "SUV · 6+1", seats: 6, bags: 3, image: "car-ertiga", perKm: 14, local8h: 2400, airport: 899, note: "Ideal for families of 5–6" },
  { id: "innova", pkgPerKm: 15, name: "Innova Crysta", type: "Premium SUV · 7+1", seats: 7, bags: 4, image: "car-innova", perKm: 17, local8h: 3000, airport: 1199, note: "Extra legroom for long drives" },
  { id: "traveller", pkgPerKm: 22, name: "Force Traveller", type: "Tempo Traveller", seats: 17, bags: 10, image: "car-traveller", perKm: 24, local8h: 4500, airport: 1999, note: "12, 17 & 26 seaters for groups" }
];

/* ---------- Trip fare calculator rules ----------
   perKm (in CABS above)    = normal per-km rate
   pkgPerKm (in CABS above) = discounted package rate, only for long round trips */
window.FARE_RULES = {
  minKmPerDay: 250,            // round trips: at least this many km billed per day
  driverAllowance: 300,        // ₹ per day (driver's food & stay)
  packageMinKm: 1000,          // package rate unlocks for round trips of this many km or more
  oneWayMinKm: 60,             // one-way: minimum km billed
  oneWayMultiplier: 1.4        // one-way per-km = perKm × this (car returns empty). Fixed ROUTES fares are used when available.
};

/* Destinations for the calculator: one-way km from Indore (approx.) */
window.TRIP_PLACES = [
  ["Ujjain", 55], ["Dewas", 40], ["Omkareshwar", 78], ["Maheshwar", 90], ["Mandu", 100], ["Hanuwantiya", 150],
  ["Bhopal", 195], ["Pachmarhi", 330], ["Udaipur", 380], ["Ahmedabad", 400], ["Nashik", 400], ["Shirdi", 420],
  ["Gwalior", 490], ["Jabalpur", 530], ["Mumbai", 590], ["Pune", 590], ["Jaipur", 600], ["Khajuraho", 600],
  ["Kanha", 690], ["Somnath", 800], ["Dwarka", 870], ["Delhi", 810]
];

/* ---------- Services (Home & Cabs pages) ----------
   enquiry: the enquiry type the "Book" button opens with */
window.SERVICES = [
  { id: "indore-tour", title: "Indore City Tour", text: "Rajwada, Lal Bagh, Khajrana, Sarafa & Chappan — full-day sightseeing with a local driver.", from: "₹1,299", unit: "/ day", image: "rajwada", enquiry: "Tour Package", item: "Indore Heritage & Food Tour" },
  { id: "ujjain-tour", title: "Ujjain Tour", text: "Mahakaleshwar, Mahakal Lok, Kal Bhairav, Harsiddhi and Ram Ghat aarti — same-day return.", from: "₹2,499", unit: "/ car", image: "mahakal-day", enquiry: "Tour Package", item: "Ujjain Mahakal Darshan" },
  { id: "omkareshwar-tour", title: "Omkareshwar Tour", text: "Jyotirlinga darshan, Narmada boat ride and Maheshwar ghats on the way back.", from: "₹2,999", unit: "/ car", image: "omkareshwar", enquiry: "Tour Package", item: "Omkareshwar & Maheshwar Day Trip" },
  { id: "one-way", title: "One-way Taxi", text: "Pay for one side only — Ujjain, Bhopal, Ahmedabad, Mumbai, Pune and more.", from: "₹999", unit: "onwards", image: "car-dzire", enquiry: "One-way Taxi" },
  { id: "airport", title: "Airport Pickup & Drop", text: "On-time transfers to Devi Ahilya Bai Holkar Airport — flight tracking, no waiting charges for delays.", from: "₹599", unit: "/ trip", image: "airport", enquiry: "Airport Transfer" },
  { id: "outstation", title: "Outstation Round Trip", text: "Multi-day trips across MP and nearby states with the same car and driver throughout.", from: "₹11", unit: "/ km", image: "car-innova", enquiry: "Cab Booking" },
  { id: "group", title: "Tempo Traveller for Groups", text: "12, 17 and 26-seater Force Travellers for family yatras, weddings and office trips.", from: "₹24", unit: "/ km", image: "car-traveller", enquiry: "Cab Booking", item: "Force Traveller" },
  { id: "railway", title: "Railway Station Pickup & Drop", text: "Indore Junction, Laxmibai Nagar and Ujjain station transfers, with train tracking and help with luggage.", from: "₹449", unit: "/ trip", image: "car-amaze", enquiry: "Airport Transfer", item: "Swift Dzire" },
  { id: "bhasma-aarti", title: "Bhasma Aarti Early Pickup", text: "2–3 AM pickups from Indore for Mahakal's Bhasma Aarti, with the driver waiting until you're done.", from: "₹2,199", unit: "/ car", image: "mahakal-shikhar", enquiry: "Tour Package", item: "Ujjain Mahakal Darshan" },
  { id: "weekend-getaways", title: "Weekend Getaways with Friends", text: "Hanuwantiya water sports, Choral camping, Pachmarhi and Mandu: cab, stay and plan sorted.", from: "₹2,499", unit: "/ person", image: "jetski", enquiry: "Tour Package", item: "Hanuwantiya Jal Mahotsav — Water Sports & Tent Stay" },
  { id: "wedding", title: "Wedding & Event Cars", text: "Decorated cars for the groom, Innovas and Force Travellers for baraat and guest pickups.", from: "₹3,000", unit: "/ day", image: "car-innova", enquiry: "General", item: "Wedding / event transport" },
  { id: "corporate", title: "Corporate & Monthly Rental", text: "Cars with drivers for offices, guests and site visits. GST invoices, monthly billing.", from: "On", unit: "request", image: "car-dzire", enquiry: "General", item: "Corporate travel" },
  { id: "pilgrimage", title: "Pilgrimage Tours", text: "Jyotirlinga circuits, Shirdi–Shani Shingnapur, Somnath–Dwarka: elder-friendly plans with darshan timings.", from: "₹4,999", unit: "/ trip", image: "trimbakeshwar", enquiry: "Tour Package", item: "MP Jyotirlinga & Shakti Peeth Yatra" },
  { id: "hourly", title: "Local Hourly Rental", text: "8 hrs / 80 km packages for shopping, family functions and meetings around Indore.", from: "₹1,800", unit: "/ 8 hrs", image: "sarafa", enquiry: "Cab Booking" }
];

/* ---------- Popular routes: fixed one-way fares from Indore ----------
   fares: [Sedan, Ertiga, Innova Crysta, Force Traveller] */
window.FARE_VEHICLES = ["Swift Dzire", "Maruti Ertiga", "Innova Crysta", "Force Traveller"];
window.ROUTES = [
  { to: "Ujjain", km: 55, time: "1 hr 30 min", fares: [1299, 1699, 2199, 3499], image: "mahakal-shikhar" },
  { to: "Omkareshwar", km: 78, time: "2 hr 15 min", fares: [1599, 1999, 2599, 3999], image: "omkareshwar-ghat" },
  { to: "Maheshwar", km: 90, time: "2 hr 30 min", fares: [1699, 2199, 2799, 4299], image: "maheshwar-fort" },
  { to: "Mandu", km: 100, time: "2 hr 45 min", fares: [1799, 2299, 2999, 4499], image: "mandu" },
  { to: "Dewas", km: 40, time: "1 hr", fares: [999, 1299, 1699, 2999], image: "dewas" },
  { to: "Bhopal", km: 195, time: "4 hr", fares: [2999, 3799, 4799, 7499], image: "bhopal" },
  { to: "Ahmedabad", km: 400, time: "8 hr", fares: [5999, 7499, 9499, 13999] },
  { to: "Mumbai", km: 590, time: "11 hr", fares: [8499, 10499, 12999, 18999] },
  { to: "Shirdi", km: 420, time: "8 hr", fares: [6299, 7799, 9799, 14499], image: "trimbakeshwar" },
  { to: "Indore Airport", km: 10, time: "Any city pickup", fares: [599, 799, 999, 1999], image: "airport" }
];

/* Kept for older pages: short service cards */
window.CAB_SERVICES = [
  { icon: "city", title: "Local City Rides", text: "8 hrs / 80 km packages for sightseeing, shopping and family visits within Indore." },
  { icon: "route", title: "One-way & Outstation", text: "One-way drops and round trips to Ujjain, Omkareshwar, Bhopal, Ahmedabad, Mumbai and beyond." },
  { icon: "plane", title: "Airport & Railway", text: "On-time pickups and drops at Devi Ahilya Bai Holkar Airport and Indore Junction." },
  { icon: "users", title: "Weddings & Groups", text: "Force Travellers and multiple cars for weddings, corporate events and group yatras." }
];
