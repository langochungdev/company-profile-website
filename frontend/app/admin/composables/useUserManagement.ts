// Composable quản lý danh sách Admin Users (chỉ superadmin dùng được)

import { ref, computed } from "vue";
import type { Firestore } from "firebase/firestore";
import { UserService } from "@/admin/services/user.service";
import type { AdminUser, CreateUserPayload, UpdateUserPayload } from "@/admin/types/auth.type";
import { useAuth } from "./useAuth";

export function useUserManagement() {
    const { $db } = useNuxtApp();
    const db = $db as Firestore;
    const { user: currentUser, isSuperAdmin } = useAuth();

    const users = ref<AdminUser[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const loadUsers = async () => {
        if (!isSuperAdmin.value) {
            error.value = "Không có quyền truy cập";
            return;
        }

        loading.value = true;
        error.value = null;

        try {
            users.value = await UserService.getAll(db);
        } catch (err: any) {
            error.value = err.message || "Không thể tải danh sách users";
        } finally {
            loading.value = false;
        }
    };

    const addUser = async (email: string, username: string): Promise<boolean> => {
        if (!isSuperAdmin.value || !currentUser.value) {
            error.value = "Không có quyền thực hiện";
            return false;
        }

        loading.value = true;
        error.value = null;

        try {
            const existingUser = await UserService.getByEmail(db, email);
            if (existingUser) {
                error.value = "Email đã tồn tại trong hệ thống";
                loading.value = false;
                return false;
            }

            const usernameExists = await UserService.checkUsername(db, username);
            if (usernameExists) {
                error.value = "Username đã tồn tại trong hệ thống";
                loading.value = false;
                return false;
            }

            const tempUid = `pending_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const payload: CreateUserPayload = {
                email,
                displayName: username,
                role: "admin",
            };

            const newUser = await UserService.create(db, tempUid, payload, currentUser.value.uid);
            users.value.push(newUser);

            return true;
        } catch (err: any) {
            error.value = err.message || "Không thể thêm user";
            return false;
        } finally {
            loading.value = false;
        }
    };

    const updateUser = async (uid: string, data: UpdateUserPayload): Promise<boolean> => {
        if (!isSuperAdmin.value) {
            error.value = "Không có quyền thực hiện";
            return false;
        }

        loading.value = true;
        error.value = null;

        try {
            await UserService.update(db, uid, data);

            const index = users.value.findIndex((u) => u.uid === uid);
            if (index !== -1) {
                users.value[index] = { ...users.value[index], ...data } as AdminUser;
            }

            return true;
        } catch (err: any) {
            error.value = err.message || "Không thể cập nhật user";
            return false;
        } finally {
            loading.value = false;
        }
    };

    const deleteUser = async (uid: string): Promise<boolean> => {
        if (!isSuperAdmin.value) {
            error.value = "Không có quyền thực hiện";
            return false;
        }

        const targetUser = users.value.find((u) => u.uid === uid);
        if (targetUser?.role === "superadmin") {
            error.value = "Không thể xóa tài khoản Super Admin";
            return false;
        }

        loading.value = true;
        error.value = null;

        try {
            await UserService.delete(db, uid);
            users.value = users.value.filter((u) => u.uid !== uid);
            return true;
        } catch (err: any) {
            error.value = err.message || "Không thể xóa user";
            return false;
        } finally {
            loading.value = false;
        }
    };

    const toggleUserStatus = async (uid: string): Promise<boolean> => {
        const targetUser = users.value.find((u) => u.uid === uid);
        if (!targetUser) return false;

        if (targetUser.role === "superadmin") {
            error.value = "Không thể vô hiệu hóa Super Admin";
            return false;
        }

        return updateUser(uid, { isActive: !targetUser.isActive });
    };

    return {
        users: computed(() => users.value),
        loading: computed(() => loading.value),
        error: computed(() => error.value),
        loadUsers,
        addUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
    };
}
