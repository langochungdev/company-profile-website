import { computed, watch, type Ref } from "vue";

interface HeroSlide {
    title?: string;
    description?: string;
    image?: string;
    badge?: string;
    highlight?: string;
}

interface ServiceItem {
    title?: string;
    description?: string;
    image?: string;
}

interface HomePageData {
    hero?: {
        slides?: HeroSlide[];
    };
    services?: {
        sectionTitle?: string;
        items?: ServiceItem[];
    };
    [key: string]: unknown;
}

export function useHomeSeo(pageData: Ref<HomePageData | null>) {
    const runtimeConfig = useRuntimeConfig();
    const SITE_URL = runtimeConfig.public.siteUrl as string;
    const SITE_NAME = runtimeConfig.public.siteName as string;

    const seoMeta = computed(() => {
        const data = pageData.value;
        const firstSlide = data?.hero?.slides?.[0];

        const meta: Record<string, string> = {};

        if (SITE_NAME) {
            meta.title = SITE_NAME;
            meta.ogTitle = SITE_NAME;
            meta.ogSiteName = SITE_NAME;
            meta.twitterTitle = SITE_NAME;
        }

        if (firstSlide?.description) {
            meta.description = firstSlide.description;
            meta.ogDescription = firstSlide.description;
            meta.twitterDescription = firstSlide.description;
        }

        if (firstSlide?.image) {
            meta.ogImage = firstSlide.image;
            meta.twitterImage = firstSlide.image;
            meta.twitterCard = "summary_large_image";
        }

        if (SITE_URL) {
            meta.ogUrl = SITE_URL;
            meta.ogType = "website";
        }

        return meta;
    });

    const schemas = computed(() => {
        const scripts: Array<{ type: string; innerHTML: string }> = [];
        const data = pageData.value;

        if (SITE_NAME && SITE_URL) {
            const organizationSchema: Record<string, any> = {
                "@context": "https://schema.org",
                "@type": "Organization",
                "@id": `${SITE_URL}/#organization`,
                name: SITE_NAME,
                url: SITE_URL,
            };

            const logoUrl = `${SITE_URL}/images/logo.png`;
            if (logoUrl) {
                organizationSchema.logo = {
                    "@type": "ImageObject",
                    url: logoUrl,
                };
            }

            const socialLinks = ["https://www.facebook.com/SHT.security", "https://youtube.com/@SHTsecurity"].filter(Boolean);

            if (socialLinks.length > 0) {
                organizationSchema.sameAs = socialLinks;
            }

            scripts.push({
                type: "application/ld+json",
                innerHTML: JSON.stringify(organizationSchema),
            });

            const websiteSchema: Record<string, any> = {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                name: SITE_NAME,
                url: SITE_URL,
                publisher: {
                    "@id": `${SITE_URL}/#organization`,
                },
            };

            websiteSchema.potentialAction = {
                "@type": "SearchAction",
                target: {
                    "@type": "EntryPoint",
                    urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
            };

            scripts.push({
                type: "application/ld+json",
                innerHTML: JSON.stringify(websiteSchema),
            });

            const firstSlide = data?.hero?.slides?.[0];
            const webpageSchema: Record<string, any> = {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "@id": `${SITE_URL}/#webpage`,
                url: SITE_URL,
                name: SITE_NAME,
                isPartOf: {
                    "@id": `${SITE_URL}/#website`,
                },
                about: {
                    "@id": `${SITE_URL}/#organization`,
                },
            };

            if (firstSlide?.description) {
                webpageSchema.description = firstSlide.description;
            }

            if (firstSlide?.image) {
                webpageSchema.primaryImageOfPage = {
                    "@type": "ImageObject",
                    url: firstSlide.image,
                };
            }

            scripts.push({
                type: "application/ld+json",
                innerHTML: JSON.stringify(webpageSchema),
            });
        }

        if (data?.services?.items && data.services.items.length > 0) {
            const itemListSchema: Record<string, any> = {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "@id": `${SITE_URL}/#services`,
            };

            if (data.services.sectionTitle) {
                itemListSchema.name = data.services.sectionTitle;
            }

            itemListSchema.itemListElement = data.services.items
                .map((item: ServiceItem, index: number) => {
                    const listItem: Record<string, any> = {
                        "@type": "ListItem",
                        position: index + 1,
                        item: {
                            "@type": "Service",
                        },
                    };

                    if (item.title) {
                        listItem.item.name = item.title;
                    }

                    if (item.description) {
                        listItem.item.description = item.description;
                    }

                    if (item.image) {
                        listItem.item.image = item.image;
                    }

                    if (SITE_URL) {
                        listItem.item.provider = {
                            "@id": `${SITE_URL}/#organization`,
                        };
                    }

                    return listItem;
                })
                .filter((item) => item.item.name);

            if (itemListSchema.itemListElement.length > 0) {
                scripts.push({
                    type: "application/ld+json",
                    innerHTML: JSON.stringify(itemListSchema),
                });
            }
        }

        return scripts;
    });

    useSeoMeta(seoMeta.value);

    useHead({
        script: schemas,
    });

    if (import.meta.dev) {
        watch(pageData, (newData) => {
            console.log("[useHomeSeo] Page data updated:", newData);
            console.log("[useHomeSeo] SEO Meta:", seoMeta.value);
        });
    }

    return {
        seoMeta,
        schemas,
    };
}
