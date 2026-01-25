<template>
    <section class="service-gallery-wrapper">
        <div class="container">
            <div class="section-header">
                <h1 class="main-title">Lĩnh Vực Hoạt Động</h1>
                <p class="main-subtitle">8 hạng mục dịch vụ chuyên nghiệp của chúng tôi</p>
            </div>

            <div v-if="loading" class="loading-state">
                <Icon name="mdi:loading" class="spin" />
                <span>Đang tải...</span>
            </div>

            <div v-else class="categories-gallery">
                <NuxtLink v-for="category in categories" :key="category.id" :to="`/service/${category.slug}`" class="category-card">
                    <div class="card-image-wrapper">
                        <img v-if="category.image" :src="category.image" :alt="category.name" class="category-image" />
                        <div v-else class="image-placeholder">
                            <Icon name="mdi:briefcase" />
                        </div>
                        <div class="card-overlay">
                            <span class="view-projects">
                                Xem {{ category.projectCount || 0 }} dự án
                                <Icon name="mdi:arrow-right" />
                            </span>
                        </div>
                    </div>
                    <div class="card-content">
                        <h3 class="category-name">{{ category.name }}</h3>
                        <p class="category-desc">{{ category.description }}</p>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup>
import { useCollectionConfig } from '@/admin/composables/useCollectionConfig'

const loading = ref(false)

const { config, loadConfig } = useCollectionConfig('collections/services/items')

const categories = computed(() => {
    if (!config.value?.categories?.length) {
        return [
            { id: '1', name: 'Camera AI', slug: 'camera-ai', description: 'Giải pháp camera giám sát thông minh', projectCount: 12 },
            { id: '2', name: 'Mạng WiFi', slug: 'mang-wifi', description: 'Hệ thống mạng không dây doanh nghiệp', projectCount: 8 },
            { id: '3', name: 'Hạ tầng mạng', slug: 'ha-tang-mang', description: 'Switch, Router, Cabling hạ tầng', projectCount: 15 },
            { id: '4', name: 'Báo cháy', slug: 'bao-chay', description: 'Hệ thống báo cháy tự động', projectCount: 6 },
            { id: '5', name: 'Kiểm soát ra vào', slug: 'kiem-soat-ra-vao', description: 'Access Control, vân tay, thẻ từ', projectCount: 10 },
            { id: '6', name: 'Tổng đài IP', slug: 'tong-dai-ip', description: 'Hệ thống tổng đài điện thoại IP', projectCount: 5 },
            { id: '7', name: 'Rào chắn', slug: 'rao-chan', description: 'Barrier tự động, cổng từ', projectCount: 7 },
            { id: '8', name: 'Âm thanh', slug: 'am-thanh', description: 'Hệ thống âm thanh thông báo', projectCount: 4 }
        ]
    }

    return config.value.categories.map((cat, index) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.name.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, ''),
        description: cat.description || `Dịch vụ ${cat.name} chuyên nghiệp`,
        image: cat.image,
        projectCount: cat.projectCount || 0
    }))
})

onMounted(async () => {
    loading.value = true
    await loadConfig()
    loading.value = false
})
</script>

<style scoped>
@import "../styles/service-list.css";
</style>
