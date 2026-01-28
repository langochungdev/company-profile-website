import { ref, computed, watch } from "vue";
import { format, subDays } from "date-fns";
import type { Firestore } from "firebase/firestore";
import { getFirestorePath } from "@/admin/utils/firestore";
import { AnalyticsService } from "@/admin/services/analytics.service";
import type { PageKey, DailyStats, RealtimeStats, WeeklyStats } from "@/admin/types/analytics.type";

export const useDashboardAnalytics = () => {
    const { $db } = useNuxtApp();

    const dailyStats = ref<DailyStats[]>([]);
    const realtimeStats = ref<RealtimeStats | null>(null);
    const loading = ref(false);
    const error = ref<Error | null>(null);

    const today = new Date();
    const sevenDaysAgo = subDays(today, 6);

    const startDate = ref(format(sevenDaysAgo, "yyyy-MM-dd"));
    const endDate = ref(format(today, "yyyy-MM-dd"));
    const selectedPage = ref<PageKey | "all">("all");

    const loadDailyStats = async () => {
        if (import.meta.server || !$db) return;

        loading.value = true;
        error.value = null;

        try {
            const path = getFirestorePath("daily-stats");
            const stats = await AnalyticsService.getDailyStats($db as Firestore, path, startDate.value, endDate.value);
            dailyStats.value = stats;
        } catch (e) {
            error.value = e as Error;
            console.error("Failed to load daily stats:", e);
        } finally {
            loading.value = false;
        }
    };

    const loadRealtimeStats = async () => {
        if (import.meta.server || !$db) return;

        try {
            const path = getFirestorePath("analytics-realtime/today");
            const stats = await AnalyticsService.getRealtimeStats($db as Firestore, path);
            realtimeStats.value = stats;
        } catch (e) {
            console.error("Failed to load realtime stats:", e);
        }
    };

    const chartLabels = computed(() => {
        return dailyStats.value.map((stat) => {
            const date = new Date(stat.date);
            return format(date, "dd/MM");
        });
    });

    const chartData = computed(() => {
        if (selectedPage.value === "all") {
            return dailyStats.value.map((stat) => stat.totalViews);
        }
        return dailyStats.value.map((stat) => stat.pages[selectedPage.value as PageKey] || 0);
    });

    const weeklyStats = computed<WeeklyStats>(() => {
        const totalViews = dailyStats.value.reduce((sum, stat) => {
            if (selectedPage.value === "all") {
                return sum + stat.totalViews;
            }
            return sum + (stat.pages[selectedPage.value as PageKey] || 0);
        }, 0);

        let topPage: PageKey = "home";
        let maxViews = 0;

        if (selectedPage.value === "all") {
            const pageTotals: Record<PageKey, number> = {
                home: 0,
                "about-us": 0,
                contact: 0,
                products: 0,
                services: 0,
                posts: 0,
            };

            dailyStats.value.forEach((stat) => {
                Object.keys(stat.pages).forEach((key) => {
                    const pageKey = key as PageKey;
                    pageTotals[pageKey] += stat.pages[pageKey];
                });
            });

            Object.entries(pageTotals).forEach(([key, views]) => {
                if (views > maxViews) {
                    maxViews = views;
                    topPage = key as PageKey;
                }
            });
        } else {
            topPage = selectedPage.value as PageKey;
            maxViews = totalViews;
        }

        return {
            totalViews,
            topPage: {
                key: topPage,
                views: maxViews,
            },
        };
    });

    const realtimeCounter = computed(() => {
        if (!realtimeStats.value) return 0;
        if (selectedPage.value === "all") {
            return realtimeStats.value.totalViews;
        }
        return realtimeStats.value.pages[selectedPage.value as PageKey] || 0;
    });

    const updateDateRange = (range: { startDate: string; endDate: string }) => {
        startDate.value = range.startDate;
        endDate.value = range.endDate;
        loadDailyStats();
    };

    const updatePageFilter = (page: PageKey | "all") => {
        selectedPage.value = page;
    };

    watch([startDate, endDate], () => {
        loadDailyStats();
    });

    onMounted(() => {
        loadDailyStats();
        loadRealtimeStats();

        const interval = setInterval(loadRealtimeStats, 30000);
        onUnmounted(() => clearInterval(interval));
    });

    return {
        dailyStats,
        realtimeStats,
        loading,
        error,
        startDate,
        endDate,
        selectedPage,
        chartLabels,
        chartData,
        weeklyStats,
        realtimeCounter,
        updateDateRange,
        updatePageFilter,
    };
};
