<template>
    <section class="relative overflow-hidden h-[calc(100vh-120px)] py-6">
        <div class="container relative z-10 h-full flex flex-col">
            <div class="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-2 flex-shrink-0 bg-white/90 backdrop-blur-sm rounded-2xl p-4 -mx-4 px-4">
                <div>
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
                        <span class="relative flex h-2 w-2">
                            <span class="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping" />
                            <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                        </span>
                        Lĩnh Vực Hoạt Động
                    </div>
                    <h2 class="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                        Hệ Sinh Thái <span class="text-primary">Công Nghệ</span>
                    </h2>
                </div>
                <div class="hidden md:block">
                    <button class="group flex items-center gap-2 px-6 py-3 border border-slate-300 hover:border-primary rounded-full transition-all bg-white hover:bg-blue-50 shadow-sm cursor-pointer">
                        <span class="text-sm font-semibold tracking-wider text-slate-900 group-hover:text-primary transition-colors">XEM TẤT CẢ GIẢI PHÁP</span>
                        <Icon name="mdi:arrow-right" class="w-4 h-4 text-slate-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 grid-rows-3 gap-3 flex-1 min-h-0">
                <div v-for="(service, index) in services" :key="index" :class="[getGridClass(index)]" class="group relative block overflow-hidden rounded-2xl bg-slate-900 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer">
                    <img :src="service.image" :alt="service.title" loading="lazy" class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" :class="index === 7 ? 'md:filter-none blur-sm' : ''" />

                    <div class="absolute bottom-0 left-0 w-full h-[50%] bg-gradient-to-t from-slate-950/70 via-slate-900/40 to-transparent" :class="index === 7 ? 'md:h-[50%] h-full from-slate-950/90' : ''"></div>

                    <div class="absolute inset-0 p-4 flex flex-col justify-between" :class="index === 7 ? 'md:justify-between justify-center items-center' : ''">
                        <div v-if="index !== 7 || index === 7" class="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500" :class="index === 7 ? 'md:flex hidden' : ''">
                            <div :class="[getIconBgColor(index)]" class="w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-slate-900 border border-white/20 transform scale-0 group-hover:scale-100 transition-transform duration-500">
                                <Icon :name="service.icon" class="w-5 h-5" />
                            </div>
                        </div>

                        <div v-if="index === 7" class="md:hidden text-center">
                            <Icon name="mdi:dots-horizontal-circle" class="w-12 h-12 text-white mx-auto mb-3" />
                            <h3 class="text-2xl font-bold text-white mb-2">Xem Thêm</h3>
                            <p class="text-white/80 text-sm">Khám phá các giải pháp khác</p>
                        </div>

                        <div class="space-y-2" :class="index === 7 ? 'md:block hidden' : ''">
                            <h3 :class="index === 0 ? 'text-xl md:text-2xl' : 'text-sm md:text-base'" class="font-bold text-white leading-tight drop-shadow-lg">
                                {{ service.title }}
                            </h3>
                            <p class="text-gray-200 text-xs leading-relaxed drop-shadow-md" :class="getGridClass(index).includes('col-span-2') ? 'line-clamp-3' : 'line-clamp-2'">
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
    if (index === 0) return 'col-span-2 md:col-span-2 md:row-span-2'
    if (index === 3) return 'md:col-span-2 md:row-span-1'
    if (index >= 4 && index <= 6) return 'hidden md:block md:col-span-1 md:row-span-1'
    if (index === 7) return 'md:col-span-1 md:row-span-1'
    return 'md:col-span-1 md:row-span-1'
}

function getIconBgColor(index: number) {
    const colors = [
        'bg-cyan-400',
        'bg-emerald-400',
        'bg-purple-400',
        'bg-orange-400',
        'bg-pink-400',
        'bg-blue-400',
        'bg-yellow-400',
        'bg-red-400'
    ]
    return colors[index] || 'bg-gray-400'
}

</script>

<style scoped></style>
