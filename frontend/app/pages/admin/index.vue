<!-- Chức năng: Admin panel chính với sidebar, header và editor area -->
<template>
    <div class="admin-layout">
        <div v-if="isMobileMenuOpen" class="sidebar-overlay" @click="isMobileMenuOpen = false" />

        <AdminSidebar :pages="MOCK_PAGES" :active-page="activePage" :is-collapsed="isSidebarCollapsed" @toggle="toggleSidebar" @switch="switchPage" />

        <main :class="['admin-main', { 'sidebar-collapsed': isSidebarCollapsed }]">
            <AdminHeader :page-name="currentPageName" :has-changes="hasChanges" @save="saveForm" />

            <div class="admin-content">
                <div v-if="currentConfig" class="editor-container">
                    <AdminSection v-for="(section, sectionKey) in currentConfig.sections" :key="sectionKey" :label="section.label" :is-collapsed="collapsedSections[sectionKey] ?? section.collapsed" @toggle="toggleSection(sectionKey)">
                        <template v-for="(field, fieldKey) in section.fields" :key="fieldKey">
                            <AdminGroupField v-if="field.type === 'group'" :field="field">
                                <AdminField v-for="(subField, subKey) in field.fields" :key="subKey" :field="subField" :model-value="getFieldValue(sectionKey, fieldKey, subKey)" @update:model-value="setFieldValue(sectionKey, fieldKey, subKey, $event)" />
                            </AdminGroupField>

                            <AdminArrayField v-else-if="field.type === 'array'" :field="field as any" :model-value="(getFieldValue(sectionKey, fieldKey) as any[]) || []" @update:model-value="setFieldValue(sectionKey, fieldKey, null, $event)" />

                            <AdminField v-else :field="field" :model-value="getFieldValue(sectionKey, fieldKey)" @update:model-value="setFieldValue(sectionKey, fieldKey, null, $event)" />
                        </template>
                    </AdminSection>
                </div>
            </div>
        </main>

        <button class="mobile-menu-btn" @click="isMobileMenuOpen = !isMobileMenuOpen">
            <Icon name="mdi:menu" />
        </button>
    </div>
</template>

<script setup lang="ts">
import AdminSidebar from './layouts/AdminSidebar.vue'
import AdminHeader from './layouts/AdminHeader.vue'
import AdminSection from './components/AdminSection.vue'
import AdminField from './components/AdminField.vue'
import AdminArrayField from './components/AdminArrayField.vue'
import AdminGroupField from './components/AdminGroupField.vue'

definePageMeta({
    layout: false
})

const MOCK_PAGES = [
    { key: 'home', name: 'Trang chủ', icon: 'mdi:home' },
    { key: 'product', name: 'Sản phẩm', icon: 'mdi:package-variant' },
    { key: 'global', name: 'Open Graph & SEO', icon: 'mdi:cog' }
]

