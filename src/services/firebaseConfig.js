import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC8KMjcaDkHigxUXgE77Z8ZjV5NqkKJkHc",
  authDomain: "finanzasapp-a24af.firebaseapp.com",
  projectId: "finanzasapp-a24af",
  storageBucket: "finanzasapp-a24af.firebasestorage.app",
  messagingSenderId: "98302090970",
  appId: "1:98302090970:web:9338df4b202ce376690fe3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);