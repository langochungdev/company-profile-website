/* Placeholder Data cho các Category Pages */

const generatePlaceholderProducts = (count = 50) => {
    const categories = ["Camera AI", "WiFi Doanh Nghiệp", "Switch & Router", "Báo Cháy", "Access Control"];
    const names = ["Lorem ipsum dolor sit amet", "Consectetur adipiscing elit", "Sed do eiusmod tempor", "Ut enim ad minim veniam", "Quis nostrud exercitation", "Duis aute irure dolor", "Excepteur sint occaecat", "Cupidatat non proident"];

    return Array.from({ length: count }, (_, i) => ({
        id: `placeholder-${i + 1}`,
        name: `${names[i % names.length]} ${i + 1}`,
        slug: `placeholder-product-${i + 1}`,
        category: categories[i % categories.length],
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        image: { url: `https://placehold.co/400x400/e2e8f0/94a3b8?text=Product+${i + 1}`, alt: `Placeholder ${i + 1}` },
        price: i % 3 === 0 ? null : (i + 1) * 1000000,
        tags: [{ value: "Placeholder" }, { value: `Tag ${(i % 5) + 1}` }],
        isPlaceholder: true,
    }));
};

export const PLACEHOLDER_PRODUCTS = generatePlaceholderProducts(50);

export const PLACEHOLDER_SERVICES = [
    {
        id: "placeholder-1",
        name: "Dịch vụ mẫu",
        title: "Dịch vụ mẫu",
        slug: "placeholder-service-1",
        category: "Danh mục mẫu",
        description: "Mô tả dịch vụ mẫu. Đây là dữ liệu placeholder được hiển thị khi chưa có dịch vụ thực.",
        image: "https://placehold.co/400x300/e2e8f0/94a3b8?text=Dịch+vụ",
        thumbnail: "https://placehold.co/400x300/e2e8f0/94a3b8?text=Dịch+vụ",
        price: "Liên hệ",
        features: ["Tính năng 1", "Tính năng 2", "Tính năng 3"],
        isPlaceholder: true,
    },
    {
        id: "placeholder-2",
        name: "Dịch vụ mẫu 2",
        title: "Dịch vụ mẫu 2",
        slug: "placeholder-service-2",
        category: "Danh mục mẫu",
        description: "Mô tả dịch vụ mẫu. Đây là dữ liệu placeholder được hiển thị khi chưa có dịch vụ thực.",
        image: "https://placehold.co/400x300/e2e8f0/94a3b8?text=Dịch+vụ",
        thumbnail: "https://placehold.co/400x300/e2e8f0/94a3b8?text=Dịch+vụ",
        price: "Liên hệ",
        features: ["Tính năng 1", "Tính năng 2", "Tính năng 3"],
        isPlaceholder: true,
    },
    {
        id: "placeholder-3",
        name: "Dịch vụ mẫu 3",
        title: "Dịch vụ mẫu 3",
        slug: "placeholder-service-3",
        category: "Danh mục mẫu",
        description: "Mô tả dịch vụ mẫu. Đây là dữ liệu placeholder được hiển thị khi chưa có dịch vụ thực.",
        image: "https://placehold.co/400x300/e2e8f0/94a3b8?text=Dịch+vụ",
        thumbnail: "https://placehold.co/400x300/e2e8f0/94a3b8?text=Dịch+vụ",
        price: "Liên hệ",
        features: ["Tính năng 1", "Tính năng 2", "Tính năng 3"],
        isPlaceholder: true,
    },
];

