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

        const deletePromises = urls.map(async (url) => {
            const publicId = extractPublicId(url);
            if (publicId) {
                await CloudinaryService.deleteAsset(publicId).catch(() => {});
            }
        });

        await Promise.all(deletePromises);
        clearQueue();
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
