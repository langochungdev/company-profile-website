/**
 * Utility: Cache layer cho SEO settings từ Firestore
 */

import { initializeApp, cert, getApps, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

interface SeoSettings {
    seo?: {
        title?: string;
        description?: string;
        keywords?: string;
        robots?: string;
        canonical?: string;
    };
    openGraph?: {
        ogTitle?: string;
        ogDescription?: string;
        ogImage?: string;
        ogImageAlt?: string;
        ogType?: string;
        twitterCard?: string;
        twitterTitle?: string;
        twitterDescription?: string;
        twitterImage?: string;
    };
    schema?: {
        config?: Record<string, unknown>;
        fieldMapping?: Record<string, string>;
    };
}

const settingsCache = new Map<string, { data: SeoSettings; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000;

let firebaseApp: App | null = null;
let firestoreDb: Firestore | null = null;

function getFirebaseAdmin(): Firestore {
    if (firestoreDb) return firestoreDb;

    const existingApps = getApps();
    if (existingApps.length > 0) {
        firebaseApp = existingApps[0]!;
        firestoreDb = getFirestore(firebaseApp);
        return firestoreDb;
    }

    const config = useRuntimeConfig();
    const serviceAccount = config.firebaseServiceAccount as string;

    if (!serviceAccount) {
        throw new Error("FIREBASE_SERVICE_ACCOUNT not configured");
    }

    try {
        const credentials = JSON.parse(serviceAccount);
        firebaseApp = initializeApp({
            credential: cert(credentials),
        });
        firestoreDb = getFirestore(firebaseApp);
        return firestoreDb;
    } catch (error) {
        throw new Error(`Failed to initialize Firebase Admin: ${error}`);
    }
}

export async function fetchSeoSettings(pageKey: string): Promise<SeoSettings> {
    const cached = settingsCache.get(pageKey);
    if (cached && cached.expires > Date.now()) {
        return cached.data;
    }

    try {
        const db = getFirebaseAdmin();

        const config = useRuntimeConfig();
        const publicConfig = config.public as Record<string, unknown>;
        const isProd = publicConfig.envIsProd === true || publicConfig.envIsProd === "true";
        const env = isProd ? "product" : "develop";
        const settingsPath = `shtcam/${env}/pages/${pageKey}/settings`;

        const docSnap = await db.doc(settingsPath).get();
        const data: SeoSettings = docSnap.exists ? (docSnap.data() as SeoSettings) : {};

        settingsCache.set(pageKey, {
            data,
            expires: Date.now() + CACHE_TTL,
        });

        return data;
    } catch (error) {
        console.error(`[seo-cache] Error fetching settings for ${pageKey}:`, error);
        return {};
    }
}

export function invalidateSeoCache(pageKey?: string): void {
    if (pageKey) {
        settingsCache.delete(pageKey);
    } else {
        settingsCache.clear();
    }
}

export function escapeHtml(str: string): string {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
