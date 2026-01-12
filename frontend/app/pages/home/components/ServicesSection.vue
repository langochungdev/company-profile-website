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
.services-section {
    position: relative;
    overflow: hidden;
    height: auto;
    min-height: calc(100vh - 120px);
    padding: 1.5rem 0;
}

.services-container {
    position: relative;
    z-index: 10;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.services-header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 1rem;
    gap: 0.5rem;
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(12px);
    border-radius: 1rem;
    padding: 1rem;
    margin-left: -1rem;
    margin-right: -1rem;
    padding-left: 1rem;
    padding-right: 1rem;
}

.services-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    background: rgba(219, 234, 254, 0.5);
    border: 1px solid rgb(191, 219, 254);
    color: rgb(29, 78, 216);
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
}

.badge-dot {
    position: relative;
    display: flex;
    width: 0.5rem;
    height: 0.5rem;
}

.dot-ping {
    position: absolute;
    display: inline-flex;
    width: 100%;
    height: 100%;
    border-radius: 9999px;
    background: rgb(96, 165, 250);
    opacity: 0.75;
    animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.dot-core {
    position: relative;
    display: inline-flex;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 9999px;
    background: rgb(59, 130, 246);
}

.services-title {
    font-size: clamp(1.25rem, 4.5vw, 1.875rem);
    font-weight: 700;
    color: rgb(15, 23, 42);
    line-height: 1.25;
}

.services-cta {
    display: none;
}

.cta-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: 1px solid rgb(203, 213, 225);
    border-radius: 9999px;
    background: white;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: all 0.3s ease;
}

.cta-button:hover {
    border-color: var(--color-primary);
    background: rgb(239, 246, 255);
}

.cta-text {
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    color: rgb(15, 23, 42);
    transition: color 0.3s ease;
}

.cta-button:hover .cta-text {
    color: var(--color-primary);
}

.cta-icon {
    width: 1rem;
    height: 1rem;
    color: rgb(71, 85, 105);
    transition: all 0.3s ease;
}

.cta-button:hover .cta-icon {
    color: var(--color-primary);
    transform: translateX(0.25rem);
}

.mobile-scroll {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.mobile-card {
    position: relative;
    flex-shrink: 0;
    height: 60px;
    border-radius: 0.75rem;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-card.active {
    height: 180px;
}

.mobile-card-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.mobile-card.active .mobile-card-bg {
    transform: scale(1.05);
}

.mobile-card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.4) 100%);
    transition: background 0.3s ease;
}

.mobile-card.active .mobile-card-overlay {
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.6) 100%);
}

.mobile-card-content {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    height: 60px;
}

.mobile-card-icon {
    width: 1.5rem;
    height: 1.5rem;
    color: white;
    flex-shrink: 0;
}

.mobile-card-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.mobile-card-expanded {
    position: relative;
    z-index: 2;
    padding: 0 1rem 1rem;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    pointer-events: none;
}

.mobile-card.active .mobile-card-expanded {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
}

.mobile-card-desc {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.5;
    margin-bottom: 0.75rem;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.mobile-card-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #DC2626;
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.mobile-card-btn:hover {
    background: #B91C1C;
}

.mobile-btn-icon {
    width: 0.875rem;
    height: 0.875rem;
}

.services-grid {
    display: none;
}

.service-card {
    position: relative;
    display: block;
    overflow: hidden;
    border-radius: 1rem;
    background: rgb(15, 23, 42);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.5s ease;
}

.service-card:hover {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.service-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.7s ease;
}

.service-card:hover .service-image {
    transform: scale(1.1);
}

.service-gradient {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30%;
    background: linear-gradient(to top, rgba(2, 6, 23, 0.85), transparent);
    transition: height 0.4s ease, background 0.4s ease;
}

.service-card:hover .service-gradient {
    height: 60%;
    background: linear-gradient(to top, rgba(2, 6, 23, 0.9), rgba(15, 23, 42, 0.6), transparent);
}

.service-content {
    position: absolute;
    inset: 0;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

.service-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.service-name {
    font-size: 1rem;
    font-weight: 700;
    color: white;
    line-height: 1.25;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    transition: transform 0.3s ease;
}

.service-card:hover .service-name {
    transform: translateY(-4px);
}

.name-large {
    font-size: 1.5rem;
}

.service-desc {
    color: rgb(229, 231, 235);
    font-size: 0.75rem;
    line-height: 1.5;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    max-height: 0;
}

.service-card:hover .service-desc {
    opacity: 1;
    transform: translateY(0);
    max-height: 100px;
}

@keyframes ping {

    75%,
    100% {
        transform: scale(2);
        opacity: 0;
    }
}

@media (min-width: 768px) {
    .services-section {
        height: calc(100vh - 120px);
        min-height: auto;
    }

    .services-header {
        flex-direction: row;
        align-items: flex-end;
    }

    .services-title {
        font-size: 2.25rem;
    }

    .services-cta {
        display: block;
    }

    .mobile-scroll {
        display: none;
    }

    .services-grid {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        grid-template-rows: repeat(6, 1fr);
        gap: 0.75rem;
        flex: 1;
        min-height: 0;
    }

    .service-card {
        border-radius: 1.25rem;
        transform-origin: center;
    }

    .service-card::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 1.25rem;
        padding: 2px;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.5s ease;
    }

    .service-card:hover::before {
        opacity: 1;
    }

    .service-card:hover {
        transform: translateY(-4px);
        z-index: 10;
    }

    .card-0 {
        grid-column: 1 / 5;
        grid-row: 1 / 5;
    }

    .card-1 {
        grid-column: 5 / 8;
        grid-row: 1 / 3;
    }

    .card-2 {
        grid-column: 8 / 10;
        grid-row: 1 / 3;
    }

    .card-3 {
        grid-column: 10 / 13;
        grid-row: 1 / 3;
    }

    .card-4 {
        grid-column: 5 / 8;
        grid-row: 3 / 5;
    }

    .card-5 {
        grid-column: 8 / 13;
        grid-row: 3 / 5;
    }

    .card-6 {
        grid-column: 1 / 4;
        grid-row: 5 / 7;
    }

    .card-7 {
        grid-column: 4 / 13;
        grid-row: 5 / 7;
    }

    .card-0 .service-name {
        font-size: 1.75rem;
    }

    .card-0 .service-desc,
    .card-5 .service-desc,
    .card-7 .service-desc {
        -webkit-line-clamp: 3;
    }

    .service-gradient {
        height: 35%;
    }

    .service-card:hover .service-gradient {
        height: 70%;
    }

    .service-content {
        padding: 1.5rem;
    }

    .service-name {
        font-size: 1.125rem;
    }

    .service-desc {
        font-size: 0.8125rem;
    }
}

@media (min-width: 1024px) {
    .services-grid {
        gap: 1rem;
    }

    .card-0 .service-name {
        font-size: 2rem;
    }

    .service-name {
        font-size: 1.25rem;
    }

    .service-content {
        padding: 1.75rem;
    }
}
</style>
