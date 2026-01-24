import { z } from "zod";
import { getFirestore } from "firebase-admin/firestore";
import { updateInAlgolia } from "../../utils/algolia";

const ProductUpdateSchema = z.object({
    name: z.string().min(1).max(200).optional(),
    description: z.string().optional(),
    price: z.number().min(0).optional(),
    category: z.string().min(1).optional(),
});

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, "id");
        if (!id) {
            throw createError({
                statusCode: 400,
                message: "ID sản phẩm không hợp lệ",
            });
        }

        const body = await readBody(event);
        const validatedData = ProductUpdateSchema.parse(body);

        if (Object.keys(validatedData).length === 0) {
            throw createError({
                statusCode: 400,
                message: "Không có dữ liệu để cập nhật",
            });
        }

        const db = getFirestore();
        const docRef = db.collection("products").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            throw createError({
                statusCode: 404,
                message: "Không tìm thấy sản phẩm",
            });
        }

        await docRef.update({
            ...validatedData,
            updatedAt: new Date().toISOString(),
        });

        await updateInAlgolia(id, validatedData);

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

        console.error("[API] Update product error:", error);
        throw createError({
            statusCode: 500,
            message: "Có lỗi xảy ra khi cập nhật sản phẩm",
        });
    }
});
