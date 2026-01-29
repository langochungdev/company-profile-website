import { collection, doc, getDoc, getDocs, query, where, orderBy, setDoc, increment, serverTimestamp } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import type { DailyStats, PageKey } from "@/admin/types/analytics.type";

export class AnalyticsService {
    static async getDailyStats(db: Firestore, collectionPath: string, startDate: string, endDate: string): Promise<DailyStats[]> {
        try {
            const collectionRef = collection(db, collectionPath);
            const q = query(collectionRef, where("date", ">=", startDate), where("date", "<=", endDate), orderBy("date", "asc"));

            const snapshot = await getDocs(q);
            return snapshot.docs.map((doc) => doc.data() as DailyStats);
        } catch (error) {
            return [];
        }
    }

    static async getTodayStats(db: Firestore, collectionPath: string, date: string): Promise<DailyStats | null> {
        try {
            const docRef = doc(db, collectionPath, date);
            const snapshot = await getDoc(docRef);

            if (!snapshot.exists()) {
                return null;
            }

            return snapshot.data() as DailyStats;
        } catch (error) {
            return null;
        }
    }

    static async incrementPageView(db: Firestore, collectionPath: string, date: string, pageKey: PageKey): Promise<void> {
        try {
            const docRef = doc(db, collectionPath, date);

            await setDoc(
                docRef,
                {
                    date,
                    totalViews: increment(1),
                    pages: {
                        [pageKey]: increment(1),
                    },
                    updatedAt: serverTimestamp(),
                },
                { merge: true },
            );
        } catch (error) {}
    }
}
