import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Cấu hình linh hoạt: Ưu tiên biến môi trường, nếu không có mới báo lỗi
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "MISSING",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let auth: any = null;
let db: any = null;

try {
  // Chỉ khởi tạo khi có API Key thật
  if (firebaseConfig.apiKey !== "MISSING") {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } else {
    console.error("Manicash Error: Vui lòng cấu hình VITE_FIREBASE_API_KEY trong Environment Variables.");
  }
} catch (error) {
  console.error("Lỗi khởi tạo Firebase:", error);
}

export { auth, db };
export const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

// Hàm AuthService để dùng trong UI
export const AuthService = {
  loginWithGoogle: async () => {
    if (!auth) return null;
    return await signInWithPopup(auth, provider);
  },
  onAuthChange: (callback: any) => {
    if (!auth) return () => {};
    return onAuthStateChanged(auth, callback);
  }
};
