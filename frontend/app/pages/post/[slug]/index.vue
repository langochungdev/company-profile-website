<template>
    <NuxtLayout name="main">
        <main v-if="post">
            <article class="post-detail-content">
                <div class="container">
                    <div class="post-grid">
                        <div class="post-main">
                            <div class="post-meta">
                                <span class="meta-category">{{ post.category }}</span>
                                <span class="meta-date">
                                    <Icon name="mdi:calendar-blank" />
                                    {{ post.publishedAt }}
                                </span>
                                <span class="meta-author">
                                    <Icon name="mdi:account" />
                                    {{ post.author }}
                                </span>
                            </div>

                            <h1 class="post-title">{{ post.title }}</h1>

                            <div class="post-thumbnail">
                                <img :src="post.thumbnail" :alt="post.title" />
                            </div>

                            <div class="post-body">
                                <p class="lead">{{ post.description }}</p>

                                <h2>Giới thiệu</h2>
                                <p>Trong bối cảnh công nghệ phát triển nhanh chóng, việc cập nhật những xu hướng mới nhất là điều cần thiết cho mọi doanh nghiệp. Bài viết này sẽ chia sẻ những thông tin hữu ích và giải pháp thiết thực.</p>

                                <h2>Nội dung chính</h2>
                                <p>Chúng tôi đã nghiên cứu và tổng hợp những kiến thức chuyên sâu từ các chuyên gia hàng đầu trong lĩnh vực này. Dưới đây là những điểm quan trọng mà bạn cần biết:</p>

                                <ul>
                                    <li>Phân tích xu hướng thị trường hiện tại</li>
                                    <li>So sánh các giải pháp công nghệ phổ biến</li>
                                    <li>Đề xuất lộ trình triển khai phù hợp</li>
                                    <li>Chi phí đầu tư và ROI dự kiến</li>
                                </ul>

                                <h2>Kết luận</h2>
                                <p>Với những thông tin đã chia sẻ, hy vọng bạn có thể đưa ra quyết định phù hợp cho doanh nghiệp của mình. Nếu cần tư vấn thêm, đừng ngại liên hệ với đội ngũ chuyên gia của SHT Security.</p>
                            </div>

                            <div class="post-tags">
                                <span class="tag">{{ post.category }}</span>
                                <span class="tag">SHT Security</span>
                                <span class="tag">Giải pháp</span>
                            </div>

                            <div class="post-share">
                                <span class="share-label">Chia sẻ:</span>
                                <a href="#" class="share-btn facebook">
                                    <Icon name="mdi:facebook" />
                                </a>
                                <a href="#" class="share-btn twitter">
                                    <Icon name="mdi:twitter" />
                                </a>
                                <a href="#" class="share-btn linkedin">
                                    <Icon name="mdi:linkedin" />
                                </a>
                            </div>
                        </div>

                        <aside class="post-sidebar">
                            <div class="sidebar-cta">
                                <h3>Cần Tư Vấn?</h3>
                                <p>Liên hệ ngay để được hỗ trợ miễn phí!</p>
                                <NuxtLink to="/contact" class="cta-btn">
                                    <Icon name="mdi:phone" />
                                    Liên Hệ Ngay
                                </NuxtLink>
                            </div>

                            <div class="sidebar-related">
                                <h3>Bài Viết Liên Quan</h3>
                                <div class="related-list">
                                    <NuxtLink v-for="item in relatedPosts" :key="item.id" :to="`/post/${item.slug}`" class="related-item">
                                        <img :src="item.thumbnail" :alt="item.title" class="related-thumb" />
                                        <div class="related-info">
                                            <span class="related-date">{{ item.publishedAt }}</span>
                                            <h4 class="related-title">{{ item.title }}</h4>
                                        </div>
                                    </NuxtLink>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </article>
        </main>

        <main v-else class="not-found">
            <div class="container">
                <Icon name="mdi:file-search-outline" class="not-found-icon" />
                <h1>Không tìm thấy bài viết</h1>
                <p>Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                <NuxtLink to="/post" class="back-btn">Quay lại trang tin tức</NuxtLink>
            </div>
        </main>
    </NuxtLayout>
</template>

<script setup>
import { POSTS } from '../post.config'

const route = useRoute()
const slug = route.params.slug

const post = computed(() => POSTS.find(p => p.slug === slug))

const relatedPosts = computed(() => {
    if (!post.value) return []
    return POSTS.filter(p => p.category === post.value.category && p.id !== post.value.id).slice(0, 3)
})

useSeoMeta({
    title: () => post.value ? `${post.value.title} - SHT Security Blog` : 'Bài viết không tồn tại',
    description: () => post.value?.description || '',
    ogTitle: () => post.value?.title || '',
    ogDescription: () => post.value?.description || '',
    ogImage: () => post.value?.thumbnail || '',
})
</script>

<style scoped>
@import "../styles/slug/desktop.css";
@import "../styles/slug/mobile.css";
</style>
