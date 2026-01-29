// API endpoint để check username availability

import { getAdminFirestore, getServerFirestorePath } from "../../utils/firebase-admin";

export default defineEventHandler(async (event) => {
    const body = await readBody<{ username: string; excludeUid?: string }>(event);
    const { username, excludeUid } = body;

    if (!username) {
        throw createError({
            statusCode: 400,
            message: "Username is required",
        });
    }

    try {
        const db = getAdminFirestore();
        const config = useRuntimeConfig();
        const usersPath = getServerFirestorePath("admin-users", config);
        const querySnapshot = await db.collection(usersPath).where("username", "==", username).get();

        if (querySnapshot.empty) {
            return { available: true };
        }

        if (excludeUid) {
            const isOtherUser = querySnapshot.docs.some((doc: { id: string }) => doc.id !== excludeUid);
            return { available: !isOtherUser };
        }

        return { available: false };
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            message: error.message || "Failed to check username",
        });
    }
});
