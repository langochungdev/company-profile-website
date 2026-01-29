// API tạo admin user mới (email + username + password) - chỉ Super Admin dùng được

import { getAdminAuth, getAdminFirestore, getServerFirestorePath } from "../../utils/firebase-admin";

export default defineEventHandler(async (event) => {
    const body = await readBody<{ email: string; username: string; password: string }>(event);
    const { email, username, password } = body;

    if (!email || !username || !password) {
        throw createError({
            statusCode: 400,
            message: "Email, username và mật khẩu là bắt buộc",
        });
    }

    if (password.length < 6) {
        throw createError({
            statusCode: 400,
            message: "Mật khẩu phải có ít nhất 6 ký tự",
        });
    }

    try {
        const db = getAdminFirestore();
        const auth = getAdminAuth();
        const config = useRuntimeConfig();
        const usersPath = getServerFirestorePath("admin-users", config);

        const usernameQuery = await db.collection(usersPath).where("username", "==", username).get();
        if (!usernameQuery.empty) {
            throw createError({
                statusCode: 400,
                message: "Username đã tồn tại",
            });
        }

        let userRecord;
        try {
            userRecord = await auth.getUserByEmail(email);
            throw createError({
                statusCode: 400,
                message: "Email đã tồn tại trong Firebase Auth",
            });
        } catch (err: any) {
            if (err.statusCode === 400) throw err;

            userRecord = await auth.createUser({
                email,
                password,
                displayName: username,
            });
        }

        const timestamp = new Date().toISOString();
        const userData = {
            email,
            username,
            displayName: username,
            photoURL: null,
            role: "admin",
            hasPassword: true,
            createdAt: timestamp,
            updatedAt: timestamp,
            createdBy: "superadmin",
            isActive: true,
        };

        await db.collection(usersPath).doc(userRecord.uid).set(userData);

        console.log(`[Create User API] Created user: ${email} (${username})`);

        return {
            success: true,
            user: {
                uid: userRecord.uid,
                ...userData,
            },
        };
    } catch (error: any) {
        console.error("[Create User API] Error:", error);

        if (error.statusCode) throw error;

        if (error.code === "auth/email-already-exists") {
            throw createError({
                statusCode: 400,
                message: "Email đã tồn tại trong hệ thống",
            });
        }

        throw createError({
            statusCode: 500,
            message: error.message || "Không thể tạo tài khoản",
        });
    }
});
