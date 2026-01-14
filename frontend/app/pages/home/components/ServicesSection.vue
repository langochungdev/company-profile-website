<template>
    <section class="services-section">
        <div class="container services-container">
            <div class="services-header">
                <div>
                    <div class="services-badge">
                        <span class="badge-dot">
                            <span class="dot-ping" />
                            <span class="dot-core" />
                        </span>
                        Lĩnh Vực Hoạt Động
                    </div>
                    <h2 class="services-title whitespace-nowrap">
                        Các Hạng Mục<span class="text-primary"> Thi Công</span>
                    </h2>
                </div>
                <div class="services-cta">
                    <NuxtLink to="/product" class="cta-button">
                        <span class="cta-text">XEM TẤT CẢ GIẢI PHÁP</span>
                        <Icon name="mdi:arrow-right" class="cta-icon" />
                    </NuxtLink>
                </div>
            </div>

            <div class="mobile-scroll">
                <NuxtLink v-for="(service, index) in services" :key="'m-' + index" :to="service.link" class="mobile-card" :class="{ 'active': activeIndex === index }" @click="activeIndex = index">
                    <img :src="service.image" :alt="service.title" class="mobile-card-bg" />
                    <div class="mobile-card-overlay"></div>
                    <div class="mobile-card-content">
                        <Icon :name="service.icon" class="mobile-card-icon" />
                        <span class="mobile-card-title">{{ service.title }}</span>
                    </div>
                    <div class="mobile-card-expanded">
                        <p class="mobile-card-desc">{{ service.description }}</p>
                        <div class="mobile-card-btn">
                            <span>Xem chi tiết</span>
                            <Icon name="mdi:arrow-right" class="mobile-btn-icon" />
                        </div>
                    </div>
                </NuxtLink>
            </div>

            <div class="services-grid">
                <NuxtLink v-for="(service, index) in services" :key="index" :to="service.link" :class="['service-card', getGridClass(index)]">
                    <img :src="service.image" :alt="service.title" loading="lazy" class="service-image" />
                    <div class="service-gradient"></div>
                    <div class="service-content">
                        <div class="service-info">
                            <h3 class="service-name" :class="{ 'name-large': index === 0 }">
                                {{ service.title }}
                            </h3>
                            <p class="service-desc">
                                {{ service.description }}
                            </p>
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const activeIndex = ref(0)
const services = [
    {
        title: 'Camera An Ninh AI',
        description: 'Giám sát 24/7, camera IP/Analog/WiFi, AI nhận diện người/xe, hàng rào ảo, Speed Dome PTZ, lưu trữ NAS/Cloud, giám sát đa điểm từ xa.',
        icon: 'mdi:face-recognition',
        image: 'https://placehold.co/600x400/1e293b/ffffff/jpg?text=Camera+AI',
        link: '/product/camera-ai-sht-pro'
    },
    {
        title: 'Hạ Tầng Mạng',
        description: 'Thi công mạng LAN, kéo cáp mạng, Switch/Router/Firewall, UPS/PoE, phân VLAN, VPN đa chi nhánh, đảm bảo kết nối ổn định 24/7.',
        icon: 'mdi:lan',
        image: 'https://placehold.co/600x400/0f766e/ffffff/jpg?text=Ha+Tang+Mang',
        link: '/product/switch-poe-24-port'
    },
    {
        title: 'WiFi & Firewall',
        description: 'WiFi Mesh/Access Point, Firewall bảo mật Anti-DDoS, Switch PoE, Load Balancing, Cloud Controller, tối ưu tốc độ và bảo mật.',
        icon: 'mdi:wifi',
        image: 'https://placehold.co/600x400/7c3aed/ffffff/jpg?text=WiFi+Firewall',
        link: '/product/wifi-6-enterprise'
    },
    {
        title: 'Tủ Rack & Data Center',
        description: 'Tủ Rack 6U-42U, Patch Panel, quản lý cáp, lắp đặt Switch/Router/NVR/NAS, PDU/UPS, gọn gàng chuẩn chỉnh, dễ bảo trì nâng cấp.',
        icon: 'mdi:server',
        image: 'https://placehold.co/600x400/475569/ffffff/jpg?text=Data+Center',
        link: '/product/router-load-balance'
    },
    {
        title: 'Access Control',
        description: 'Kiểm soát ra vào vân tay/khuôn mặt/thẻ từ, khóa điện tử, chấm công nhân viên, phân quyền phòng/cửa, liên kết camera xem lịch sử.',
        icon: 'mdi:fingerprint',
        image: 'https://placehold.co/600x400/0284c7/ffffff/jpg?text=Access+Control',
        link: '/product/may-cham-cong-faceid'
    },
    {
        title: 'Báo Động & Báo Cháy',
        description: 'Cảm biến cửa/chuyển động, đầu báo khói/nhiệt, trung tâm báo cháy, còi/đèn/nút khẩn, gửi cảnh báo điện thoại, chuẩn an toàn.',
        icon: 'mdi:alarm-light',
        image: 'https://placehold.co/600x400/dc2626/ffffff/jpg?text=Bao+Chay',
        link: '/product/bao-chay-dia-chi-4-loop'
    },
    {
        title: 'Tổng Đài IP PBX',
        description: 'Tổng đài VoIP/SIP, máy lẻ nội bộ, chuyển máy tự động, ghi âm cuộc gọi, tổng đài cloud, hotline CSKH chuyên nghiệp.',
        icon: 'mdi:phone-voip',
        image: 'https://placehold.co/600x400/059669/ffffff/jpg?text=Tong+Dai+IP',
        link: '/product'
    },
    {
        title: 'Âm Thanh PA',
        description: 'Loa trần/treo/cột, loa thông báo văn phòng/siêu thị, phát cảnh báo khẩn cấp, hẹn giờ phân vùng, âm thanh vận hành chuyên nghiệp.',
        icon: 'mdi:speaker',
        image: 'https://placehold.co/600x400/d97706/ffffff/jpg?text=Am+Thanh+PA',
        link: '/product'
    }
]

function getGridClass(index: number) {
    const classes = ['card-0', 'card-1', 'card-2', 'card-3', 'card-4', 'card-5', 'card-6', 'card-7']
    return classes[index] || ''
}
</script>

<style scoped>
@import "../styles/services-section/desktop.css";
@import "../styles/services-section/mobile.css";
</style>
