import { computed, type Ref } from "vue";

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
        if (!data) {
            return {
                title: SITE_NAME,
                description: "",
                ogTitle: SITE_NAME,
                ogDescription: "",
                ogImage: "",
            };
        }

        const firstSlide = data.hero?.slides?.[0];
        const title = SITE_NAME;
        const description = firstSlide?.description || "Giải pháp an ninh toàn diện cho doanh nghiệp";
        const image = firstSlide?.image || "";

        return {
            title,
            description,
            ogTitle: title,
            ogDescription: description,
            ogImage: image,
            ogType: "website" as const,
            ogUrl: SITE_URL,
            ogSiteName: SITE_NAME,
            twitterCard: "summary_large_image" as const,
            twitterTitle: title,
            twitterDescription: description,
            twitterImage: image,
        };
    });

    const schemas = computed(() => {
        const scripts: Array<{ type: string; innerHTML: string }> = [];
        const data = pageData.value;

        const organizationSchema = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": `${SITE_URL}/#organization`,
            name: SITE_NAME,
            url: SITE_URL,
            logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/images/logo.png`,
            },
            sameAs: ["https://www.facebook.com/SHT.security", "https://youtube.com/@SHTsecurity"],
        };

        scripts.push({
            type: "application/ld+json",
            innerHTML: JSON.stringify(organizationSchema),
        });

        const websiteSchema = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            name: SITE_NAME,
            url: SITE_URL,
            publisher: {
                "@id": `${SITE_URL}/#organization`,
            },
            potentialAction: {
                "@type": "SearchAction",
                target: {
                    "@type": "EntryPoint",
                    urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
            },
        };

        scripts.push({
            type: "application/ld+json",
            innerHTML: JSON.stringify(websiteSchema),
        });

        const firstSlide = data?.hero?.slides?.[0];
        const webpageSchema = {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${SITE_URL}/#webpage`,
            url: SITE_URL,
            name: SITE_NAME,
            description: firstSlide?.description || "Giải pháp an ninh toàn diện cho doanh nghiệp",
            isPartOf: {
                "@id": `${SITE_URL}/#website`,
            },
            about: {
                "@id": `${SITE_URL}/#organization`,
            },
            primaryImageOfPage: firstSlide?.image
                ? {
                      "@type": "ImageObject",
                      url: firstSlide.image,
                  }
                : undefined,
        };

        scripts.push({
            type: "application/ld+json",
            innerHTML: JSON.stringify(webpageSchema),
        });

        if (data?.services?.items && data.services.items.length > 0) {
            const itemListSchema = {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "@id": `${SITE_URL}/#services`,
                name: data.services.sectionTitle || "Dịch vụ",
                itemListElement: data.services.items.map((item: ServiceItem, index: number) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    item: {
                        "@type": "Service",
                        name: item.title || "",
                        description: item.description || "",
                        image: item.image || "",
                        provider: {
                            "@id": `${SITE_URL}/#organization`,
                        },
                    },
                })),
            };

            scripts.push({
                type: "application/ld+json",
                innerHTML: JSON.stringify(itemListSchema),
            });
        }

        return scripts;
    });

    useSeoMeta({
        title: () => seoMeta.value.title,
        description: () => seoMeta.value.description,
        ogTitle: () => seoMeta.value.ogTitle,
        ogDescription: () => seoMeta.value.ogDescription,
        ogImage: () => seoMeta.value.ogImage,
        ogType: () => seoMeta.value.ogType,
        ogUrl: () => seoMeta.value.ogUrl,
        ogSiteName: () => seoMeta.value.ogSiteName,
        twitterCard: () => seoMeta.value.twitterCard,
        twitterTitle: () => seoMeta.value.twitterTitle,
        twitterDescription: () => seoMeta.value.twitterDescription,
        twitterImage: () => seoMeta.value.twitterImage,
    });

    useHead({
        script: schemas,
    });

    return {
        seoMeta,
        schemas,
    };
}
