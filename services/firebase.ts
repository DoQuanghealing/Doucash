import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/** * SỬA LỖI BUILD: Ép kiểu 'import.meta' thành 'any' để TypeScript 
 * bỏ qua việc kiểm tra thuộc tính 'env' trong lúc build.
 */
const metaEnv = (import.meta as any).env;

const firebaseConfig = {
  apiKey: metaEnv?.VITE_FIREBASE_API_KEY || "",
  authDomain: metaEnv?.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: metaEnv?.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: metaEnv?.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: metaEnv?.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: metaEnv?.VITE_FIREBASE_APP_ID || ""
};

let auth: any = null;
let db: any = null;
let isConfigured = false;

try {
  // Kiểm tra xem Key thực tế đã được nạp chưa
  if (firebaseConfig.apiKey) {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    isConfigured = true;
  }
} catch (error) {
  console.error("Lỗi khởi tạo Firebase:", error);
}

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export { auth, db };

export const AuthService = {
  isConfigured: () => isConfigured,

  loginWithGoogle: async () => {
    if (!auth) throw new Error("Hệ thống chưa nhận diện được API Key.");
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error);
      throw error;
    }
  },

  logout: async () => {
    if (auth) await signOut(auth);
    window.location.href = window.location.origin + window.location.pathname;
  },

  onAuthChange: (callback: (user: any) => void) => {
    if (!auth) {
      setTimeout(() => callback(null), 10);
      return () => {};
    }
    return onAuthStateChanged(auth, (user) => callback(user));
  }
};
