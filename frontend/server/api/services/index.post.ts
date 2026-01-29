import { z } from "zod";
import { getFirestore } from "firebase-admin/firestore";
import { saveToAlgolia } from "../../utils/algolia";

const ServiceSchema = z.object({
    name: z.string().min(1, "Tên dự án không được để trống").max(200),
    categories: z.array(z.string()).min(1, "Phải chọn ít nhất 1 danh mục"),
    description: z.string().optional(),
    location: z.string().min(1, "Địa điểm không được để trống"),
    completedDate: z.string().min(1, "Ngày hoàn thành không được để trống"),
});

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);

        const validatedData = ServiceSchema.parse(body);

        const db = getFirestore();
        const servicesRef = db.collection("services");
        const docRef = await servicesRef.add({
            ...validatedData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        await saveToAlgolia(docRef.id, validatedData, "SERVICE");

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
            message: error.message || "Có lỗi xảy ra khi tạo dự án",
        });
    }
});
