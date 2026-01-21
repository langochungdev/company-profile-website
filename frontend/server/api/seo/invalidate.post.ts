/**
 * API: Invalidate SEO cache khi admin save settings
 */

import { invalidateSeoCache } from "../../utils/seo-cache";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const pageKey = body?.pageKey;

    if (pageKey) {
        invalidateSeoCache(pageKey);
        return { success: true, message: `Cache invalidated for ${pageKey}` };
    }

    invalidateSeoCache();
    return { success: true, message: "All SEO cache invalidated" };
});
