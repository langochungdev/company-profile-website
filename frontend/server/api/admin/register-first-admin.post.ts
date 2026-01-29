// API đăng ký Super Admin đầu tiên (chỉ hoạt động khi chưa có user nào)

import { getAdminAuth, getAdminFirestore, getServerFirestorePath } from "../../utils/firebase-admin";

export default defineEventHandler(async (event) => {
    const body = await readBody<{ email: string; password: string; username: string }>(event);
    const { email, password, username } = body;

    if (!email || !password || !username) {
        throw createError({
            statusCode: 400,
            message: "Email, mật khẩu và username là bắt buộc",
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

        const existingUsers = await db.collection(usersPath).limit(1).get();
        if (!existingUsers.empty) {
            throw createError({
                statusCode: 403,
                message: "Đã có Super Admin. Liên hệ admin để được cấp tài khoản.",
            });
        }

        let userRecord;
        try {
            userRecord = await auth.getUserByEmail(email);
        } catch {
            userRecord = await auth.createUser({
                email,
                password,
                displayName: username,
            });
        }

        if (!userRecord) {
            throw createError({
                statusCode: 500,
                message: "Không thể tạo tài khoản Firebase Auth",
            });
        }

        await auth.updateUser(userRecord.uid, { password });

        const timestamp = new Date().toISOString();
        const userData = {
            email,
            username,
            displayName: username,
            photoURL: null,
            role: "superadmin",
            hasPassword: true,
            createdAt: timestamp,
            updatedAt: timestamp,
            createdBy: null,
            isActive: true,
        };

        await db.collection(usersPath).doc(userRecord.uid).set(userData);

        return {
            success: true,
            message: "Tạo Super Admin thành công! Hãy đăng nhập.",
        };
    } catch (error: any) {
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
