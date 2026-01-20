/**
 * Utility: Normalize data trước khi lưu vào Firestore
 * - Replace PendingImageValue objects với Cloudinary URLs
 * - Đệ quy traverse nested objects và arrays
 */

import { isPendingImage } from "@/admin/composables/usePendingUploads";
import type { CloudinaryUploadResult } from "@/admin/services/cloudinary.service";

export function normalizeImageData(data: Record<string, unknown>, uploadResults: Map<string, CloudinaryUploadResult>, basePath: string = ""): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
        const fieldPath = basePath ? `${basePath}.${key}` : key;

        if (isPendingImage(value)) {
            const uploadResult = uploadResults.get(fieldPath);
            result[key] = uploadResult?.secure_url || "";
        } else if (Array.isArray(value)) {
            result[key] = value.map((item, index) => {
                if (isPendingImage(item)) {
                    const itemPath = `${fieldPath}.${index}`;
                    const uploadResult = uploadResults.get(itemPath);
                    return uploadResult?.secure_url || "";
                }
                if (typeof item === "object" && item !== null) {
                    return normalizeImageData(item as Record<string, unknown>, uploadResults, `${fieldPath}.${index}`);
                }
                return item;
            });
        } else if (typeof value === "object" && value !== null) {
            result[key] = normalizeImageData(value as Record<string, unknown>, uploadResults, fieldPath);
        } else {
            result[key] = value;
        }
    }

    return result;
}
