/**
 * Cấu hình SEO & Open Graph - Đơn giản hóa thành 2 sections chính
 */

export interface FieldConfig {
    type: "text" | "textarea" | "image" | "select" | "boolean" | "number" | "array" | "group";
    label: string;
    note?: string;
    max?: number;
    min?: number;
    required?: boolean;
    default?: string | number | boolean;
    options?: string[] | { value: string; label: string }[];
    showIf?: { field: string; value: string | string[] };
    schema?: Record<string, FieldConfig>;
    fields?: Record<string, FieldConfig>;
}

export interface SectionConfig {
    label: string;
    collapsed?: boolean;
    fields: Record<string, FieldConfig>;
}

export interface seoOpenGraphConfigType {
    page: string;
    pageName: string;
    path: string;
    icon: string;
    order: number;
    group?: string;
    sections: Record<string, SectionConfig>;
}

export const OG_TYPES = [
    { value: "website", label: "Website" },
    { value: "article", label: "Bài viết" },
    { value: "product", label: "Sản phẩm" },
];

export const TWITTER_CARD_TYPES = [
    { value: "summary", label: "Summary - Ảnh nhỏ" },
    { value: "summary_large_image", label: "Summary Large Image - Ảnh lớn" },
];

export const LOCALES = [
    { value: "vi_VN", label: "Tiếng Việt (VN)" },
    { value: "en_US", label: "English (US)" },
    { value: "en_GB", label: "English (UK)" },
    { value: "zh_CN", label: "中文 (简体)" },
    { value: "ja_JP", label: "日本語" },
    { value: "ko_KR", label: "한국어" },
];

export const seoOpenGraphConfig: seoOpenGraphConfigType = {
    page: "open-graph",
    pageName: "SEO & Open Graph",
    path: "config/seo-opengraph",
    icon: "mdi:share-variant",
    order: 100,
    group: "Cài đặt",

    sections: {
        seoGlobal: {
            label: "SEO Global - Thông Tin Website",
            fields: {
                siteName: {
                    type: "text",
                    label: "Tên Website",
                    note: "Tên chính thức của website. VD: SHT Security",
                    default: "SHT Security",
                    max: 50,
                    required: true,
                },
                siteLogo: {
                    type: "image",
                    label: "Logo/Favicon",
                    note: "Logo website hiển thị trên trình duyệt và khi chia sẻ. Kích thước tối ưu: 512x512px",
                    required: true,
                },
                canonicalUrl: {
                    type: "text",
                    label: "URL Canonical",
                    note: "Base URL của website. VD: https://sht.langochung.me (không có / cuối)",
                    required: true,
                },
                robotsIndex: {
                    type: "boolean",
                    label: "Cho phép Index",
                    note: "Bật để Google và search engine có thể index trang này",
                    default: true,
                },
                robotsFollow: {
                    type: "boolean",
                    label: "Cho phép Follow Links",
                    note: "Bật để search engine theo dõi các liên kết trên trang",
                    default: true,
                },
                locale: {
                    type: "select",
                    label: "Ngôn ngữ mặc định",
                    options: LOCALES,
                    default: "vi_VN",
                    note: "Ngôn ngữ chính của website",
                },
                twitterSite: {
                    type: "text",
                    label: "Twitter @username",
                    note: "Tài khoản Twitter của website. VD: @SHTSecurity (bao gồm dấu @)",
                    max: 50,
                },
                facebookAppId: {
                    type: "text",
                    label: "Facebook App ID",
                    note: "ID ứng dụng Facebook. Lấy từ developers.facebook.com",
                },
                facebookPageIds: {
                    type: "text",
                    label: "Facebook Page IDs",
                    note: "ID các Fanpage liên kết, phân cách bằng dấu phẩy. VD: 123456789,987654321",
                },
            },
        },

        openGraphGlobal: {
            label: "Open Graph Global - Chia Sẻ Mạng Xã Hội",
            fields: {
                ogTitle: {
                    type: "text",
                    label: "Tiêu đề",
                    note: "Tiêu đề hiển thị khi chia sẻ. Tối đa 60 ký tự để hiển thị đầy đủ",
                    max: 60,
                    required: true,
                },
                ogDescription: {
                    type: "textarea",
                    label: "Mô tả",
                    note: "Mô tả ngắn gọn. Tối đa 160 ký tự để hiển thị đầy đủ trên Facebook và Twitter",
                    max: 160,
                    required: true,
                },
                ogType: {
                    type: "select",
                    label: "Loại nội dung",
                    options: OG_TYPES,
                    default: "website",
                    note: "Chọn loại nội dung phù hợp (Website cho trang chủ, Article cho bài viết, Product cho sản phẩm)",
                },
                ogImage: {
                    type: "image",
                    label: "Banner chia sẻ",
                    note: "Ảnh hiển thị khi chia sẻ. Kích thước tối ưu: 1200x630px (tỷ lệ 1.91:1). Tối thiểu 600x315px, tối đa 5MB",
                    required: true,
                },
                ogImageAlt: {
                    type: "text",
                    label: "Mô tả ảnh",
                    note: "Alt text cho ảnh, hỗ trợ accessibility và SEO. Tối đa 125 ký tự",
                    max: 125,
                },
                twitterCard: {
                    type: "select",
                    label: "Twitter Card Type",
                    options: TWITTER_CARD_TYPES,
                    default: "summary_large_image",
                    note: "summary_large_image được khuyến nghị để hiển thị ảnh lớn trên Twitter",
                },
            },
        },
    },
};

export type OpenGraphFieldKey = keyof typeof seoOpenGraphConfig.sections;

export const getOpenGraphSection = (sectionKey: OpenGraphFieldKey) => {
    return seoOpenGraphConfig.sections[sectionKey];
};

export const getAllOpenGraphSections = () => {
    return Object.entries(seoOpenGraphConfig.sections).map(([key, section]) => ({
        key,
        ...section,
    }));
};

export const getSeoGlobalSection = () => seoOpenGraphConfig.sections.seoGlobal;

export const getOgGlobalSection = () => seoOpenGraphConfig.sections.openGraphGlobal;
