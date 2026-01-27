<template>
    <section class="about-content">
        <div class="container">
            <div class="hero-section">
                <h1 class="hero-title">
                    <span data-field="hero.title">{{ displayHero.title }}</span><br>
                    <span class="highlight" data-field="hero.highlight">{{ displayHero.highlight }}</span>
                </h1>
                <p class="hero-desc" data-field="hero.description">
                    {{ displayHero.description }}
                </p>
            </div>

            <div class="intro-section">
                <div class="intro-image" data-field="intro.image" data-field-type="image">
                    <img :src="displayIntro.image" alt="Đội ngũ SHT Security" />
                    <div class="experience-badge">
                        <span class="exp-number" data-field="intro.experienceYears">{{ displayIntro.experienceYears }}</span>
                        <span class="exp-text" data-field="intro.experienceText">{{ displayIntro.experienceText }}</span>
                    </div>
                </div>
                <div class="intro-text">
                    <h2 class="section-title" data-field="intro.sectionTitle">{{ displayIntro.sectionTitle }}</h2>
                    <p v-for="(desc, index) in displayIntro.descriptions" :key="index" class="intro-desc" :data-field="`intro.descriptions.${index}.text`">
                        {{ desc.text }}
                    </p>
                </div>
            </div>

            <div class="stats-section">
                <div v-for="(stat, index) in displayStats" :key="stat.label" class="stat-card">
                    <Icon :name="stat.icon" class="stat-icon" />
                    <span class="stat-number" :data-field="`stats.items.${index}.value`">{{ stat.value }}</span>
                    <span class="stat-label" :data-field="`stats.items.${index}.label`">{{ stat.label }}</span>
                </div>
            </div>

            <div class="values-section">
                <h2 class="section-title center">
                    <span data-field="values.sectionTitle">{{ displayValues.sectionTitle }}</span><br>
                    <span class="highlight" data-field="values.highlightText">{{ displayValues.highlightText }}</span>
                </h2>
                <div class="values-grid">
                    <div v-for="(value, index) in displayValues.items" :key="value.title" class="value-card">
                        <div class="value-icon-wrap">
                            <Icon :name="value.icon" class="value-icon" />
                        </div>
                        <h3 class="value-title" :data-field="`values.items.${index}.title`">{{ value.title }}</h3>
                        <p class="value-desc" :data-field="`values.items.${index}.description`">{{ value.description }}</p>
                    </div>
                </div>
            </div>

            <div class="cta-section">
                <div class="cta-content">
                    <h2 class="cta-title" data-field="cta.title">{{ displayCta.title }}</h2>
                    <p class="cta-desc" data-field="cta.description">{{ displayCta.description }}</p>
                </div>
                <NuxtLink :to="displayCta.buttonLink" class="cta-btn">
                    <span data-field="cta.buttonText">{{ displayCta.buttonText }}</span>
                    <Icon name="mdi:arrow-right" />
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface StatItem {
    value: string
    label: string
    icon: string
}

interface ValueItem {
    title: string
    description: string
    icon: string
}

interface DescriptionItem {
    text: string
}

interface AboutData {
    hero?: { title?: string; highlight?: string; description?: string }
    intro?: { image?: string; experienceYears?: string; experienceText?: string; sectionTitle?: string; descriptions?: DescriptionItem[] }
    stats?: { items?: StatItem[] }
    values?: { sectionTitle?: string; highlightText?: string; items?: ValueItem[] }
    cta?: { title?: string; description?: string; buttonText?: string; buttonLink?: string }
}

const props = defineProps<{
    data?: AboutData | null
    editMode?: boolean
}>()

const defaultHero = {
    title: 'Câu Chuyện',
    highlight: 'SHT Security',
    description: 'Đối tác tin cậy trong lĩnh vực an ninh và hạ tầng mạng cho doanh nghiệp Việt Nam'
}

const defaultIntro = {
    image: 'https://placehold.co/800x600/jpg?text=800x600',
    experienceYears: '10+',
    experienceText: 'Năm Kinh Nghiệm',
    sectionTitle: 'Về Chúng Tôi',
    descriptions: [
        { text: 'SHT Security được thành lập với sứ mệnh mang đến các giải pháp an ninh và hạ tầng mạng tiên tiến nhất cho doanh nghiệp Việt Nam. Chúng tôi không chỉ cung cấp sản phẩm, mà còn đồng hành cùng khách hàng trong suốt quá trình vận hành và bảo trì.' },
        { text: 'Với đội ngũ kỹ sư giàu kinh nghiệm và được đào tạo bài bản, chúng tôi tự tin đáp ứng mọi yêu cầu từ dự án gia đình nhỏ đến các tòa nhà doanh nghiệp quy mô lớn.' }
    ]
}

const defaultStats: StatItem[] = [
    { value: '500+', label: 'Dự Án Hoàn Thành', icon: 'mdi:check-decagram' },
    { value: '1000+', label: 'Khách Hàng Tin Tưởng', icon: 'mdi:account-group' },
    { value: '50+', label: 'Kỹ Sư Chuyên Nghiệp', icon: 'mdi:account-hard-hat' },
    { value: '24/7', label: 'Hỗ Trợ Kỹ Thuật', icon: 'mdi:headset' }
]

const defaultValues = {
    sectionTitle: 'Giá Trị',
    highlightText: 'Cốt Lõi',
    items: [
        { title: 'Chất Lượng', description: 'Cam kết sử dụng thiết bị chính hãng, thi công chuẩn quy trình quốc tế.', icon: 'mdi:shield-check' },
        { title: 'Uy Tín', description: 'Bảo hành dài hạn, hỗ trợ nhanh chóng, minh bạch trong mọi giao dịch.', icon: 'mdi:handshake' },
        { title: 'Sáng Tạo', description: 'Luôn cập nhật công nghệ mới nhất, tối ưu hóa giải pháp cho từng khách hàng.', icon: 'mdi:lightbulb-on' },
        { title: 'Tận Tâm', description: 'Đặt lợi ích khách hàng lên hàng đầu, đồng hành từ tư vấn đến bảo trì.', icon: 'mdi:heart' }
    ]
}

const defaultCta = {
    title: 'Bạn Cần Tư Vấn?',
    description: 'Liên hệ ngay với đội ngũ chuyên gia của chúng tôi để được hỗ trợ miễn phí.',
    buttonText: 'Liên Hệ Ngay',
    buttonLink: '/contact'
}

const displayHero = computed(() => ({ ...defaultHero, ...(props.data?.hero || {}) }))
const displayIntro = computed(() => {
    const base = { ...defaultIntro }
    const edited = props.data?.intro || {}
    return {
        ...base,
        ...edited,
        descriptions: edited.descriptions?.length ? edited.descriptions : base.descriptions
    }
})
const displayStats = computed(() => {
    const edited = props.data?.stats?.items
    if (!edited || edited.length === 0) return defaultStats
    return defaultStats.map((base, index) => ({ ...base, ...(edited[index] || {}) }))
})
const displayValues = computed(() => {
    const base = { ...defaultValues }
    const edited = props.data?.values || {}
    return {
        ...base,
        ...edited,
        items: edited.items?.length
            ? defaultValues.items.map((b, i) => ({ ...b, ...(edited.items?.[i] || {}) }))
            : base.items
    }
})
const displayCta = computed(() => ({ ...defaultCta, ...(props.data?.cta || {}) }))
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800;900&display=swap');
@import "../styles/about-content.css";
</style>
