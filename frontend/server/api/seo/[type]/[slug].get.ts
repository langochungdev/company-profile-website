import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const collectionMap: Record<string, string> = {
    post: "collections/posts/items",
    service: "collections/services/items",
    product: "collections/products/items",
};

function getFirestorePath(configPath: string, config: any): string {
    const siteName = config.public.siteName || "default";
    const isProd = config.public.envIsProd === true || config.public.envIsProd === "true";
    const env = isProd ? "product" : "develop";
    return `${siteName}/${env}/${configPath}`;
}

export default defineEventHandler(async (event) => {
    const { type, slug } = getRouterParams(event);

    if (!type || !slug) {
        throw createError({ statusCode: 400, message: "Missing type or slug" });
    }

    const validTypes = ["post", "service", "product"];
    if (!validTypes.includes(type)) {
        throw createError({ statusCode: 400, message: `Invalid type: ${type}. Must be one of: ${validTypes.join(", ")}` });
    }

    try {
        const config = useRuntimeConfig();
        let serviceAccount = config.firebaseServiceAccount;

        if (typeof serviceAccount === "string") {
            try {
                serviceAccount = JSON.parse(serviceAccount);
            } catch (e) {
                console.error("[SEO API] Failed to parse service account:", e);
                throw createError({ statusCode: 500, message: "Invalid Firebase configuration" });
            }
        }

        if (!getApps().length) {
            initializeApp({
                credential: cert(serviceAccount as any),
            });
        }

        const db = getFirestore();
        const configPath = collectionMap[type];
        const collectionPath = getFirestorePath(configPath, config);

        console.log(`[SEO API] Querying: ${collectionPath} with slug: ${slug}`);

        const snapshot = await db.collection(collectionPath).where("slug", "==", slug).limit(1).get();

        if (snapshot.empty) {
            console.log(`[SEO API] No document found for slug: ${slug}`);
            throw createError({
                statusCode: 404,
                message: `${type} with slug "${slug}" not found`,
            });
        }

        const doc = snapshot.docs[0];
        console.log(`[SEO API] Found document: ${doc.id}`);
        return {
            id: doc.id,
            ...doc.data(),
        };
    } catch (error: any) {
        if (error.statusCode) throw error;

        console.error("[SEO API] Error:", error);
        throw createError({
            statusCode: 500,
            message: "Failed to fetch SEO data",
        });
    }
});
