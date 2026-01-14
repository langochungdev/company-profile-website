<!-- Chức năng: Footer chính với thông tin liên hệ, liên kết nhanh và bản đồ -->
<template>
    <footer class="footer" itemscope itemtype="https://schema.org/Organization">
        <div class="footer-container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="brand-logo" itemprop="url">
                        <div class="brand-name" itemprop="name">
                            <span class="text-primary">SHT</span> Security
                        </div>
                    </div>
                    <p class="brand-desc" itemprop="description">
                        Chuyên cung cấp giải pháp an ninh và hạ tầng mạng cho gia đình, doanh nghiệp.
                        Camera AI, mạng LAN, WiFi, Access Control, Báo cháy, Tổng đài IP.
                    </p>
                    <NuxtLink to="/gioi-thieu" class="brand-btn">
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
                            <li v-for="link in quickLinks" :key="link.name">
                                <NuxtLink :to="link.path" class="link-item">
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
                        <li>
                            <div class="contact-item" itemprop="telephone">
                                <Icon name="mdi:phone" class="contact-icon" />
                                0901 234 567
                            </div>
                        </li>
                        <li>
                            <div class="contact-item">
                                <Icon name="mdi:phone-classic" class="contact-icon" />
                                028 7654 321
                            </div>
                        </li>
                        <li>
                            <div class="contact-item" itemprop="email">
                                <Icon name="mdi:email" class="contact-icon" />
                                info@sht.vn
                            </div>
                        </li>
                        <li>
                            <div class="contact-item">
                                <Icon name="mdi:facebook" class="contact-icon" />
                                facebook.com/SHT.security
                            </div>
                        </li>
                        <li>
                            <div class="contact-item">
                                <Icon name="mdi:chat" class="contact-icon" />
                                Zalo: 0901 234 567
                            </div>
                        </li>
                        <li class="bct-mobile-item">
                            <div class="bct-badge" title="Đã đăng ký Bộ Công Thương">
                                <img src="./images/bocongthuong.png" alt="Đã đăng ký Bộ Công Thương" class="bct-img-mobile" loading="lazy" />
                            </div>
                        </li>
                    </ul>
                    <div class="social-icons social-desktop">
                        <div v-for="social in socials" :key="social.name" :aria-label="social.name" class="social-icon">
                            <Icon :name="social.icon" class="social-icon-svg" />
                        </div>
                    </div>
                </div>

                <div class="footer-map">
                    <h3 class="footer-title">Bản Đồ</h3>
                    <div class="map-address" itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
                        <Icon name="mdi:map-marker" class="map-icon" />
                        <span itemprop="streetAddress">123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh</span>
                    </div>
                    <div class="map-wrapper">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241674197956!2d106.69765841533417!3d10.778789792319392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f38f9ed887b%3A0x14aded5703768989!2zUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1704796800000" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Bản đồ địa chỉ SHT Security"></iframe>
                    </div>
                    <div class="social-icons social-mobile">
                        <div v-for="social in socials" :key="social.name" :aria-label="social.name" class="social-icon">
                            <Icon :name="social.icon" class="social-icon-svg" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="footer-bottom">
                <p class="copyright">
                    © 2024 SHT Security. All rights reserved.
                </p>
            </div>
        </div>
    </footer>
</template>

<script setup>
const quickLinks = [
    { name: 'Giới Thiệu', path: '/about-us' },
    { name: 'Sản Phẩm', path: '/product' },
    { name: 'Tin Tức', path: '/post' },
    { name: 'Liên Hệ', path: '/contact' }
]

const socials = [
    { name: 'Facebook', icon: 'mdi:facebook', url: 'https://facebook.com/SHT.security' },
    { name: 'TikTok', icon: 'mdi:music-note', url: 'https://tiktok.com/@sht.security' },
    { name: 'YouTube', icon: 'mdi:youtube', url: 'https://youtube.com/@SHTsecurity' },
    { name: 'Zalo', icon: 'mdi:chat', url: 'https://zalo.me/0901234567' }
]
</script>

<style scoped>
@import "../styles/footer/desktop.css";
@import "../styles/footer/mobile.css";
</style>
