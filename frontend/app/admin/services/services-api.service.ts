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
        } catch (error) {}
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
        } catch (error) {}
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
        } catch (error) {}
    },
};
