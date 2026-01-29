// Service xử lý Firebase Authentication

import { getAuth, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, onAuthStateChanged, type Auth, type User } from "firebase/auth";
import type { FirebaseApp } from "firebase/app";

let authInstance: Auth | null = null;
const googleProvider = new GoogleAuthProvider();

export const initAuth = (app: FirebaseApp): Auth => {
    if (!authInstance) {
        authInstance = getAuth(app);
    }
    return authInstance;
};

export const getAuthInstance = (): Auth => {
    if (!authInstance) {
        throw new Error("Auth not initialized");
    }
    return authInstance;
};

export const AuthService = {
    async signInWithGoogle(): Promise<User> {
        const auth = getAuthInstance();
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    },

    async signInWithEmailPassword(email: string, password: string): Promise<User> {
        const auth = getAuthInstance();
        const { signInWithEmailAndPassword } = await import("firebase/auth");
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result.user;
    },

    async signOut(): Promise<void> {
        const auth = getAuthInstance();
        await firebaseSignOut(auth);
    },

    onAuthStateChange(callback: (user: User | null) => void): () => void {
        const auth = getAuthInstance();
        return onAuthStateChanged(auth, callback);
    },

    getCurrentUser(): User | null {
        const auth = getAuthInstance();
        return auth.currentUser;
    },
};
