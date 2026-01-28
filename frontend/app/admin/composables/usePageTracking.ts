import { onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import type { Firestore } from "firebase/firestore";
import { getFirestorePath } from "@/admin/utils/firestore";
import { AnalyticsService } from "@/admin/services/analytics.service";
import type { PageKey } from "@/admin/types/analytics.type";

const ROUTE_TO_PAGE_KEY: Record<string, PageKey> = {
    "/": "home",
    "/about-us": "about-us",
    "/contact": "contact",
    "/products": "products",
    "/services": "services",
    "/posts": "posts",
};

let lastTrackedTime = 0;
const DEBOUNCE_MS = 3000;

export const usePageTracking = () => {
    const route = useRoute();
    const { $db } = useNuxtApp();

    const trackPageView = async (path: string) => {
        if (import.meta.server || !$db) {
            return;
        }

        const now = Date.now();
        if (now - lastTrackedTime < DEBOUNCE_MS) {
            return;
        }

        let pageKey: PageKey | null = null;

        if (ROUTE_TO_PAGE_KEY[path]) {
            pageKey = ROUTE_TO_PAGE_KEY[path];
        } else if (path.startsWith("/products/")) {
            pageKey = "products";
        } else if (path.startsWith("/services/")) {
            pageKey = "services";
        } else if (path.startsWith("/posts/")) {
            pageKey = "posts";
        }

        if (!pageKey) {
            return;
        }

        lastTrackedTime = now;

        const realtimePath = getFirestorePath("analytics-realtime/today");
        await AnalyticsService.incrementPageView($db as Firestore, realtimePath, pageKey);
    };

    onMounted(() => {
        trackPageView(route.path);
    });

    watch(
        () => route.path,
        (newPath) => {
            trackPageView(newPath);
        },
    );

    return {
        trackPageView,
    };
};
