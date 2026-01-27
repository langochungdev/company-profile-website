export interface PostData {
    id?: string;
    title: string;
    slug: string;
    category: string;
    tags?: string[];
    excerpt?: string;
    thumbnail?: {
        url: string;
        alt: string;
        title: string;
        width: number;
        height: number;
    };
    content?: string;
    author?: string;
    publishedAt?: string;
    featured?: boolean;
    status?: string;
    [key: string]: any;
}

export const PostsApiService = {
    async syncCreate(objectID: string, data: Omit<PostData, "id">): Promise<{ success: boolean }> {
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

    async syncUpdate(objectID: string, data: Partial<PostData>): Promise<{ success: boolean }> {
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
