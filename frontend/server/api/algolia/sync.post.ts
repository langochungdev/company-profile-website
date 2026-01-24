import { saveToAlgolia, updateInAlgolia, deleteFromAlgolia } from "../../utils/algolia";
import { z } from "zod";

const SyncSchema = z.object({
    action: z.enum(["create", "update", "delete"]),
    objectID: z.string(),
    data: z.any().optional(),
});

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { action, objectID, data } = SyncSchema.parse(body);

        if (action === "create" && data) {
            await saveToAlgolia(objectID, data);
        } else if (action === "update" && data) {
            await updateInAlgolia(objectID, data);
        } else if (action === "delete") {
            await deleteFromAlgolia(objectID);
        }

        return {
            success: true,
            action,
            objectID,
        };
    } catch (error: any) {
        console.error("[API] Algolia sync error:", error);
        throw createError({
            statusCode: 500,
            message: error.message || "Có lỗi xảy ra khi đồng bộ Algolia",
        });
    }
});
