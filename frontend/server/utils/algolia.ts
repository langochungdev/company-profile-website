import { algoliasearch, type Algoliasearch } from "algoliasearch";

let algoliaClient: Algoliasearch | null = null;

export function getAlgoliaClient() {
    if (algoliaClient) return algoliaClient;

    const config = useRuntimeConfig();
    const appId = config.algoliaAppId;
    const adminKey = config.algoliaAdminKey;

    if (!appId || !adminKey) {
        throw new Error("Algolia credentials missing in .env");
    }

    algoliaClient = algoliasearch(appId, adminKey);
    return algoliaClient;
}

function getAlgoliaIndexName(): string {
    const config = useRuntimeConfig();
    const isProd = config.public.envIsProd;
    const indexName = isProd ? config.algoliaIndexNameProd : config.algoliaIndexNameDev;

    if (!indexName) {
        throw new Error("Algolia index name missing in .env");
    }

    return indexName;
}

export async function saveToAlgolia(objectID: string, data: Record<string, any>) {
    const client = getAlgoliaClient();
    const indexName = getAlgoliaIndexName();

    await client.saveObject({
        indexName,
        body: {
            objectID,
            ...data,
        },
    });
}

export async function updateInAlgolia(objectID: string, data: Record<string, any>) {
    const client = getAlgoliaClient();
    const indexName = getAlgoliaIndexName();

    await client.partialUpdateObject({
        indexName,
        objectID,
        attributesToUpdate: data,
    });
}

export async function deleteFromAlgolia(objectID: string) {
    const client = getAlgoliaClient();
    const indexName = getAlgoliaIndexName();

    await client.deleteObject({
        indexName,
        objectID,
    });
}
