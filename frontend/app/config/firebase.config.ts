import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCO0vlGyMbgbNI_RmnHTTwunhACpC92dyw",
    authDomain: "langochung-se23.firebaseapp.com",
    projectId: "langochung-se23",
    storageBucket: "langochung-se23.firebasestorage.app",
    messagingSenderId: "835274043977",
    appId: "1:835274043977:web:7cea8c43e9edd7362b0598",
    measurementId: "G-SJJ6750C4F",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
}

export { analytics };
