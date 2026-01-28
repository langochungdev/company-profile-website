export interface CloudinaryStorageUsage {
    used: number;
    limit: number;
    usedPercent: number;
}

export interface CloudinaryBandwidthUsage {
    used: number;
    limit: number;
    usedPercent: number;
}

export interface CloudinaryUsageResponse {
    storage: CloudinaryStorageUsage;
    bandwidth: CloudinaryBandwidthUsage;
    resources: number;
    lastUpdated: string;
}

export interface CloudinaryApiResponse {
    storage?: {
        usage?: number;
        limit?: number;
    };
    bandwidth?: {
        usage?: number;
        limit?: number;
    };
    resources?: {
        usage?: number;
    };
}
