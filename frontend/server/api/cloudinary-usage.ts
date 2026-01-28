import type { CloudinaryUsageResponse, CloudinaryApiResponse } from "@/admin/types/cloudinary.type";

export default defineEventHandler(async (event): Promise<CloudinaryUsageResponse> => {
    const config = useRuntimeConfig();

    const cloudName = config.public.cloudinaryCloudName;
    const apiKey = config.cloudinaryApiKey;
    const apiSecret = config.cloudinaryApiSecret;

    if (!cloudName || !apiKey || !apiSecret) {
        throw createError({
            statusCode: 500,
            message: "Cloudinary credentials not configured",
        });
    }

    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
    const usageUrl = `https://api.cloudinary.com/v1_1/${cloudName}/usage`;

    try {
        const response = await $fetch<CloudinaryApiResponse>(usageUrl, {
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });

        return {
            storage: {
                used: response.storage?.usage || 0,
                limit: response.storage?.limit || 25000000000,
                usedPercent: response.storage?.usage && response.storage?.limit ? Math.round((response.storage.usage / response.storage.limit) * 100) : 0,
            },
            bandwidth: {
                used: response.bandwidth?.usage || 0,
                limit: response.bandwidth?.limit || 25000000000,
                usedPercent: response.bandwidth?.usage && response.bandwidth?.limit ? Math.round((response.bandwidth.usage / response.bandwidth.limit) * 100) : 0,
            },
            resources: response.resources?.usage || 0,
            lastUpdated: new Date().toISOString(),
        };
    } catch (error: any) {
        throw createError({
            statusCode: error?.response?.status || 500,
            message: error?.message || "Failed to fetch Cloudinary usage",
        });
    }
});
