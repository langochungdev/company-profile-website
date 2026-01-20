// Composable quản lý pending image uploads

import { ref, computed } from "vue";
import { CloudinaryService, type CloudinaryUploadResult } from "@/admin/services/cloudinary.service";

export interface PendingUpload {
    fieldPath: string;
    file: File;
    previewUrl: string;
    oldUrl?: string;
    folder?: string;
}

export interface PendingImageValue {
    pending: true;
    file: File;
    previewUrl: string;
    oldUrl?: string;
}

export function isPendingImage(value: unknown): value is PendingImageValue {
    return typeof value === "object" && value !== null && (value as PendingImageValue).pending === true;
}

const pendingUploads = ref<PendingUpload[]>([]);

export function usePendingUploads() {
    const hasPending = computed(() => pendingUploads.value.length > 0);

    const addPending = (fieldPath: string, file: File, oldUrl?: string, folder?: string) => {
        const existingIndex = pendingUploads.value.findIndex((p) => p.fieldPath === fieldPath);
        if (existingIndex >= 0) {
            const existing = pendingUploads.value[existingIndex];
            if (existing) {
                URL.revokeObjectURL(existing.previewUrl);
            }
            pendingUploads.value.splice(existingIndex, 1);
        }

        const previewUrl = URL.createObjectURL(file);
        pendingUploads.value.push({
            fieldPath,
            file,
            previewUrl,
            oldUrl,
            folder,
        });

        return previewUrl;
    };

    const removePending = (fieldPath: string) => {
        const index = pendingUploads.value.findIndex((p) => p.fieldPath === fieldPath);
        if (index >= 0) {
            const item = pendingUploads.value[index];
            if (item) {
                URL.revokeObjectURL(item.previewUrl);
            }
            pendingUploads.value.splice(index, 1);
        }
    };

    const getPending = (fieldPath: string): PendingUpload | undefined => {
        return pendingUploads.value.find((p) => p.fieldPath === fieldPath);
    };

    const clearAll = () => {
        pendingUploads.value.forEach((p) => URL.revokeObjectURL(p.previewUrl));
        pendingUploads.value = [];
    };

    const uploadAllPending = async (onProgress?: (current: number, total: number) => void): Promise<Map<string, CloudinaryUploadResult>> => {
        const results = new Map<string, CloudinaryUploadResult>();
        const uploads = [...pendingUploads.value];
        const total = uploads.length;
        let current = 0;

        const uploadPromises = uploads.map(async (pending) => {
            try {
                const result = await CloudinaryService.uploadToCloudinary(pending.file, {
                    folder: pending.folder,
                });

                results.set(pending.fieldPath, result);
                current++;
                onProgress?.(current, total);

                if (pending.oldUrl) {
                    const { extractPublicId, isCloudinaryUrl } = await import("@/admin/utils/cloudinary");
                    if (isCloudinaryUrl(pending.oldUrl)) {
                        const publicId = extractPublicId(pending.oldUrl);
                        if (publicId) {
                            await CloudinaryService.deleteAsset(publicId).catch((e) => {
                                console.warn("[usePendingUploads] Failed to delete old image:", e);
                            });
                        }
                    }
                }
            } catch (e) {
                console.error(`[usePendingUploads] Failed to upload ${pending.fieldPath}:`, e);
                throw e;
            }
        });

        await Promise.all(uploadPromises);

        clearAll();

        return results;
    };

    return {
        pendingUploads: computed(() => pendingUploads.value),
        hasPending,
        addPending,
        removePending,
        getPending,
        clearAll,
        uploadAllPending,
    };
}
