// Composable quản lý queue URLs cần xóa khi save

import { ref, computed } from "vue";
import { CloudinaryService } from "@/admin/services/cloudinary.service";
import { extractPublicId, isCloudinaryUrl } from "@/admin/utils/cloudinary";

const deleteQueue = ref<Set<string>>(new Set());

export function useDeleteQueue() {
    const hasUrlsToDelete = computed(() => deleteQueue.value.size > 0);

    const addToDeleteQueue = (url: string) => {
        if (url && isCloudinaryUrl(url)) {
            deleteQueue.value.add(url);
        }
    };

    const removeFromDeleteQueue = (url: string) => {
        deleteQueue.value.delete(url);
    };

    const clearQueue = () => {
        deleteQueue.value.clear();
    };

    const processDeleteQueue = async (): Promise<void> => {
        const urls = Array.from(deleteQueue.value);

        if (urls.length === 0) {
            console.log("[DeleteQueue] No images to delete");
            return;
        }

        console.log(`[DeleteQueue] Deleting ${urls.length} images:`, urls);

        const deletePromises = urls.map(async (url) => {
            const publicId = extractPublicId(url);
            if (publicId) {
                try {
                    const result = await CloudinaryService.deleteAsset(publicId);
                    console.log(`[DeleteQueue] Deleted ${publicId}:`, result);
                } catch (error) {
                    console.error(`[DeleteQueue] Failed to delete ${publicId}:`, error);
                }
            } else {
                console.warn(`[DeleteQueue] Could not extract publicId from:`, url);
            }
        });

        await Promise.all(deletePromises);
        clearQueue();
        console.log("[DeleteQueue] Cleanup complete");
    };

    return {
        deleteQueue: computed(() => Array.from(deleteQueue.value)),
        hasUrlsToDelete,
        addToDeleteQueue,
        removeFromDeleteQueue,
        clearQueue,
        processDeleteQueue,
    };
}
