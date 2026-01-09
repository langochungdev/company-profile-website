<template>
    <section class="relative w-full bg-slate-50 overflow-hidden">
        <div class="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        <div class="container relative z-10 mb-8 flex flex-col md:flex-row items-end justify-between gap-6">
            <div>
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
                    <span class="relative flex h-2 w-2">
                        <span class="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping" />
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                    </span>
                    Các KÊNH TRUYỀN THÔNG
                </div>
                <h2 class="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                    CÁC KÊNH <span class="text-primary">TRUYỀN THÔNG</span>
                </h2>
            </div>

            <div class="flex gap-3">
                <button @click="scrollSlider(-400)" class="w-12 h-12 rounded-full border border-slate-300 flex items-center justify-center hover:bg-white hover:border-primary transition-all text-slate-600 hover:text-primary shadow-sm">
                    <Icon name="mdi:chevron-left" class="w-6 h-6" />
                </button>
                <button @click="scrollSlider(400)" class="w-12 h-12 rounded-full border border-slate-300 flex items-center justify-center hover:bg-white hover:border-primary transition-all text-slate-600 hover:text-primary shadow-sm">
                    <Icon name="mdi:chevron-right" class="w-6 h-6" />
                </button>
            </div>
        </div>

        <div class="container relative z-10 mb-8 flex flex-wrap justify-center gap-4">
            <a href="https://tiktok.com/@huyphan_sht_co.ltd" target="_blank" rel="noopener noreferrer" class="group flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 hover:border-primary rounded-full transition-all hover:bg-blue-50 shadow-sm">
                <Icon name="mdi:music-note" class="w-5 h-5 text-slate-700" />
                <span class="text-sm font-semibold text-slate-900 group-hover:text-primary transition-colors">Theo dõi TikTok</span>
            </a>
            <a href="https://facebook.com/SHT.security" target="_blank" rel="noopener noreferrer" class="group flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 hover:border-blue-500 rounded-full transition-all hover:bg-blue-50 shadow-sm">
                <Icon name="mdi:facebook" class="w-5 h-5 text-blue-600" />
                <span class="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Theo dõi Facebook</span>
            </a>
            <a href="https://youtube.com/@SHTsecurity" target="_blank" rel="noopener noreferrer" class="group flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 hover:border-red-500 rounded-full transition-all hover:bg-red-50 shadow-sm">
                <Icon name="mdi:youtube" class="w-5 h-5 text-red-600" />
                <span class="text-sm font-semibold text-slate-900 group-hover:text-red-600 transition-colors">Đăng ký YouTube</span>
            </a>
        </div>

        <div class="container relative z-10">
            <div ref="sliderRef" class="overflow-x-auto hide-scroll" @mousedown="startDrag" @mousemove="onDrag" @mouseup="endDrag" @mouseleave="endDrag">
                <div class="flex gap-6 md:gap-8 w-max pb-10 pt-4 select-none">
                    <div v-for="(video, index) in videos" :key="index" class="relative group pointer-events-auto">
                        <div class="phone-frame w-[325px] h-[575px] bg-white rounded-[32px] overflow-hidden relative border border-slate-200 shadow-lg">
                            <div v-html="video.embedHtml" class="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0 [&_iframe]:pointer-events-auto [&_blockquote]:m-0 [&_blockquote]:p-0" />
                        </div>
                    </div>

                    <NuxtLink to="https://tiktok.com/@huyphan_sht_co.ltd" target="_blank" class="relative group">
                        <div class="phone-frame w-[325px] h-[575px] bg-white rounded-[32px] overflow-hidden relative border border-slate-200 shadow-lg flex items-center justify-center">
                            <div class="text-center p-6">
                                <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-200">
                                    <Icon name="mdi:plus" class="w-8 h-8 text-primary" />
                                </div>
                                <h3 class="text-xl font-bold text-slate-900 mb-2">Xem thêm trên TikTok</h3>
                                <span class="text-primary text-sm hover:underline">@huyphan_sht_co.ltd</span>
                            </div>
                        </div>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const sliderRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)

const videos = [
    {
        embedHtml: `<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@huyphan_sht_co.ltd/video/7479305993915026705" data-video-id="7479305993915026705" style="max-width:100%;min-width:100%;height:100%;margin:0;"><section><a target="_blank" title="@huyphan_sht_co.ltd" href="https://www.tiktok.com/@huyphan_sht_co.ltd?refer=embed">@huyphan_sht_co.ltd</a></section></blockquote>`
    },
    {
        embedHtml: `<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@huyphan_sht_co.ltd/video/7479305993915026705" data-video-id="7479305993915026705" style="max-width:100%;min-width:100%;height:100%;margin:0;"><section><a target="_blank" title="@huyphan_sht_co.ltd" href="https://www.tiktok.com/@huyphan_sht_co.ltd?refer=embed">@huyphan_sht_co.ltd</a></section></blockquote>`
    },
    {
        embedHtml: `<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@huyphan_sht_co.ltd/video/7479305993915026705" data-video-id="7479305993915026705" style="max-width:100%;min-width:100%;height:100%;margin:0;"><section><a target="_blank" title="@huyphan_sht_co.ltd" href="https://www.tiktok.com/@huyphan_sht_co.ltd?refer=embed">@huyphan_sht_co.ltd</a></section></blockquote>`
    }
]

function scrollSlider(amount: number) {
    sliderRef.value?.scrollBy({ left: amount, behavior: 'smooth' })
}

function startDrag(e: MouseEvent) {
    if (!sliderRef.value) return
    const target = e.target as HTMLElement
    if (target.closest('.phone-frame')) return
    isDragging.value = true
    sliderRef.value.style.cursor = 'grabbing'
    startX.value = e.pageX - sliderRef.value.offsetLeft
    scrollLeft.value = sliderRef.value.scrollLeft
}

function onDrag(e: MouseEvent) {
    if (!isDragging.value || !sliderRef.value) return
    e.preventDefault()
    const x = e.pageX - sliderRef.value.offsetLeft
    const walk = (x - startX.value) * 2
    sliderRef.value.scrollLeft = scrollLeft.value - walk
}

function endDrag() {
    isDragging.value = false
    if (sliderRef.value) sliderRef.value.style.cursor = 'grab'
}

onMounted(() => {
    const script = document.createElement('script')
    script.src = 'https://www.tiktok.com/embed.js'
    script.async = true
    document.body.appendChild(script)
})
</script>

<style scoped>
.bg-dot-pattern {
    background-image: radial-gradient(#334155 1px, transparent 1px);
    background-size: 30px 30px;
}

.hide-scroll::-webkit-scrollbar {
    display: none;
}

.hide-scroll {
    -ms-overflow-style: none;
    scrollbar-width: none;
    cursor: grab;
}

.hide-scroll:active {
    cursor: grabbing;
}

.phone-frame {
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.phone-frame:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15);
    border-color: rgb(59 130 246);
}
</style>
