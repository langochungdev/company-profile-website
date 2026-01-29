// Service CRUD cho quản lý Admin Users

import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, type Firestore } from "firebase/firestore";
import type { AdminUser, CreateUserPayload, UpdateUserPayload } from "@/admin/types/auth.type";
import { getFirestorePath } from "@/admin/utils/firestore";

const USERS_PATH = "admin-users";

const getUsersCollection = (db: Firestore) => {
    const path = getFirestorePath(USERS_PATH);
    return collection(db, path);
};

export const UserService = {
    async getByUid(db: Firestore, uid: string): Promise<AdminUser | null> {
        const path = getFirestorePath(USERS_PATH);
        const docRef = doc(db, path, uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return null;

        return { uid: docSnap.id, ...docSnap.data() } as AdminUser;
    },

    async getByEmail(db: Firestore, email: string): Promise<AdminUser | null> {
        const colRef = getUsersCollection(db);
        const q = query(colRef, where("email", "==", email));
        const snapshot = await getDocs(q);

        if (snapshot.empty) return null;

        const docSnap = snapshot.docs[0];
        if (!docSnap) return null;
        return { uid: docSnap.id, ...docSnap.data() } as AdminUser;
    },

    async getByUsername(db: Firestore, username: string): Promise<AdminUser | null> {
        const colRef = getUsersCollection(db);
        const q = query(colRef, where("username", "==", username));
        const snapshot = await getDocs(q);

        if (snapshot.empty) return null;

        const docSnap = snapshot.docs[0];
        if (!docSnap) return null;
        return { uid: docSnap.id, ...docSnap.data() } as AdminUser;
    },

    async checkUsername(db: Firestore, username: string, excludeUid?: string): Promise<boolean> {
        const colRef = getUsersCollection(db);
        const q = query(colRef, where("username", "==", username));
        const snapshot = await getDocs(q);

        if (snapshot.empty) return false;

        if (excludeUid) {
            return snapshot.docs.some((doc) => doc.id !== excludeUid);
        }

        return true;
    },

    async getAll(db: Firestore): Promise<AdminUser[]> {
        const colRef = getUsersCollection(db);
        const snapshot = await getDocs(colRef);

        return snapshot.docs.map((docSnap) => ({
            uid: docSnap.id,
            ...docSnap.data(),
        })) as AdminUser[];
    },

    async create(db: Firestore, uid: string, data: CreateUserPayload, createdBy: string): Promise<AdminUser> {
        const path = getFirestorePath(USERS_PATH);
        const docRef = doc(db, path, uid);
        const timestamp = new Date().toISOString();

        const userData: Omit<AdminUser, "uid"> = {
            email: data.email,
            username: data.displayName,
            displayName: data.displayName,
            photoURL: null,
            role: data.role,
            hasPassword: false,
            createdAt: timestamp,
            updatedAt: timestamp,
            createdBy,
            isActive: true,
        };

        await setDoc(docRef, userData);

        return { uid, ...userData };
    },

    async createSuperAdmin(db: Firestore, uid: string, email: string, displayName: string | null, photoURL: string | null): Promise<AdminUser> {
        const path = getFirestorePath(USERS_PATH);
        const docRef = doc(db, path, uid);
        const timestamp = new Date().toISOString();

        const userData: Omit<AdminUser, "uid"> = {
            email,
            username: null,
            displayName,
            photoURL,
            role: "superadmin",
            hasPassword: false,
            createdAt: timestamp,
            updatedAt: timestamp,
            createdBy: null,
            isActive: true,
        };

        await setDoc(docRef, userData);

        return { uid, ...userData };
    },

    async update(db: Firestore, uid: string, data: UpdateUserPayload): Promise<void> {
        const path = getFirestorePath(USERS_PATH);
        const docRef = doc(db, path, uid);
        const timestamp = new Date().toISOString();

        await updateDoc(docRef, {
            ...data,
            updatedAt: timestamp,
        });
    },

    async delete(db: Firestore, uid: string): Promise<void> {
        const path = getFirestorePath(USERS_PATH);
        const docRef = doc(db, path, uid);
        await deleteDoc(docRef);
    },

    async hasAnyUsers(db: Firestore): Promise<boolean> {
        const colRef = getUsersCollection(db);
        const snapshot = await getDocs(colRef);
        return !snapshot.empty;
    },
};
