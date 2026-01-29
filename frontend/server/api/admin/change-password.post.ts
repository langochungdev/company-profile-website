// API endpoint để user đổi password của chính mình (cần verify password cũ)

import { getAdminAuth } from "../../utils/firebase-admin";

export default defineEventHandler(async (event) => {
    const body = await readBody<{ email: string; oldPassword: string; newPassword: string }>(event);
    const { email, oldPassword, newPassword } = body;

    if (!email || !oldPassword || !newPassword) {
        throw createError({
            statusCode: 400,
            message: "Email, mật khẩu cũ và mật khẩu mới là bắt buộc",
        });
    }

    if (newPassword.length < 6) {
        throw createError({
            statusCode: 400,
            message: "Mật khẩu mới phải có ít nhất 6 ký tự",
        });
    }

    try {
        const config = useRuntimeConfig();
        const firebaseConfig = {
            apiKey: config.public.firebaseApiKey,
        };

        const signInResponse = await $fetch<{ idToken: string; localId: string }>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`, {
            method: "POST",
            body: {
                email,
                password: oldPassword,
                returnSecureToken: true,
            },
        });

        if (!signInResponse.idToken) {
            throw createError({
                statusCode: 401,
                message: "Mật khẩu cũ không chính xác",
            });
        }

        const auth = getAdminAuth();
        await auth.updateUser(signInResponse.localId, { password: newPassword });

        return {
            success: true,
            message: "Đổi mật khẩu thành công",
        };
    } catch (error: any) {
        if (error.statusCode) throw error;

        if (error.data?.error?.message === "INVALID_PASSWORD" || error.data?.error?.message === "INVALID_LOGIN_CREDENTIALS") {
            throw createError({
                statusCode: 401,
                message: "Mật khẩu cũ không chính xác",
            });
        }

        if (error.data?.error?.message === "EMAIL_NOT_FOUND") {
            throw createError({
                statusCode: 404,
                message: "Email không tồn tại",
            });
        }

        throw createError({
            statusCode: 500,
            message: error.message || "Không thể đổi mật khẩu",
        });
    }
});
