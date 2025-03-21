import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from "react-router-dom";
import ApiService from "../../service/ApiService.js";
import "../../assets/css/Navbar.css";
import { toast } from 'react-toastify';
import Modal from 'react-modal';

Modal.setAppElement('#root');

// Hàm chuyển đổi chữ cái đầu thành in hoa
const capitalizeWords = (str) => {
    if (!str) return "";
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

function Navbar() {
    const [isOpen, setIsOpen] = useState(false); // Menu hamburger
    const [isLoading, setIsLoading] = useState(false); // Trạng thái đăng xuất
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal đăng xuất
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown
    const [userInfo, setUserInfo] = useState(null); // Thông tin người dùng
    const isAuthenticated = ApiService.isAuthenticated();
    const isTenant = ApiService.isTenant();
    const isAdmin = ApiService.isAdmin();
    const navigate = useNavigate();

    // Lấy thông tin người dùng khi component mount
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await ApiService.getUserInfo();
                if (response && response.data) {
                    setUserInfo(response.data);
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error.message);
            }
        };

        if (isAuthenticated) {
            fetchUserInfo();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest('.navbar-menu-container') &&
                !event.target.closest('.hamburger-menu')) {
                setIsOpen(false);
            }
            if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
                setIsDropdownOpen(false);
            }
        };

        if (isOpen || isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, isDropdownOpen]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const openModal = () => {
        setIsModalOpen(true);
        setIsDropdownOpen(false);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleLogout = async () => {
        setIsModalOpen(false);
        setIsLoading(true);
        try {
            const resp = await ApiService.logout();
            console.log("Logout response:", resp);
            if (resp && resp.code === 200) {
                console.log("Showing success toast");
                toast.success("Đăng xuất thành công!", {
                    position: "top-right",
                    autoClose: 3000,
                });
                closeMenu();
                setTimeout(() => navigate("/login", { replace: true }), 1500);
            } else {
                console.log("Showing error toast:", resp?.message);
                toast.error("Đăng xuất thất bại: " + (resp?.message || "Lỗi không xác định"), {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.log("Error during logout:", error.message);
            toast.error("Lỗi đăng xuất: " + (error.message || "Không thể kết nối đến server"), {
                position: "top-right",
                autoClose: 3000,
            });
            ApiService.clearAuth();
            closeMenu();
            navigate("/login", { replace: true });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <nav className="navbar-modern">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <NavLink to="/home" className="navbar-brand-link" onClick={closeMenu}>
                        <div className="brand-content">
                            <span className="brand-text">HAPPY VIVU HOUSE</span>
                            <span className="brand-slogan">Comfort and Care</span>
                        </div>
                    </NavLink>
                </div>

                <div className={`navbar-menu-container ${isOpen ? 'active' : ''}`}>
                    <ul className="navbar-ul main-nav">
                        <li><NavLink to="/home" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>Home</NavLink></li>
                        <li><NavLink to="/find-booking" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>Booking</NavLink></li>
                        <li><NavLink to="/rooms" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>Room</NavLink></li>
                        <li><NavLink to="/others" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>Others</NavLink></li>
                    </ul>

                    <div className="user-nav-container">
                        <ul className="navbar-ul user-nav">
                            {isAdmin && (
                                <li>
                                    <NavLink
                                        to="/admin"
                                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                                        onClick={closeMenu}
                                    >
                                        Admin
                                    </NavLink>
                                </li>
                            )}
                            {!isAuthenticated && (
                                <li>
                                    <NavLink
                                        to="/login"
                                        className="nav-link login"
                                        onClick={closeMenu}
                                    >
                                        Log In
                                    </NavLink>
                                </li>
                            )}
                            {!isAuthenticated && (
                                <li>
                                    <NavLink
                                        to="/register"
                                        className="nav-link register"
                                        onClick={closeMenu}
                                    >
                                        Sign up
                                    </NavLink>
                                </li>
                            )}
                            {isAuthenticated && (
                                <li className="dropdown-container">
                                    <div
                                        className="nav-link dropdown-toggle"
                                        onClick={toggleDropdown}
                                        style={{
                                            cursor: isLoading ? "not-allowed" : "pointer",
                                            opacity: isLoading ? 0.6 : 1,
                                        }}
                                    >
                                        <span className="user-name">
                                            {userInfo ? `Xin chào ${capitalizeWords(`${userInfo.firstName} ${userInfo.lastName}`)}` : "Xin chào Người dùng"}
                                        </span>
                                    </div>
                                    {isDropdownOpen && (
                                        <ul className="dropdown-menu">
                                            <li>
                                                <NavLink
                                                    to="/profile"
                                                    className="dropdown-item"
                                                    onClick={() => { closeMenu(); setIsDropdownOpen(false); }}
                                                >
                                                    Profile
                                                </NavLink>
                                            </li>
                                            <li>
                                                <div
                                                    className="dropdown-item logout-link"
                                                    onClick={openModal}
                                                >
                                                    {isLoading ? (
                                                        <span>
                                                            <span className="spinner"></span> Đang đăng xuất...
                                                        </span>
                                                    ) : (
                                                        "Logout"
                                                    )}
                                                </div>
                                            </li>
                                        </ul>
                                    )}
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="hamburger-menu" onClick={toggleMenu}>
                    <div className={`hamburger-bar ${isOpen ? 'open' : ''}`}></div>
                    <div className={`hamburger-bar ${isOpen ? 'open' : ''}`}></div>
                    <div className={`hamburger-bar ${isOpen ? 'open' : ''}`}></div>
                </div>

                <div className={`menu-overlay ${isOpen ? 'active' : ''}`} onClick={closeMenu}></div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className="logout-modal"
                overlayClassName="logout-modal-overlay"
                contentLabel="Xác nhận đăng xuất"
            >
                <h2>Xác nhận đăng xuất</h2>
                <p>Bạn có chắc chắn muốn đăng xuất?</p>
                <div className="modal-buttons">
                    <button onClick={handleLogout} className="modal-button confirm">OK</button>
                    <button onClick={closeModal} className="modal-button cancel">Cancel</button>
                </div>
            </Modal>
        </nav>
    );
}

export default Navbar;