import { collection, doc, getDoc, getDocs, query, where, orderBy, setDoc, increment, serverTimestamp } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import type { DailyStats, RealtimeStats, PageKey } from "@/admin/types/analytics.type";

export class AnalyticsService {
    static async getDailyStats(db: Firestore, path: string, startDate: string, endDate: string): Promise<DailyStats[]> {
        try {
            const collectionRef = collection(db, path);
            const q = query(collectionRef, where("date", ">=", startDate), where("date", "<=", endDate), orderBy("date", "asc"));

            const snapshot = await getDocs(q);
            return snapshot.docs.map((doc) => doc.data() as DailyStats);
        } catch (error) {
            console.error("Error getting daily stats:", error);
            return [];
        }
    }

    static async getRealtimeStats(db: Firestore, path: string): Promise<RealtimeStats | null> {
        try {
            const docRef = doc(db, path);
            const snapshot = await getDoc(docRef);

            if (!snapshot.exists()) {
                return null;
            }

            return snapshot.data() as RealtimeStats;
        } catch (error) {
            console.error("Error getting realtime stats:", error);
            return null;
        }
    }

    static async incrementPageView(db: Firestore, path: string, pageKey: PageKey): Promise<void> {
        try {
            const docRef = doc(db, path);
            const today = new Date().toISOString().split("T")[0];

            await setDoc(
                docRef,
                {
                    date: today,
                    totalViews: increment(1),
                    [`pages.${pageKey}`]: increment(1),
                    updatedAt: serverTimestamp(),
                },
                { merge: true },
            );
        } catch (error) {
            console.error("Error incrementing page view:", error);
        }
    }

    static async aggregateDailyStats(db: Firestore, realtimePath: string, dailyStatsPath: string, date: string): Promise<void> {
        try {
            const realtimeDoc = await this.getRealtimeStats(db, realtimePath);

            if (!realtimeDoc) {
                return;
            }

            const dailyDocRef = doc(db, dailyStatsPath, date);
            await setDoc(dailyDocRef, {
                date: realtimeDoc.date,
                totalViews: realtimeDoc.totalViews,
                pages: realtimeDoc.pages,
                createdAt: serverTimestamp(),
            });
        } catch (error) {
            console.error("Error aggregating daily stats:", error);
        }
    }
}
