<template>
    <section class="relative w-full overflow-hidden">
        <div class="container relative z-10 mb-8">
            <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 inline-block">
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
        </div>

        <div class="container relative z-10 mb-0 flex flex-wrap justify-center gap-3 md:gap-4">
            <a href="https://tiktok.com/@huyphan_sht_co.ltd" target="_blank" rel="noopener noreferrer" class="group flex items-center gap-3 px-2 md:px-6 py-2 md:py-3 md:bg-white md:border border-slate-200 hover:border-primary md:rounded-full transition-all md:hover:bg-blue-50 md:shadow-sm">
                <Icon name="mdi:music-note" class="w-8 h-8 md:w-7 md:h-7 text-slate-700" />
                <span class="hidden md:inline text-sm font-semibold text-slate-900 group-hover:text-primary transition-colors">Theo dõi TikTok</span>
            </a>
            <a href="https://facebook.com/SHT.security" target="_blank" rel="noopener noreferrer" class="group flex items-center gap-3 px-2 md:px-6 py-2 md:py-3 md:bg-white md:border border-slate-200 hover:border-blue-500 md:rounded-full transition-all md:hover:bg-blue-50 md:shadow-sm">
                <Icon name="mdi:facebook" class="w-8 h-8 md:w-7 md:h-7 text-blue-600" />
                <span class="hidden md:inline text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Theo dõi Facebook</span>
            </a>
            <a href="https://youtube.com/@SHTsecurity" target="_blank" rel="noopener noreferrer" class="group flex items-center gap-3 px-2 md:px-6 py-2 md:py-3 md:bg-white md:border border-slate-200 hover:border-red-500 md:rounded-full transition-all md:hover:bg-red-50 md:shadow-sm">
                <Icon name="mdi:youtube" class="w-8 h-8 md:w-7 md:h-7 text-red-600" />
                <span class="hidden md:inline text-sm font-semibold text-slate-900 group-hover:text-red-600 transition-colors">Đăng ký YouTube</span>
            </a>
        </div>

        <div class="scroll-container relative z-10 w-full overflow-x-auto px-4">
            <div class="flex gap-6 py-10 min-w-max justify-center">
                <div v-for="(video, index) in videos" :key="index" class="relative group flex-shrink-0">
                    <div class="phone-frame w-[280px] h-[500px] bg-white rounded-[32px] overflow-hidden relative border border-slate-200 shadow-lg">
                        <div v-html="video.embedHtml" class="absolute inset-0 w-full h-full flex items-center justify-center [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0 [&_iframe]:absolute [&_iframe]:inset-0 [&_blockquote]:m-0 [&_blockquote]:p-0 [&_blockquote]:w-full [&_blockquote]:h-full [&_blockquote]:scale-[1.4] [&_blockquote]:origin-center" />
                    </div>
                </div>

                <div class="relative group flex-shrink-0">
                    <div class="phone-frame w-[280px] h-[500px] bg-white rounded-[32px] overflow-hidden relative border border-slate-200 shadow-lg flex items-center justify-center p-4">
                        <div id="fb-root"></div>
                        <div class="fb-page w-full h-full" data-href="https://www.facebook.com/SmartHomeTechnologySHT/" data-tabs="timeline" data-width="260" data-height="460" data-small-header="true" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
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

onMounted(() => {
    const tiktokScript = document.createElement('script')
    tiktokScript.src = 'https://www.tiktok.com/embed.js'
    tiktokScript.async = true
    document.body.appendChild(tiktokScript)

    const fbScript = document.createElement('script')
    fbScript.text = `(function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = 'https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v18.0';
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));`
    document.body.appendChild(fbScript)
})
</script>

<style scoped>
.scroll-container {
    -webkit-overflow-scrolling: touch;
    touch-action: pan-x;
    overscroll-behavior-x: contain;
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
