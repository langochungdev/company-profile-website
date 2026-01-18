import { initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, type Analytics } from "firebase/analytics";

let app: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;
let analyticsInstance: Analytics | null = null;
let isInitialized = false;

export interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
}

export const initFirebase = (config: FirebaseConfig) => {
    if (isInitialized) return { app: app!, db: dbInstance!, analytics: analyticsInstance };

    app = initializeApp(config);
    dbInstance = getFirestore(app);

    if (typeof window !== "undefined") {
        analyticsInstance = getAnalytics(app);
    }

    isInitialized = true;
    return { app, db: dbInstance, analytics: analyticsInstance };
};

export const db: Firestore = new Proxy({} as Firestore, {
    get(_, prop) {
        if (!dbInstance) {
            throw new Error("Firebase not initialized. Ensure firebase.client.ts plugin is loaded.");
        }
        return Reflect.get(dbInstance, prop);
    },
});

export const analytics: Analytics | null = new Proxy({} as Analytics, {
    get(_, prop) {
        if (!analyticsInstance) return undefined;
        return Reflect.get(analyticsInstance, prop);
    },
});
