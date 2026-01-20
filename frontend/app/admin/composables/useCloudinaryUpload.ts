// Composable wrap CloudinaryService + reactive state cho UI

import { ref, type Ref } from "vue";
import { CloudinaryService, type UploadOptions, type CloudinaryUploadResult } from "@/admin/services/cloudinary.service";

interface UseCloudinaryUploadResult {
    uploading: Ref<boolean>;
    deleting: Ref<boolean>;
    progress: Ref<number>;
    error: Ref<Error | null>;
    upload: (file: File, options?: UploadOptions) => Promise<CloudinaryUploadResult>;
    deleteAsset: (public_id: string, resource_type?: "image" | "video" | "raw") => Promise<boolean>;
    reset: () => void;
}

export function useCloudinaryUpload(): UseCloudinaryUploadResult {
    const uploading = ref(false);
    const deleting = ref(false);
    const progress = ref(0);
    const error = ref<Error | null>(null);

    const reset = () => {
        uploading.value = false;
        deleting.value = false;
        progress.value = 0;
        error.value = null;
    };

    const upload = async (file: File, options: UploadOptions = {}): Promise<CloudinaryUploadResult> => {
        reset();
        uploading.value = true;

        try {
            const result = await CloudinaryService.uploadToCloudinary(file, options, (percent) => {
                progress.value = percent;
            });

            return result;
        } catch (e) {
            error.value = e as Error;
            throw e;
        } finally {
            uploading.value = false;
        }
    };

    const deleteAsset = async (public_id: string, resource_type?: "image" | "video" | "raw"): Promise<boolean> => {
        error.value = null;
        deleting.value = true;

        try {
            const result = await CloudinaryService.deleteAsset(public_id, resource_type);

            if (!result.success) {
                throw new Error(result.error || "Failed to delete asset");
            }

            return true;
        } catch (e) {
            error.value = e as Error;
            throw e;
        } finally {
            deleting.value = false;
        }
    };

    return {
        uploading,
        deleting,
        progress,
        error,
        upload,
        deleteAsset,
        reset,
    };
}
