import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import "../../assets/css/UserProfile.css"; // Import CSS
import ApiService from "../../service/ApiService.js"; // Adjust the path if needed

const UserProfile = () => {
  const [currentPage, setCurrentPage] = useState(""); // Current page for pagination

  // Fetch user info when the component mounts
  useEffect(() => {
    setCurrentPage(window.location.hash);
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

  const handleNavigation = (hash) => {
    window.location.href = hash;
    setCurrentPage(hash); // Cập nhật trang hiện tại
  };

  return (
    <div className="user-profile-page">
      {/* Main Layout */}
      <div className="main-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <h2>NGƯỜI THUÊ</h2>
          <div className="sidebar-links">
            <p
              className={location.pathname === "/profile" ? "active" : ""}
              onClick={() => handleNavigation("/profile")}
            >
              Hồ sơ cá nhân
            </p>
            <p
              className={
                location.pathname === "/profile/rental-history" ? "active" : ""
              }
              onClick={() => handleNavigation("/profile/rental-history")}
            >
              Lịch sử thuê trọ
            </p>
            <p
              className={
                location.pathname === "/profile/payment-history" ? "active" : ""
              }
              onClick={() => handleNavigation("/profile/payment-history")}
            >
              Lịch sử thanh toán
            </p>
            <p
              className={
                location.pathname === "/profile/change-password" ? "active" : ""
              }
              onClick={() => handleNavigation("/profile/change-password")}
            >
              Đổi mật khẩu
            </p>
            <p
              className={
                location.pathname === "/profile/assets" ? "active" : ""
              }
              onClick={() => handleNavigation("/profile/assets")}
            >
              Tài sản
            </p>
          </div>
          {/* <ul>
            <li>
              <a href="#phone">Hồ sơ cá nhân</a>
            </li>
            <li>
              <a href="#rental-history">Lịch sử thuê trọ</a>
            </li>
            <li>
              <a href="#payment-history">Lịch sử thanh toán</a>
            </li>
            <li>
              <a href="#change-password">Đổi mật khẩu</a>
            </li>
            <li>
              <a href="#assets">Tài sản</a>
            </li>
          </ul> */}
          {/* Thay ul vs li trên kia thành text*/}
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <Outlet /> {/* Render child routes here */}
        </main>
      </div>
    </div>
  );
};

export default UserProfile;
