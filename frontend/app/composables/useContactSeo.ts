import { computed, watch, type Ref } from "vue";

interface ContactPageData {
    content?: {
        info?: {
            title?: string;
            items?: Array<{
                label: string;
                value: string;
                icon: string;
            }>;
        };
        socials?: {
            items?: Array<{
                name: string;
                icon: string;
                url: string;
            }>;
        };
        map?: {
            title?: string;
            embedUrl?: string;
        };
    };
    [key: string]: unknown;
}

export function useContactSeo(pageData: Ref<ContactPageData | null>) {
    const runtimeConfig = useRuntimeConfig();
    const SITE_URL = runtimeConfig.public.siteUrl as string;
    const SITE_NAME = runtimeConfig.public.siteName as string;

    const seoMeta = computed(() => {
        const data = pageData.value;
        const info = data?.content?.info;

        const meta: Record<string, string> = {};

        if (SITE_NAME) {
            meta.title = `Liên Hệ - ${SITE_NAME}`;
            meta.ogTitle = "Liên Hệ";
            meta.ogSiteName = SITE_NAME;
            meta.twitterTitle = "Liên Hệ";
        }

        if (info?.title) {
            meta.description = info.title;
            meta.ogDescription = info.title;
            meta.twitterDescription = info.title;
        }

        if (SITE_URL) {
            meta.ogUrl = `${SITE_URL}/contact`;
            meta.ogType = "website";
        }

        meta.twitterCard = "summary";

        return meta;
    });

    const schemas = computed(() => {
        const scripts: Array<{ type: string; innerHTML: string }> = [];
        const data = pageData.value;
        const info = data?.content?.info;

        if (SITE_URL) {
            const contactPageSchema: Record<string, any> = {
                "@context": "https://schema.org",
                "@type": "ContactPage",
                "@id": `${SITE_URL}/contact#contactpage`,
                url: `${SITE_URL}/contact`,
                name: "Liên Hệ",
                isPartOf: {
                    "@id": `${SITE_URL}/#website`,
                },
            };

            if (info?.title) {
                contactPageSchema.description = info.title;
            }

            scripts.push({
                type: "application/ld+json",
                innerHTML: JSON.stringify(contactPageSchema),
            });

            if (info?.items && info.items.length > 0 && SITE_NAME) {
                const phoneItem = info.items.find((item) => item?.label?.toLowerCase().includes("điện thoại") || item?.label?.toLowerCase().includes("phone"));
                const emailItem = info.items.find((item) => item?.label?.toLowerCase().includes("email"));
                const addressItem = info.items.find((item) => item?.label?.toLowerCase().includes("địa chỉ") || item?.label?.toLowerCase().includes("address"));

                if (phoneItem || emailItem || addressItem) {
                    const contactPointSchema: Record<string, any> = {
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "@id": `${SITE_URL}/#organization`,
                        name: SITE_NAME,
                        url: SITE_URL,
                    };

                    const contactPoint: Record<string, any> = {
                        "@type": "ContactPoint",
                        contactType: "customer service",
                        areaServed: "VN",
                        availableLanguage: ["vi", "en"],
                    };

                    if (phoneItem?.value) {
                        contactPoint.telephone = phoneItem.value;
                    }

                    if (emailItem?.value) {
                        contactPoint.email = emailItem.value;
                    }

                    contactPointSchema.contactPoint = contactPoint;

                    if (addressItem?.value) {
                        contactPointSchema.address = {
                            "@type": "PostalAddress",
                            streetAddress: addressItem.value,
                            addressCountry: "VN",
                        };
                    }

                    scripts.push({
                        type: "application/ld+json",
                        innerHTML: JSON.stringify(contactPointSchema),
                    });
                }
            }

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
                        name: "Liên Hệ",
                        item: `${SITE_URL}/contact`,
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
            console.log("[useContactSeo] Page data updated:", newData);
            console.log("[useContactSeo] SEO Meta:", seoMeta.value);
        });
    }

    return {
        seoMeta,
        schemas,
    };
}
