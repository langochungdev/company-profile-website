// API endpoint để xóa asset trên Cloudinary

import { createHash } from "crypto";

interface DeleteRequestBody {
    public_id: string;
    resource_type?: "image" | "video" | "raw";
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const body = await readBody<DeleteRequestBody>(event);

    if (!body.public_id) {
        throw createError({
            statusCode: 400,
            message: "public_id is required",
        });
    }

    const cloudName = config.public.cloudinaryCloudName;
    const apiKey = config.cloudinaryApiKey;
    const apiSecret = config.cloudinaryApiSecret;

    if (!cloudName || !apiKey || !apiSecret) {
        throw createError({
            statusCode: 500,
            message: "Cloudinary credentials not configured",
        });
    }

    const timestamp = Math.round(Date.now() / 1000);
    const resourceType = body.resource_type || "image";

    const paramsToSign = `public_id=${body.public_id}&timestamp=${timestamp}${apiSecret}`;
    const signature = createHash("sha1").update(paramsToSign).digest("hex");

    const formData = new FormData();
    formData.append("public_id", body.public_id);
    formData.append("timestamp", timestamp.toString());
    formData.append("api_key", String(apiKey));
    formData.append("signature", signature);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`, {
        method: "POST",
        body: formData,
    });

    const result = await response.json();

    if (result.result === "ok" || result.result === "not found") {
        return {
            success: true,
            result: result.result,
        };
    }

    return {
        success: false,
        error: result.error?.message || "Failed to delete asset",
    };
});
