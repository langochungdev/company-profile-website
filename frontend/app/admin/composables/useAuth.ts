// Composable quản lý xác thực và phân quyền

import { ref, computed, readonly } from "vue";
import type { User } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import { AuthService } from "@/admin/services/auth.service";
import { UserService } from "@/admin/services/user.service";
import type { AdminUser, AuthState } from "@/admin/types/auth.type";

const state = ref<AuthState>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
    isSuperAdmin: false,
});

let isInitialized = false;
let unsubscribe: (() => void) | null = null;

export function useAuth() {
    const { $db } = useNuxtApp();
    const db = $db as Firestore;

    const initAuth = async () => {
        if (isInitialized) return;
        isInitialized = true;

        unsubscribe = AuthService.onAuthStateChange(async (firebaseUser: User | null) => {
            state.value.loading = true;
            state.value.error = null;

            if (!firebaseUser) {
                state.value.user = null;
                state.value.isAuthenticated = false;
                state.value.isSuperAdmin = false;
                state.value.loading = false;
                return;
            }

            try {
                let adminUser = await UserService.getByUid(db, firebaseUser.uid);

                if (!adminUser && firebaseUser.email) {
                    adminUser = await UserService.getByEmail(db, firebaseUser.email);

                    if (adminUser) {
                        await UserService.delete(db, adminUser.uid);

                        const migratedUser = await UserService.create(
                            db,
                            firebaseUser.uid,
                            {
                                email: firebaseUser.email,
                                displayName: firebaseUser.displayName || adminUser.displayName,
                                role: adminUser.role,
                            },
                            adminUser.createdBy || "system",
                        );

                        if (firebaseUser.displayName) {
                            await UserService.update(db, firebaseUser.uid, {
                                displayName: firebaseUser.displayName,
                            });
                        }

                        adminUser = migratedUser;
                    }
                }

                if (!adminUser) {
                    state.value.error = "Tài khoản chưa được cấp quyền truy cập CMS";
                    await AuthService.signOut();
                    state.value.user = null;
                    state.value.isAuthenticated = false;
                    state.value.isSuperAdmin = false;
                    state.value.loading = false;
                    return;
                }

                if (!adminUser.isActive) {
                    state.value.error = "Tài khoản đã bị vô hiệu hóa";
                    await AuthService.signOut();
                    state.value.user = null;
                    state.value.isAuthenticated = false;
                    state.value.isSuperAdmin = false;
                    state.value.loading = false;
                    return;
                }

                state.value.user = adminUser;
                state.value.isAuthenticated = true;
                state.value.isSuperAdmin = adminUser.role === "superadmin";
            } catch (err: any) {
                state.value.error = err.message || "Lỗi xác thực";
                state.value.user = null;
                state.value.isAuthenticated = false;
                state.value.isSuperAdmin = false;
            } finally {
                state.value.loading = false;
            }
        });
    };

    const signInWithGoogle = async () => {
        state.value.loading = true;
        state.value.error = null;

        try {
            await AuthService.signInWithGoogle();
        } catch (err: any) {
            state.value.error = err.message || "Đăng nhập thất bại";
            state.value.loading = false;
        }
    };

    const signInWithPassword = async (usernameOrEmail: string, password: string) => {
        state.value.loading = true;
        state.value.error = null;

        try {
            let email = usernameOrEmail;

            if (!usernameOrEmail.includes("@")) {
                const user = await UserService.getByUsername(db, usernameOrEmail);
                if (!user) {
                    state.value.error = "Username không tồn tại";
                    state.value.loading = false;
                    return;
                }
                email = user.email;
            }

            await AuthService.signInWithEmailPassword(email, password);
        } catch (err: any) {
            if (err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
                state.value.error = "Email hoặc password không đúng";
            } else if (err.code === "auth/invalid-credential") {
                state.value.error = "Thông tin đăng nhập không hợp lệ";
            } else {
                state.value.error = err.message || "Đăng nhập thất bại";
            }
            state.value.loading = false;
        }
    };

    const signOut = async () => {
        try {
            await AuthService.signOut();
            state.value.user = null;
            state.value.isAuthenticated = false;
            state.value.isSuperAdmin = false;
        } catch (err: any) {}
    };

    const cleanup = () => {
        if (unsubscribe) {
            unsubscribe();
            unsubscribe = null;
        }
        isInitialized = false;
    };

    return {
        user: computed(() => state.value.user),
        loading: computed(() => state.value.loading),
        error: computed(() => state.value.error),
        isAuthenticated: computed(() => state.value.isAuthenticated),
        isSuperAdmin: computed(() => state.value.isSuperAdmin),
        initAuth,
        signInWithGoogle,
        signInWithPassword,
        signOut,
        cleanup,
    };
}
