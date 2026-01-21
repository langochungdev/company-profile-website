import { SCHEMA_TYPE_MAP, type SchemaPageType } from "@/admin/types/schema";
import type { GlobalSchemaConfig, OrganizationSchema, WebSiteSchema } from "@/admin/types/schema/global.schema";
import type { HomeSchemaConfig } from "@/admin/types/schema/page/home.schema";

export function generateGlobalSchema(config: GlobalSchemaConfig): Array<OrganizationSchema | WebSiteSchema> {
    const schemas: Array<OrganizationSchema | WebSiteSchema> = [];

    if (config.organization) {
        const organizationSchema: OrganizationSchema = {
            "@context": "https://schema.org",
            "@type": "Organization",
            ...config.organization,
        };
        schemas.push(organizationSchema);
    }

    if (config.website) {
        const websiteSchema: WebSiteSchema = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            ...config.website,
        };
        schemas.push(websiteSchema);
    }

    return schemas;
}

export function generateHomeSchema(config: HomeSchemaConfig): Array<any> {
    // Home specific schema logic here if needed
    return [];
}

interface ProductData {
    name: string;
    slug?: string;
    description?: string;
    image?: string;
    category?: string;
    price?: number;
    badge?: string;
    features?: Array<{ text: string }>;
}

interface PostData {
    title: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    image?: string;
    author?: string;
    publishedAt?: string;
    category?: string;
}

interface SeoData {
    title: string;
    description: string;
    ogImage: string;
    ogType: string;
}

export function generateProductSchema(product: ProductData, siteUrl = "https://sht.langochung.me"): object {
    const productUrl = `${siteUrl}/product/${product.slug}`;

    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": `${productUrl}/#product`,
        name: product.name,
        description: product.description,
        image: product.image,
        category: product.category,
        brand: {
            "@type": "Brand",
            name: "SHT Security",
        },
        offers: product.price
            ? {
                  "@type": "Offer",
                  price: product.price,
                  priceCurrency: "VND",
                  availability: "https://schema.org/InStock",
                  url: productUrl,
              }
            : undefined,
    };
}

export function generatePostSchema(post: PostData, siteUrl = "https://sht.langochung.me"): object {
    const postUrl = `${siteUrl}/post/${post.slug}`;

    return {
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${postUrl}/#article`,
        headline: post.title,
        description: post.excerpt,
        image: post.image,
        datePublished: post.publishedAt,
        author: post.author
            ? {
                  "@type": "Person",
                  name: post.author,
              }
            : undefined,
        publisher: {
            "@type": "Organization",
            name: "SHT Security",
            logo: {
                "@type": "ImageObject",
                url: `${siteUrl}/images/logo.png`,
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": postUrl,
        },
    };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url?: string }>): object {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

interface ProductSchemaFullInput {
    name: string;
    description: string;
    images: string[];
    sku: string;
    price?: number;
    brand?: string;
    currency?: string;
    url: string;
    priceValidUntil?: string;
    availability?: "https://schema.org/InStock" | "https://schema.org/OutOfStock";
}

export function generateProductSchemaFull(input: ProductSchemaFullInput): object {
    const currentYear = new Date().getFullYear();
    const priceValidUntil = input.priceValidUntil || `${currentYear + 1}-12-31`;

    const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: input.name,
        description: input.description,
        image: input.images,
        sku: input.sku,
        brand: {
            "@type": "Brand",
            name: input.brand || "SHT Security",
        },
    };

    if (input.price && input.price > 0) {
        schema.offers = {
            "@type": "Offer",
            url: input.url,
            priceCurrency: input.currency || "VND",
            price: input.price,
            priceValidUntil,
            availability: input.availability || "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
        };
    }

    return schema;
}

interface CollectionPageInput {
    name: string;
    description: string;
    url: string;
    breadcrumbItems: Array<{ name: string; url: string }>;
}

export function generateCollectionPageSchema(input: CollectionPageInput): object {
    return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: input.name,
        description: input.description,
        url: input.url,
        breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: input.breadcrumbItems.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: item.name,
                item: item.url,
            })),
        },
    };
}

export function generateSeoFromProduct(product: ProductData): SeoData {
    return {
        title: `${product.name} - SHT Security`,
        description: product.description || "",
        ogImage: product.image || "",
        ogType: "product",
    };
}

export function generateSeoFromPost(post: PostData): SeoData {
    return {
        title: `${post.title} - SHT Security`,
        description: post.excerpt || "",
        ogImage: post.image || "",
        ogType: "article",
    };
}

export function getSchemaTypeLabel(schemaType: SchemaPageType): string {
    return SCHEMA_TYPE_MAP[schemaType] || "WebPage";
}

export function generateDefaultSchema(schemaType: SchemaPageType, pageName: string, siteUrl = "https://sht.langochung.me"): object {
    const schemaTypeValue = SCHEMA_TYPE_MAP[schemaType];

    switch (schemaType) {
        case "home":
            return {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "@id": `${siteUrl}/#webpage`,
                name: pageName,
                url: siteUrl,
                isPartOf: {
                    "@type": "WebSite",
                    "@id": `${siteUrl}/#website`,
                    name: "SHT Security",
                    url: siteUrl,
                },
            };

        case "productListing":
            return {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "@id": `${siteUrl}/product/#collection`,
                name: pageName,
                description: "Danh sách sản phẩm",
                url: `${siteUrl}/product`,
            };

        case "postListing":
            return {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "@id": `${siteUrl}/post/#collection`,
                name: pageName,
                description: "Danh sách bài viết",
                url: `${siteUrl}/post`,
            };

        default:
            return {
                "@context": "https://schema.org",
                "@type": schemaTypeValue,
                name: pageName,
                url: siteUrl,
            };
    }
}
