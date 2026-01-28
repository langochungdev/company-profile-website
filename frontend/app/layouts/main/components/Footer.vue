<!-- Chức năng: Footer chính với thông tin liên hệ, liên kết nhanh và bản đồ -->
<template>
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="brand-logo">
                        <div class="brand-name">
                            <span class="text-primary" data-field="brandHighlight">{{ displayBrandHighlight }}</span> <span data-field="brandName">{{ displayBrandName }}</span>
                        </div>
                    </div>
                    <p class="brand-desc" data-field="brandDescription">
                        {{ displayBrandDescription }}
                    </p>
                    <NuxtLink to="/about-us" class="brand-btn">
                        Về Chúng Tôi
                    </NuxtLink>
                    <div class="bct-badge bct-desktop" title="Đã đăng ký Bộ Công Thương">
                        <img src="../images/bocongthuong.png" alt="Đã đăng ký Bộ Công Thương" class="bct-img" loading="lazy" />
                    </div>
                </div>

                <div class="footer-links">
                    <h3 class="footer-title">Liên Kết</h3>
                    <nav aria-label="Footer navigation">
                        <ul class="links-list">
                            <li v-for="(link, index) in displayQuickLinks" :key="link.name">
                                <NuxtLink :to="link.path" class="link-item" :data-field="`quickLinks.${index}.name`">
                                    <Icon name="mdi:chevron-right" class="link-icon" />
                                    {{ link.name }}
                                </NuxtLink>
                            </li>
                        </ul>
                    </nav>
                </div>

                <div class="footer-contact">
                    <h3 class="footer-title">Liên Hệ</h3>
                    <ul class="contact-list">
                        <li v-for="(item, index) in displayContactInfo" :key="index">
                            <div class="contact-item" :data-field="`contactInfo.${index}.value`">
                                <Icon :name="item.icon" class="contact-icon" />
                                {{ item.value }}
                            </div>
                        </li>
                        <li class="bct-mobile-item">
                            <div class="bct-badge" title="Đã đăng ký Bộ Công Thương">
                                <img src="../images/bocongthuong.png" alt="Đã đăng ký Bộ Công Thương" class="bct-img-mobile" loading="lazy" />
                            </div>
                        </li>
                    </ul>
                    <div class="social-icons social-desktop">
                        <div v-for="social in displaySocials" :key="social.name" :aria-label="social.name" class="social-icon">
                            <Icon :name="social.icon" class="social-icon-svg" />
                        </div>
                    </div>
                </div>

                <div class="footer-map">
                    <h3 class="footer-title">Bản Đồ</h3>
                    <div class="map-address">
                        <Icon name="mdi:map-marker" class="map-icon" />
                        <span data-field="mapAddress">{{ displayMapAddress }}</span>
                    </div>
                    <div class="map-container">
                        <button class="map-edit-btn" data-field="mapEmbedUrl" data-field-type="text" title="Chỉnh sửa URL bản đồ">
                            <Icon name="mdi:map-marker-plus" />
                            <span>Đổi vị trí</span>
                        </button>
                        <div class="map-wrapper">
                            <iframe :src="displayMapEmbedUrl" width="100%" height="100%" style="border:0;" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Bản đồ địa chỉ SHT Security"></iframe>
                        </div>
                    </div>
                    <div class="social-icons social-mobile">
                        <div v-for="social in displaySocials" :key="social.name" :aria-label="social.name" class="social-icon">
                            <Icon :name="social.icon" class="social-icon-svg" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="footer-bottom">
                <p class="copyright" data-field="copyright">
                    {{ displayCopyright }}
                </p>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface QuickLink {
    name: string
    path: string
}

interface ContactInfo {
    icon: string
    value: string
}

interface SocialItem {
    name: string
    icon: string
    url: string
}

interface FooterData {
    brandName?: string
    brandHighlight?: string
    brandDescription?: string
    quickLinks?: QuickLink[]
    contactInfo?: ContactInfo[]
    socials?: SocialItem[]
    mapAddress?: string
    mapEmbedUrl?: string
    copyright?: string
}

const props = defineProps<{
    data?: FooterData | null
}>()

const defaultQuickLinks: QuickLink[] = [
    { name: 'Giới Thiệu', path: '/about-us' },
    { name: 'Sản Phẩm', path: '/product' },
    { name: 'Tin Tức', path: '/post' },
    { name: 'Liên Hệ', path: '/contact' }
]

const defaultContactInfo: ContactInfo[] = [
    { icon: 'mdi:phone', value: '0901 234 567' },
    { icon: 'mdi:phone-classic', value: '028 7654 321' },
    { icon: 'mdi:email', value: 'info@sht.vn' },
    { icon: 'mdi:facebook', value: 'facebook.com/SHT.security' },
    { icon: 'mdi:chat', value: 'Zalo: 0901 234 567' }
]

const defaultSocials: SocialItem[] = [
    { name: 'Facebook', icon: 'mdi:facebook', url: 'https://facebook.com/SHT.security' },
    { name: 'TikTok', icon: 'mdi:music-note', url: 'https://tiktok.com/@sht.security' },
    { name: 'YouTube', icon: 'mdi:youtube', url: 'https://youtube.com/@SHTsecurity' },
    { name: 'Zalo', icon: 'mdi:chat', url: 'https://zalo.me/0901234567' }
]

