import React from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService.js";
import "../../assets/css/Logout.css"; // Tùy chọn CSS

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const resp = await ApiService.logout();
            if (resp.code === 200) {
                alert("Đăng xuất thành công!");
                navigate("/login", { replace: true });
            } else {
                alert("Đăng xuất thất bại: " + (resp.message || "Lỗi không xác định"));
            }
        } catch (error) {
            alert("Đã có lỗi xảy ra khi đăng xuất: " + (error.response?.data?.message || error.message));
            // Vẫn xóa localStorage và điều hướng để đảm bảo an toàn
            ApiService.clearAuth();
            navigate("/login", { replace: true });
        }
    };

    return (
        <button className="logout-button" onClick={handleLogout}>
            Đăng xuất
        </button>
    );
};

export default LogoutButton;