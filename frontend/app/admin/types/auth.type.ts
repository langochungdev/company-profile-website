// Types cho hệ thống xác thực và phân quyền

export interface AdminUser {
    uid: string;
    email: string;
    username?: string | null;
    displayName: string | null;
    photoURL: string | null;
    role: "superadmin" | "admin";
    hasPassword: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: string | null;
    isActive: boolean;
}

export interface AuthState {
    user: AdminUser | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    isSuperAdmin: boolean;
}

export interface CreateUserPayload {
    email: string;
    displayName: string | null;
    role: "admin" | "superadmin";
}

export interface UpdateUserPayload {
    displayName?: string;
    username?: string;
    isActive?: boolean;
    hasPassword?: boolean;
}

export interface SetPasswordPayload {
    email: string;
    password: string;
    username?: string;
}
