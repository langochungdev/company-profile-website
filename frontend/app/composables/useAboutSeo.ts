import { computed, watch, type Ref } from "vue";

interface AboutPageData {
    content?: {
        hero?: {
            title?: string;
            highlight?: string;
            description?: string;
        };
        intro?: {
            image?: string;
            sectionTitle?: string;
            descriptions?: Array<{ text: string }>;
        };
        stats?: {
            items?: Array<{ value: string; label: string }>;
        };
        values?: {
            sectionTitle?: string;
            highlightText?: string;
            items?: Array<{ title: string; description: string }>;
        };
    };
    [key: string]: unknown;
}

export function useAboutSeo(pageData: Ref<AboutPageData | null>) {
    const runtimeConfig = useRuntimeConfig();
    const SITE_URL = runtimeConfig.public.siteUrl as string;
    const SITE_NAME = runtimeConfig.public.siteName as string;

    const seoMeta = computed(() => {
        const data = pageData.value;
        const hero = data?.content?.hero;
        const intro = data?.content?.intro;

        const meta: Record<string, string> = {};

        const pageTitle = hero?.title && hero?.highlight ? `${hero.title} ${hero.highlight}` : null;

        if (pageTitle && SITE_NAME) {
            meta.title = `${pageTitle} - ${SITE_NAME}`;
            meta.ogTitle = pageTitle;
            meta.twitterTitle = pageTitle;
        } else if (SITE_NAME) {
            meta.title = `Giới Thiệu - ${SITE_NAME}`;
            meta.ogTitle = "Giới Thiệu";
            meta.twitterTitle = "Giới Thiệu";
        }

        const description = hero?.description || intro?.descriptions?.[0]?.text;
        if (description) {
            meta.description = description;
            meta.ogDescription = description;
            meta.twitterDescription = description;
        }

        if (intro?.image) {
            meta.ogImage = intro.image;
            meta.twitterImage = intro.image;
            meta.twitterCard = "summary_large_image";
        }

        if (SITE_URL) {
            meta.ogUrl = `${SITE_URL}/about-us`;
            meta.ogType = "website";
        }

        if (SITE_NAME) {
            meta.ogSiteName = SITE_NAME;
        }

        return meta;
    });

    const schemas = computed(() => {
        const scripts: Array<{ type: string; innerHTML: string }> = [];
        const data = pageData.value;
        const hero = data?.content?.hero;
        const intro = data?.content?.intro;

        if (SITE_URL) {
            const aboutPageSchema: Record<string, any> = {
                "@context": "https://schema.org",
                "@type": "AboutPage",
                "@id": `${SITE_URL}/about-us#aboutpage`,
                url: `${SITE_URL}/about-us`,
                isPartOf: {
                    "@id": `${SITE_URL}/#website`,
                },
                about: {
                    "@id": `${SITE_URL}/#organization`,
                },
            };

            const pageName = hero?.title && hero?.highlight ? `${hero.title} ${hero.highlight}` : null;
            if (pageName) {
                aboutPageSchema.name = pageName;
            }

            if (hero?.description) {
                aboutPageSchema.description = hero.description;
            }

            if (intro?.image) {
                aboutPageSchema.primaryImageOfPage = {
                    "@type": "ImageObject",
                    url: intro.image,
                };
            }

            scripts.push({
                type: "application/ld+json",
                innerHTML: JSON.stringify(aboutPageSchema),
            });

            const breadcrumbSchema = {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: "Trang Chủ",
                        item: SITE_URL,
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: "Giới Thiệu",
                        item: `${SITE_URL}/about-us`,
                    },
                ],
            };

            scripts.push({
                type: "application/ld+json",
                innerHTML: JSON.stringify(breadcrumbSchema),
            });
        }

        return scripts;
    });

    useSeoMeta(seoMeta.value);

    useHead({
        script: schemas,
    });

    if (import.meta.dev) {
        watch(pageData, (newData) => {
            console.log("[useAboutSeo] Page data updated:", newData);
            console.log("[useAboutSeo] SEO Meta:", seoMeta.value);
        });
    }

    return {
        seoMeta,
        schemas,
    };
}
