<template>
    <footer class="bg-secondary pt-16 pb-6" itemscope itemtype="https://schema.org/Organization">
        <div class="container">
            <!-- Main Footer Content -->
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/10">
                <!-- Logo & Description -->
                <div>
                    <div class="inline-block mb-4 cursor-pointer" itemprop="url">
                        <div class="text-3xl font-bold text-white" itemprop="name">
                            <span class="text-primary">SHT</span> Security
                        </div>
                    </div>
                    <p class="text-gray-400 text-sm leading-relaxed mb-4" itemprop="description">
                        Chuyên cung cấp giải pháp an ninh và hạ tầng mạng cho gia đình, doanh nghiệp.
                        Camera AI, mạng LAN, WiFi, Access Control, Báo cháy, Tổng đài IP.
                    </p>
                    <button class="btn-primary text-sm">
                        Về Chúng Tôi
                    </button>
                </div>

                <!-- Quick Links -->
                <div>
                    <h3 class="text-white font-bold text-lg mb-4">Liên Kết</h3>
                    <nav aria-label="Footer navigation">
                        <ul class="space-y-2">
                            <li v-for="link in quickLinks" :key="link.name">
                                <span class="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-2 cursor-pointer">
                                    <Icon name="mdi:chevron-right" class="w-4 h-4" />
                                    {{ link.name }}
                                </span>
                            </li>
                        </ul>
                    </nav>
                </div>

                <!-- Contact Info -->
                <div>
                    <h3 class="text-white font-bold text-lg mb-4">Liên Hệ</h3>
                    <ul class="space-y-3">
                        <li>
                            <div class="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-2 cursor-pointer" itemprop="telephone">
                                <Icon name="mdi:phone" class="w-4 h-4 text-primary" />
                                0901 234 567
                            </div>
                        </li>
                        <li>
                            <div class="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-2 cursor-pointer">
                                <Icon name="mdi:phone-classic" class="w-4 h-4 text-primary" />
                                028 7654 321
                            </div>
                        </li>
                        <li>
                            <div class="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-2 cursor-pointer" itemprop="email">
                                <Icon name="mdi:email" class="w-4 h-4 text-primary" />
                                info@sht.vn
                            </div>
                        </li>
                        <li>
                            <div class="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-2 cursor-pointer">
                                <Icon name="mdi:facebook" class="w-4 h-4 text-primary" />
                                facebook.com/SHT.security
                            </div>
                        </li>
                        <li>
                            <div class="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-2 cursor-pointer">
                                <Icon name="mdi:chat" class="w-4 h-4 text-primary" />
                                Zalo: 0901 234 567
                            </div>
                        </li>
                        <li class="text-gray-400 text-sm flex items-start gap-2" itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
                            <Icon name="mdi:map-marker" class="w-4 h-4 text-primary mt-0.5" />
                            <span itemprop="streetAddress">123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh</span>
                        </li>
                    </ul>
                </div>

                <!-- Google Map -->
                <div>
                    <h3 class="text-white font-bold text-lg mb-4">Bản Đồ</h3>
                    <div class="rounded-lg overflow-hidden aspect-video">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241674197956!2d106.69765841533417!3d10.778789792319392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f38f9ed887b%3A0x14aded5703768989!2zUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1704796800000" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Bản đồ địa chỉ SHT Security"></iframe>
                    </div>
                </div>
            </div>

            <!-- Bottom Footer -->
            <div class="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <p class="text-gray-400 text-sm">
                        © 2024 SHT Security. All rights reserved.
                    </p>
                    <div class="cursor-pointer" title="Đã đăng ký Bộ Công Thương">
                        <img src="/images/bocongthuong.png" alt="Đã đăng ký Bộ Công Thương" class="h-10" loading="lazy" />
                    </div>
                </div>

                <!-- Social Icons -->
                <div class="flex items-center gap-3">
                    <div v-for="social in socials" :key="social.name" :aria-label="social.name" class="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors cursor-pointer">
                        <Icon :name="social.icon" class="w-4 h-4" />
                    </div>
                </div>
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
