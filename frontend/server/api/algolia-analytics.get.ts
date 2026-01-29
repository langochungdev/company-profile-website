interface AlgoliaSearchTerm {
    search: string;
    count: number;
    nbHits?: number;
}

interface AlgoliaAnalyticsResponse {
    totalSearches: number;
    totalClicks: number;
    clickThroughRate: number;
    noResultsRate: number;
    dailyStats: Array<{ date: string; searches: number }>;
    topSearches: AlgoliaSearchTerm[];
    noResultSearches: AlgoliaSearchTerm[];
    lastUpdated: string;
}

export default defineEventHandler(async (event): Promise<AlgoliaAnalyticsResponse> => {
    const config = useRuntimeConfig();
    const query = getQuery(event);

    const appId = config.algoliaAppId;
    const adminKey = config.algoliaAdminKey;
    const isProd = config.public.envIsProd;

    if (!appId || !adminKey) {
    }

    const startDate = query.startDate as string;
    const endDate = query.endDate as string;
    const env = (query.env as string) || "all";

    if (!startDate || !endDate) {
        throw createError({
            statusCode: 400,
            message: "startDate and endDate are required",
        });
    }

    let indexes: string[] = [];
    if (env === "prod") {
        indexes = ["prod_PRODUCT", "prod_SERVICE"];
    } else if (env === "dev") {
        indexes = ["dev_PRODUCT", "dev_SERVICE"];
    } else {
        indexes = ["prod_PRODUCT", "prod_SERVICE", "dev_PRODUCT", "dev_SERVICE"];
    }

    try {
        let totalSearches = 0;
        let totalClicks = 0;
        let totalNoResultCount = 0;
        let totalTrackedSearches = 0;
        const dailyStatsMap = new Map<string, number>();

        const headers = {
            "x-algolia-application-id": appId,
            "x-algolia-api-key": adminKey,
        };

        for (const index of indexes) {
            const baseUrl = "https://analytics.de.algolia.com/2";
            const searchUrl = `${baseUrl}/searches/count?index=${index}&startDate=${startDate}&endDate=${endDate}`;
            const ctrUrl = `${baseUrl}/clicks/clickThroughRate?index=${index}&startDate=${startDate}&endDate=${endDate}`;
            const noResultUrl = `${baseUrl}/searches/noResultRate?index=${index}&startDate=${startDate}&endDate=${endDate}`;

            const [searchData, ctrData, noResultData] = await Promise.all([
                $fetch<any>(searchUrl, { headers }).catch((err) => {
                    return { count: 0, dates: [] };
                }),
                $fetch<any>(ctrUrl, { headers }).catch((err) => {
                    return { rate: null, clickCount: 0, trackedSearchCount: 0 };
                }),
                $fetch<any>(noResultUrl, { headers }).catch((err) => {
                    return { rate: 0, count: 0, noResultCount: 0 };
                }),
            ]);

            const searchCount = searchData?.count || 0;
            const clickCount = ctrData?.clickCount || 0;
            const trackedSearchCount = ctrData?.trackedSearchCount || 0;
            const noResultCount = noResultData?.noResultCount || 0;

            totalSearches += searchCount;
            totalClicks += clickCount;
            totalTrackedSearches += trackedSearchCount;
            totalNoResultCount += noResultCount;

            if (searchData?.dates) {
                searchData.dates.forEach((item: any) => {
                    const current = dailyStatsMap.get(item.date) || 0;
                    dailyStatsMap.set(item.date, current + (item.count || 0));
                });
            }
        }

        const dailyStats = Array.from(dailyStatsMap.entries())
            .map(([date, searches]) => ({ date, searches }))
            .sort((a, b) => a.date.localeCompare(b.date));

        const clickThroughRate = totalTrackedSearches > 0 ? Math.round((totalClicks / totalTrackedSearches) * 100 * 10) / 10 : 0;
        const noResultsRate = totalSearches > 0 ? Math.round((totalNoResultCount / totalSearches) * 100 * 10) / 10 : 0;

        const topSearchesMap = new Map<string, number>();
        const noResultSearchesMap = new Map<string, number>();

        for (const index of indexes) {
            const baseUrl = "https://analytics.de.algolia.com/2";
            const topSearchUrl = `${baseUrl}/searches?index=${index}&startDate=${startDate}&endDate=${endDate}&limit=20`;
            const noResultUrl = `${baseUrl}/searches/noResults?index=${index}&startDate=${startDate}&endDate=${endDate}&limit=20`;

            const [topSearchData, noResultData] = await Promise.all([
                $fetch<any>(topSearchUrl, { headers }).catch((err) => {
                    return { searches: [] };
                }),
                $fetch<any>(noResultUrl, { headers }).catch((err) => {
                    return { searches: [] };
                }),
            ]);

            if (topSearchData?.searches) {
                topSearchData.searches.forEach((item: any) => {
                    const current = topSearchesMap.get(item.search) || 0;
                    topSearchesMap.set(item.search, current + (item.count || 0));
                });
            }

            if (noResultData?.searches) {
                noResultData.searches.forEach((item: any) => {
                    const current = noResultSearchesMap.get(item.search) || 0;
                    noResultSearchesMap.set(item.search, current + (item.count || 0));
                });
            }
        }

        const topSearches = Array.from(topSearchesMap.entries())
            .map(([search, count]) => ({ search, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 20);

        const noResultSearches = Array.from(noResultSearchesMap.entries())
            .map(([search, count]) => ({ search, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 20);

        const result: AlgoliaAnalyticsResponse = {
            totalSearches,
            totalClicks,
            clickThroughRate,
            noResultsRate,
            dailyStats,
            topSearches,
            noResultSearches,
            lastUpdated: new Date().toISOString(),
        };

        return result;
    } catch (error: any) {
        throw createError({
            statusCode: error?.status || error?.statusCode || 500,
            message: error?.data?.message || error?.message || "Failed to fetch Algolia analytics",
        });
    }
});
