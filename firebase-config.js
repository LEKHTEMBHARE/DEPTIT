// js/firebase-config.js

// 1. Imports (Hum CDN use kar rahe hain taaki browser mein direct chale)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. Your Web App's Firebase Configuration
const firebaseConfig = {
  apiKey: "---PUT YOUR API KEY HERE---",
  authDomain: "itportal-beafa.firebaseapp.com",
  projectId: "itportal-beafa",
  storageBucket: "itportal-beafa.firebasestorage.app",
  messagingSenderId: "495851714784",
  appId: "1:495851714784:web:8b852c3582e1e91180f885"
};

// 3. Initialize Firebase
const app = initializeApp(firebaseConfig);

// 4. Export Auth & Database (Taaki baaki files inhe use kar sakein)
export const auth = getAuth(app);

export const db = getFirestore(app);
