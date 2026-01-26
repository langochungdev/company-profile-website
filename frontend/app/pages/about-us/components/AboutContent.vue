<template>
    <section class="about-content">
        <div class="container">
            <div class="hero-section">
                <h1 class="hero-title">
                    Câu Chuyện<br>
                    <span class="highlight">SHT Security</span>
                </h1>
                <p class="hero-desc">
                    Đối tác tin cậy trong lĩnh vực an ninh và hạ tầng mạng cho doanh nghiệp Việt Nam
                </p>
            </div>

            <div class="intro-section">
                <div class="intro-image">
                    <img src="https://placehold.co/800x600/jpg?text=800x600" alt="Đội ngũ SHT Security" />
                    <div class="experience-badge">
                        <span class="exp-number">10+</span>
                        <span class="exp-text">Năm Kinh Nghiệm</span>
                    </div>
                </div>
                <div class="intro-text">
                    <h2 class="section-title">Về Chúng Tôi</h2>
                    <p class="intro-desc">
                        SHT Security được thành lập với sứ mệnh mang đến các giải pháp an ninh và hạ tầng mạng
                        tiên tiến nhất cho doanh nghiệp Việt Nam. Chúng tôi không chỉ cung cấp sản phẩm,
                        mà còn đồng hành cùng khách hàng trong suốt quá trình vận hành và bảo trì.
                    </p>
                    <p class="intro-desc">
                        Với đội ngũ kỹ sư giàu kinh nghiệm và được đào tạo bài bản, chúng tôi tự tin đáp ứng
                        mọi yêu cầu từ dự án gia đình nhỏ đến các tòa nhà doanh nghiệp quy mô lớn.
                    </p>
                </div>
            </div>

            <div class="stats-section">
                <div v-for="stat in stats" :key="stat.label" class="stat-card">
                    <Icon :name="stat.icon" class="stat-icon" />
                    <span class="stat-number">{{ stat.value }}</span>
                    <span class="stat-label">{{ stat.label }}</span>
                </div>
            </div>

            <div class="values-section">
                <h2 class="section-title center">
                    Giá Trị<br>
                    <span class="highlight">Cốt Lõi</span>
                </h2>
                <div class="values-grid">
                    <div v-for="value in values" :key="value.title" class="value-card">
                        <div class="value-icon-wrap">
                            <Icon :name="value.icon" class="value-icon" />
                        </div>
                        <h3 class="value-title">{{ value.title }}</h3>
                        <p class="value-desc">{{ value.description }}</p>
                    </div>
                </div>
            </div>

            <div class="cta-section">
                <div class="cta-content">
                    <h2 class="cta-title">Bạn Cần Tư Vấn?</h2>
                    <p class="cta-desc">Liên hệ ngay với đội ngũ chuyên gia của chúng tôi để được hỗ trợ miễn phí.</p>
                </div>
                <NuxtLink to="/contact" class="cta-btn">
                    Liên Hệ Ngay
                    <Icon name="mdi:arrow-right" />
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup>
const stats = [
    { value: '500+', label: 'Dự Án Hoàn Thành', icon: 'mdi:check-decagram' },
    { value: '1000+', label: 'Khách Hàng Tin Tưởng', icon: 'mdi:account-group' },
    { value: '50+', label: 'Kỹ Sư Chuyên Nghiệp', icon: 'mdi:account-hard-hat' },
    { value: '24/7', label: 'Hỗ Trợ Kỹ Thuật', icon: 'mdi:headset' }
]

const values = [
    {
        title: 'Chất Lượng',
        description: 'Cam kết sử dụng thiết bị chính hãng, thi công chuẩn quy trình quốc tế.',
        icon: 'mdi:shield-check'
    },
    {
        title: 'Uy Tín',
        description: 'Bảo hành dài hạn, hỗ trợ nhanh chóng, minh bạch trong mọi giao dịch.',
        icon: 'mdi:handshake'
    },
    {
        title: 'Sáng Tạo',
        description: 'Luôn cập nhật công nghệ mới nhất, tối ưu hóa giải pháp cho từng khách hàng.',
        icon: 'mdi:lightbulb-on'
    },
    {
        title: 'Tận Tâm',
        description: 'Đặt lợi ích khách hàng lên hàng đầu, đồng hành từ tư vấn đến bảo trì.',
        icon: 'mdi:heart'
    }
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800;900&display=swap');
@import "../styles/about-content.css";
</style>
