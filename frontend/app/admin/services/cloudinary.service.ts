// Service xử lý Cloudinary upload/delete - pure API calls, không UI state

export interface CloudinaryUploadResult {
    public_id: string;
    secure_url: string;
    url: string;
    format: string;
    resource_type: "image" | "video" | "raw";
    bytes: number;
    width?: number;
    height?: number;
    duration?: number;
}

export interface UploadOptions {
    folder?: string;
    public_id?: string;
}

export interface DeleteResult {
    success: boolean;
    result?: "ok" | "not found";
    error?: string;
}

export const CloudinaryService = {
    getConfig() {
        const runtimeConfig = useRuntimeConfig();
        const publicConfig = runtimeConfig.public as Record<string, unknown>;
        const envIsProd = publicConfig.envIsProd === true || publicConfig.envIsProd === "true";

        return {
            cloudName: publicConfig.cloudinaryCloudName as string,
            uploadPreset: publicConfig.cloudinaryUploadPreset as string,
            envIsProd,
        };
    },

    getEnvFolder(): string {
        const { envIsProd } = this.getConfig();
        return envIsProd ? "sht/product" : "sht/develop";
    },

    async uploadToCloudinary(file: File, options: UploadOptions = {}, onProgress?: (percent: number) => void): Promise<CloudinaryUploadResult> {
        const { cloudName, uploadPreset } = this.getConfig();
        const envFolder = this.getEnvFolder();

        const folder = options.folder ? `${envFolder}/${options.folder}` : envFolder;

        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", uploadPreset);
            formData.append("folder", folder);

            if (options.public_id) {
                formData.append("public_id", options.public_id);
            }

            const xhr = new XMLHttpRequest();
            const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

            xhr.upload.addEventListener("progress", (event) => {
                if (event.lengthComputable && onProgress) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    onProgress(percent);
                }
            });

            xhr.addEventListener("load", () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const result = JSON.parse(xhr.responseText) as CloudinaryUploadResult;
                    resolve(result);
                } else {
                    const errorData = JSON.parse(xhr.responseText);
                    reject(new Error(errorData.error?.message || "Upload failed"));
                }
            });

            xhr.addEventListener("error", () => {
                reject(new Error("Network error during upload"));
            });

            xhr.addEventListener("abort", () => {
                reject(new Error("Upload aborted"));
            });

            xhr.open("POST", uploadUrl);
            xhr.send(formData);
        });
    },

    async deleteAsset(public_id: string, resource_type?: "image" | "video" | "raw"): Promise<DeleteResult> {
        const response = await $fetch<DeleteResult>("/api/cloudinary/delete", {
            method: "POST",
            body: {
                public_id,
                resource_type,
            },
        });
        return response;
    },
};
