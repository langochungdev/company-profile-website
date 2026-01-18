<template>
    <NuxtLayout name="main">
        <main v-if="service">
            <article class="service-detail-content">
                <div class="container">
                    <div class="service-grid">
                        <div class="service-main">
                            <div class="service-meta">
                                <span class="meta-category">{{ service.category }}</span>
                                <span class="meta-price">
                                    <Icon name="mdi:currency-usd" />
                                    {{ service.price }}
                                </span>
                            </div>

                            <h1 class="service-title">{{ service.title }}</h1>

                            <div class="service-thumbnail">
                                <img :src="service.thumbnail" :alt="service.title" />
                            </div>

                            <div class="service-body">
                                <p class="lead">{{ service.description }}</p>

                                <h2>Tính Năng Nổi Bật</h2>
                                <div class="features-grid">
                                    <div v-for="(feature, index) in service.features" :key="index" class="feature-box">
                                        <Icon name="mdi:check-decagram" class="feature-icon" />
                                        <span>{{ feature }}</span>
                                    </div>
                                </div>

                                <h2>Giới Thiệu Dịch Vụ</h2>
                                <p>Chúng tôi cung cấp giải pháp chuyên nghiệp với đội ngũ kỹ thuật giàu kinh nghiệm, cam kết mang đến sự hài lòng tuyệt đối cho khách hàng. Sản phẩm và dịch vụ của chúng tôi đã được hàng nghìn doanh nghiệp tin dùng.</p>

                                <h2>Quy Trình Triển Khai</h2>
                                <ul>
                                    <li>Khảo sát và tư vấn giải pháp phù hợp</li>
                                    <li>Thiết kế hệ thống chi tiết theo yêu cầu</li>
                                    <li>Thi công lắp đặt chuyên nghiệp</li>
                                    <li>Chạy thử và nghiệm thu hoàn thiện</li>
                                    <li>Bảo hành và hỗ trợ kỹ thuật 24/7</li>
                                </ul>

                                <h2>Cam Kết Của SHT Security</h2>
                                <p>Chúng tôi cam kết sử dụng thiết bị chính hãng, thi công đúng tiêu chuẩn kỹ thuật và cung cấp chế độ bảo hành dài hạn. Đội ngũ hỗ trợ kỹ thuật luôn sẵn sàng 24/7 để đảm bảo hệ thống hoạt động ổn định.</p>
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
                                        <span class="info-value">{{ service.category }}</span>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <Icon name="mdi:cash" />
                                    <div>
                                        <span class="info-label">Giá:</span>
                                        <span class="info-value">{{ service.price }}</span>
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

                            <div class="sidebar-related">
                                <h3>Dịch Vụ Liên Quan</h3>
                                <div class="related-list">
                                    <NuxtLink v-for="item in relatedServices" :key="item.id" :to="`/service/${item.slug}`" class="related-item">
                                        <img :src="item.thumbnail" :alt="item.title" class="related-thumb" />
                                        <div class="related-info">
                                            <h4 class="related-title">{{ item.title }}</h4>
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

        <main v-else class="not-found">
            <div class="container">
                <Icon name="mdi:file-search-outline" class="not-found-icon" />
                <h1>Không tìm thấy dịch vụ</h1>
                <p>Dịch vụ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                <NuxtLink to="/service" class="back-btn">Quay lại trang dịch vụ</NuxtLink>
            </div>
        </main>
    </NuxtLayout>
</template>

<script setup>
import { SERVICES } from '../serviceListing.cms'

const route = useRoute()
const slug = route.params.slug

const service = computed(() => SERVICES.find(s => s.slug === slug))

const relatedServices = computed(() => {
    if (!service.value) return []
    return SERVICES.filter(s => s.category === service.value.category && s.id !== service.value.id).slice(0, 3)
})

useSeoMeta({
    title: () => service.value ? `${service.value.title} - SHT Security` : 'Dịch vụ không tồn tại',
    description: () => service.value?.description || '',
    ogTitle: () => service.value?.title || '',
    ogDescription: () => service.value?.description || '',
    ogImage: () => service.value?.thumbnail || '',
})
</script>

<style scoped>
@import "@/styles/service/slug/desktop.css";
@import "@/styles/service/slug/mobile.css";
</style>
