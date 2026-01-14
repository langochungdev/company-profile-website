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
                    <button class="cta-button">
                        <span class="cta-text">XEM TẤT CẢ GIẢI PHÁP</span>
                        <Icon name="mdi:arrow-right" class="cta-icon" />
                    </button>
                </div>
            </div>

            <div class="mobile-scroll">
                <div v-for="(service, index) in services" :key="'m-' + index" class="mobile-card" :class="{ 'active': activeIndex === index }" @click="activeIndex = index">
                    <img :src="service.image" :alt="service.title" class="mobile-card-bg" />
                    <div class="mobile-card-overlay"></div>
                    <div class="mobile-card-content">
                        <Icon :name="service.icon" class="mobile-card-icon" />
                        <span class="mobile-card-title">{{ service.title }}</span>
                    </div>
                    <div class="mobile-card-expanded">
                        <p class="mobile-card-desc">{{ service.description }}</p>
                        <button class="mobile-card-btn">
                            <span>Xem chi tiết</span>
                            <Icon name="mdi:arrow-right" class="mobile-btn-icon" />
                        </button>
                    </div>
                </div>
            </div>

            <div class="services-grid">
                <div v-for="(service, index) in services" :key="index" :class="['service-card', getGridClass(index)]">
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
                </div>
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
        image: '/images/pj.jpg',
        link: '/san-pham/camera-an-ninh'
    },
    {
        title: 'Hạ Tầng Mạng',
        description: 'Thi công mạng LAN, kéo cáp mạng, Switch/Router/Firewall, UPS/PoE, phân VLAN, VPN đa chi nhánh, đảm bảo kết nối ổn định 24/7.',
        icon: 'mdi:lan',
        image: '/images/pj.jpg',
        link: '/san-pham/ha-tang-mang'
    },
    {
        title: 'WiFi & Firewall',
        description: 'WiFi Mesh/Access Point, Firewall bảo mật Anti-DDoS, Switch PoE, Load Balancing, Cloud Controller, tối ưu tốc độ và bảo mật.',
        icon: 'mdi:wifi',
        image: '/images/pj.jpg',
        link: '/san-pham/wifi-firewall'
    },
    {
        title: 'Tủ Rack & Data Center',
        description: 'Tủ Rack 6U-42U, Patch Panel, quản lý cáp, lắp đặt Switch/Router/NVR/NAS, PDU/UPS, gọn gàng chuẩn chỉnh, dễ bảo trì nâng cấp.',
        icon: 'mdi:server',
        image: '/images/pj.jpg',
        link: '/san-pham/tu-rack'
    },
    {
        title: 'Access Control',
        description: 'Kiểm soát ra vào vân tay/khuôn mặt/thẻ từ, khóa điện tử, chấm công nhân viên, phân quyền phòng/cửa, liên kết camera xem lịch sử.',
        icon: 'mdi:fingerprint',
        image: '/images/pj.jpg',
        link: '/san-pham/access-control'
    },
    {
        title: 'Báo Động & Báo Cháy',
        description: 'Cảm biến cửa/chuyển động, đầu báo khói/nhiệt, trung tâm báo cháy, còi/đèn/nút khẩn, gửi cảnh báo điện thoại, chuẩn an toàn.',
        icon: 'mdi:alarm-light',
        image: '/images/pj.jpg',
        link: '/san-pham/bao-dong-bao-chay'
    },
    {
        title: 'Tổng Đài IP PBX',
        description: 'Tổng đài VoIP/SIP, máy lẻ nội bộ, chuyển máy tự động, ghi âm cuộc gọi, tổng đài cloud, hotline CSKH chuyên nghiệp.',
        icon: 'mdi:phone-voip',
        image: '/images/pj.jpg',
        link: '/san-pham/tong-dai-ip'
    },
    {
        title: 'Âm Thanh PA',
        description: 'Loa trần/treo/cột, loa thông báo văn phòng/siêu thị, phát cảnh báo khẩn cấp, hẹn giờ phân vùng, âm thanh vận hành chuyên nghiệp.',
        icon: 'mdi:speaker',
        image: '/images/pj.jpg',
        link: '/san-pham/am-thanh-loa'
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
