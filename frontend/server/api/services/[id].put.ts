import { z } from "zod";
import { getFirestore } from "firebase-admin/firestore";
import { updateInAlgolia } from "../../utils/algolia";

const ServiceUpdateSchema = z.object({
    name: z.string().min(1).max(200).optional(),
    categories: z.array(z.string()).min(1).optional(),
    description: z.string().optional(),
    location: z.string().min(1).optional(),
    completedDate: z.string().min(1).optional(),
});

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, "id");
        if (!id) {
            throw createError({
                statusCode: 400,
                message: "ID dự án không hợp lệ",
            });
        }

        const body = await readBody(event);
        const validatedData = ServiceUpdateSchema.parse(body);

        if (Object.keys(validatedData).length === 0) {
            throw createError({
                statusCode: 400,
                message: "Không có dữ liệu để cập nhật",
            });
        }

        const db = getFirestore();
        const docRef = db.collection("services").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            throw createError({
                statusCode: 404,
                message: "Không tìm thấy dự án",
            });
        }

        await docRef.update({
            ...validatedData,
            updatedAt: new Date().toISOString(),
        });

        await updateInAlgolia(id, validatedData, "SERVICE");

        return {
            success: true,
            id,
            data: validatedData,
        };
    } catch (error: any) {
        if (error.name === "ZodError") {
            throw createError({
                statusCode: 400,
                message: error.errors.map((e: any) => e.message).join(", "),
            });
        }

        if (error.statusCode) throw error;

        console.error("[API] Update service error:", error);
        throw createError({
            statusCode: 500,
            message: "Có lỗi xảy ra khi cập nhật dự án",
        });
    }
});
