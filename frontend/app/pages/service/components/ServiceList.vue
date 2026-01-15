<template>
    <section class="service-list-section">
        <div class="container">

            <div class="filter-bar">
                <button v-for="cat in categories" :key="cat" class="filter-btn" :class="{ active: currentCategory === cat }" @click="setCategory(cat)">
                    {{ cat }}
                </button>
            </div>


            <transition-group name="fade" tag="div" class="service-grid">
                <ServiceItem v-for="service in filteredServices" :key="service.id" :service="service" />
            </transition-group>


            <div v-if="filteredServices.length === 0" class="empty-state">
                <div class="empty-icon">
                    <Icon name="mdi:file-search-outline" />
                </div>
                <h3>Không tìm thấy dịch vụ</h3>
                <p>Vui lòng thử chọn danh mục khác</p>
            </div>


            <div class="pagination" v-if="filteredServices.length > 0">
                <button class="page-btn active">1</button>
                <button class="page-btn">2</button>
                <button class="page-btn">3</button>
                <button class="page-btn next">
                    <Icon name="mdi:chevron-right" />
                </button>
            </div>
        </div>
    </section>
</template>

<script setup>
import ServiceItem from './ServiceItem.vue'
import { SERVICES, SERVICE_CATEGORIES } from '../service.config'

const categories = SERVICE_CATEGORIES
const currentCategory = ref('Tất cả')

const setCategory = (cat) => {
    currentCategory.value = cat
}

const filteredServices = computed(() => {
    if (currentCategory.value === 'Tất cả') return SERVICES
    return SERVICES.filter(service => service.category === currentCategory.value)
})
</script>

<style scoped>
@import "../styles/service-list/desktop.css";
@import "../styles/service-list/mobile.css";
</style>
