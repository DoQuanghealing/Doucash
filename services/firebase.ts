import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Khởi tạo Firebase an toàn
let auth: any = null;
if (firebaseConfig.apiKey && getApps().length === 0) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} else if (getApps().length > 0) {
  auth = getAuth(getApp());
}

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const AuthService = {
  isConfigured: () => !!auth,

  loginWithGoogle: async () => {
    if (!auth) throw new Error("Firebase chưa được cấu hình API Key.");
    
    // Kiểm tra mạng trước khi mở popup để tránh treo
    if (!navigator.onLine) throw new Error("Không có kết nối internet.");

    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("TIMEOUT")), 20000)
    );

    try {
      const loginPromise = signInWithPopup(auth, provider);
      const result: any = await Promise.race([loginPromise, timeout]);
      return result.user;
    } catch (error: any) {
      if (error.message === "TIMEOUT") throw new Error("Phản hồi quá chậm, vui lòng thử lại.");
      if (error.code === 'auth/popup-closed-by-user') throw new Error("Bạn đã hủy đăng nhập.");
      throw error;
    }
  },

  logout: async () => {
    if (auth) {
      await signOut(auth);
      // Thay vì reload trang, hãy để onAuthChange xử lý UI
    }
  },

  onAuthChange: (callback: (user: User | null) => void) => {
    if (!auth) {
      callback(null);
      return () => {};
    }
    // Trả về hàm unsubscribe để React useEffect dọn dẹp
    return onAuthStateChanged(auth, callback);
  }
};
