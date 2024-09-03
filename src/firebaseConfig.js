import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCj8SmLpnOR_6HXOHCJptg1oMHIeb4aSec",
  authDomain: "whale-finance-10349.firebaseapp.com",
  projectId: "whale-finance-10349",
  storageBucket: "whale-finance-10349.appspot.com",
  messagingSenderId: "37818570043",
  appId: "1:37818570043:web:c274b8e42f98dbe993931e",
  measurementId: "G-VH22X2R7GM",
};

const app = initializeApp(firebaseConfig);

// Инициализация Firestore с настройками
const db = getFirestore(app);

// Если вы используете эмулятор Firestore, раскомментируйте следующую строку:
// connectFirestoreEmulator(db, 'localhost', 8080);

const auth = getAuth(app);

export { db, auth };
