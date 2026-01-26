export const ServicesApiService = {
    async syncCreate(objectID: string, data: Record<string, unknown>) {
        try {
            await $fetch("/api/algolia/sync", {
                method: "POST",
                body: {
                    action: "create",
                    objectID,
                    data,
                    collection: "SERVICE",
                },
            });
        } catch (error) {
            console.error("[ServicesApiService] Sync create error:", error);
        }
    },

    async syncUpdate(objectID: string, data: Record<string, unknown>) {
        try {
            await $fetch("/api/algolia/sync", {
                method: "POST",
                body: {
                    action: "update",
                    objectID,
                    data,
                    collection: "SERVICE",
                },
            });
        } catch (error) {
            console.error("[ServicesApiService] Sync update error:", error);
        }
    },

    async syncDelete(objectID: string) {
        try {
            await $fetch("/api/algolia/sync", {
                method: "POST",
                body: {
                    action: "delete",
                    objectID,
                    collection: "SERVICE",
                },
            });
        } catch (error) {
            console.error("[ServicesApiService] Sync delete error:", error);
        }
    },
};
