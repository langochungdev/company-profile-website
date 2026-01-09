<template>
    <section ref="sectionRef" class="relative overflow-hidden bg-slate-50 h-[calc(100vh-120px)] py-6">
        <div class="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

        <div class="container relative z-10 h-full flex flex-col">
            <div class="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-2 flex-shrink-0">
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
                    <button class="group flex items-center gap-2 text-slate-600 hover:text-primary transition-colors font-semibold cursor-pointer">
                        Xem tất cả giải pháp
                        <Icon name="mdi:arrow-right" class="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 grid-rows-3 gap-3 flex-1 min-h-0">
                <div v-for="(service, index) in services" :key="index" :class="[getGridClass(index), isVisible ? 'animate-fade-in-up' : 'opacity-0']" :style="{ animationDelay: `${index * 100}ms` }" class="group relative block overflow-hidden rounded-2xl bg-slate-900 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer">
                    <img :src="service.image" :alt="service.title" loading="lazy" class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />

                    <div class="absolute bottom-0 left-0 w-full h-[50%] bg-gradient-to-t from-slate-950/70 via-slate-900/40 to-transparent"></div>

                    <div class="absolute inset-0 p-4 flex flex-col justify-between">
                        <div class="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div :class="[getIconBgColor(index)]" class="w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-slate-900 border border-white/20 transform scale-0 group-hover:scale-100 transition-transform duration-500">
                                <Icon :name="service.icon" class="w-5 h-5" />
                            </div>
                        </div>

                        <div class="space-y-2">
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
const isVisible = ref(false)
const sectionRef = ref<HTMLElement | null>(null)

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
    if (index === 0) return 'md:col-span-2 md:row-span-2'
    if (index === 3) return 'md:col-span-2 md:row-span-1'
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

onMounted(() => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    isVisible.value = true
                    observer.disconnect()
                }
            })
        },
        { threshold: 0.2 }
    )

    if (sectionRef.value) {
        observer.observe(sectionRef.value)
    }
})
</script>

<style scoped>
@keyframes fade-in-up {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
    animation: fade-in-up 0.6s ease-out forwards;
}
</style>
