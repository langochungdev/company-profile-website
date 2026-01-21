<template>
    <NuxtLayout name="main">
        <main v-if="loading" class="loading-wrapper">
            <div class="container">
                <Icon name="mdi:loading" class="spin loading-icon" />
                <p>Đang tải dịch vụ...</p>
            </div>
        </main>

        <main v-else class="service-detail-wrapper" :class="{ 'is-placeholder': displayService.isPlaceholder }">
            <article class="service-detail-content">
                <div class="container">
                    <div class="service-grid">
                        <div class="service-main">
                            <div class="service-meta">
                                <span class="meta-category">{{ displayService.category }}</span>
                                <span class="meta-price">
                                    <Icon name="mdi:currency-usd" />
                                    {{ displayService.price }}
                                </span>
                            </div>

                            <h1 class="service-title">{{ displayService.title || displayService.name }}</h1>

                            <div class="service-thumbnail">
                                <img :src="displayService.thumbnail || displayService.image" :alt="displayService.title || displayService.name" />
                            </div>

                            <div class="service-body">
                                <p class="lead">{{ displayService.description }}</p>

                                <div v-if="displayService.features?.length">
                                    <h2>Tính Năng Nổi Bật</h2>
                                    <div class="features-grid">
                                        <div v-for="(feature, index) in displayService.features" :key="index" class="feature-box">
                                            <Icon name="mdi:check-decagram" class="feature-icon" />
                                            <span>{{ feature.text || feature }}</span>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="displayService.content" v-html="displayService.content"></div>

                                <template v-else>
                                    <h2>Giới Thiệu Dịch Vụ</h2>
                                    <p>Chúng tôi cung cấp giải pháp chuyên nghiệp với đội ngũ kỹ thuật giàu kinh nghiệm, cam kết mang đến sự hài lòng tuyệt đối cho khách hàng.</p>

                                    <h2>Quy Trình Triển Khai</h2>
                                    <ul>
                                        <li>Khảo sát và tư vấn giải pháp phù hợp</li>
                                        <li>Thiết kế hệ thống chi tiết theo yêu cầu</li>
                                        <li>Thi công lắp đặt chuyên nghiệp</li>
                                        <li>Chạy thử và nghiệm thu hoàn thiện</li>
                                        <li>Bảo hành và hỗ trợ kỹ thuật 24/7</li>
                                    </ul>
                                </template>
                            </div>

                            <div class="service-cta-box">
                                <h3>Nhận Báo Giá Chi Tiết</h3>
                                <p>Liên hệ ngay với chúng tôi để được tư vấn và báo giá miễn phí!</p>
                                <NuxtLink to="/contact" class="cta-button">
                                    <Icon name="mdi:phone-in-talk" />
                                    Liên Hệ Tư Vấn
                                </NuxtLink>
                            </div>
                        </div>

                        <aside class="service-sidebar">
                            <div class="sidebar-info">
                                <h3>Thông Tin Dịch Vụ</h3>
                                <div class="info-item">
                                    <Icon name="mdi:tag" />
                                    <div>
                                        <span class="info-label">Danh mục:</span>
                                        <span class="info-value">{{ displayService.category }}</span>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <Icon name="mdi:cash" />
                                    <div>
                                        <span class="info-label">Giá:</span>
                                        <span class="info-value">{{ displayService.price }}</span>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <Icon name="mdi:shield-check" />
                                    <div>
                                        <span class="info-label">Bảo hành:</span>
                                        <span class="info-value">12-60 tháng</span>
                                    </div>
                                </div>
                            </div>

                            <div class="sidebar-contact">
                                <h3>Cần Hỗ Trợ?</h3>
                                <p>Đội ngũ chuyên gia sẵn sàng tư vấn miễn phí</p>
                                <a href="tel:0123456789" class="contact-btn">
                                    <Icon name="mdi:phone" />
                                    0123 456 789
                                </a>
                                <NuxtLink to="/contact" class="contact-btn secondary">
                                    <Icon name="mdi:email" />
                                    Gửi Yêu Cầu
                                </NuxtLink>
                            </div>

                            <div class="sidebar-related" v-if="relatedServices.length">
                                <h3>Dịch Vụ Liên Quan</h3>
                                <div class="related-list">
                                    <NuxtLink v-for="item in relatedServices" :key="item.id" :to="`/service/${item.slug}`" class="related-item">
                                        <img :src="item.thumbnail || item.image" :alt="item.title || item.name" class="related-thumb" />
                                        <div class="related-info">
                                            <h4 class="related-title">{{ item.title || item.name }}</h4>
                                            <span class="related-price">{{ item.price }}</span>
                                        </div>
                                    </NuxtLink>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </article>
        </main>
    </NuxtLayout>
</template>

<script setup>
import { usePreviewContext } from '@/admin/composables/usePreviewContext'
import { generateBreadcrumbSchema } from '@/admin/utils/schema-generator'
import { PLACEHOLDER_SERVICE_DETAIL } from '@/constants/placeholders'

const SITE_URL = 'https://sht.langochung.me'

const route = useRoute()
const slug = route.params.slug

const { previews, loading, loadPreviews } = usePreviewContext('collections/services/items')

const service = ref(null)
const relatedServices = ref([])

const displayService = computed(() => {
    if (service.value) {
        return service.value
    }
    return PLACEHOLDER_SERVICE_DETAIL
})

onMounted(async () => {
    await loadPreviews({ limitCount: 50 })
    service.value = previews.value.find(s => s.slug === slug)

    if (service.value) {
        relatedServices.value = previews.value.filter(s => s.category === service.value.category && s.id !== service.value.id).slice(0, 3)
    }
})

const serviceSchema = computed(() => {
    if (!service.value) return null
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        name: service.value.title || service.value.name,
        description: service.value.description,
        image: service.value.thumbnail || service.value.image,
        provider: {
            "@type": "Organization",
            name: "SHT Security",
        },
    }
})

const breadcrumbSchema = computed(() => {
    if (!service.value) return null
    return generateBreadcrumbSchema([
        { name: 'Trang Chủ', url: SITE_URL },
        { name: 'Dịch Vụ', url: `${SITE_URL}/service` },
        { name: service.value.title || service.value.name, url: `${SITE_URL}/service/${service.value.slug}` },
    ])
})

useSeoMeta({
    title: () => service.value ? `${service.value.title || service.value.name} - SHT Security` : 'Dịch vụ không tồn tại',
    description: () => service.value?.description || '',
    ogTitle: () => service.value?.title || service.value?.name || '',
    ogDescription: () => service.value?.description || '',
    ogImage: () => service.value?.thumbnail || service.value?.image || '',
})

useHead({
    script: computed(() => {
        if (!service.value) return []
        const scripts = []
        if (serviceSchema.value) {
            scripts.push({ type: 'application/ld+json', innerHTML: JSON.stringify(serviceSchema.value) })
        }
        if (breadcrumbSchema.value) {
            scripts.push({ type: 'application/ld+json', innerHTML: JSON.stringify(breadcrumbSchema.value) })
        }
        return scripts
    }),
})
</script>

<style scoped>
@import "@/styles/service/slug/desktop.css";
@import "@/styles/service/slug/mobile.css";

.is-placeholder {
    opacity: 0.7;
}
</style>