const generatePlaceholderPosts = (count = 25) => {
    const categories = ["Công nghệ", "Hướng dẫn", "Tin tức", "Sự kiện", "Giải pháp"];
    const titles = ["Xu hướng công nghệ bảo mật", "Hướng dẫn cài đặt hệ thống", "Tin tức công nghệ mới nhất", "Sự kiện ra mắt sản phẩm", "Giải pháp an ninh toàn diện", "Camera AI thông minh", "Mạng WiFi doanh nghiệp", "Hệ thống báo cháy hiện đại", "Kiểm soát ra vào tự động", "Tổng đài IP cho văn phòng", "Giải pháp smarthome", "An ninh mạng doanh nghiệp"];
    const excerpts = ["Khám phá những xu hướng công nghệ bảo mật mới nhất trong ngành an ninh và giám sát.", "Hướng dẫn chi tiết từng bước để cài đặt và cấu hình hệ thống an ninh chuyên nghiệp.", "Cập nhật tin tức công nghệ mới nhất về camera AI, IoT và hệ thống thông minh.", "Tham gia sự kiện ra mắt sản phẩm mới với nhiều ưu đãi đặc biệt dành cho khách hàng.", "Giải pháp an ninh tích hợp toàn diện cho doanh nghiệp vừa và lớn."];
    const authors = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D"];

    return Array.from({ length: count }, (_, i) => ({
        id: `placeholder-${i + 1}`,
        title: `${titles[i % titles.length]} ${i + 1}`,
        slug: `placeholder-post-${i + 1}`,
        category: categories[i % categories.length],
        description: excerpts[i % excerpts.length],
        excerpt: excerpts[i % excerpts.length],
        image: `https://placehold.co/600x400/${i % 2 === 0 ? "fecaca/991b1b" : "fee2e2/b91c1c"}?text=Blog+${i + 1}`,
        thumbnail: `https://placehold.co/600x400/${i % 2 === 0 ? "fecaca/991b1b" : "fee2e2/b91c1c"}?text=Blog+${i + 1}`,
        publishedAt: new Date(2024, (i * 2) % 12, ((i * 3) % 28) + 1).toLocaleDateString("vi-VN"),
        date: new Date(2024, (i * 2) % 12, ((i * 3) % 28) + 1).toISOString(),
        author: authors[i % authors.length],
        isPlaceholder: true,
    }));
};

export const PLACEHOLDER_POSTS = generatePlaceholderPosts(25);

