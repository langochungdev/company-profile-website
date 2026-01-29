import { z } from "zod";
import { getFirestore } from "firebase-admin/firestore";
import { saveToAlgolia } from "../../utils/algolia";

const ProductSchema = z.object({
    name: z.string().min(1, "Tên sản phẩm không được để trống").max(200),
    description: z.string().optional(),
    price: z.number().min(0, "Giá phải >= 0"),
    category: z.string().min(1, "Danh mục không được để trống"),
});

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const validatedData = ProductSchema.parse(body);

        const db = getFirestore();
        const productsRef = db.collection("products");
        const docRef = await productsRef.add({
            ...validatedData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        await saveToAlgolia(docRef.id, validatedData);

        return {
            success: true,
            id: docRef.id,
            data: validatedData,
        };
    } catch (error: any) {
        if (error.name === "ZodError") {
            throw createError({
                statusCode: 400,
                message: error.errors.map((e: any) => e.message).join(", "),
            });
        }

        throw createError({
            statusCode: 500,
            message: "Có lỗi xảy ra khi tạo sản phẩm",
        });
    }
});