const MOCK_CONFIGS: Record<string, PageConfig> = {
    home: {
        page: 'home',
        pageName: 'Trang chủ',
        sections: {
            hero: {
                label: 'Banner chính',
                collapsed: false,
                fields: {
                    bg: { type: 'image', label: 'Ảnh nền', note: '1920x1080, max 5MB', required: true },
                    title: { type: 'text', label: 'Tiêu đề', max: 80, required: true },
                    subtitle: { type: 'textarea', label: 'Mô tả', max: 200, rows: 3 },
                    ctaButton: {
                        type: 'group',
                        label: 'Nút CTA',
                        fields: {
                            text: { type: 'text', label: 'Text nút', default: 'Tìm hiểu thêm' },
                            link: { type: 'text', label: 'Link', note: 'VD: /services' },
                            style: { type: 'select', label: 'Style', options: ['primary', 'secondary', 'outline'], default: 'primary' }
                        }
                    }
                }
            },
            features: {
                label: 'Tính năng nổi bật',
                collapsed: true,
                fields: {
                    heading: { type: 'text', label: 'Tiêu đề section', required: true },
                    subheading: { type: 'text', label: 'Mô tả ngắn' },
                    items: {
                        type: 'array',
                        label: 'Danh sách tính năng',
                        min: 3,
                        max: 6,
                        sortable: true,
                        schema: {
                            icon: { type: 'image', label: 'Icon', note: 'SVG hoặc PNG 64x64' },
                            title: { type: 'text', label: 'Tiêu đề', max: 50, required: true },
                            desc: { type: 'textarea', label: 'Mô tả', max: 150, rows: 3 },
                            enabled: { type: 'boolean', label: 'Hiển thị?', default: true }
                        }
                    }
                }
            },
            stats: {
                label: 'Số liệu thống kê',
                collapsed: true,
                fields: {
                    enabled: { type: 'boolean', label: 'Hiển thị section?', default: true },
                    bg: { type: 'image', label: 'Ảnh nền (optional)' },
                    items: {
                        type: 'array',
                        label: 'Các chỉ số',
                        min: 3,
                        max: 4,
                        sortable: true,
                        schema: {
                            number: { type: 'text', label: 'Con số', note: 'VD: 100+, 5K+', required: true },
                            label: { type: 'text', label: 'Nhãn', required: true },
                            icon: { type: 'image', label: 'Icon (optional)' }
                        }
                    }
                }
            },
            seo: {
                label: 'SEO & Meta Tags',
                collapsed: true,
                fields: {
                    title: { type: 'text', label: 'Meta Title', max: 60, required: true, note: 'Tối đa 60 ký tự' },
                    description: { type: 'textarea', label: 'Meta Description', max: 160, rows: 3, required: true },
                    keywords: { type: 'text', label: 'Keywords', note: 'Ngăn cách bởi dấu phẩy' },
                    ogImage: { type: 'image', label: 'Open Graph Image', note: '1200x630px', required: true },
                    noindex: { type: 'boolean', label: 'No Index', default: false },
                    nofollow: { type: 'boolean', label: 'No Follow', default: false }
                }
            }
        }
    },
    product: {
        page: 'product',
        pageName: 'Sản phẩm',
        sections: {
            hero: {
                label: 'Banner sản phẩm',
                collapsed: false,
                fields: {
                    bg: { type: 'image', label: 'Ảnh nền', note: '1920x1080', required: true },
                    logo: { type: 'image', label: 'Logo sản phẩm', note: 'PNG transparent 512x512' },
                    title: { type: 'text', label: 'Tên sản phẩm', required: true },
                    tagline: { type: 'text', label: 'Slogan', max: 100 }
                }
            },
            pricing: {
                label: 'Bảng giá',
                collapsed: true,
                fields: {
                    heading: { type: 'text', label: 'Tiêu đề', required: true },
                    subheading: { type: 'text', label: 'Mô tả ngắn' },
                    plans: {
                        type: 'array',
                        label: 'Các gói',
                        min: 2,
                        max: 4,
                        sortable: true,
                        schema: {
                            name: { type: 'text', label: 'Tên gói', required: true },
                            price: { type: 'number', label: 'Giá (VNĐ)', min: 0 },
                            period: { type: 'select', label: 'Chu kỳ', options: ['tháng', 'quý', 'năm', 'một lần'], default: 'tháng' },
                            highlight: { type: 'boolean', label: 'Gói nổi bật?', default: false },
                            ctaText: { type: 'text', label: 'Text nút CTA', default: 'Đăng ký ngay' }
                        }
                    }
                }
            },
            gallery: {
                label: 'Thư viện media',
                collapsed: true,
                fields: {
                    video: { type: 'video', label: 'Video demo', note: 'YouTube URL hoặc upload MP4' },
                    images: {
                        type: 'array',
                        label: 'Ảnh sản phẩm',
                        min: 3,
                        max: 12,
                        sortable: true,
                        schema: {
                            url: { type: 'image', label: 'Ảnh', note: '800x600', required: true },
                            caption: { type: 'text', label: 'Chú thích', max: 100 },
                            alt: { type: 'text', label: 'Alt text (SEO)', required: true }
                        }
                    }
                }
            },
            content: {
                label: 'Nội dung chi tiết',
                collapsed: true,
                fields: {
                    description: { type: 'richtext', label: 'Mô tả sản phẩm' },
                    specifications: {
                        type: 'array',
                        label: 'Thông số kỹ thuật',
                        schema: {
                            label: { type: 'text', label: 'Tên thông số', required: true },
                            value: { type: 'text', label: 'Giá trị', required: true }
                        }
                    }
                }
            },
            seo: {
                label: 'SEO & Meta Tags',
                collapsed: true,
                fields: {
                    title: { type: 'text', label: 'Meta Title', max: 60, required: true },
                    description: { type: 'textarea', label: 'Meta Description', max: 160, rows: 3, required: true },
                    ogImage: { type: 'image', label: 'Open Graph Image', note: '1200x630px', required: true },
                    productSchema: {
                        type: 'group',
                        label: 'Product Schema.org',
                        fields: {
                            sku: { type: 'text', label: 'SKU' },
                            brand: { type: 'text', label: 'Thương hiệu' },
                            price: { type: 'number', label: 'Giá' },
                            availability: { type: 'select', label: 'Tình trạng', options: ['InStock', 'OutOfStock', 'PreOrder'], default: 'InStock' }
                        }
                    }
                }
            }
        }
    },
    global: {
        page: 'global',
        pageName: 'Open Graph & SEO',
        sections: {
            company: {
                label: 'Thông tin công ty',
                collapsed: false,
                fields: {
                    name: { type: 'text', label: 'Tên công ty', required: true },
                    logo: { type: 'image', label: 'Logo', note: 'PNG transparent, 512x512px', required: true },
                    favicon: { type: 'image', label: 'Favicon', note: 'ICO hoặc PNG 32x32px' },
                    description: { type: 'textarea', label: 'Mô tả công ty', max: 300, rows: 4, required: true },
                    phone: { type: 'text', label: 'Số điện thoại', required: true },
                    email: { type: 'text', label: 'Email', required: true },
                    address: { type: 'textarea', label: 'Địa chỉ', rows: 3, required: true },
                    website: { type: 'text', label: 'Website URL', required: true }
                }
            },
            social: {
                label: 'Social Media Links',
                collapsed: true,
                fields: {
                    facebook: { type: 'text', label: 'Facebook URL' },
                    tiktok: { type: 'text', label: 'TikTok URL' },
                    youtube: { type: 'text', label: 'YouTube URL' },
                    instagram: { type: 'text', label: 'Instagram URL' },
                    linkedin: { type: 'text', label: 'LinkedIn URL' },
                    zalo: { type: 'text', label: 'Zalo OA URL' }
                }
            },
            seoDefaults: {
                label: 'SEO Mặc định',
                collapsed: true,
                fields: {
                    defaultTitle: { type: 'text', label: 'Default Title', max: 60, required: true },
                    titleTemplate: { type: 'text', label: 'Title Template', default: '%s | Tên Công Ty', required: true },
                    titleSeparator: { type: 'select', label: 'Title Separator', options: ['|', '-', '·', '•', '—'], default: '|' },
                    defaultDescription: { type: 'textarea', label: 'Default Description', max: 160, rows: 3, required: true },
                    defaultOgImage: { type: 'image', label: 'Default OG Image', note: '1200x630px', required: true }
                }
            },
            openGraph: {
                label: 'Open Graph Settings',
                collapsed: true,
                fields: {
                    ogSiteName: { type: 'text', label: 'OG Site Name', required: true },
                    ogType: { type: 'select', label: 'Default OG Type', options: ['website', 'article', 'product', 'profile'], default: 'website' },
                    ogLocale: { type: 'text', label: 'OG Locale', default: 'vi_VN', required: true },
                    twitterCard: { type: 'select', label: 'Twitter Card Type', options: ['summary', 'summary_large_image', 'app', 'player'], default: 'summary_large_image' },
                    twitterSite: { type: 'text', label: 'Twitter @username' }
                }
            },
            schemaOrg: {
                label: 'Schema.org Structured Data',
                collapsed: true,
                fields: {
                    organizationType: { type: 'select', label: 'Organization Type', options: ['Organization', 'LocalBusiness', 'Corporation', 'EducationalOrganization'], default: 'Organization', required: true },
                    foundingDate: { type: 'text', label: 'Founding Date', note: 'YYYY-MM-DD' },
                    numberOfEmployees: { type: 'text', label: 'Number of Employees' },
                    areaServed: { type: 'text', label: 'Area Served' },
                    priceRange: { type: 'text', label: 'Price Range' }
                }
            },
            integrations: {
                label: 'Third-party Integrations',
                collapsed: true,
                fields: {
                    googleAnalyticsId: { type: 'text', label: 'Google Analytics ID', note: 'VD: G-XXXXXXXXXX' },
                    googleTagManagerId: { type: 'text', label: 'Google Tag Manager ID' },
                    facebookPixelId: { type: 'text', label: 'Facebook Pixel ID' },
                    tiktokPixelId: { type: 'text', label: 'TikTok Pixel ID' }
                }
            }
        }
    }
}

