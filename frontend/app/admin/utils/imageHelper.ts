/**
 * Utility: Helper xử lý image value cho live edit mode
 */

import { isPendingImage, type PendingImageValue } from "@/admin/composables/usePendingUploads";

export type ImageValue = string | PendingImageValue;

export function getImageSrc(value: ImageValue | unknown | undefined | null): string {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (isPendingImage(value)) {
        return value.previewUrl;
    }
    return "";
}

export async function createPendingImage(file: File, oldUrl?: string): Promise<PendingImageValue> {
    const previewUrl = URL.createObjectURL(file);
    return {
        pending: true,
        file,
        previewUrl,
        oldUrl,
    };
}
