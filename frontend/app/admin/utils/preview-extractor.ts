// Utility trích xuất preview data từ full item dựa trên field config

import type { FieldConfig } from "@/admin/config/page.config";

export interface PreviewData {
    [key: string]: unknown;
}

export function extractPreview(data: Record<string, unknown>, fieldConfigs: Record<string, FieldConfig>): PreviewData {
    const preview: PreviewData = {};

    for (const [fieldKey, fieldConfig] of Object.entries(fieldConfigs)) {
        const value = data[fieldKey];
        if (value === undefined || value === null) continue;

        if (fieldConfig.isPreview) {
            preview[fieldKey] = processPreviewValue(value, fieldConfig);
        } else if (fieldConfig.type === "array" && fieldConfig.previewCount !== undefined && fieldConfig.previewCount > 0) {
            const arr = value as unknown[];
            preview[fieldKey] = arr.slice(0, fieldConfig.previewCount);
        }
    }

    // Special handling: extract first image from images[] array to image object
    if (data.images && Array.isArray(data.images) && data.images.length > 0) {
        preview.image = data.images[0];
    }

    return preview;
}

function processPreviewValue(value: unknown, config: FieldConfig): unknown {
    if (config.type === "text" || config.type === "textarea") {
        if (config.previewMaxLength && typeof value === "string" && value.length > config.previewMaxLength) {
            return value.slice(0, config.previewMaxLength) + "...";
        }
        return value;
    }

    if (config.type === "array") {
        const arr = value as unknown[];
        const count = config.previewCount ?? 1;
        if (count === 0) return [];
        return arr.slice(0, count);
    }

    if (config.type === "dynamic-multi-select") {
        if (Array.isArray(value)) {
            const normalized = value.map((item) => {
                if (typeof item === "string") return item;
                if (typeof item === "object" && item !== null) {
                    if ("value" in item) return String((item as { value: string }).value);
                    if ("name" in item) return String((item as { name: string }).name);
                }
                return String(item);
            });
            const count = config.previewCount ?? normalized.length;
            return normalized.slice(0, count);
        }
        return value;
    }

    return value;
}

export function getPreviewFields(fieldConfigs: Record<string, FieldConfig>): string[] {
    return Object.entries(fieldConfigs)
        .filter(([_, config]) => config.isPreview || (config.type === "array" && (config.previewCount ?? 0) > 0))
        .map(([key]) => key);
}