const MOCK_FORM_DATA: Record<string, Record<string, Record<string, unknown>>> = {
    home: {
        hero: {
            bg: 'https://placehold.co/1920x1080/3b82f6/white?text=Hero+Background',
            title: 'Giải pháp an ninh toàn diện',
            subtitle: 'Chuyên cung cấp hệ thống camera, báo động, kiểm soát ra vào',
            ctaButton: { text: 'Tư vấn miễn phí', link: '/lien-he', style: 'primary' }
        },
        features: {
            heading: 'Tại sao chọn chúng tôi',
            subheading: 'Cam kết mang đến dịch vụ tốt nhất',
            items: [
                { icon: '', title: 'Giá cả cạnh tranh', desc: 'Cam kết giá tốt nhất', enabled: true },
                { icon: '', title: 'Bảo hành dài hạn', desc: 'Bảo hành từ 2-5 năm', enabled: true },
                { icon: '', title: 'Hỗ trợ 24/7', desc: 'Luôn sẵn sàng hỗ trợ', enabled: true }
            ]
        },
        stats: {
            enabled: true,
            bg: '',
            items: [
                { number: '500+', label: 'Dự án hoàn thành', icon: '' },
                { number: '10K+', label: 'Khách hàng tin dùng', icon: '' },
                { number: '15+', label: 'Năm kinh nghiệm', icon: '' }
            ]
        },
        seo: {
            title: 'SHT Security - Giải pháp an ninh toàn diện',
            description: 'Chuyên cung cấp hệ thống camera, báo động, kiểm soát ra vào',
            keywords: 'camera an ninh, bảo vệ, hệ thống báo động',
            ogImage: '',
            noindex: false,
            nofollow: false
        }
    },
    product: {
        hero: { bg: '', logo: '', title: 'Camera IP Thông Minh', tagline: 'Giám sát mọi lúc, mọi nơi' },
        pricing: {
            heading: 'Bảng giá dịch vụ',
            subheading: 'Chọn gói phù hợp với nhu cầu',
            plans: [
                { name: 'Gói Basic', price: 2000000, period: 'tháng', highlight: false, ctaText: 'Chọn gói' },
                { name: 'Gói Pro', price: 5000000, period: 'tháng', highlight: true, ctaText: 'Gói phổ biến' }
            ]
        },
        gallery: { video: '', images: [] },
        content: { description: '<p>Camera IP thông minh với công nghệ AI...</p>', specifications: [] },
        seo: { title: 'Camera IP 4MP', description: 'Camera IP 4MP với AI nhận diện', ogImage: '', productSchema: { sku: '', brand: '', price: 0, availability: 'InStock' } }
    },
    global: {
        company: { name: 'SHT Security', logo: '', favicon: '', description: 'Chuyên cung cấp giải pháp an ninh', phone: '+84 901 234 567', email: 'contact@shtsecurity.com', address: '123 Nguyễn Huệ, Quận 1, TP.HCM', website: 'https://sht.langochung.me' },
        social: { facebook: 'https://facebook.com/SHT.security', tiktok: '', youtube: '', instagram: '', linkedin: '', zalo: '' },
        seoDefaults: { defaultTitle: 'SHT Security', titleTemplate: '%s | SHT Security', titleSeparator: '|', defaultDescription: 'Giải pháp an ninh toàn diện', defaultOgImage: '' },
        openGraph: { ogSiteName: 'SHT Security', ogType: 'website', ogLocale: 'vi_VN', twitterCard: 'summary_large_image', twitterSite: '' },
        schemaOrg: { organizationType: 'LocalBusiness', foundingDate: '2020-01-01', numberOfEmployees: '50-100', areaServed: 'TP.HCM', priceRange: '$$' },
        integrations: { googleAnalyticsId: '', googleTagManagerId: '', facebookPixelId: '', tiktokPixelId: '' }
    }
}

