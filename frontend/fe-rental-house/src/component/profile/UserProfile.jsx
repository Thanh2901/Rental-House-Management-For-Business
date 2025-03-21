import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService.js"; // Điều chỉnh đường dẫn nếu cần
import "../../assets/css/UserProfile.css"; // Import CSS

const UserProfile = () => {
    const [user, setUser] = useState(null); // Lưu thông tin người dùng từ API
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        identityCardNumber: "",
        country: "",
    }); // Lưu dữ liệu form
    const [loading, setLoading] = useState(true); // Trạng thái đang tải
    const [error, setError] = useState(null); // Lưu lỗi nếu có
    const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái gửi form

    // Gọi API để lấy thông tin người dùng khi component được mount
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await ApiService.getUserInfo();
                console.log("Phản hồi từ API:", response);
                if (response && response.data) {
                    setUser(response);
                    // Điền dữ liệu vào form
                    setFormData({
                        firstName: response.data.firstName || "",
                        lastName: response.data.lastName || "",
                        phoneNumber: response.data.phoneNumber || "",
                        identityCardNumber: response.data.identityCardNumber || "",
                        country: response.data.country || "",
                    });
                } else {
                    setError("Không có dữ liệu người dùng từ API.");
                }
            } catch (err) {
                setError("Lỗi khi lấy thông tin người dùng: " + (err.message || "Không xác định"));
            } finally {
                setLoading(false);
            }
        };

        if (ApiService.isAuthenticated()) {
            fetchUserInfo();
        } else {
            setError("Vui lòng đăng nhập để xem thông tin.");
            setLoading(false);
        }
    }, []);

    // Xử lý thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Xử lý gửi form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Gửi dữ liệu cập nhật lên API
            const response = await ApiService.updateMyProfile(formData);
            console.log("Phản hồi từ API cập nhật:", response);
            if (response && response.code === 200) {
                setUser({ ...user, data: { ...user.data, ...formData } }); // Cập nhật giao diện
                alert("Cập nhật thông tin thành công!");
            } else {
                setError("Cập nhật thất bại: " + (response?.message || "Lỗi không xác định"));
            }
        } catch (err) {
            setError("Lỗi khi cập nhật thông tin: " + (err.message || "Không xác định"));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Hiển thị khi đang tải
    if (loading) {
        return <div className="loading">Đang tải thông tin người dùng...</div>;
    }

    // Hiển thị lỗi nếu có
    if (error) {
        return <div className="error">{error}</div>;
    }

    // Hiển thị form thông tin người dùng
    return (
        <div className="user-profile-container">
            <h1 className="user-profile-title">Thông tin người dùng hiện tại</h1>
            {user && user.data ? (
                <form className="user-profile-details" onSubmit={handleSubmit}>
                    <h2 className="user-profile-subtitle">Chi tiết người dùng</h2>
                    <div className="user-profile-info">
                        <div className="form-group">
                            <label><strong>Họ:</strong></label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label><strong>Tên:</strong></label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label><strong>Số điện thoại:</strong></label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label><strong>Số CMND/CCCD:</strong></label>
                            <input
                                type="text"
                                name="identityCardNumber"
                                value={formData.identityCardNumber}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label><strong>Quốc gia:</strong></label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Đang cập nhật..." : "Cập nhật thông tin"}
                    </button>
                </form>
            ) : (
                <p className="no-data">Không có thông tin người dùng để hiển thị.</p>
            )}
        </div>
    );
};

export default UserProfile;