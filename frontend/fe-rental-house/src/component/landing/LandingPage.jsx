// LandingPage.jsx
import React from 'react';
import '../../assets/css/LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <h1>Chào mừng đến với Happy Vivu House</h1>
                        <p>
                            Giải pháp quản lý nhà thuê toàn diện, chuyên nghiệp và hiện đại. Tối ưu hóa mọi thứ chỉ trong vài cú nhấp chuột!
                        </p>
                        <div className="hero-buttons">
                            <button className="btn-primary">Đăng ký ngay</button>
                            <button className="btn-secondary">Tìm hiểu thêm</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <div className="section-header">
                        <h2>Tại sao chọn Happy Vivu House?</h2>
                    </div>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <span>📊</span>
                            </div>
                            <div className="feature-content">
                                <h3>Quản lý dữ liệu thông minh</h3>
                                <p>Theo dõi thông tin nhà thuê, khách thuê và lịch sử đặt phòng dễ dàng.</p>
                            </div>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <span>🔌</span>
                            </div>
                            <div className="feature-content">
                                <h3>Quản lý dịch vụ tiện ích</h3>
                                <p>Quản lý điện, nước, chỗ gửi xe cho từng phòng một cách hiệu quả.</p>
                            </div>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <span>🏠</span>
                            </div>
                            <div className="feature-content">
                                <h3>Quản lý tài sản hiệu quả</h3>
                                <p>Theo dõi tài sản chủ nhà và khách thuê, quản lý bảo trì chuyên nghiệp.</p>
                            </div>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <span>💰</span>
                            </div>
                            <div className="feature-content">
                                <h3>Quản lý tài chính linh hoạt</h3>
                                <p>Thu phí online, thống kê chi phí minh bạch và chi tiết.</p>
                            </div>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <span>📁</span>
                            </div>
                            <div className="feature-content">
                                <h3>Lưu trữ tài liệu an toàn</h3>
                                <p>Quản lý hợp đồng cho thuê, truy cập mọi lúc mọi nơi.</p>
                            </div>
                        </div>
                    </div>
                    <div className="features-cta">
                        <button className="btn-secondary">Khám phá tất cả tính năng</button>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="benefits">
                <div className="container">
                    <div className="section-header">
                        <h2>Happy Vivu House mang đến gì cho bạn?</h2>
                    </div>
                    <div className="benefits-list">
                        <div className="benefit-item">
                            <div className="benefit-icon">✓</div>
                            <div className="benefit-text">Tiết kiệm thời gian với quy trình tự động hóa.</div>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-icon">✓</div>
                            <div className="benefit-text">Tăng hiệu quả nhờ dữ liệu được tổ chức khoa học.</div>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-icon">✓</div>
                            <div className="benefit-text">An tâm tuyệt đối với tài sản và tài chính trong tầm tay.</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call-to-Action Section */}
            <section className="cta">
                <div className="container">
                    <div className="cta-content">
                        <h2>Sẵn sàng để quản lý nhà thuê dễ dàng hơn bao giờ hết?</h2>
                        <p>Hãy để Happy Vivu House đồng hành cùng bạn!</p>
                        <div className="cta-buttons">
                            <button className="btn-primary">Đăng ký miễn phí</button>
                            <button className="btn-secondary">Liên hệ ngay</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;