export const PLACEHOLDER_PRODUCT_DETAIL = {
    id: "placeholder",
    name: "Lorem Ipsum Dolor Sit Amet Consectetur",
    slug: "placeholder",
    category: "Camera AI",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    image: { url: "https://placehold.co/800x800/e2e8f0/94a3b8?text=800x800", alt: "Ảnh chính" },
    images: [
        { url: "https://placehold.co/800x800/e2e8f0/94a3b8?text=800x800", alt: "Ảnh chính", title: "Ảnh chính" },
        { url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=800x600", alt: "Ảnh phụ 1", title: "Ảnh phụ 1" },
        { url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=800x600", alt: "Ảnh phụ 2", title: "Ảnh phụ 2" },
        { url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=800x600", alt: "Ảnh phụ 3", title: "Ảnh phụ 3" },
    ],
    price: 15900000,
    tags: ["An ninh", "Giám sát", "AI", "Thông minh"],
    media: [
        { type: "image", url: "https://placehold.co/800x800/e2e8f0/94a3b8?text=800x800", caption: "Ảnh chính" },
        { type: "image", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=800x600", caption: "Ảnh phụ 1" },
        { type: "image", url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=800x600", caption: "Ảnh phụ 2" },
        { type: "video", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", caption: "Video demo" },
    ],
    gallery: [
        { url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=800x600", caption: "Gallery 1" },
        { url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=800x600", caption: "Gallery 2" },
        { url: "https://placehold.co/800x600/e2e8f0/94a3b8?text=800x600", caption: "Gallery 3" },
    ],
    content: `
        <h2>Giới thiệu sản phẩm</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        
        <h3>Thông số kỹ thuật</h3>
        <table>
            <tr><th>Thông số</th><th>Giá trị</th></tr>
            <tr><td>Độ phân giải</td><td>4K Ultra HD</td></tr>
            <tr><td>Góc nhìn</td><td>120°</td></tr>
            <tr><td>Hồng ngoại</td><td>30m</td></tr>
            <tr><td>Kết nối</td><td>WiFi / LAN</td></tr>
        </table>
        
        <h3>Video hướng dẫn</h3>
        <div class="video-embed">
            <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>
        </div>
        
        <h3>Đánh giá từ khách hàng</h3>
        <blockquote>
            <p>"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."</p>
            <cite>- Khách hàng A</cite>
        </blockquote>
        
        <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
    `,
    isPlaceholder: true,
};

export const PLACEHOLDER_RELATED_PRODUCTS = [
    {
        id: "related-1",
        name: "Lorem ipsum dolor",
        slug: "placeholder-related-1",
        category: "Camera AI",
        image: "https://placehold.co/400x400/e2e8f0/94a3b8?text=400x400",
        price: 8900000,
        isPlaceholder: true,
    },
    {
        id: "related-2",
        name: "Consectetur adipiscing",
        slug: "placeholder-related-2",
        category: "Camera AI",
        image: "https://placehold.co/400x400/e2e8f0/94a3b8?text=400x400",
        price: null,
        isPlaceholder: true,
    },
    {
        id: "related-3",
        name: "Sed do eiusmod",
        slug: "placeholder-related-3",
        category: "Camera AI",
        image: "https://placehold.co/400x400/e2e8f0/94a3b8?text=400x400",
        price: 12500000,
        isPlaceholder: true,
    },
    {
        id: "related-4",
        name: "Ut enim ad minim",
        slug: "placeholder-related-4",
        category: "Camera AI",
        image: "https://placehold.co/400x400/e2e8f0/94a3b8?text=400x400",
        price: 6700000,
        isPlaceholder: true,
    },
];

export const PLACEHOLDER_SERVICE_DETAIL = {
    id: "placeholder",
    name: "Dịch vụ mẫu",
    slug: "placeholder",
    category: "Danh mục mẫu",
    description: "Mô tả chi tiết dịch vụ mẫu. Đây là dữ liệu placeholder được hiển thị khi chưa có dữ liệu thực hoặc đang tải.",
    image: "https://placehold.co/800x400/e2e8f0/94a3b8?text=Dịch+vụ",
    price: "Liên hệ",
    content: "<p>Nội dung dịch vụ mẫu. Đây là dữ liệu placeholder.</p>",
    features: ["Tính năng 1", "Tính năng 2", "Tính năng 3"],
    isPlaceholder: true,
};

const generatePlaceholderServiceProjects = (count = 160) => {
    const categories = ["Camera AI", "Mạng WiFi", "Hạ tầng mạng", "Báo cháy", "Kiểm soát ra vào", "Tổng đài IP", "Rào chắn", "Âm thanh"];
    const tags = ["Giải pháp tổng thể", "Công nghệ mới", "Tiết kiệm chi phí", "Bảo hành dài hạn", "Lắp đặt nhanh"];
    const locations = ["Hà Nội", "TP.HCM", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Bình Dương", "Đồng Nai", "Bắc Ninh"];
    const projectTypes = ["Văn phòng", "Nhà máy", "Khu chung cư", "Trường học", "Bệnh viện", "Trung tâm thương mại", "Khách sạn", "Khu công nghiệp"];

    return Array.from({ length: count }, (_, i) => {
        const categoryIndex = i % categories.length;
        const primaryCategory = categories[categoryIndex] || "Camera AI";
        const secondaryCategory = i % 3 === 0 ? categories[(categoryIndex + 1) % categories.length] : null;

        return {
            id: `placeholder-${i + 1}`,
            name: `${projectTypes[i % projectTypes.length]} ${primaryCategory} ${i + 1}`,
            categories: secondaryCategory ? [primaryCategory, secondaryCategory] : [primaryCategory],
            tags: Array.from({ length: (i % 3) + 1 }, (_, j) => tags[(i + j) % tags.length]),
            description: `Dự án lắp đặt hệ thống ${primaryCategory} cho ${projectTypes[i % projectTypes.length]}. Đây là dữ liệu placeholder được hiển thị khi chưa có dữ liệu thực từ Firestore.`,
            completedDate: new Date(2024, (i * 2) % 12, ((i * 3) % 28) + 1).toISOString(),
            location: `${locations[i % locations.length]}, Việt Nam`,
            images: Array.from({ length: 4 + (i % 4) }, (_, j) => ({
                url: `https://placehold.co/600x400/${j % 2 === 0 ? "e2e8f0/64748b" : "cbd5e1/475569"}?text=${encodeURIComponent(primaryCategory)}+${i + 1}-${j + 1}`,
                alt: `${primaryCategory} - Dự án ${i + 1} - Hình ${j + 1}`,
            })),
            isPlaceholder: true,
        };
    });
};

export const PLACEHOLDER_SERVICE_PROJECTS = generatePlaceholderServiceProjects(160);

export const PLACEHOLDER_POST_DETAIL = {
    id: "placeholder",
    title: "Bài viết mẫu",
    slug: "placeholder",
    category: "Danh mục mẫu",
    content: "<p>Nội dung bài viết mẫu. Đây là dữ liệu placeholder được hiển thị khi chưa có dữ liệu thực hoặc đang tải.</p>",
    image: "https://placehold.co/1200x600/e2e8f0/94a3b8?text=Bài+viết",
    date: new Date().toISOString(),
    author: "Tác giả",
    tags: ["Tag 1", "Tag 2"],
    isPlaceholder: true,
};
