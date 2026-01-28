import { ref, computed, watch } from "vue";
import { format, subDays } from "date-fns";
import type { Firestore } from "firebase/firestore";
import { getFirestorePath } from "@/admin/utils/firestore";
import { AnalyticsService } from "@/admin/services/analytics.service";
import type { PageKey, DailyStats, WeeklyStats } from "@/admin/types/analytics.type";

export const useDashboardAnalytics = () => {
    const { $db } = useNuxtApp();

    const dailyStats = ref<DailyStats[]>([]);
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
            const collectionPath = getFirestorePath("daily-stats");
            const stats = await AnalyticsService.getDailyStats($db as Firestore, collectionPath, startDate.value, endDate.value);

            const filledStats: DailyStats[] = [];
            const statsMap = new Map(stats.map((s) => [s.date, s]));

            let currentDate = new Date(startDate.value);
            const end = new Date(endDate.value);

            while (currentDate <= end) {
                const dateStr = format(currentDate, "yyyy-MM-dd");
                const existingStat = statsMap.get(dateStr);

                filledStats.push(
                    existingStat || {
                        date: dateStr,
                        totalViews: 0,
                        pages: {
                            home: 0,
                            "about-us": 0,
                            contact: 0,
                            products: 0,
                            services: 0,
                            posts: 0,
                        },
                    },
                );

                currentDate.setDate(currentDate.getDate() + 1);
            }

            dailyStats.value = filledStats;
        } catch (e) {
            error.value = e as Error;
            console.error("Failed to load daily stats:", e);
        } finally {
            loading.value = false;
        }
    };

    const todayStats = computed(() => {
        if (dailyStats.value.length === 0) return null;
        return dailyStats.value[dailyStats.value.length - 1];
    });

    const chartLabels = computed(() => {
        return dailyStats.value.map((stat) => {
            const date = new Date(stat.date);
            return format(date, "dd/MM");
        });
    });

    const chartData = computed(() => {
        if (selectedPage.value === "all") {
            return dailyStats.value.map((stat) => stat.totalViews || 0);
        }
        return dailyStats.value.map((stat) => stat.pages?.[selectedPage.value as PageKey] || 0);
    });

    const weeklyStats = computed<WeeklyStats>(() => {
        const totalViews = dailyStats.value.reduce((sum, stat) => {
            if (selectedPage.value === "all") {
                return sum + (stat.totalViews || 0);
            }
            return sum + (stat.pages?.[selectedPage.value as PageKey] || 0);
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
                if (stat.pages) {
                    Object.keys(stat.pages).forEach((key) => {
                        const pageKey = key as PageKey;
                        pageTotals[pageKey] += stat.pages?.[pageKey] || 0;
                    });
                }
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

    const todayCounter = computed(() => {
        if (!todayStats.value) return 0;
        if (selectedPage.value === "all") {
            return todayStats.value.totalViews || 0;
        }
        return todayStats.value.pages?.[selectedPage.value as PageKey] || 0;
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

        const interval = setInterval(loadDailyStats, 60000);
        onUnmounted(() => clearInterval(interval));
    });

    return {
        dailyStats,
        todayStats,
        loading,
        error,
        startDate,
        endDate,
        selectedPage,
        chartLabels,
        chartData,
        weeklyStats,
        todayCounter,
        updateDateRange,
        updatePageFilter,
    };
};
