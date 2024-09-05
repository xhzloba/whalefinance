import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC0P4jUnO4tmdmsryb5jkJDEUQOHoELDjo",
  authDomain: "while-finance-r.firebaseapp.com",
  projectId: "while-finance-r",
  storageBucket: "while-finance-r.appspot.com",
  messagingSenderId: "1040548266280",
  appId: "1:1040548266280:web:55b0bcbf097818f688101d",
  measurementId: "G-12CL13W9JF",
};

const app = initializeApp(firebaseConfig);

// Инициализация Firestore с настройками
const db = getFirestore(app);

// Если вы используете эмулятор Firestore, раскомментируйте следующую строку:
// connectFirestoreEmulator(db, 'localhost', 8080);

const auth = getAuth(app);

export { db, auth };
