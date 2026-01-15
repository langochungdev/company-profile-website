/**
 * Cấu hình Open Graph Meta Tags cho Admin quản lý SEO
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

export interface OpenGraphConfigType {
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
    { value: "profile", label: "Hồ sơ cá nhân" },
    { value: "video.other", label: "Video" },
    { value: "music.song", label: "Âm nhạc" },
];

export const TWITTER_CARD_TYPES = [
    { value: "summary", label: "Summary - Ảnh nhỏ" },
    { value: "summary_large_image", label: "Summary Large Image - Ảnh lớn" },
    { value: "app", label: "App - Ứng dụng" },
    { value: "player", label: "Player - Video/Audio" },
];

export const LOCALES = [
    { value: "vi_VN", label: "Tiếng Việt (VN)" },
    { value: "en_US", label: "English (US)" },
    { value: "en_GB", label: "English (UK)" },
    { value: "zh_CN", label: "中文 (简体)" },
    { value: "ja_JP", label: "日本語" },
    { value: "ko_KR", label: "한국어" },
];

export const PRODUCT_AVAILABILITY = [
    { value: "in stock", label: "Còn hàng" },
    { value: "out of stock", label: "Hết hàng" },
    { value: "preorder", label: "Đặt trước" },
    { value: "discontinued", label: "Ngừng kinh doanh" },
];

export const CURRENCIES = [
    { value: "VND", label: "VND - Việt Nam Đồng" },
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
];

export const openGraphConfig: OpenGraphConfigType = {
    page: "open-graph",
    pageName: "Open Graph & Social Meta",
    path: "config/open-graph",
    icon: "mdi:share-variant",
    order: 100,
    group: "Cài đặt",

    sections: {
        basic: {
            label: "Open Graph Cơ Bản",
            fields: {
                ogTitle: {
                    type: "text",
                    label: "og:title - Tiêu đề",
                    note: "Tiêu đề hiển thị khi chia sẻ. Tối đa 60 ký tự để hiển thị đầy đủ",
                    max: 60,
                    required: true,
                },
                ogDescription: {
                    type: "textarea",
                    label: "og:description - Mô tả",
                    note: "Mô tả ngắn gọn. Tối đa 160 ký tự để hiển thị đầy đủ trên Facebook",
                    max: 160,
                    required: true,
                },
                ogType: {
                    type: "select",
                    label: "og:type - Loại nội dung",
                    options: OG_TYPES,
                    default: "website",
                    note: "Chọn loại nội dung phù hợp. Article và Product sẽ mở thêm các trường bổ sung",
                },
                ogUrl: {
                    type: "text",
                    label: "og:url - URL chính thức",
                    note: "URL canonical của trang. VD: https://sht.langochung.me/about",
                },
                ogSiteName: {
                    type: "text",
                    label: "og:site_name - Tên website",
                    default: "SHT Security",
                    max: 50,
                },
                ogLocale: {
                    type: "select",
                    label: "og:locale - Ngôn ngữ",
                    options: LOCALES,
                    default: "vi_VN",
                },
                ogLocaleAlternate: {
                    type: "array",
                    label: "og:locale:alternate - Ngôn ngữ thay thế",
                    note: "Các ngôn ngữ khác mà trang hỗ trợ",
                    min: 0,
                    max: 5,
                    schema: {
                        locale: {
                            type: "select",
                            label: "Ngôn ngữ",
                            options: LOCALES,
                        },
                    },
                },
            },
        },

        images: {
            label: "Hình Ảnh Open Graph",
            fields: {
                ogImage: {
                    type: "image",
                    label: "og:image - Ảnh chính",
                    note: "Kích thước tối ưu: 1200x630px (tỷ lệ 1.91:1). Tối thiểu 600x315px. Max 5MB",
                    required: true,
                },
                ogImageSecureUrl: {
                    type: "text",
                    label: "og:image:secure_url - HTTPS URL",
                    note: "URL HTTPS của ảnh (nếu khác với og:image)",
                },
                ogImageType: {
                    type: "select",
                    label: "og:image:type - Định dạng ảnh",
                    options: [
                        { value: "image/jpeg", label: "JPEG" },
                        { value: "image/png", label: "PNG" },
                        { value: "image/gif", label: "GIF" },
                        { value: "image/webp", label: "WebP" },
                    ],
                    default: "image/jpeg",
                },
                ogImageWidth: {
                    type: "number",
                    label: "og:image:width - Chiều rộng (px)",
                    default: 1200,
                    min: 200,
                    max: 4096,
                },
                ogImageHeight: {
                    type: "number",
                    label: "og:image:height - Chiều cao (px)",
                    default: 630,
                    min: 200,
                    max: 4096,
                },
                ogImageAlt: {
                    type: "text",
                    label: "og:image:alt - Mô tả ảnh",
                    note: "Alt text cho ảnh, hỗ trợ accessibility và SEO",
                    max: 125,
                },
            },
        },

        twitter: {
            label: "Twitter Card",
            fields: {
                twitterCard: {
                    type: "select",
                    label: "twitter:card - Loại Card",
                    options: TWITTER_CARD_TYPES,
                    default: "summary_large_image",
                    note: "summary_large_image được khuyến nghị để hiển thị ảnh nổi bật",
                },
                twitterSite: {
                    type: "text",
                    label: "twitter:site - Tài khoản Website",
                    note: "@username của website. VD: @SHTSecurity",
                    max: 50,
                },
                twitterCreator: {
                    type: "text",
                    label: "twitter:creator - Tài khoản Tác giả",
                    note: "@username của tác giả bài viết (nếu có)",
                    max: 50,
                },
                twitterTitle: {
                    type: "text",
                    label: "twitter:title - Tiêu đề Twitter",
                    note: "Để trống sẽ dùng og:title. Tối đa 70 ký tự",
                    max: 70,
                },
                twitterDescription: {
                    type: "text",
                    label: "twitter:description - Mô tả Twitter",
                    note: "Để trống sẽ dùng og:description. Tối đa 200 ký tự",
                    max: 200,
                },
                twitterImage: {
                    type: "image",
                    label: "twitter:image - Ảnh Twitter",
                    note: "Để trống sẽ dùng og:image. Tối ưu: 1200x675px (tỷ lệ 16:9)",
                },
                twitterImageAlt: {
                    type: "text",
                    label: "twitter:image:alt - Mô tả ảnh Twitter",
                    note: "Alt text cho ảnh Twitter. Tối đa 420 ký tự",
                    max: 420,
                },
            },
        },

        article: {
            label: "Article Meta (Bài viết)",
            collapsed: true,
            fields: {
                articleEnabled: {
                    type: "boolean",
                    label: "Kích hoạt Article Meta",
                    note: "Bật để sử dụng các trường Article khi og:type = article",
                    default: false,
                },
                articlePublishedTime: {
                    type: "text",
                    label: "article:published_time - Ngày đăng",
                    note: "Định dạng ISO 8601. VD: 2026-01-15T10:00:00+07:00",
                    showIf: { field: "articleEnabled", value: "true" },
                },
                articleModifiedTime: {
                    type: "text",
                    label: "article:modified_time - Ngày cập nhật",
                    note: "Định dạng ISO 8601. VD: 2026-01-15T15:30:00+07:00",
                    showIf: { field: "articleEnabled", value: "true" },
                },
                articleExpirationTime: {
                    type: "text",
                    label: "article:expiration_time - Ngày hết hạn",
                    note: "Thời điểm bài viết hết hạn (nếu có)",
                    showIf: { field: "articleEnabled", value: "true" },
                },
                articleAuthor: {
                    type: "text",
                    label: "article:author - Tác giả",
                    note: "URL profile tác giả hoặc tên tác giả",
                    showIf: { field: "articleEnabled", value: "true" },
                },
                articleSection: {
                    type: "text",
                    label: "article:section - Danh mục",
                    note: "Danh mục/chuyên mục của bài viết",
                    showIf: { field: "articleEnabled", value: "true" },
                },
                articleTags: {
                    type: "array",
                    label: "article:tag - Tags",
                    note: "Các thẻ liên quan đến bài viết",
                    min: 0,
                    max: 10,
                    showIf: { field: "articleEnabled", value: "true" },
                    schema: {
                        tag: {
                            type: "text",
                            label: "Tag",
                            max: 50,
                        },
                    },
                },
            },
        },

        product: {
            label: "Product Meta (Sản phẩm)",
            collapsed: true,
            fields: {
                productEnabled: {
                    type: "boolean",
                    label: "Kích hoạt Product Meta",
                    note: "Bật để sử dụng các trường Product khi og:type = product",
                    default: false,
                },
                productPriceAmount: {
                    type: "text",
                    label: "product:price:amount - Giá",
                    note: "Giá sản phẩm. VD: 8500000",
                    showIf: { field: "productEnabled", value: "true" },
                },
                productPriceCurrency: {
                    type: "select",
                    label: "product:price:currency - Đơn vị tiền",
                    options: CURRENCIES,
                    default: "VND",
                    showIf: { field: "productEnabled", value: "true" },
                },
                productAvailability: {
                    type: "select",
                    label: "product:availability - Tình trạng",
                    options: PRODUCT_AVAILABILITY,
                    default: "in stock",
                    showIf: { field: "productEnabled", value: "true" },
                },
                productCondition: {
                    type: "select",
                    label: "product:condition - Tình trạng SP",
                    options: [
                        { value: "new", label: "Mới" },
                        { value: "refurbished", label: "Tân trang" },
                        { value: "used", label: "Đã qua sử dụng" },
                    ],
                    default: "new",
                    showIf: { field: "productEnabled", value: "true" },
                },
                productBrand: {
                    type: "text",
                    label: "product:brand - Thương hiệu",
                    note: "Tên thương hiệu sản phẩm",
                    showIf: { field: "productEnabled", value: "true" },
                },
                productRetailerItemId: {
                    type: "text",
                    label: "product:retailer_item_id - Mã SP",
                    note: "Mã sản phẩm duy nhất của nhà bán hàng",
                    showIf: { field: "productEnabled", value: "true" },
                },
            },
        },

        facebook: {
            label: "Facebook Pixel & App",
            collapsed: true,
            fields: {
                fbAppId: {
                    type: "text",
                    label: "fb:app_id - Facebook App ID",
                    note: "ID của Facebook App. Lấy từ developers.facebook.com",
                },
                fbAdmins: {
                    type: "text",
                    label: "fb:admins - Facebook Admin IDs",
                    note: "ID các admin, cách nhau bởi dấu phẩy. VD: 123456,789012",
                },
                fbPages: {
                    type: "text",
                    label: "fb:pages - Facebook Page IDs",
                    note: "ID các Fanpage liên kết, cách nhau bởi dấu phẩy",
                },
            },
        },

        advanced: {
            label: "Cài Đặt Nâng Cao",
            collapsed: true,
            fields: {
                robotsIndex: {
                    type: "boolean",
                    label: "Cho phép Index",
                    note: "Bật để Google và các search engine có thể index trang này",
                    default: true,
                },
                robotsFollow: {
                    type: "boolean",
                    label: "Cho phép Follow Links",
                    note: "Bật để search engine theo dõi các liên kết trên trang",
                    default: true,
                },
                canonicalUrl: {
                    type: "text",
                    label: "Canonical URL",
                    note: "URL chính thức của trang để tránh duplicate content",
                },
                ogDeterminer: {
                    type: "select",
                    label: "og:determiner - Mạo từ",
                    options: [
                        { value: "", label: "Không có" },
                        { value: "a", label: "a" },
                        { value: "an", label: "an" },
                        { value: "the", label: "the" },
                        { value: "auto", label: "Tự động" },
                    ],
                    default: "",
                    note: "Mạo từ xuất hiện trước title khi chia sẻ",
                },
                previewMode: {
                    type: "boolean",
                    label: "Chế độ Preview",
                    note: "Bật để xem trước meta tags mà không ảnh hưởng frontend",
                    default: false,
                },
            },
        },
    },
};

export type OpenGraphFieldKey = keyof typeof openGraphConfig.sections;

export const getOpenGraphSection = (sectionKey: OpenGraphFieldKey) => {
    return openGraphConfig.sections[sectionKey];
};

export const getAllOpenGraphSections = () => {
    return Object.entries(openGraphConfig.sections).map(([key, section]) => ({
        key,
        ...section,
    }));
};
