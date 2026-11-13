/* =========================================================
   FIREBASE — paste your Web app config below.
   Firebase Console → Project settings → Your apps → Web app → Config.
   Until it's filled in, enquiries still go to WhatsApp; they just
   aren't saved to the database.
   ========================================================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export const isConfigured = !String(firebaseConfig.apiKey).startsWith("YOUR_");

let db = null;
if (isConfigured) {
  db = getFirestore(initializeApp(firebaseConfig));
}

/** Save one enquiry to the "enquiries" collection. Returns the new document id. */
export async function saveEnquiry(data) {
  if (!db) throw new Error("Firebase is not configured yet (assets/js/firebase-config.js)");
  const ref = await addDoc(collection(db, "enquiries"), {
    name: data.name,
    phone: data.phone,
    email: data.email,
    type: data.type,
    item: data.item,
    date: data.date,
    travellers: data.travellers,
    pickup: data.pickup,
    destination: data.destination,
    message: data.message,
    source: data.source,
    status: "new",
    createdAt: serverTimestamp()
  });
  return ref.id;
}
