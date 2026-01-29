export const generateArticleSchema = (post: any, siteUrl: string) => {
    if (!post || post.isPlaceholder) return null;

    return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.description || post.excerpt || "",
        image: post.thumbnail || post.image || "",
        datePublished: post.date || new Date().toISOString(),
        dateModified: post.updatedAt || post.date || new Date().toISOString(),
        author: {
            "@type": "Person",
            name: post.author || "SHT Security Team",
        },
        publisher: {
            "@type": "Organization",
            name: "SHT Security",
            logo: {
                "@type": "ImageObject",
                url: `${siteUrl}/logo.png`,
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${siteUrl}/post/${post.slug}`,
        },
    };
};

export const generateServiceSchema = (service: any, siteUrl: string) => {
    if (!service || service.isPlaceholder) return null;

    return {
        "@context": "https://schema.org",
        "@type": "Service",
        name: service.name || service.title,
        description: service.description || "",
        provider: {
            "@type": "Organization",
            name: "SHT Security",
            url: siteUrl,
        },
        areaServed: {
            "@type": "Country",
            name: "Vietnam",
        },
        serviceType: service.category || "Security Solutions",
    };
};

export const generateProductSchema = (product: any, siteUrl: string) => {
    if (!product || product.isPlaceholder) return null;

    return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description || "",
        image: product.image?.url || product.image || "",
        brand: {
            "@type": "Brand",
            name: product.brand || "SHT Security",
        },
        offers: product.price
            ? {
                  "@type": "Offer",
                  price: product.price,
                  priceCurrency: "VND",
                  availability: "https://schema.org/InStock",
                  url: `${siteUrl}/product/${product.slug}`,
              }
            : undefined,
        category: product.category || "",
    };
};

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => {
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
};
