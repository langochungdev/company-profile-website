// API endpoint để Super Admin set password cho user

import { getAdminAuth, getAdminFirestore, getServerFirestorePath } from "../../utils/firebase-admin";

interface SetPasswordPayload {
    email: string;
    password: string;
    username?: string;
}

export default defineEventHandler(async (event) => {
    const body = await readBody<SetPasswordPayload>(event);
    const { email, password, username } = body;

    if (!email || !password) {
        throw createError({
            statusCode: 400,
            message: "Email và password là bắt buộc",
        });
    }

    if (password.length < 6) {
        throw createError({
            statusCode: 400,
            message: "Password phải có ít nhất 6 ký tự",
        });
    }

    try {
        const auth = getAdminAuth();
        const db = getAdminFirestore();
        const config = useRuntimeConfig();

        let userRecord;
        try {
            userRecord = await auth.getUserByEmail(email);
            await auth.updateUser(userRecord.uid, { password });
        } catch (error: any) {
            if (error.code === "auth/user-not-found") {
                userRecord = await auth.createUser({ email, password });
            } else {
                throw error;
            }
        }

        const usersPath = getServerFirestorePath("admin-users", config);
        const userDocRef = db.collection(usersPath).doc(userRecord.uid);

        const updateData: Record<string, any> = {
            hasPassword: true,
            updatedAt: new Date().toISOString(),
        };

        if (username) {
            updateData.username = username;
        }

        await userDocRef.set(updateData, { merge: true });

        return {
            success: true,
            message: "Password đã được thiết lập thành công",
        };
    } catch (error: any) {
        if (error.statusCode) throw error;

        throw createError({
            statusCode: 500,
            message: error.message || "Không thể thiết lập password",
        });
    }
});
