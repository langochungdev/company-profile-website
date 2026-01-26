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
        console.log("[API Services] Received body:", JSON.stringify(body, null, 2));

        const validatedData = ServiceSchema.parse(body);
        console.log("[API Services] Validated data:", validatedData);

        const db = getFirestore();
        const servicesRef = db.collection("services");
        const docRef = await servicesRef.add({
            ...validatedData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        console.log("[API Services] Created doc:", docRef.id);

        await saveToAlgolia(docRef.id, validatedData, "SERVICE");
        console.log("[API Services] Synced to Algolia");

        return {
            success: true,
            id: docRef.id,
            data: validatedData,
        };
    } catch (error: any) {
        console.error("[API] Create service error:", error);
        console.error("[API] Error stack:", error.stack);

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
