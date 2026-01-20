// Service CRUD cho single page document

import { doc, getDoc, setDoc, type Firestore } from "firebase/firestore";

export const PageService = {
    async get<T extends Record<string, unknown>>(db: Firestore, path: string): Promise<T | null> {
        const docRef = doc(db, path);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return null;
        }

        return docSnap.data() as T;
    },

    async save(db: Firestore, path: string, data: Record<string, unknown>): Promise<void> {
        const docRef = doc(db, path);
        await setDoc(docRef, data);
    },
};
