// API endpoint để Super Admin impersonate (đăng nhập với tư cách) user khác

import { getAdminAuth, getServerFirestorePath, getAdminFirestore } from "../../utils/firebase-admin";

export default defineEventHandler(async (event) => {
    const body = await readBody<{ targetUid: string }>(event);
    const { targetUid } = body;

    if (!targetUid) {
        throw createError({
            statusCode: 400,
            message: "Target user UID is required",
        });
    }

    try {
        const auth = getAdminAuth();
        const db = getAdminFirestore();
        const config = useRuntimeConfig();

        const usersPath = getServerFirestorePath("admin-users", config);
        const targetDoc = await db.collection(usersPath).doc(targetUid).get();

        if (!targetDoc.exists) {
            throw createError({
                statusCode: 404,
                message: "User không tồn tại",
            });
        }

        const targetData = targetDoc.data();

        if (targetData?.role === "superadmin") {
            throw createError({
                statusCode: 403,
                message: "Không thể impersonate Super Admin khác",
            });
        }

        if (!targetData?.isActive) {
            throw createError({
                statusCode: 403,
                message: "User đã bị khóa, không thể impersonate",
            });
        }

        const customToken = await auth.createCustomToken(targetUid, {
            impersonated: true,
            impersonatedAt: Date.now(),
        });

        return {
            success: true,
            token: customToken,
            user: {
                uid: targetUid,
                email: targetData.email,
                displayName: targetData.displayName,
                role: targetData.role,
            },
        };
    } catch (error: any) {
        if (error.statusCode) throw error;

        throw createError({
            statusCode: 500,
            message: error.message || "Không thể tạo impersonate token",
        });
    }
});
