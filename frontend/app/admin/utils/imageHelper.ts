/**
 * Utility: Helper xử lý image value cho live edit mode
 */

import { isPendingImage, type PendingImageValue } from "@/admin/composables/usePendingUploads";

export interface ImageMetadata {
    url: string;
    alt?: string;
    title?: string;
    width?: number;
    height?: number;
}

export type ImageValue = string | ImageMetadata | PendingImageValue;

const PLACEHOLDER_URL = "https://placehold.co/400x300/1a1a2e/666?text=No+Image";

export function isImageMetadata(value: unknown): value is ImageMetadata {
    return typeof value === "object" && value !== null && "url" in value && typeof (value as ImageMetadata).url === "string";
}

export function getImageSrc(value: ImageValue | unknown | undefined | null, placeholder?: string): string {
    const fallback = placeholder || PLACEHOLDER_URL;

    if (!value) return fallback;

    if (typeof value === "string") return value;

    if (isImageMetadata(value)) return value.url;

    if (isPendingImage(value)) {
        return value.previewUrl || fallback;
    }

    return fallback;
}

export function getImageUrl(value: ImageValue | unknown | undefined | null): string {
    return getImageSrc(value);
}

export function getImageAlt(value: ImageValue | unknown | undefined | null, fallback: string = ""): string {
    if (isImageMetadata(value)) {
        return value.alt || fallback;
    }
    return fallback;
}

export function getImageTitle(value: ImageValue | unknown | undefined | null): string | undefined {
    if (isImageMetadata(value)) {
        return value.title;
    }
    return undefined;
}

export function getImageWidth(value: ImageValue | unknown | undefined | null): number | undefined {
    if (isImageMetadata(value)) {
        return value.width;
    }
    return undefined;
}

export function getImageHeight(value: ImageValue | unknown | undefined | null): number | undefined {
    if (isImageMetadata(value)) {
        return value.height;
    }
    return undefined;
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
