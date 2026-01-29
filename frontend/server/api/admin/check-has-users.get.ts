// API kiểm tra xem đã có admin user nào chưa

import { getAdminFirestore, getServerFirestorePath } from "../../utils/firebase-admin";

export default defineEventHandler(async () => {
    try {
        const db = getAdminFirestore();
        const config = useRuntimeConfig();
        const usersPath = getServerFirestorePath("admin-users", config);
        const snapshot = await db.collection(usersPath).limit(1).get();

        return {
            hasUsers: !snapshot.empty,
        };
    } catch (error: any) {
        console.error("[Check Has Users API] Error:", error);
        throw createError({
            statusCode: 500,
            message: error.message || "Không thể kiểm tra",
        });
    }
});
