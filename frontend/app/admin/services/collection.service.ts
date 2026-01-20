// Service CRUD cho collection items với auto-sync preview

import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, setDoc, query, orderBy, limit, startAfter, type Firestore, type DocumentData, type QueryDocumentSnapshot, type QueryConstraint } from "firebase/firestore";

export interface CollectionQueryOptions {
    orderByField?: string;
    orderDirection?: "asc" | "desc";
    limitCount?: number;
    lastDoc?: QueryDocumentSnapshot<DocumentData>;
}

export interface CollectionQueryResult<T> {
    items: T[];
    lastDoc: QueryDocumentSnapshot<DocumentData> | null;
}

export const CollectionService = {
    async getAll<T extends { id: string }>(db: Firestore, path: string, options: CollectionQueryOptions = {}): Promise<CollectionQueryResult<T>> {
        const colRef = collection(db, path);
        const constraints: QueryConstraint[] = [];

        if (options.orderByField) {
            constraints.push(orderBy(options.orderByField, options.orderDirection || "asc"));
        }

        if (options.limitCount) {
            constraints.push(limit(options.limitCount));
        }

        if (options.lastDoc) {
            constraints.push(startAfter(options.lastDoc));
        }

        const q = constraints.length > 0 ? query(colRef, ...constraints) : query(colRef);
        const snapshot = await getDocs(q);

        const items: T[] = [];
        snapshot.forEach((docSnap) => {
            items.push({
                id: docSnap.id,
                ...docSnap.data(),
            } as T);
        });

        const lastDoc = snapshot.docs.length > 0 ? (snapshot.docs[snapshot.docs.length - 1] ?? null) : null;

        return { items, lastDoc };
    },

    async getById<T extends { id: string }>(db: Firestore, path: string, id: string): Promise<T | null> {
        const docRef = doc(db, path, id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return null;
        }

        return {
            id: docSnap.id,
            ...docSnap.data(),
        } as T;
    },

    async create(db: Firestore, path: string, data: Record<string, unknown>, previewPath?: string, previewData?: Record<string, unknown>): Promise<string> {
        const colRef = collection(db, path);
        const timestamp = new Date().toISOString();

        const fullData = {
            ...data,
            createdAt: timestamp,
            updatedAt: timestamp,
        };

        const docRef = await addDoc(colRef, fullData);

        if (previewPath && previewData) {
            await this.syncPreview(db, previewPath, docRef.id, {
                ...previewData,
                id: docRef.id,
                updatedAt: timestamp,
            });
        }

        return docRef.id;
    },

    async update(db: Firestore, path: string, id: string, data: Record<string, unknown>, previewPath?: string, previewData?: Record<string, unknown>): Promise<void> {
        const docRef = doc(db, path, id);
        const timestamp = new Date().toISOString();

        const updateData: Record<string, unknown> = {
            ...data,
            updatedAt: timestamp,
        };
        delete updateData.id;

        await updateDoc(docRef, updateData);

        if (previewPath && previewData) {
            await this.syncPreview(db, previewPath, id, {
                ...previewData,
                id,
                updatedAt: timestamp,
            });
        }
    },

    async delete(db: Firestore, path: string, id: string, previewPath?: string): Promise<void> {
        const docRef = doc(db, path, id);
        await deleteDoc(docRef);

        if (previewPath) {
            await this.deletePreview(db, previewPath, id);
        }
    },

    async syncPreview(db: Firestore, previewPath: string, id: string, data: Record<string, unknown>): Promise<void> {
        const previewRef = doc(db, previewPath, id);
        await setDoc(previewRef, data);
    },

    async deletePreview(db: Firestore, previewPath: string, id: string): Promise<void> {
        const previewRef = doc(db, previewPath, id);
        await deleteDoc(previewRef);
    },
};
