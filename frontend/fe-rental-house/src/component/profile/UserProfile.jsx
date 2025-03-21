import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService.js"; // Adjust the path if needed
import "../../assets/css/UserProfile.css"; // Import CSS

const UserProfile = () => {
    const [user, setUser] = useState(null); // Store user info from API
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        identityCardNumber: "",
        country: "",
    }); // Store form data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [isSubmitting, setIsSubmitting] = useState(false); // Form submission state

    // Fetch user info when the component mounts
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await ApiService.getUserInfo();
                console.log("API Response:", response);
                if (response && response.data) {
                    setUser(response);
                    // Populate form data
                    setFormData({
                        firstName: response.data.firstName || "",
                        lastName: response.data.lastName || "",
                        phoneNumber: response.data.phoneNumber || "",
                        identityCardNumber: response.data.identityCardNumber || "",
                        country: response.data.country || "",
                    });
                } else {
                    setError("No user data from API.");
                }
            } catch (err) {
                setError("Error fetching user info: " + (err.message || "Unknown error"));
            } finally {
                setLoading(false);
            }
        };

        if (ApiService.isAuthenticated()) {
            fetchUserInfo();
        } else {
            setError("Please log in to view your information.");
            setLoading(false);
        }
    }, []);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await ApiService.updateMyProfile(formData);
            console.log("Update API Response:", response);
            if (response && response.code === 200) {
                setUser({ ...user, data: { ...user.data, ...formData } }); // Update UI
                alert("Profile updated successfully!");
            } else {
                setError("Update failed: " + (response?.message || "Unknown error"));
            }
        } catch (err) {
            setError("Error updating profile: " + (err.message || "Unknown error"));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading state
    if (loading) {
        return <div className="loading">Loading user information...</div>;
    }

    // Show error if exists
    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="user-profile-page">
            {/* Main Layout */}
            <div className="main-layout">
                {/* Sidebar */}
                <aside className="sidebar">
                    <h2>NGƯỜI THUÊ</h2>
                    <ul>
                        <li><a href="#phone">Hồ sơ cá nhân</a></li>
                        <li><a href="#rental-history">Lịch sử thuê trọ</a></li>
                        <li><a href="#payment-history">Lịch sử thanh toán</a></li>
                        <li><a href="#change-password">Đổi mật khẩu</a></li>
                        <li><a href="#assets">Tài sản</a></li>
                    </ul>
                </aside>

                {/* Main Content */}
                <main className="main-content">
                    <div className="user-profile-container">
                        {/*<h1 className="user-profile-title">Thông tin người dùng hiện tại</h1>*/}
                        {user && user.data ? (
                            <form className="user-profile-details" onSubmit={handleSubmit}>
                                {/*<h2 className="user-profile-subtitle">Chi tiết người dùng</h2>*/}
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
                                        <label><strong>Quê quán:</strong></label>
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
                </main>
            </div>
        </div>
    );
};

export default UserProfile;