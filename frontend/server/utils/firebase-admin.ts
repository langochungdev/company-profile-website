// Singleton Firebase Admin SDK initialization

import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

let adminApp: App | null = null;
let adminDb: Firestore | null = null;
let adminAuth: Auth | null = null;

function parseServiceAccount(config: any): any {
    let serviceAccount = config.firebaseServiceAccount;

    if (!serviceAccount) {
        throw new Error("Firebase service account not configured. Set NUXT_FIREBASE_SERVICE_ACCOUNT in .env");
    }

    if (typeof serviceAccount === "string") {
        let cleaned = serviceAccount.trim();
        if ((cleaned.startsWith("'") && cleaned.endsWith("'")) || (cleaned.startsWith('"') && cleaned.endsWith('"'))) {
            cleaned = cleaned.slice(1, -1);
        }

        try {
            serviceAccount = JSON.parse(cleaned);
        } catch (e) {
            console.error("[Firebase Admin] Failed to parse service account JSON:", e);
            throw new Error("Invalid Firebase configuration - failed to parse JSON");
        }
    }

    return JSON.parse(JSON.stringify(serviceAccount));
}

export function getAdminApp(): App {
    if (adminApp) return adminApp;

    if (getApps().length > 0) {
        adminApp = getApps()[0];
        return adminApp;
    }

    const config = useRuntimeConfig();
    const serviceAccount = parseServiceAccount(config);

    adminApp = initializeApp({
        credential: cert(serviceAccount as any),
    });

    return adminApp;
}

export function getAdminFirestore(): Firestore {
    if (adminDb) return adminDb;
    getAdminApp();
    adminDb = getFirestore();
    return adminDb;
}

export function getAdminAuth(): Auth {
    if (adminAuth) return adminAuth;
    getAdminApp();
    adminAuth = getAuth();
    return adminAuth;
}

export function getServerFirestorePath(configPath: string, config?: any): string {
    const runtimeConfig = config || useRuntimeConfig();
    const siteName = runtimeConfig.public?.siteName || "default";
    const isProd = runtimeConfig.public?.envIsProd === true || runtimeConfig.public?.envIsProd === "true";
    const env = isProd ? "product" : "develop";
    return `${siteName}/${env}/${configPath}`;
}
