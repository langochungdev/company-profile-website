/** Composable auto-generate SEO, OG, Schema từ CMS config và item data */

import { computed, type Ref, type ComputedRef } from "vue";
import { generateProductSchemaFull, generateCollectionPageSchema, generateBreadcrumbSchema } from "@/admin/utils/schema-generator";

interface SeoMapping {
    title: string;
    description: string;
    image: string;
    priceField?: string;
    categoryField?: string;
}

interface SchemaMapping {
    name: string;
    description: string;
    image: string;
    gallery?: string;
    sku: string;
    price?: string;
    brand?: string;
    currency?: string;
}

interface ListingMeta {
    title: string;
    description: string;
}

interface AutoSeoConfig {
    schemaType?: string;
    listingSchemaType?: string;
    seoMapping?: SeoMapping;
    schemaMapping?: SchemaMapping;
    listingMeta?: ListingMeta;
    collection?: string;
}

interface ItemData {
    id?: string;
    name?: string;
    slug?: string;
    description?: string;
    image?: string;
    gallery?: Array<{ url: string }>;
    price?: number;
    category?: string;
    metaTitle?: string;
    metaDescription?: string;
    [key: string]: unknown;
}

function getFieldValue(item: ItemData, fieldPath: string, fallback = ""): string {
    if (!item || !fieldPath) return fallback;
    const value = item[fieldPath];
    return typeof value === "string" ? value : fallback;
}

function getNumberValue(item: ItemData, fieldPath: string): number | undefined {
    if (!item || !fieldPath) return undefined;
    const value = item[fieldPath];
    return typeof value === "number" ? value : undefined;
}

export function useAutoSeo(config: AutoSeoConfig, item?: Ref<ItemData | null> | ComputedRef<ItemData | null>) {
    const runtimeConfig = useRuntimeConfig();
    const SITE_URL = runtimeConfig.public.siteUrl as string;
    const SITE_NAME = runtimeConfig.public.siteName as string;

    const isDetailPage = computed(() => !!item?.value);

    const seoData = computed(() => {
        if (isDetailPage.value && item?.value) {
            const data = item.value;
            const mapping = config.seoMapping;

            const title = data.metaTitle || getFieldValue(data, mapping?.title || "name") || data.name || "";

            const description = data.metaDescription || getFieldValue(data, mapping?.description || "description") || data.description || "";

            const image = getFieldValue(data, mapping?.image || "image") || data.image || "";

            return {
                title: title ? `${title} - ${SITE_NAME}` : SITE_NAME,
                description,
                ogTitle: title,
                ogDescription: description,
                ogImage: image,
                ogType: "website" as const,
            };
        }

        const listingMeta = config.listingMeta;
        return {
            title: listingMeta?.title ? `${listingMeta.title} - ${SITE_NAME}` : SITE_NAME,
            description: listingMeta?.description || "",
            ogTitle: listingMeta?.title || SITE_NAME,
            ogDescription: listingMeta?.description || "",
            ogImage: "",
            ogType: "website" as const,
        };
    });

    const schemas = computed(() => {
        const scripts: Array<{ type: string; innerHTML: string }> = [];

        if (isDetailPage.value && item?.value) {
            const data = item.value;
            const mapping = config.schemaMapping;

            const images: string[] = [];
            const mainImage = getFieldValue(data, mapping?.image || "image") || data.image;
            if (mainImage) images.push(mainImage);

            if (data.gallery && Array.isArray(data.gallery)) {
                data.gallery.forEach((g) => {
                    if (g.url) images.push(g.url);
                });
            }

            const productSchema = generateProductSchemaFull({
                name: getFieldValue(data, mapping?.name || "name") || data.name || "",
                description: getFieldValue(data, mapping?.description || "description") || data.description || "",
                images,
                sku: getFieldValue(data, mapping?.sku || "slug") || data.slug || data.id || "",
                price: getNumberValue(data, mapping?.price || "price") ?? data.price,
                brand: mapping?.brand || SITE_NAME,
                currency: mapping?.currency || "VND",
                url: `${SITE_URL}/product/${data.slug || data.id}`,
            });

            scripts.push({
                type: "application/ld+json",
                innerHTML: JSON.stringify(productSchema),
            });

            const breadcrumb = generateBreadcrumbSchema([
                { name: "Trang Chủ", url: SITE_URL },
                { name: config.listingMeta?.title || "Sản Phẩm", url: `${SITE_URL}/product` },
                { name: data.name || "", url: `${SITE_URL}/product/${data.slug || data.id}` },
            ]);

            scripts.push({
                type: "application/ld+json",
                innerHTML: JSON.stringify(breadcrumb),
            });
        } else {
            const collectionSchema = generateCollectionPageSchema({
                name: config.listingMeta?.title || "Sản Phẩm",
                description: config.listingMeta?.description || "",
                url: `${SITE_URL}/product`,
                breadcrumbItems: [
                    { name: "Trang Chủ", url: SITE_URL },
                    { name: config.listingMeta?.title || "Sản Phẩm", url: `${SITE_URL}/product` },
                ],
            });

            scripts.push({
                type: "application/ld+json",
                innerHTML: JSON.stringify(collectionSchema),
            });
        }

        return scripts;
    });

    useSeoMeta({
        title: () => seoData.value.title,
        description: () => seoData.value.description,
        ogTitle: () => seoData.value.ogTitle,
        ogDescription: () => seoData.value.ogDescription,
        ogImage: () => seoData.value.ogImage,
        ogType: () => seoData.value.ogType,
    });

    useHead({
        script: schemas,
    });

    return {
        seoData,
        schemas,
    };
}
