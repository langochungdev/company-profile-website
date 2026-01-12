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
                    <button class="brand-btn">
                        Về Chúng Tôi
                    </button>
                    <div class="bct-badge bct-desktop" title="Đã đăng ký Bộ Công Thương">
                        <img src="./img/bocongthuong.png" alt="Đã đăng ký Bộ Công Thương" class="bct-img" loading="lazy" />
                    </div>
                </div>

                <div class="footer-links">
                    <h3 class="footer-title">Liên Kết</h3>
                    <nav aria-label="Footer navigation">
                        <ul class="links-list">
                            <li v-for="link in quickLinks" :key="link.name">
                                <span class="link-item">
                                    <Icon name="mdi:chevron-right" class="link-icon" />
                                    {{ link.name }}
                                </span>
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
                                <img src="./img/bocongthuong.png" alt="Đã đăng ký Bộ Công Thương" class="bct-img-mobile" loading="lazy" />
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
    { name: 'Giới Thiệu', path: '/gioi-thieu' },
    { name: 'Camera An Ninh', path: '/san-pham/camera-an-ninh' },
    { name: 'Hạ Tầng Mạng', path: '/san-pham/ha-tang-mang' },
    { name: 'WiFi & Firewall', path: '/san-pham/wifi-firewall' },
    { name: 'Access Control', path: '/san-pham/access-control' },
    { name: 'Báo Động & Báo Cháy', path: '/san-pham/bao-dong-bao-chay' },
    { name: 'Dự Án', path: '/du-an' },
    { name: 'Bài Đăng', path: '/bai-dang' },
    { name: 'Liên Hệ', path: '/lien-he' }
]

const socials = [
    { name: 'Facebook', icon: 'mdi:facebook', url: 'https://facebook.com/SHT.security' },
    { name: 'TikTok', icon: 'mdi:music-note', url: 'https://tiktok.com/@sht.security' },
    { name: 'YouTube', icon: 'mdi:youtube', url: 'https://youtube.com/@SHTsecurity' },
    { name: 'Zalo', icon: 'mdi:chat', url: 'https://zalo.me/0901234567' }
]
</script>

<style scoped>
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

@media (min-width: 768px) {
    .footer-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .footer-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

.footer-brand {
    grid-column: span 2;
}

@media (min-width: 768px) {
    .footer-brand {
        grid-column: span 1;
    }
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

@media (min-width: 768px) {
    .bct-desktop {
        display: block;
    }
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

@media (min-width: 768px) {
    .bct-mobile-item {
        display: none;
    }
}

.footer-links,
.footer-contact {
    grid-column: span 1;
}

.footer-map {
    grid-column: span 2;
}

@media (min-width: 768px) {
    .footer-map {
        grid-column: span 1;
        display: flex;
        flex-direction: column;
    }
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

@media (min-width: 768px) {
    .social-desktop {
        display: flex;
    }
}

.social-mobile {
    display: flex;
    justify-content: center;
}

@media (min-width: 768px) {
    .social-mobile {
        display: none;
    }
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

.map-wrapper {
    border-radius: 0.5rem;
    overflow: hidden;
    aspect-ratio: 16/9;
}

@media (min-width: 768px) {
    .map-wrapper {
        aspect-ratio: auto;
        flex: 1;
    }
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
</style>
