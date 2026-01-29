import { ref } from "vue";
import { CloudinaryService } from "@/admin/services/cloudinary.service";

interface PendingEditorImage {
    id: string;
    file: File;
    previewUrl: string;
}

const pendingEditorImages = ref<PendingEditorImage[]>([]);

export function useRichTextImages() {
    const addPendingImage = (file: File): string => {
        const id = `editor-img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const previewUrl = URL.createObjectURL(file);

        pendingEditorImages.value.push({
            id,
            file,
            previewUrl,
        });

        return previewUrl;
    };

    const clearPendingImages = () => {
        pendingEditorImages.value.forEach((img) => URL.revokeObjectURL(img.previewUrl));
        pendingEditorImages.value = [];
    };

    const uploadPendingImages = async (htmlContent: string, folder: string = "products/content"): Promise<string> => {
        if (pendingEditorImages.value.length === 0) {
            return htmlContent;
        }

        let updatedHtml = htmlContent;

        for (const pendingImg of pendingEditorImages.value) {
            try {
                const result = await CloudinaryService.uploadToCloudinary(pendingImg.file, { folder });

                updatedHtml = updatedHtml.replaceAll(pendingImg.previewUrl, result.secure_url);

                URL.revokeObjectURL(pendingImg.previewUrl);
            } catch (error) {
                throw error;
            }
        }

        pendingEditorImages.value = [];

        return updatedHtml;
    };

    return {
        addPendingImage,
        clearPendingImages,
        uploadPendingImages,
        pendingImagesCount: () => pendingEditorImages.value.length,
    };
}
