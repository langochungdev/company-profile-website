// Utility functions cho Cloudinary

export function extractPublicId(url: string): string | null {
    if (!url || !url.includes("cloudinary.com")) {
        return null;
    }

    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;

        const uploadIndex = pathname.indexOf("/upload/");
        if (uploadIndex === -1) {
            return null;
        }

        let afterUpload = pathname.substring(uploadIndex + 8);

        const versionMatch = afterUpload.match(/^v\d+\//);
        if (versionMatch) {
            afterUpload = afterUpload.substring(versionMatch[0].length);
        }

        const lastDotIndex = afterUpload.lastIndexOf(".");
        if (lastDotIndex > -1) {
            afterUpload = afterUpload.substring(0, lastDotIndex);
        }

        return afterUpload || null;
    } catch {
        return null;
    }
}

export function isCloudinaryUrl(url: string): boolean {
    return url?.includes("cloudinary.com") ?? false;
}
