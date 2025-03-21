import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService.js";
import "../../assets/css/Register.css";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: "",
        identityCardNumber: "",
        country: "",
    });

    const [message, setMessage] = useState({ type: "", text: "" });

    const navigate = useNavigate();

    // Handle input change
    const handleInputChange = ({ target: { name, value } }) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Validate form fields
    const validateForm = () => {
        const errors = {};
        if (!formData.firstName.trim()) errors.firstName = "Họ là bắt buộc";
        if (!formData.lastName.trim()) errors.lastName = "Tên là bắt buộc";
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
        if (!formData.phoneNumber.trim()) errors.phoneNumber = "Số điện thoại là bắt buộc";
        if (!formData.identityCardNumber.trim()) errors.identityCardNumber = "Số CMND/CCCD là bắt buộc";
        if (!formData.country.trim()) errors.country = "Quốc gia là bắt buộc";

        return errors;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setMessage({ type: "error", text: Object.values(validationErrors)[0] });
            setTimeout(() => setMessage({}), 5000);
            return;
        }

        try {
            const resp = await ApiService.registerUser(formData);
            // API trả về ApiResponseUserResponse, kiểm tra code thay vì status
            if (resp.code === 200 || resp.status === 200) { // Điều chỉnh theo response thực tế của API
                setMessage({ type: "success", text: "Đăng ký thành công!" });
                setTimeout(() => navigate("/login"), 3000);
            } else {
                setMessage({ type: "error", text: resp.message || "Đăng ký thất bại" });
                setTimeout(() => setMessage({}), 5000);
            }
        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.message || "Đã có lỗi xảy ra khi đăng ký",
            });
            setTimeout(() => setMessage({}), 5000);
        }
    };

    return (
        <div className="auth-container">
            {message.text && <p className={`${message.type}-message`}>{message.text}</p>}

            <h2>Đăng ký</h2>
            <form onSubmit={handleSubmit}>
                {[
                    "firstName",
                    "lastName",
                    "email",
                    "password",
                    "phoneNumber",
                    "identityCardNumber",
                    "country",
                ].map((field) => (
                    <div className="form-group" key={field}>
                        <label>
                            {field
                                .replace(/([A-Z])/g, " $1")
                                .trim()
                                .charAt(0)
                                .toUpperCase() + field.replace(/([A-Z])/g, " $1").slice(1)}
                        </label>
                        <input
                            type={field === "email" ? "email" : field === "password" ? "password" : "text"}
                            name={field}
                            value={formData[field]}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                ))}
                <button type="submit">Đăng ký</button>
                <p className="register-link">
                    Đã có tài khoản? <a href="/login">Đăng nhập</a>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;