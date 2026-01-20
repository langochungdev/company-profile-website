// Service read-only cho preview collection với pagination và filter

import { collection, getDocs, query, orderBy, limit, startAfter, where, type Firestore, type DocumentData, type QueryDocumentSnapshot, type QueryConstraint } from "firebase/firestore";

export interface PreviewQueryOptions {
    orderByField?: string;
    orderDirection?: "asc" | "desc";
    limitCount?: number;
    lastDoc?: QueryDocumentSnapshot<DocumentData>;
    category?: string;
}

export interface PreviewQueryResult<T> {
    items: T[];
    lastDoc: QueryDocumentSnapshot<DocumentData> | null;
    hasMore: boolean;
}

export const PreviewService = {
    async getAll<T extends { id: string }>(db: Firestore, path: string, options: PreviewQueryOptions = {}): Promise<PreviewQueryResult<T>> {
        const colRef = collection(db, path);
        const constraints: QueryConstraint[] = [];

        if (options.category) {
            constraints.push(where("category", "==", options.category));
        }

        const orderField = options.orderByField || "updatedAt";
        const orderDir = options.orderDirection || "desc";
        constraints.push(orderBy(orderField, orderDir));

        const limitCount = options.limitCount || 12;
        constraints.push(limit(limitCount));

        if (options.lastDoc) {
            constraints.push(startAfter(options.lastDoc));
        }

        const q = query(colRef, ...constraints);
        const snapshot = await getDocs(q);

        const items: T[] = [];
        snapshot.forEach((docSnap) => {
            items.push({
                id: docSnap.id,
                ...docSnap.data(),
            } as T);
        });

        const lastDoc = snapshot.docs.length > 0 ? (snapshot.docs[snapshot.docs.length - 1] ?? null) : null;
        const hasMore = items.length >= limitCount;

        return { items, lastDoc, hasMore };
    },
};