interface FieldConfig {
    type: string
    label: string
    required?: boolean
    max?: number
    min?: number
    rows?: number
    options?: string[]
    note?: string
    default?: unknown
    fields?: Record<string, FieldConfig>
    schema?: Record<string, FieldConfig>
    sortable?: boolean
}

interface SectionConfig {
    label: string
    collapsed: boolean
    fields: Record<string, FieldConfig>
}

interface PageConfig {
    page: string
    pageName: string
    sections: Record<string, SectionConfig>
}

const activePage = ref('home')
const formData = ref<Record<string, Record<string, Record<string, unknown>>>>(JSON.parse(JSON.stringify(MOCK_FORM_DATA)))
const collapsedSections = ref<Record<string, boolean>>({})
const isSidebarCollapsed = ref(false)
const isMobileMenuOpen = ref(false)
const hasChanges = ref(false)

const currentConfig = computed(() => MOCK_CONFIGS[activePage.value])
const currentPageName = computed(() => currentConfig.value?.pageName || '')

const switchPage = (pageKey: string) => {
    activePage.value = pageKey
    isMobileMenuOpen.value = false
}

const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
        isMobileMenuOpen.value = !isMobileMenuOpen.value
    } else {
        isSidebarCollapsed.value = !isSidebarCollapsed.value
    }
}

