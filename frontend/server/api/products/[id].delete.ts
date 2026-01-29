import { getFirestore } from "firebase-admin/firestore";
import { deleteFromAlgolia } from "../../utils/algolia";

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, "id");
        if (!id) {
            throw createError({
                statusCode: 400,
                message: "ID sản phẩm không hợp lệ",
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

        await docRef.delete();

        await deleteFromAlgolia(id);

        return {
            success: true,
            id,
        };
    } catch (error: any) {
        if (error.statusCode) throw error;

        throw createError({
            statusCode: 500,
            message: "Có lỗi xảy ra khi xóa sản phẩm",
        });
    }
});
