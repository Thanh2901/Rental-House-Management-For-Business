import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService.js";
import "../../assets/css/ForgotPassword.css"; // File CSS cho giao diện
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Xử lý thay đổi input email
    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    // Xác thực email
    const validateForm = () => {
        const errors = {};
        if (!email.trim()) {
            errors.email = "Email là bắt buộc";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = "Email không hợp lệ";
        }
        return errors;
    };

    // Xử lý gửi yêu cầu quên mật khẩu
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            toast.error(validationErrors.email, {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        setIsLoading(true);
        try {
            const resp = await ApiService.forgetPassword({ email });
            if (resp.code === 200) {
                toast.success("Yêu cầu đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra email.", {
                    position: "top-right",
                    autoClose: 3000,
                });
                setTimeout(() => navigate("/login"), 3000); // Chuyển về trang đăng nhập sau 3 giây
            } else {
                toast.error(resp.message || "Không thể gửi yêu cầu đặt lại mật khẩu", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Đã có lỗi xảy ra khi gửi yêu cầu", {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <h2>Quên mật khẩu</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        placeholder="Nhập email của bạn"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    style={{ opacity: isLoading ? 0.6 : 1 }}
                >
                    {isLoading ? (
                        <span>
              <span className="spinner"></span> Đang gửi...
            </span>
                    ) : (
                        "Gửi yêu cầu"
                    )}
                </button>
                <p className="login-link">
                    Quay lại <a href="/login">Đăng nhập</a>
                </p>
            </form>
        </div>
    );
};

export default ForgotPassword;