const toggleSection = (sectionKey: string) => {
    collapsedSections.value[sectionKey] = !collapsedSections.value[sectionKey]
}

const getFieldValue = (sectionKey: string, fieldKey: string, subKey?: string | null) => {
    const pageData = formData.value[activePage.value]
    if (!pageData || !pageData[sectionKey]) return undefined

    const fieldValue = pageData[sectionKey][fieldKey]
    if (subKey && typeof fieldValue === 'object' && fieldValue !== null) {
        return (fieldValue as Record<string, unknown>)[subKey]
    }
    return fieldValue
}

const setFieldValue = (sectionKey: string, fieldKey: string, subKey: string | null, value: unknown) => {
    const page = activePage.value
    if (!formData.value[page]) {
        formData.value[page] = {}
    }
    if (!formData.value[page]![sectionKey]) {
        formData.value[page]![sectionKey] = {}
    }

    if (subKey) {
        const currentValue = formData.value[page]![sectionKey]![fieldKey]
        formData.value[page]![sectionKey]![fieldKey] = {
            ...(typeof currentValue === 'object' && currentValue !== null ? currentValue : {}),
            [subKey]: value
        }
    } else {
        formData.value[page]![sectionKey]![fieldKey] = value
    }

    hasChanges.value = true
}

const saveForm = () => {
    console.log('Saving form data:', formData.value)
    hasChanges.value = false
    alert('Đã lưu thành công! (Check console để xem data)')
}
</script>

<style scoped>
.admin-layout {
    display: flex;
    min-height: 100vh;
    background: #f3f4f6;
}

.sidebar-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 90;
}

.admin-main {
    flex: 1;
    margin-left: 250px;
    transition: margin-left 0.3s ease;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.admin-main.sidebar-collapsed {
    margin-left: 60px;
}

.admin-content {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
}

.editor-container {
    max-width: 900px;
    margin: 0 auto;
}

.mobile-menu-btn {
    display: none;
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 56px;
    height: 56px;
    background: #3b82f6;
    color: #ffffff;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    z-index: 80;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.mobile-menu-btn svg {
    width: 24px;
    height: 24px;
}

@media (max-width: 768px) {
    .admin-main {
        margin-left: 0;
    }

    .admin-main.sidebar-collapsed {
        margin-left: 0;
    }

    .admin-content {
        padding: 16px;
    }

    .mobile-menu-btn {
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
