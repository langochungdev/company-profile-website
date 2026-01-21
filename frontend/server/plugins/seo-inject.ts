/**
 * Nitro Plugin: Auto-inject SEO/OG/Schema vào HTML
 */

import { fetchSeoSettings, escapeHtml } from "../utils/seo-cache";

const PAGE_KEY_MAP: Record<string, string> = {
    "/": "home",
    "/about": "about",
    "/services": "services",
    "/projects": "projects",
    "/contact": "contact",
    "/news": "news",
};

function getPageKeyFromPath(path: string): string | null {
    if (path.startsWith("/admin") || path.startsWith("/api") || path.startsWith("/_")) {
        return null;
    }

    const cleanPath = path.split("?")[0]?.split("#")[0] || path;
    return PAGE_KEY_MAP[cleanPath] || null;
}

function generateMetaTags(settings: any, siteUrl: string, path: string): string[] {
    const tags: string[] = [];
    const seo = settings.seo || {};
    const og = settings.openGraph || {};

    if (seo.title) {
        tags.push(`<title>${escapeHtml(seo.title)}</title>`);
        tags.push(`<meta name="title" content="${escapeHtml(seo.title)}">`);
    }

    if (seo.description) {
        tags.push(`<meta name="description" content="${escapeHtml(seo.description)}">`);
    }

    if (seo.keywords) {
        tags.push(`<meta name="keywords" content="${escapeHtml(seo.keywords)}">`);
    }

    if (seo.robots) {
        tags.push(`<meta name="robots" content="${escapeHtml(seo.robots)}">`);
    }

    const canonical = seo.canonical || `${siteUrl}${path}`;
    tags.push(`<link rel="canonical" href="${escapeHtml(canonical)}">`);

    tags.push(`<meta property="og:url" content="${escapeHtml(canonical)}">`);
    tags.push(`<meta property="og:type" content="${escapeHtml(og.ogType || "website")}">`);
    tags.push(`<meta property="og:title" content="${escapeHtml(og.ogTitle || seo.title || "")}">`);
    tags.push(`<meta property="og:description" content="${escapeHtml(og.ogDescription || seo.description || "")}">`);

    const ogImage = og.ogImage || `${siteUrl}/seo/banner.png`;
    tags.push(`<meta property="og:image" content="${escapeHtml(ogImage)}">`);
    tags.push(`<meta property="og:image:width" content="1200">`);
    tags.push(`<meta property="og:image:height" content="630">`);
    if (og.ogImageAlt) {
        tags.push(`<meta property="og:image:alt" content="${escapeHtml(og.ogImageAlt)}">`);
    }

    tags.push(`<meta name="twitter:card" content="${escapeHtml(og.twitterCard || "summary_large_image")}">`);
    tags.push(`<meta name="twitter:title" content="${escapeHtml(og.twitterTitle || og.ogTitle || seo.title || "")}">`);
    tags.push(`<meta name="twitter:description" content="${escapeHtml(og.twitterDescription || og.ogDescription || seo.description || "")}">`);

    if (og.twitterImage || og.ogImage) {
        tags.push(`<meta name="twitter:image" content="${escapeHtml(og.twitterImage || og.ogImage)}">`);
    }

    return tags;
}

async function generateSchemaScript(settings: any, pageKey: string): Promise<string | null> {
    const schemaConfig = settings.schema?.config || {};

    try {
        const { generateHomeSchema, generateGlobalSchema } = await import("~/admin/utils/schema-generator");

        // 1. Generate Global Schema (Always)
        // Note: Using hardcoded defaults here since Global UI is not built yet.
        // In future, this should come from a fetchGlobalSettings() call.
        const globalConfig = {
            organization: {
                name: "SHT Security",
                url: "https://sht.langochung.me",
                telephone: "0901 234 567",
                email: "info@sht.vn",
                address: {
                    "@type": "PostalAddress" as const,
                    streetAddress: "123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh",
                },
            },
            website: {
                name: "SHT Security",
                url: "https://sht.langochung.me",
            },
        };

        let allSchemas: any[] = generateGlobalSchema(globalConfig);

        // 2. Generate Page Specific Schema
        let pageSchemas: any[] = [];
        if (pageKey === "home") {
            // Home page now has empty/minimal specific schema
            pageSchemas = generateHomeSchema(schemaConfig);
        } else {
            // Other pages might use the raw config as schema for now
            if (Object.keys(schemaConfig).length > 0) {
                // Wrap in array if not
                pageSchemas = Array.isArray(schemaConfig) ? schemaConfig : [schemaConfig];
            }
        }

        if (pageSchemas.length > 0) {
            allSchemas = [...allSchemas, ...pageSchemas];
        }

        if (allSchemas.length === 0) return null;

        return allSchemas.map((schema) => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`).join("\n");
    } catch (error) {
        console.error(`[seo-inject] Error generating schema for ${pageKey}:`, error);
        return null; // Don't crash request
    }
}

export default defineNitroPlugin((nitro) => {
    nitro.hooks.hook("render:html", async (html, { event }) => {
        const path = event.path;
        const pageKey = getPageKeyFromPath(path);

        if (!pageKey) {
            return;
        }

        try {
            const settings = await fetchSeoSettings(pageKey);

            if (!settings || Object.keys(settings).length === 0) {
                return;
            }

            const config = useRuntimeConfig();
            const siteUrl = (config.public.siteUrl as string) || "https://example.com";

            const metaTags = generateMetaTags(settings, siteUrl, path);
            metaTags.forEach((tag) => {
                html.head.push(tag);
            });

            const schemaScript = await generateSchemaScript(settings, pageKey);
            if (schemaScript) {
                html.head.push(schemaScript);
            }
        } catch (error) {
            console.error(`[seo-inject] Error injecting SEO for ${path}:`, error);
        }
    });
});
