export interface ProductData {
    id?: string;
    name: string;
    description?: string;
    price: number;
    category: string;
    slug?: string;
    tags?: any[];
    images?: any[];
    content?: string;
    [key: string]: any;
}

export const ProductsApiService = {
    async syncCreate(objectID: string, data: Omit<ProductData, "id">): Promise<{ success: boolean }> {
        const response = await $fetch("/api/algolia/sync", {
            method: "POST",
            body: {
                action: "create",
                objectID,
                data,
            },
        });
        return response as any;
    },

    async syncUpdate(objectID: string, data: Partial<ProductData>): Promise<{ success: boolean }> {
        const response = await $fetch("/api/algolia/sync", {
            method: "POST",
            body: {
                action: "update",
                objectID,
                data,
            },
        });
        return response as any;
    },

    async syncDelete(objectID: string): Promise<{ success: boolean }> {
        const response = await $fetch("/api/algolia/sync", {
            method: "POST",
            body: {
                action: "delete",
                objectID,
            },
        });
        return response as any;
    },

    async search(query: string): Promise<{ hits: any[]; total: number }> {
        const response = await $fetch("/api/search", {
            method: "GET",
            query: { q: query },
        });
        return response as any;
    },
};
