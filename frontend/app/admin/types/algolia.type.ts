export interface AlgoliaAnalyticsRequest {
    startDate: string;
    endDate: string;
}

export interface AlgoliaDailyStats {
    date: string;
    searches: number;
}

export interface AlgoliaSearchTerm {
    search: string;
    count: number;
    nbHits?: number;
}

export interface AlgoliaAnalyticsResponse {
    totalSearches: number;
    totalClicks: number;
    clickThroughRate: number;
    noResultsRate: number;
    dailyStats: AlgoliaDailyStats[];
    topSearches: AlgoliaSearchTerm[];
    noResultSearches: AlgoliaSearchTerm[];
    lastUpdated: string;
}

export interface AlgoliaRawSearches {
    count: number;
}

export interface AlgoliaRawClicks {
    count: number;
}

export interface AlgoliaRawNoResults {
    rate: number;
}
