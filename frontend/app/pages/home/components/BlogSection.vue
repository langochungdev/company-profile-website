<template>
    <section class="blog-section">
        <div class="blog-container">
            <div class="blog-header">
                <div class="blog-header-card">
                    <div class="blog-badge">
                        <span class="badge-pulse">
                            <span class="pulse-ring" />
                            <span class="pulse-dot" />
                        </span>
                        Các KÊNH TRUYỀN THÔNG
                    </div>
                    <h2 class="blog-title">
                        CÁC KÊNH <span class="blog-title-highlight">TRUYỀN THÔNG</span>
                    </h2>
                </div>
            </div>

            <div class="social-links">
                <a href="https://tiktok.com/@huyphan_sht_co.ltd" target="_blank" rel="noopener noreferrer" class="social-link social-link-tiktok">
                    <Icon name="mdi:music-note" class="social-icon" />
                    <span class="social-text">Theo dõi TikTok</span>
                </a>
                <a href="https://facebook.com/SHT.security" target="_blank" rel="noopener noreferrer" class="social-link social-link-facebook">
                    <Icon name="mdi:facebook" class="social-icon" />
                    <span class="social-text">Theo dõi Facebook</span>
                </a>
                <a href="https://youtube.com/@SHTsecurity" target="_blank" rel="noopener noreferrer" class="social-link social-link-youtube">
                    <Icon name="mdi:youtube" class="social-icon" />
                    <span class="social-text">Đăng ký YouTube</span>
                </a>
            </div>

            <div class="video-grid">
                <div v-for="(video, index) in videos" :key="index" class="video-card">
                    <blockquote class="tiktok-embed" :cite="video.cite" :data-video-id="video.videoId">
                        <section>
                            <a target="_blank" :href="video.profileUrl">{{ video.username }}</a>
                        </section>
                    </blockquote>
                </div>

                <div class="video-card facebook-card">
                    <div id="fb-root"></div>
                    <div class="fb-page" data-href="https://www.facebook.com/SmartHomeTechnologySHT/" data-tabs="timeline" data-width="325" data-height="700" data-small-header="false" data-adapt-container-width="false" data-hide-cover="false" data-show-facepile="true">
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const videos = [
    {
        cite: 'https://www.tiktok.com/@huyphan_sht_co.ltd/video/7479305993915026705',
        videoId: '7479305993915026705',
        username: '@huyphan_sht_co.ltd',
        profileUrl: 'https://www.tiktok.com/@huyphan_sht_co.ltd?refer=embed'
    },
    {
        cite: 'https://www.tiktok.com/@huyphan_sht_co.ltd/video/7479305993915026705',
        videoId: '7479305993915026705',
        username: '@huyphan_sht_co.ltd',
        profileUrl: 'https://www.tiktok.com/@huyphan_sht_co.ltd?refer=embed'
    },
    {
        cite: 'https://www.tiktok.com/@huyphan_sht_co.ltd/video/7479305993915026705',
        videoId: '7479305993915026705',
        username: '@huyphan_sht_co.ltd',
        profileUrl: 'https://www.tiktok.com/@huyphan_sht_co.ltd?refer=embed'
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
@import "../styles/blog-section/desktop.css";
@import "../styles/blog-section/mobile.css";
</style>
