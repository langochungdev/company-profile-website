import { algoliasearch } from "algoliasearch";

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event);
        const searchQuery = (query.q as string) || "";

        if (!searchQuery.trim()) {
            return {
                hits: [],
                total: 0,
            };
        }

        const config = useRuntimeConfig();
        const isProd = config.public.envIsProd;
        const indexName = isProd ? config.algoliaIndexNameProd : config.algoliaIndexNameDev;
        const client = algoliasearch(config.algoliaAppId, config.public.algoliaSearchKey);

        const { results } = await client.search({
            requests: [
                {
                    indexName,
                    query: searchQuery,
                    hitsPerPage: 20,
                },
            ],
        });

        const firstResult = results[0];
        const hits = "hits" in firstResult ? firstResult.hits : [];
        const nbHits = "nbHits" in firstResult ? firstResult.nbHits : 0;

        return {
            hits,
            total: nbHits,
        };
    } catch (error: any) {
        console.error("[API] Search error:", error);
        throw createError({
            statusCode: 500,
            message: "Có lỗi xảy ra khi tìm kiếm",
        });
    }
});
