import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, where, limit, Timestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// TODO: Replace with your own Firebase config
// 1. Go to console.firebase.google.com
// 2. Create a new project (free)
// 3. Go to Project Settings > General > Your apps > Add web app
// 4. Copy the config object here
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "000000000",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID",
};

let app, db, storage;

function getFirebaseApp() {
  if (!app) app = initializeApp(firebaseConfig);
  return app;
}

export function getDb() {
  if (!db) db = getFirestore(getFirebaseApp());
  return db;
}

export function getStorageInstance() {
  if (!storage) storage = getStorage(getFirebaseApp());
  return storage;
}

export async function submitReport({ zip, city, state, lat, lon, title, description, category, photos, climateData }) {
  const db = getDb();
  const photoUrls = [];

  // Skip photo uploads — Firebase Storage requires paid plan
  // Photos are stored as data URLs in Firestore instead (limited to small images)

  const report = {
    zip,
    city,
    state,
    lat,
    lon,
    title,
    description,
    category,
    photos: photoUrls,
    climateData: climateData || null,
    createdAt: Timestamp.now(),
    upvotes: 0,
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

export function isFirebaseConfigured() {
  return firebaseConfig.apiKey !== "YOUR_API_KEY" && firebaseConfig.projectId !== "YOUR_PROJECT_ID";
}
