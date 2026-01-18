// Type SEO + Open Graph gộp chung - Áp dụng cho ALL pages (page, listing, detail)

export interface PageMeta {
    title: string;
    description: string;
    keywords?: string;
    robots: "index,follow" | "noindex,nofollow" | "index,nofollow" | "noindex,follow";
    canonical?: string;

    ogTitle?: string;
    ogDescription?: string;
    ogImage: string;
    ogImageAlt?: string;
    ogType: "website" | "article" | "product";

    twitterCard?: "summary" | "summary_large_image";
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
}

export const DEFAULT_META: PageMeta = {
    title: "",
    description: "",
    robots: "index,follow",
    ogImage: "",
    ogType: "website",
    twitterCard: "summary_large_image",
};

export interface MetaFieldConfig {
    type: "text" | "textarea" | "image" | "select";
    label: string;
    note?: string;
    max?: number;
    required?: boolean;
    default?: string;
    options?: string[] | { value: string; label: string }[];
}

export const META_FIELDS: Record<keyof PageMeta, MetaFieldConfig> = {
    title: {
        type: "text",
        label: "Meta Title",
        note: "Tiêu đề hiển thị trên Google. Tối đa 60 ký tự",
        max: 60,
        required: true,
    },
    description: {
        type: "textarea",
        label: "Meta Description",
        note: "Mô tả hiển thị trên Google. Tối đa 160 ký tự",
        max: 160,
        required: true,
    },
    keywords: {
        type: "text",
        label: "Keywords",
        note: "Từ khóa phân cách bằng dấu phẩy",
        max: 200,
    },
    robots: {
        type: "select",
        label: "Robots",
        options: [
            { value: "index,follow", label: "Index & Follow (default)" },
            { value: "noindex,nofollow", label: "No Index & No Follow" },
            { value: "index,nofollow", label: "Index & No Follow" },
            { value: "noindex,follow", label: "No Index & Follow" },
        ],
        default: "index,follow",
    },
    canonical: {
        type: "text",
        label: "Canonical URL",
        note: "URL chuẩn của trang. Để trống sẽ tự động dùng URL hiện tại",
    },
    ogTitle: {
        type: "text",
        label: "OG Title",
        note: "Tiêu đề khi share Facebook/LinkedIn. Để trống sẽ dùng Meta Title",
        max: 60,
    },
    ogDescription: {
        type: "textarea",
        label: "OG Description",
        note: "Mô tả khi share. Để trống sẽ dùng Meta Description",
        max: 160,
    },
    ogImage: {
        type: "image",
        label: "OG Image",
        note: "Ảnh khi share. Kích thước tối ưu: 1200x630px",
        required: true,
    },
    ogImageAlt: {
        type: "text",
        label: "OG Image Alt",
        note: "Mô tả ảnh cho accessibility",
        max: 125,
    },
    ogType: {
        type: "select",
        label: "OG Type",
        options: [
            { value: "website", label: "Website" },
            { value: "article", label: "Article" },
            { value: "product", label: "Product" },
        ],
        default: "website",
    },
    twitterCard: {
        type: "select",
        label: "Twitter Card",
        options: [
            { value: "summary_large_image", label: "Large Image" },
            { value: "summary", label: "Summary" },
        ],
        default: "summary_large_image",
    },
    twitterTitle: {
        type: "text",
        label: "Twitter Title",
        note: "Để trống sẽ dùng OG Title",
        max: 60,
    },
    twitterDescription: {
        type: "textarea",
        label: "Twitter Description",
        note: "Để trống sẽ dùng OG Description",
        max: 160,
    },
    twitterImage: {
        type: "text",
        label: "Twitter Image",
        note: "Để trống sẽ dùng OG Image",
    },
};

export const createMetaSection = (collapsed = true) => ({
    label: "SEO & Open Graph",
    collapsed,
    fields: META_FIELDS,
});
