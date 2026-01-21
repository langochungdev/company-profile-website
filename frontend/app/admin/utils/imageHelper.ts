/**
 * Utility: Helper xử lý image value cho live edit mode
 */

import { isPendingImage, type PendingImageValue } from "@/admin/composables/usePendingUploads";

export type ImageValue = string | PendingImageValue;

const PLACEHOLDER_URL = "https://placehold.co/400x300/1a1a2e/666?text=No+Image";

export function getImageSrc(value: ImageValue | unknown | undefined | null, placeholder?: string): string {
    const fallback = placeholder || PLACEHOLDER_URL;

    if (!value) return fallback;

    if (typeof value === "string") return value;

    if (isPendingImage(value)) {
        return value.previewUrl || fallback;
    }

    return fallback;
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
