// API endpoint để lấy signed params cho Cloudinary upload

import { createHmac } from "crypto";

interface SignRequestBody {
    folder?: string;
    public_id?: string;
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const body = await readBody<SignRequestBody>(event);

    const cloudName = config.public.cloudinaryCloudName;
    const apiKey = config.cloudinaryApiKey;
    const apiSecret = config.cloudinaryApiSecret;
    const uploadPreset = config.public.cloudinaryUploadPreset;

    if (!cloudName || !apiKey || !apiSecret) {
        throw createError({
            statusCode: 500,
            message: "Cloudinary credentials not configured",
        });
    }

    const timestamp = Math.round(Date.now() / 1000);

    const paramsToSign: Record<string, string | number> = {
        timestamp,
    };

    if (body.folder) {
        paramsToSign.folder = body.folder;
    }

    if (body.public_id) {
        paramsToSign.public_id = body.public_id;
    }

    if (uploadPreset) {
        paramsToSign.upload_preset = uploadPreset;
    }

    const sortedParams = Object.keys(paramsToSign)
        .sort()
        .map((key) => `${key}=${paramsToSign[key]}`)
        .join("&");

    const signature = createHmac("sha1", apiSecret).update(sortedParams).digest("hex");

    return {
        signature,
        timestamp,
        cloudName,
        apiKey: String(apiKey),
        uploadPreset,
        folder: body.folder,
        public_id: body.public_id,
    };
});
