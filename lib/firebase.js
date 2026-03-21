import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, getDoc, updateDoc, doc, query, orderBy, where, limit, Timestamp, increment } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "000000000",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID",
};

let app, db;

function getFirebaseApp() {
  if (!app) app = initializeApp(firebaseConfig);
  return app;
}

export function getDb() {
  if (!db) db = getFirestore(getFirebaseApp());
  return db;
}

export async function submitReport({ zip, city, state, lat, lon, title, description, category, photos, climateData, urgency }) {
  const db = getDb();
  const report = {
    zip, city, state, lat, lon, title, description, category,
    photos: photos || [],
    climateData: climateData || null,
    urgency: urgency || "moderate",
    createdAt: Timestamp.now(),
    upvotes: 0,
    status: "open",
  };
  const docRef = await addDoc(collection(db, "reports"), report);
  return { id: docRef.id, ...report };
}

export async function getReports({ zipFilter, categoryFilter, limitCount = 50 } = {}) {
  const db = getDb();
  let q;
  if (zipFilter) {
    q = query(collection(db, "reports"), where("zip", "==", zipFilter), orderBy("createdAt", "desc"), limit(limitCount));
  } else if (categoryFilter) {
    q = query(collection(db, "reports"), where("category", "==", categoryFilter), orderBy("createdAt", "desc"), limit(limitCount));
  } else {
    q = query(collection(db, "reports"), orderBy("createdAt", "desc"), limit(limitCount));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function upvoteReport(reportId) {
  const db = getDb();
  const ref = doc(db, "reports", reportId);
  await updateDoc(ref, { upvotes: increment(1) });
}

export async function getReportsByZip(zip) {
  const db = getDb();
  const q = query(collection(db, "reports"), where("zip", "==", zip), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getZipStats(zip) {
  const reports = await getReportsByZip(zip);
  if (reports.length === 0) return null;
  const cats = {};
  let totalUpvotes = 0;
  let urgentCount = 0;
  reports.forEach((r) => {
    cats[r.category] = (cats[r.category] || 0) + 1;
    totalUpvotes += r.upvotes || 0;
    if (r.urgency === "critical" || r.urgency === "high") urgentCount++;
  });
  return {
    totalReports: reports.length,
    categories: cats,
    totalUpvotes,
    urgentCount,
    topCategory: Object.entries(cats).sort((a, b) => b[1] - a[1])[0]?.[0],
    oldestReport: reports[reports.length - 1]?.createdAt,
    newestReport: reports[0]?.createdAt,
    reports,
  };
}

export function isFirebaseConfigured() {
  return firebaseConfig.apiKey !== "YOUR_API_KEY" && firebaseConfig.projectId !== "YOUR_PROJECT_ID";
}
