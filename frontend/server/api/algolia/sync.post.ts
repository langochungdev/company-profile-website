import { saveToAlgolia, updateInAlgolia, deleteFromAlgolia } from "../../utils/algolia";
import { z } from "zod";

const SyncSchema = z.object({
    action: z.enum(["create", "update", "delete"]),
    objectID: z.string(),
    data: z.any().optional(),
    collection: z.enum(["PRODUCT", "SERVICE"]).optional(),
});

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { action, objectID, data, collection } = SyncSchema.parse(body);

        if (action === "create" && data) {
            await saveToAlgolia(objectID, data, collection);
        } else if (action === "update" && data) {
            await updateInAlgolia(objectID, data, collection);
        } else if (action === "delete") {
            await deleteFromAlgolia(objectID, collection);
        }

        return {
            success: true,
            action,
            objectID,
        };
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            message: error.message || "Có lỗi xảy ra khi đồng bộ Algolia",
        });
    }
});
