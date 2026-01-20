// Service CRUD cho settings document

import { doc, getDoc, setDoc, type Firestore } from "firebase/firestore";

export const SettingsService = {
    async get<T>(db: Firestore, path: string): Promise<T | null> {
        const docRef = doc(db, path);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return null;
        }

        const data = docSnap.data();
        return (data._settings as T) || null;
    },

    async save(db: Firestore, path: string, settings: Record<string, unknown>): Promise<void> {
        const docRef = doc(db, path);
        await setDoc(docRef, { _settings: settings }, { merge: true });
    },
};
