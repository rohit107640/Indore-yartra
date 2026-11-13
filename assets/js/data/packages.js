/* =========================================================
   TOUR PACKAGES — add / edit packages here.
   category: "indore" | "mp" | "nearby"
   image: key from assets/js/data/photos.js, a local path, or an Unsplash id
   featured: true -> shown on the home page
   interests: spiritual | fun | nature | heritage | wildlife  (used by the filters)
   for: who the trip suits (Family, Friends, Couples)
   tag: the label shown on the card (Darshan, Nature, Heritage, Wildlife...)
   Prices are placeholders (₹ per person).
   ========================================================= */
window.CATEGORIES = {
  indore: { label: "Indore & Around", short: "Indore" },
  mp: { label: "Madhya Pradesh", short: "MP" },
  nearby: { label: "Nearby States", short: "Nearby" }
};

window.PACKAGES = [
  /* ---------------- INDORE & AROUND ---------------- */
  {
    id: "indore-temple-darshan",
    interests: ["spiritual"],
    for: ["Family"],
    tag: "Darshan",
    category: "indore",
    title: "Indore Temple Darshan",
    days: "1 Day",
    price: 1299,
    image: "khajrana",
    summary: "Seek blessings at Indore's most loved temples — Khajrana Ganesh, Bada Ganpati, Annapurna and Bijasan Mata — in one comfortable day.",
    highlights: ["Khajrana Ganesh Mandir", "Bada Ganpati", "Annapurna Temple", "Bijasan Mata Tekri", "Kanch Mandir"],
    itinerary: [
      { title: "Morning — Ganesh darshan", text: "Pickup from your home or hotel. Darshan at Khajrana Ganesh Mandir and Bada Ganpati (one of the largest Ganesh idols in the world)." },
      { title: "Afternoon — Devi temples", text: "Annapurna Temple, Kanch Mandir (the glass temple) and lunch at a local favourite." },
      { title: "Evening — Bijasan Tekri", text: "Bijasan Mata temple on the hill at sunset, then drop back home." }
    ],
    inclusions: ["AC cab for the day", "Driver allowance & fuel", "Parking", "Darshan guidance"],
    exclusions: ["Meals", "Prasad & offerings", "Personal expenses"]
  },
  {
    id: "indore-city-tour",
    featured: true,
    interests: ["fun", "heritage"],
    for: ["Friends", "Family", "Couples"],
    tag: "Sightseeing",
    category: "indore",
    title: "Indore Heritage & Food Tour",
    days: "1 Day",
    price: 1499,
    image: "rajwada",
    summary: "Holkar history at Rajwada and Lal Bagh Palace, Krishnapura Chhatris, and a night food walk at Sarafa and Chappan Dukan.",
    highlights: ["Rajwada Palace", "Lal Bagh Palace", "Krishnapura Chhatris", "Sarafa night food walk"],
    itinerary: [
      { title: "Morning — Royal Indore", text: "Rajwada, statue of Devi Ahilyabai Holkar, Krishnapura Chhatris and the old city markets." },
      { title: "Afternoon — Palaces", text: "Lal Bagh Palace and the Central Museum. Lunch break." },
      { title: "Evening — Food trail", text: "Chappan Dukan and Sarafa Bazaar night food walk — poha, garadu, bhutte ka kees and more." }
    ],
    inclusions: ["AC cab for the day", "Driver allowance & fuel", "Parking", "Local guide"],
    exclusions: ["Meals", "Entry tickets"]
  },
  {
    id: "patalpani-tincha-falls",
    interests: ["nature", "fun"],
    for: ["Friends", "Family", "Couples"],
    tag: "Nature",
    category: "indore",
    title: "Patalpani & Tincha Falls Day Trip",
    days: "1 Day",
    price: 1999,
    image: "patalpani",
    summary: "Monsoon waterfalls, green valleys and Janapav hills — the perfect weekend escape, less than an hour from Indore.",
    highlights: ["Patalpani Waterfall", "Tincha Falls", "Janapav Kuti", "Choral Dam"],
    itinerary: [
      { title: "Morning", text: "Early pickup from Indore, drive to Patalpani waterfall and viewpoint." },
      { title: "Afternoon", text: "Tincha Falls and lunch break near Choral Dam." },
      { title: "Evening", text: "Sunset at Janapav hills and return to Indore." }
    ],
    inclusions: ["AC cab", "Fuel & driver", "Parking & tolls"],
    exclusions: ["Meals", "Entry tickets"]
  },
  {
    id: "dewas-tekri",
    interests: ["spiritual"],
    for: ["Family"],
    tag: "Darshan",
    category: "indore",
    title: "Dewas Mata Tekri Darshan",
    days: "Half Day",
    price: 999,
    image: "dewas",
    summary: "Quick darshan of Maa Chamunda and Maa Tulja Bhavani on Dewas Tekri, just 40 km from Indore, with ropeway option.",
    highlights: ["Maa Chamunda Devi", "Maa Tulja Bhavani", "Ropeway to the hilltop", "City view from Tekri"],
    itinerary: [
      { title: "Darshan", text: "Pickup from Indore, drive to Dewas, ropeway or steps to the Tekri, darshan of both Devis, return by afternoon." }
    ],
    inclusions: ["AC cab", "Fuel & driver", "Parking"],
    exclusions: ["Ropeway tickets", "Meals"]
  },

  {
    id: "choral-camping",
    featured: true,
    interests: ["fun", "nature"],
    for: ["Friends", "Couples"],
    tag: "Camping",
    category: "indore",
    title: "Choral Dam Camping & Kayaking",
    days: "1 Night",
    price: 2499,
    image: "kayaking",
    summary: "Lakeside tents, kayaking, a barbecue and a bonfire under the stars, just 45 km from Indore. A perfect friends' getaway.",
    highlights: ["Kayaking", "Lakeside tents", "Bonfire & music", "BBQ dinner", "Sunrise trek"],
    itinerary: [
      { title: "Evening", text: "Pickup from Indore, reach Choral by 4 PM. Kayaking, games and sunset by the lake. Bonfire, BBQ dinner and music night." },
      { title: "Morning", text: "Sunrise trek to the viewpoint, breakfast, return to Indore by noon." }
    ],
    inclusions: ["AC cab both ways", "Tent stay", "Dinner & breakfast", "Kayaking session"],
    exclusions: ["Personal expenses", "Extra activities"]
  },
  {
    id: "indore-food-night",
    interests: ["fun"],
    for: ["Friends", "Family", "Couples"],
    tag: "Food walk",
    category: "indore",
    title: "Indore Night Food Crawl",
    days: "Evening",
    price: 999,
    image: "poha",
    summary: "India's cleanest city is also its street-food capital. Chappan Dukan, then Sarafa after 10 PM: poha-jalebi, garadu, bhutte ka kees, malpua and more.",
    highlights: ["Chappan Dukan", "Sarafa night market", "10+ tastings", "Local food guide"],
    itinerary: [
      { title: "8 PM — Chappan Dukan", text: "Pickup and the first round of snacks at Chappan: Johny hot dogs, khopra patties, shikanji." },
      { title: "10 PM — Sarafa", text: "The jewellery market turns into a food street: garadu, bhutte ka kees, malpua, rabdi. Drop back by midnight." }
    ],
    inclusions: ["AC cab for the evening", "Food guide", "Tasting budget per person"],
    exclusions: ["Extra orders"]
  },

  /* ---------------- MADHYA PRADESH ---------------- */
  {
    id: "ujjain-mahakal-darshan",
    interests: ["spiritual"],
    for: ["Family", "Friends"],
    tag: "Darshan",
    category: "mp",
    title: "Ujjain Mahakal Darshan",
    days: "1 Day",
    price: 2499,
    image: "mahakal",
    summary: "Mahakaleshwar Jyotirlinga, Mahakal Lok corridor, Kal Bhairav and the evening aarti at Ram Ghat on the Shipra — a full day in Ujjain.",
    highlights: ["Mahakaleshwar Jyotirlinga", "Shri Mahakal Lok", "Kal Bhairav Temple", "Harsiddhi Shakti Peeth", "Ram Ghat aarti"],
    itinerary: [
      { title: "Morning — Mahakal", text: "Early pickup from Indore (1.5 hrs). Mahakaleshwar darshan and a walk through Shri Mahakal Lok." },
      { title: "Afternoon — Temple circuit", text: "Kal Bhairav, Harsiddhi Mata, Mangalnath, Sandipani Ashram and Gadkalika." },
      { title: "Evening — Shipra aarti", text: "Ram Ghat aarti on the Shipra river, then return to Indore." }
    ],
    inclusions: ["AC cab Indore–Ujjain–Indore", "Driver allowance, tolls & parking", "Darshan guidance & timings"],
    exclusions: ["Bhasma Aarti / quick darshan tickets", "Meals", "Puja expenses"]
  },
  {
    id: "ujjain-omkareshwar",
    featured: true,
    interests: ["spiritual"],
    for: ["Family"],
    tag: "Darshan",
    category: "mp",
    title: "Ujjain & Omkareshwar — Two Jyotirlinga Yatra",
    days: "2 Days / 1 Night",
    price: 4999,
    image: "omkareshwar",
    summary: "Two Jyotirlinga darshan in one trip — Mahakaleshwar in Ujjain and Omkareshwar–Mamleshwar on the sacred Narmada.",
    highlights: ["Mahakaleshwar Jyotirlinga", "Shri Mahakal Lok", "Omkareshwar & Mamleshwar", "Narmada boat ride", "Ram Ghat aarti"],
    itinerary: [
      { title: "Day 1 — Ujjain", text: "Pickup from Indore. Mahakaleshwar darshan, Mahakal Lok, Harsiddhi, Kal Bhairav and Ram Ghat aarti. Night stay in Ujjain." },
      { title: "Day 2 — Omkareshwar", text: "Drive to Omkareshwar. Darshan at Omkareshwar & Mamleshwar, boat ride on the Narmada, parikrama (optional), return to Indore." }
    ],
    inclusions: ["AC cab for 2 days", "1 night hotel near Mahakal", "Breakfast", "Driver allowance, tolls & parking"],
    exclusions: ["Bhasma Aarti / VIP darshan tickets", "Lunch & dinner", "Boat charges"]
  },
  {
    id: "omkareshwar-maheshwar",
    interests: ["spiritual", "heritage"],
    for: ["Family", "Couples"],
    tag: "Darshan + Heritage",
    category: "mp",
    title: "Omkareshwar & Maheshwar Day Trip",
    days: "1 Day",
    price: 2999,
    image: "omkareshwar-ghat",
    summary: "Jyotirlinga darshan at Omkareshwar, then the calm ghats and fort of Devi Ahilyabai Holkar at Maheshwar on the Narmada.",
    highlights: ["Omkareshwar Jyotirlinga", "Mamleshwar Temple", "Maheshwar ghats & Ahilya Fort", "Narmada boat ride", "Maheshwari saree weavers"],
    itinerary: [
      { title: "Morning — Omkareshwar", text: "Early drive from Indore (2.5 hrs). Darshan at Omkareshwar and Mamleshwar, boat ride on the Narmada." },
      { title: "Afternoon — Maheshwar", text: "Drive to Maheshwar. Ahilya Fort, Rajwada, the ghats and a visit to the handloom weavers." },
      { title: "Evening", text: "Narmada aarti at Maheshwar ghat (seasonal) and return to Indore." }
    ],
    inclusions: ["AC cab for the day", "Fuel, tolls & parking", "Driver allowance"],
    exclusions: ["Boat charges", "Meals", "Darshan tickets"]
  },
  {
    id: "mp-jyotirlinga-shaktipeeth",
    interests: ["spiritual"],
    for: ["Family"],
    tag: "Pilgrimage",
    category: "mp",
    title: "MP Jyotirlinga & Shakti Peeth Yatra",
    days: "4 Days / 3 Nights",
    price: 11999,
    image: "mahakal-day",
    summary: "The complete Malwa pilgrimage: Mahakaleshwar, Omkareshwar, Harsiddhi, Dewas Tekri, Nalkheda Baglamukhi and Maheshwar.",
    highlights: ["2 Jyotirlingas", "Harsiddhi Shakti Peeth", "Baglamukhi Mata, Nalkheda", "Dewas Tekri", "Maheshwar ghats"],
    itinerary: [
      { title: "Day 1 — Ujjain", text: "Indore → Ujjain. Mahakaleshwar darshan, Mahakal Lok, Harsiddhi, Ram Ghat aarti. Night in Ujjain." },
      { title: "Day 2 — Ujjain & Nalkheda", text: "Bhasma Aarti (if booked), Kal Bhairav, Mangalnath. Afternoon drive to Nalkheda for Maa Baglamukhi darshan. Night in Ujjain." },
      { title: "Day 3 — Dewas & Omkareshwar", text: "Dewas Tekri darshan en route to Omkareshwar. Evening Narmada aarti. Night in Omkareshwar." },
      { title: "Day 4 — Omkareshwar & Maheshwar", text: "Morning Jyotirlinga darshan and Mamleshwar. Maheshwar ghats and fort, return to Indore." }
    ],
    inclusions: ["AC cab for 4 days", "3 nights hotel", "Breakfast", "Driver allowance, tolls & parking", "Darshan planning"],
    exclusions: ["Bhasma Aarti / VIP tickets", "Lunch & dinner", "Boat rides & puja"]
  },
  {
    id: "mandu-heritage",
    interests: ["heritage", "fun"],
    for: ["Friends", "Couples", "Family"],
    tag: "Heritage",
    category: "mp",
    title: "Mandu — City of Joy",
    days: "1 Day",
    price: 3499,
    image: "mandu",
    summary: "Afghan palaces, the love story of Rani Roopmati and Baz Bahadur, and views over the Nimar plains — 100 km from Indore.",
    highlights: ["Jahaz Mahal", "Hindola Mahal", "Rani Roopmati Pavilion", "Jami Masjid & Hoshang Shah's Tomb"],
    itinerary: [
      { title: "Morning", text: "Drive Indore → Mandu. Jahaz Mahal, Hindola Mahal and the royal enclave." },
      { title: "Afternoon", text: "Jami Masjid, Hoshang Shah's Tomb (inspiration for the Taj Mahal), Ram Mandir." },
      { title: "Evening", text: "Sunset at Roopmati Pavilion and Baz Bahadur's Palace, return to Indore." }
    ],
    inclusions: ["AC cab", "Tolls & parking", "Driver allowance"],
    exclusions: ["Entry tickets", "Meals", "Guide fees"]
  },
  {
    id: "bhopal-sanchi",
    interests: ["heritage", "nature"],
    for: ["Family", "Friends"],
    tag: "Heritage",
    category: "mp",
    title: "Bhopal, Sanchi & Bhojpur",
    days: "2 Days / 1 Night",
    price: 6499,
    image: "sanchi",
    summary: "The City of Lakes, the UNESCO-listed Sanchi Stupa, the giant Shivling at Bhojpur and the rock shelters of Bhimbetka.",
    highlights: ["Upper Lake, Bhopal", "Sanchi Stupa (UNESCO)", "Bhojeshwar Shiv Temple", "Bhimbetka rock shelters"],
    itinerary: [
      { title: "Day 1 — Bhopal", text: "Indore → Bhopal (3.5 hrs). Bhojpur temple and Bhimbetka on the way. Evening at Upper Lake. Night in Bhopal." },
      { title: "Day 2 — Sanchi", text: "Drive to Sanchi for the stupas and museum, then return to Indore." }
    ],
    inclusions: ["AC cab", "1 night hotel", "Breakfast", "Tolls & parking"],
    exclusions: ["Entry tickets", "Lunch & dinner"]
  },
  {
    id: "pachmarhi",
    featured: true,
    interests: ["nature", "fun"],
    for: ["Friends", "Family", "Couples"],
    tag: "Hill station",
    category: "mp",
    title: "Pachmarhi Adventure Weekend",
    days: "3 Days / 2 Nights",
    price: 9999,
    image: "beefalls",
    summary: "MP's only hill station with friends or family: open-jeep safaris, swims under Bee Falls, cave treks, Jata Shankar and sunset at Dhoopgarh.",
    highlights: ["Open-jeep safari", "Bee Falls swim", "Cave treks", "Dhoopgarh sunset", "Jata Shankar"],
    itinerary: [
      { title: "Day 1", text: "Drive Indore → Pachmarhi. Evening at the lake. Night stay." },
      { title: "Day 2", text: "Gypsy safari: Bee Falls, Jata Shankar, Pandav Caves, Dhoopgarh sunset." },
      { title: "Day 3", text: "Chauragarh Mahadev view (optional) and return to Indore." }
    ],
    inclusions: ["AC cab", "2 nights hotel", "Breakfast", "Driver allowance"],
    exclusions: ["Gypsy safari charges", "Lunch & dinner", "Entry tickets"]
  },
  {
    id: "khajuraho-orchha",
    interests: ["heritage"],
    for: ["Couples", "Family"],
    tag: "Heritage",
    category: "mp",
    title: "Khajuraho & Orchha Temples",
    days: "4 Days / 3 Nights",
    price: 14999,
    image: "khajuraho",
    summary: "UNESCO-listed Khajuraho temples, the medieval town of Orchha and Ram Raja Temple, where Shri Ram is worshipped as king.",
    highlights: ["Western Group of Temples", "Light & Sound show", "Orchha Fort", "Ram Raja Temple"],
    itinerary: [
      { title: "Day 1", text: "Train / drive to Khajuraho. Evening Light & Sound show." },
      { title: "Day 2", text: "Western & Eastern temple groups with a guide." },
      { title: "Day 3", text: "Drive to Orchha. Orchha Fort, Jahangir Mahal, Betwa river chhatris." },
      { title: "Day 4", text: "Ram Raja Temple darshan and return journey." }
    ],
    inclusions: ["AC cab", "3 nights hotel", "Breakfast", "Tolls & parking"],
    exclusions: ["Train tickets", "Entry tickets", "Lunch & dinner"]
  },
  {
    id: "bandhavgarh-safari",
    interests: ["wildlife", "fun"],
    for: ["Friends", "Family"],
    tag: "Wildlife",
    category: "mp",
    title: "Bandhavgarh Tiger Safari",
    days: "3 Days / 2 Nights",
    price: 15999,
    image: "tiger",
    summary: "The tiger state's best-known reserve — jungle safaris, a forest lodge stay and the ancient Bandhavgarh fort.",
    highlights: ["2 jeep safaris", "Forest resort stay", "Bird watching", "Village walk"],
    itinerary: [
      { title: "Day 1", text: "Arrive Bandhavgarh (via Jabalpur / Katni). Check in to the jungle resort." },
      { title: "Day 2", text: "Morning and evening jeep safaris in the core zones." },
      { title: "Day 3", text: "Village walk and departure." }
    ],
    inclusions: ["2 nights resort", "All meals", "2 jeep safaris (subject to permit)", "Station transfers"],
    exclusions: ["Train tickets", "Camera fees", "Personal expenses"]
  },

  {
    id: "omkareshwar-hanuwantiya",
    featured: true,
    interests: ["spiritual", "fun"],
    for: ["Family", "Friends"],
    tag: "Darshan + Fun",
    category: "mp",
    title: "Omkareshwar Darshan + Hanuwantiya Fun",
    days: "2 Days / 1 Night",
    price: 8999,
    image: "tentcity",
    summary: "The best of both: morning Jyotirlinga darshan at Omkareshwar, then jet skis, parasailing and a tent-city night at Hanuwantiya.",
    highlights: ["Omkareshwar Jyotirlinga", "Narmada boat ride", "Jet ski & parasailing", "Tent city stay", "Bonfire night"],
    itinerary: [
      { title: "Day 1", text: "Indore → Omkareshwar darshan and boat ride. Afternoon drive to Hanuwantiya, water sports and cultural night." },
      { title: "Day 2", text: "Hot-air balloon (optional), island cruise, return to Indore." }
    ],
    inclusions: ["AC cab", "Tent stay", "Breakfast & dinner"],
    exclusions: ["Water sports", "Darshan tickets", "Lunch"]
  },
  {
    id: "monsoon-waterfall-trail",
    interests: ["nature", "fun"],
    for: ["Friends", "Couples", "Family"],
    tag: "Monsoon special",
    category: "mp",
    title: "Monsoon Trail — Mandu, Patalpani & Tincha",
    days: "1 Day",
    price: 2999,
    image: "mandu-monsoon",
    summary: "When the rains arrive, Malwa turns green. Waterfalls at Patalpani and Tincha, then misty Mandu with its clouds and ruins.",
    highlights: ["Patalpani Falls", "Tincha Falls", "Mandu in the clouds", "Roadside bhutta & chai"],
    itinerary: [
      { title: "Morning", text: "Early start, Patalpani and Tincha falls." },
      { title: "Afternoon", text: "Drive to Mandu: Roopmati Pavilion and Jahaz Mahal in the mist." },
      { title: "Evening", text: "Return to Indore." }
    ],
    inclusions: ["AC cab", "Fuel, tolls & parking"],
    exclusions: ["Meals", "Entry tickets"]
  },

  /* ---------------- MORE MP TOURISM ---------------- */
  {
    id: "hanuwantiya-jal-mahotsav",
    featured: true,
    interests: ["fun"],
    for: ["Friends", "Family", "Couples"],
    tag: "Adventure",
    category: "mp",
    title: "Hanuwantiya Jal Mahotsav — Water Sports & Tent Stay",
    days: "2 Days / 1 Night",
    price: 7999,
    image: "jetski",
    summary: "Tent city on the Indira Sagar backwaters: hot-air balloons, parasailing, jet skis, island cruises and starry-night bonfires.",
    highlights: ["Jet ski & speed boat", "Parasailing", "Hot-air balloon", "Luxury tent stay", "Bonfire & music night"],
    itinerary: [
      { title: "Day 1", text: "Indore → Hanuwantiya (3.5 hrs). Check in to the tent city, water sports and evening cultural programme." },
      { title: "Day 2", text: "Sunrise balloon ride (optional), island cruise, return to Indore." }
    ],
    inclusions: ["AC cab", "Tent stay (seasonal, Nov–Feb)", "Breakfast & dinner"],
    exclusions: ["Adventure activities", "Lunch"]
  },
  {
    id: "jabalpur-bhedaghat",
    interests: ["nature", "fun"],
    for: ["Friends", "Family", "Couples"],
    tag: "Nature",
    category: "mp",
    title: "Jabalpur Bhedaghat & Dhuandhar Falls",
    days: "3 Days / 2 Nights",
    price: 10999,
    image: "bhedaghat-boat",
    summary: "Boat ride through the glowing Marble Rocks on the Narmada, the roaring Dhuandhar Falls and a ropeway over the gorge.",
    highlights: ["Marble Rocks boat ride", "Dhuandhar Falls", "Ropeway", "Chausath Yogini Temple"],
    itinerary: [
      { title: "Day 1", text: "Indore → Jabalpur by train or cab. Evening at leisure." },
      { title: "Day 2", text: "Bhedaghat: Marble Rocks boat ride, Dhuandhar Falls, ropeway, Chausath Yogini. Moonlit boat ride (seasonal)." },
      { title: "Day 3", text: "Madan Mahal Fort and return." }
    ],
    inclusions: ["2 nights hotel", "Breakfast", "AC cab in Jabalpur"],
    exclusions: ["Train tickets", "Boat & ropeway tickets", "Lunch & dinner"]
  },
  {
    id: "gwalior-heritage",
    interests: ["heritage"],
    for: ["Family", "Couples"],
    tag: "Heritage",
    category: "mp",
    title: "Gwalior Fort & Palaces",
    days: "3 Days / 2 Nights",
    price: 11499,
    image: "gwalior",
    summary: "The 'pearl among fortresses': Gwalior Fort, Man Singh Palace, Jai Vilas Palace and the Light & Sound show.",
    highlights: ["Gwalior Fort", "Man Singh Palace", "Jai Vilas Palace", "Saas-Bahu temples"],
    itinerary: [
      { title: "Day 1", text: "Train to Gwalior. Evening Light & Sound show at the fort." },
      { title: "Day 2", text: "Gwalior Fort, Saas-Bahu temples, Jai Vilas Palace museum, Tansen's tomb." },
      { title: "Day 3", text: "Optional Orchha day visit and return." }
    ],
    inclusions: ["2 nights hotel", "Breakfast", "Local AC cab"],
    exclusions: ["Train tickets", "Entry tickets", "Lunch & dinner"]
  },
  {
    id: "kanha-safari",
    interests: ["wildlife", "fun"],
    for: ["Friends", "Family"],
    tag: "Wildlife",
    category: "mp",
    title: "Kanha Jungle Safari",
    days: "3 Days / 2 Nights",
    price: 16499,
    image: "kanha",
    summary: "The land of The Jungle Book — sal forests, meadows full of barasingha and sambar, and a real chance to spot tigers.",
    highlights: ["2 jeep safaris", "Barasingha meadows", "Jungle resort", "Birding walk"],
    itinerary: [
      { title: "Day 1", text: "Arrive Kanha (via Jabalpur). Check in to the resort." },
      { title: "Day 2", text: "Morning and evening safaris in the core zone." },
      { title: "Day 3", text: "Birding walk and departure." }
    ],
    inclusions: ["2 nights resort", "All meals", "2 jeep safaris (subject to permit)", "Jabalpur transfers"],
    exclusions: ["Train tickets", "Camera fees"]
  },
  {
    id: "tincha-kajligarh",
    interests: ["nature", "fun"],
    for: ["Friends", "Couples"],
    tag: "Nature",
    category: "indore",
    title: "Tincha Falls & Kajligarh Fort",
    days: "Half Day",
    price: 1299,
    image: "tincha",
    summary: "A quick escape from the city: Tincha waterfall's gorge, the ruins of Kajligarh fort and a sunset viewpoint.",
    highlights: ["Tincha Falls", "Kajligarh Fort", "Sunset viewpoint", "Roadside bhutte & chai"],
    itinerary: [
      { title: "Afternoon", text: "Pickup from Indore, drive to Tincha Falls (25 km), then Kajligarh Fort for sunset and return." }
    ],
    inclusions: ["AC cab", "Fuel & driver", "Parking"],
    exclusions: ["Meals", "Entry tickets"]
  },

  /* ---------------- NEARBY STATES ---------------- */
  {
    id: "shirdi-trimbakeshwar",
    interests: ["spiritual"],
    for: ["Family"],
    tag: "Pilgrimage",
    category: "nearby",
    title: "Shirdi, Shani Shingnapur & Trimbakeshwar",
    days: "3 Days / 2 Nights",
    price: 10999,
    image: "trimbakeshwar",
    summary: "Sai Baba's Shirdi, Shani Dev at Shingnapur and the Trimbakeshwar Jyotirlinga near Nashik — by road from Indore.",
    highlights: ["Shirdi Sai Baba Samadhi", "Shani Shingnapur", "Trimbakeshwar Jyotirlinga", "Panchavati, Nashik"],
    itinerary: [
      { title: "Day 1 — Shirdi", text: "Early start from Indore (7 hrs). Evening aarti at Sai Baba Samadhi Mandir. Night in Shirdi." },
      { title: "Day 2 — Shingnapur & Nashik", text: "Shani Shingnapur darshan, then drive to Nashik: Panchavati, Kalaram Mandir, Ramkund. Night in Nashik." },
      { title: "Day 3 — Trimbakeshwar", text: "Trimbakeshwar Jyotirlinga darshan and return to Indore." }
    ],
    inclusions: ["AC cab from Indore", "2 nights hotel", "Breakfast", "Tolls, parking & state permit"],
    exclusions: ["Darshan / aarti passes", "Lunch & dinner", "Puja expenses"]
  },
  {
    id: "grishneshwar-ellora",
    interests: ["spiritual", "heritage"],
    for: ["Family", "Friends"],
    tag: "Heritage",
    category: "nearby",
    title: "Grishneshwar Jyotirlinga & Ellora Caves",
    days: "2 Days / 1 Night",
    price: 8499,
    image: "ellora",
    summary: "The 12th Jyotirlinga at Grishneshwar beside the rock-cut wonder of the Kailasa temple at Ellora.",
    highlights: ["Grishneshwar Jyotirlinga", "Ellora Caves (Kailasa Temple)", "Daulatabad Fort", "Bibi Ka Maqbara"],
    itinerary: [
      { title: "Day 1", text: "Indore → Aurangabad (Chhatrapati Sambhajinagar). Bibi Ka Maqbara in the evening. Night stay." },
      { title: "Day 2", text: "Grishneshwar darshan, Ellora Caves and Daulatabad Fort, return to Indore." }
    ],
    inclusions: ["AC cab from Indore", "1 night hotel", "Breakfast", "Tolls & permit"],
    exclusions: ["Entry tickets", "Lunch & dinner"]
  },
  {
    id: "somnath-dwarka",
    interests: ["spiritual"],
    for: ["Family"],
    tag: "Pilgrimage",
    category: "nearby",
    title: "Somnath & Dwarka Yatra",
    days: "6 Days / 5 Nights",
    price: 21999,
    image: "somnath",
    summary: "The first Jyotirlinga at Somnath, Nageshwar Jyotirlinga, Dwarkadhish and Bet Dwarka — Gujarat's sacred coast.",
    highlights: ["Somnath Jyotirlinga", "Dwarkadhish Temple", "Nageshwar Jyotirlinga", "Bet Dwarka", "Somnath Light & Sound"],
    itinerary: [
      { title: "Day 1", text: "Indore → Ahmedabad / Rajkot by train or road." },
      { title: "Day 2 — Somnath", text: "Drive to Somnath. Evening aarti and Light & Sound show." },
      { title: "Day 3 — Somnath", text: "Morning darshan, Bhalka Tirth, Triveni Sangam. Drive to Dwarka." },
      { title: "Day 4 — Dwarka", text: "Dwarkadhish darshan, Nageshwar Jyotirlinga, Rukmini temple, Bet Dwarka." },
      { title: "Day 5", text: "Morning aarti at Dwarkadhish, drive back towards Ahmedabad." },
      { title: "Day 6", text: "Return to Indore." }
    ],
    inclusions: ["5 nights hotel", "Breakfast", "AC cab in Gujarat", "Driver allowance"],
    exclusions: ["Train tickets", "Boat to Bet Dwarka", "Lunch & dinner"]
  },
  {
    id: "nathdwara-udaipur",
    interests: ["spiritual", "heritage"],
    for: ["Family", "Couples"],
    tag: "Lakes & palaces",
    category: "nearby",
    title: "Nathdwara, Eklingji & Udaipur",
    days: "3 Days / 2 Nights",
    price: 11999,
    image: "1599661046289-e31897846e41",
    summary: "Shrinathji darshan at Nathdwara, Eklingji Mahadev, and the lakes and palaces of Udaipur — a short drive into Rajasthan.",
    highlights: ["Shrinathji Temple", "Eklingji Temple", "City Palace, Udaipur", "Lake Pichola boat ride"],
    itinerary: [
      { title: "Day 1", text: "Indore → Udaipur (via Chittorgarh). Evening at Fateh Sagar. Night in Udaipur." },
      { title: "Day 2", text: "Nathdwara Shrinathji darshan and Eklingji. Evening Lake Pichola boat ride." },
      { title: "Day 3", text: "City Palace and Saheliyon ki Bari, return to Indore." }
    ],
    inclusions: ["AC cab from Indore", "2 nights hotel", "Breakfast", "Tolls & permit"],
    exclusions: ["Entry tickets", "Boat rides", "Lunch & dinner"]
  }
];