const displayBrandHighlight = computed(() => props.data?.brandHighlight || 'SHT')
const displayBrandName = computed(() => props.data?.brandName || 'Security')
const displayBrandDescription = computed(() => props.data?.brandDescription || 'Chuyên cung cấp giải pháp an ninh và hạ tầng mạng cho gia đình, doanh nghiệp. Camera AI, mạng LAN, WiFi, Access Control, Báo cháy, Tổng đài IP.')

const displayQuickLinks = computed(() => {
    const edited = props.data?.quickLinks
    if (!edited || edited.length === 0) return defaultQuickLinks
    return defaultQuickLinks.map((base, index) => ({ ...base, ...(edited[index] || {}) }))
})

const displayContactInfo = computed(() => {
    const edited = props.data?.contactInfo
    if (!edited || edited.length === 0) return defaultContactInfo
    return defaultContactInfo.map((base, index) => ({ ...base, ...(edited[index] || {}) }))
})

const displaySocials = computed(() => {
    const edited = props.data?.socials
    if (!edited || edited.length === 0) return defaultSocials
    return defaultSocials.map((base, index) => ({ ...base, ...(edited[index] || {}) }))
})

const displayMapAddress = computed(() => props.data?.mapAddress || '123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh')
const displayMapEmbedUrl = computed(() => props.data?.mapEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241674197956!2d106.69765841533417!3d10.778789792319392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f38f9ed887b%3A0x14aded5703768989!2zUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1704796800000')
const displayCopyright = computed(() => props.data?.copyright || '© 2024 SHT Security. All rights reserved.')
</script>

<style scoped>
/* Footer - Desktop styles */
.footer {
    background: #1a1a1a;
    padding-top: 2rem;
    padding-bottom: 1.5rem;
}

.footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

.footer-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-brand {
    grid-column: span 2;
}

.brand-logo {
    display: inline-block;
    margin-bottom: 1rem;
    cursor: pointer;
}

.brand-name {
    font-size: 1.875rem;
    font-weight: 700;
    color: #ffffff;
}

.text-primary {
    color: #DC2626;
}

.brand-desc {
    color: #9ca3af;
    font-size: 0.875rem;
    line-height: 1.625;
    margin-bottom: 1rem;
}

.brand-btn {
    background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
    color: #ffffff;
    padding: 0.625rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    transition: all 0.3s;
    border: none;
    cursor: pointer;
    font-size: 0.875rem;
}

.brand-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(220, 38, 38, 0.3);
}

.bct-badge {
    cursor: pointer;
    margin-top: 1rem;
}

.bct-desktop {
    display: none;
}

.bct-img {
    height: 5rem;
}

.bct-img-mobile {
    height: 3rem;
}

.bct-mobile-item {
    display: block;
}

.footer-links,
.footer-contact {
    grid-column: span 1;
}

.footer-map {
    grid-column: span 2;
}

.footer-title {
    color: #ffffff;
    font-weight: 700;
    font-size: 1.125rem;
    margin-bottom: 1rem;
}

.links-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.link-item {
    color: #9ca3af;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: color 0.3s;
}

.link-item:hover {
    color: #DC2626;
}

.link-icon {
    width: 1rem;
    height: 1rem;
}

.contact-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.contact-item {
    color: #9ca3af;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: color 0.3s;
}

.contact-item:hover {
    color: #DC2626;
}

.contact-icon {
    width: 1rem;
    height: 1rem;
    color: #DC2626;
}

.social-icons {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 1rem;
}

.social-desktop {
    display: none;
}

.social-mobile {
    display: flex;
    justify-content: center;
}

.social-icon {
    width: 2.25rem;
    height: 2.25rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    transition: background 0.3s;
    cursor: pointer;
}

.social-icon:hover {
    background: #DC2626;
}

.social-icon-svg {
    width: 1rem;
    height: 1rem;
}

.map-address {
    color: #9ca3af;
    font-size: 0.875rem;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
}

.map-icon {
    width: 1rem;
    height: 1rem;
    color: #DC2626;
    margin-top: 0.125rem;
    flex-shrink: 0;
}

.map-container {
    position: relative;
}

.map-edit-btn {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 0.75rem;
    background: rgba(220, 38, 38, 0.95);
    color: #ffffff;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.map-edit-btn:hover {
    background: #DC2626;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
}

.map-wrapper {
    border-radius: 0.5rem;
    overflow: hidden;
    aspect-ratio: 16/9;
}

.footer-bottom {
    padding-top: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}

.copyright {
    color: #9ca3af;
    font-size: 0.875rem;
    text-align: center;
}

@media (min-width: 768px) {
    .footer-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .footer-brand {
        grid-column: span 1;
    }

    .bct-desktop {
        display: block;
    }

    .bct-mobile-item {
        display: none;
    }

    .footer-map {
        grid-column: span 1;
        display: flex;
        flex-direction: column;
    }

    .social-desktop {
        display: flex;
    }

    .social-mobile {
        display: none;
    }

    .map-wrapper {
        aspect-ratio: auto;
        flex: 1;
    }
}

@media (min-width: 1024px) {
    .footer-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}
</style>
