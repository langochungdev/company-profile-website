/**
 * Composable: Override SEO settings cho page cụ thể
 */

interface SeoOverrideOptions {
    title?: string;
    description?: string;
    keywords?: string;
    robots?: string;
    canonical?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogType?: string;
    twitterCard?: string;
    schema?: Record<string, unknown>;
}

export function useSeoOverride(options: SeoOverrideOptions) {
    const metaTags: { name?: string; property?: string; content: string }[] = [];

    if (options.description) {
        metaTags.push({ name: "description", content: options.description });
    }

    if (options.keywords) {
        metaTags.push({ name: "keywords", content: options.keywords });
    }

    if (options.robots) {
        metaTags.push({ name: "robots", content: options.robots });
    }

    if (options.ogTitle || options.title) {
        metaTags.push({ property: "og:title", content: options.ogTitle || options.title || "" });
    }

    if (options.ogDescription || options.description) {
        metaTags.push({ property: "og:description", content: options.ogDescription || options.description || "" });
    }

    if (options.ogImage) {
        metaTags.push({ property: "og:image", content: options.ogImage });
    }

    if (options.ogType) {
        metaTags.push({ property: "og:type", content: options.ogType });
    }

    if (options.twitterCard) {
        metaTags.push({ name: "twitter:card", content: options.twitterCard });
    }

    const headConfig: {
        title?: string;
        meta: typeof metaTags;
        link: { rel: string; href: string }[];
        script: { type: string; innerHTML: string }[];
    } = {
        meta: metaTags,
        link: [],
        script: [],
    };

    if (options.title) {
        headConfig.title = options.title;
    }

    if (options.canonical) {
        headConfig.link.push({ rel: "canonical", href: options.canonical });
    }

    if (options.schema && Object.keys(options.schema).length > 0) {
        headConfig.script.push({
            type: "application/ld+json",
            innerHTML: JSON.stringify(options.schema),
        });
    }

    useHead(headConfig);
}
