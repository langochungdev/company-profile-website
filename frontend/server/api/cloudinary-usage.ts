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

        const storageUsed = response.storage?.usage || 0;
        const storageLimit = response.storage?.limit || 25000000000;
        const bandwidthUsed = response.bandwidth?.usage || 0;
        const bandwidthLimit = response.bandwidth?.limit || 25000000000;

        const storagePercent = storageUsed && storageLimit ? Math.round((storageUsed / storageLimit) * 100) : 0;
        const bandwidthPercent = bandwidthUsed && bandwidthLimit ? Math.round((bandwidthUsed / bandwidthLimit) * 100) : 0;

        const result = {
            storage: {
                used: storageUsed,
                limit: storageLimit,
                usedPercent: storagePercent,
            },
            bandwidth: {
                used: bandwidthUsed,
                limit: bandwidthLimit,
                usedPercent: bandwidthPercent,
            },
            resources: response.resources?.usage || 0,
            lastUpdated: new Date().toISOString(),
        };

        return result;
    } catch (error: any) {
        throw createError({
            statusCode: error?.response?.status || 500,
            message: error?.data?.error?.message || error?.message || "Failed to fetch Cloudinary usage",
        });
    }
});
