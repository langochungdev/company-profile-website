export type PageKey = "home" | "about-us" | "contact" | "products" | "services" | "posts";

export interface PageStats {
    home: number;
    "about-us": number;
    contact: number;
    products: number;
    services: number;
    posts: number;
}

export interface DailyStats {
    date: string;
    totalViews: number;
    pages: PageStats;
}

export interface RealtimeStats {
    date: string;
    totalViews: number;
    pages: PageStats;
}

export interface AnalyticsQueryOptions {
    startDate: string;
    endDate: string;
}

export interface WeeklyStats {
    totalViews: number;
    topPage: {
        key: PageKey;
        views: number;
    };
}
