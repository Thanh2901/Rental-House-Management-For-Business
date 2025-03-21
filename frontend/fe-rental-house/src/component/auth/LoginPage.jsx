import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService.js";
import "../../assets/css/Login.css";
import { toast } from 'react-toastify';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { state } = useLocation();

    const redirectPath = state?.from?.pathname || "/home";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.email.trim()) {
            errors.email = "Email là bắt buộc";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = "Email không hợp lệ";
        }
        if (!formData.password.trim()) {
            errors.password = "Mật khẩu là bắt buộc";
        } else if (formData.password.length < 6) {
            errors.password = "Mật khẩu phải ít nhất 6 ký tự";
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            toast.error(Object.values(validationErrors)[0], {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        setIsLoading(true);
        try {
            const resp = await ApiService.loginUser(formData);
            if (resp.code === 200 && resp.data?.accessToken) {
                toast.success("Đăng nhập thành công!", {
                    position: "top-right",
                    autoClose: 3000,
                });
                setTimeout(() => navigate(redirectPath, { replace: true }), 1500);
            } else {
                toast.error(resp.message || "Đăng nhập thất bại", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Đã có lỗi xảy ra khi đăng nhập", {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-page">
                <div className="auth-container">
                    <h2>Đăng nhập</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                                placeholder="Nhập email của bạn"
                            />
                        </div>
                        <div className="form-group">
                            <label>Mật khẩu</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                                placeholder="Nhập mật khẩu"
                            />
                            {/*<p className="security-note">*/}
                            {/*    Đảm bảo mật khẩu của bạn mạnh và duy nhất. Nếu mật khẩu của bạn đã bị lộ trong một vụ vi phạm dữ liệu, hãy <a href="/forgot-password">đổi mật khẩu ngay</a>.*/}
                            {/*</p>*/}
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={isLoading ? "loading" : ""}
                        >
                            {isLoading ? (
                                <span>
                                    <span className="spinner"></span> Đang đăng nhập...
                                </span>
                            ) : (
                                "Đăng nhập"
                            )}
                        </button>
                        <div className="links">
                            <p className="forgot-password-link">
                                <a href="/forgot-password">Quên mật khẩu?</a>
                            </p>
                            <p className="register-link">
                                Bạn chưa có tài khoản? <a href="/register">Đăng ký</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;