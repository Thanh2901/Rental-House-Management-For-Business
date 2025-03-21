import axios from "axios";
import CryptoJS from "crypto-js";

export default class ApiService {
    static BASE_URL = "http://localhost:9090/api"; // URL cơ sở của API
    static ENCRYPTION_KEY = "dennis-secrete-key"; // Khóa mã hóa

    // Mã hóa dữ liệu bằng CryptoJS
    static encrypt(token) {
        return CryptoJS.AES.encrypt(token, this.ENCRYPTION_KEY).toString();
    }

    // Giải mã token bằng CryptoJS
    static decrypt(token) {
        const bytes = CryptoJS.AES.decrypt(token, this.ENCRYPTION_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    // Lưu token
    static saveToken(token) {
        const encryptedToken = this.encrypt(token);
        localStorage.setItem("token", encryptedToken);
    }

    // Lấy token
    static getToken() {
        const encryptedToken = localStorage.getItem("token");
        if (!encryptedToken) return null;
        return this.decrypt(encryptedToken);
    }

    // Lưu refresh token
    static saveRefreshToken(refreshToken) {
        const encryptedRefreshToken = this.encrypt(refreshToken);
        localStorage.setItem("refreshToken", encryptedRefreshToken);
    }

    // Lấy refresh token
    static getRefreshToken() {
        const encryptedRefreshToken = localStorage.getItem("refreshToken");
        if (!encryptedRefreshToken) return null;
        return this.decrypt(encryptedRefreshToken);
    }

    // Lưu vai trò (role)
    static saveRole(role) {
        const encryptedRole = this.encrypt(role);
        localStorage.setItem("role", encryptedRole);
    }

    // Lấy vai trò (role)
    static getRole() {
        const encryptedRole = localStorage.getItem("role");
        if (!encryptedRole) return null;
        return this.decrypt(encryptedRole);
    }

    // Lưu credentialId
    static saveCredentialId(credentialId) {
        const encryptedCredentialId = this.encrypt(credentialId);
        localStorage.setItem("credentialId", encryptedCredentialId);
        console.log("CredentialId đã mã hóa và lưu:", encryptedCredentialId);
    }

    // Lấy credentialId
    static getCredentialId() {
        const encryptedCredentialId = localStorage.getItem("credentialId");
        if (!encryptedCredentialId) return null;
        const decrypted = this.decrypt(encryptedCredentialId);
        console.log("CredentialId đã giải mã:", decrypted);
        return decrypted;
    }

    // Xóa toàn bộ thông tin xác thực
    static clearAuth() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("credentialId");
    }

    // Lấy header cho các yêu cầu API
    static getHeader() {
        const token = this.getToken();
        const credentialId = this.getCredentialId();
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Credential-Id": credentialId || "",
        };
    }

    // Đăng nhập người dùng
    static async loginUser(loginData) {
        try {
            const resp = await axios.post(`${this.BASE_URL}/auth/access-token`, loginData);
            console.log("Phản hồi từ API đăng nhập:", resp.data);
            if (resp.data.data && resp.data.data.accessToken && resp.data.data.refreshToken) {
                this.saveToken(resp.data.data.accessToken);
                this.saveRefreshToken(resp.data.data.refreshToken);

                // Gọi /api/auth/user-info để lấy credentialId
                console.log("Gọi /auth/user-info để lấy thông tin người dùng");
                const userInfo = await axios.post(`${this.BASE_URL}/auth/user-info`, {}, {
                    headers: this.getHeader()
                });
                console.log("Phản hồi từ /auth/user-info:", userInfo.data);
                if (userInfo.data.data && userInfo.data.data.credentialId) {
                    this.saveCredentialId(userInfo.data.data.credentialId);
                } else {
                    console.log("Không tìm thấy credentialId trong phản hồi từ /auth/user-info");
                }

                console.log("Token truy cập đã được lưu:", this.getToken());
                console.log("Refresh token đã được lưu:", this.getRefreshToken());
                console.log("Credential ID đã được lưu:", this.getCredentialId());
            } else {
                console.error("Không có accessToken hoặc refreshToken trong phản hồi:", resp.data);
            }
            return resp.data;
        } catch (error) {
            console.error("Lỗi đăng nhập:", error.response?.data || error.message);
            throw error;
        }
    }

    // Đăng xuất người dùng
    static async logoutUser() {
        const token = this.getToken();
        const refreshToken = this.getRefreshToken();

        if (!token || !refreshToken) {
            this.clearAuth();
            return { code: 200, message: "Đã đăng xuất (không có token)", data: null };
        }

        try {
            const resp = await axios.post(`${this.BASE_URL}/auth/remove-token`, {}, {
                headers: {
                    ...this.getHeader(),
                    "refresh-token": refreshToken
                }
            });
            this.clearAuth();
            return resp.data;
        } catch (error) {
            this.clearAuth();
            return {
                code: error.response?.status || 500,
                message: error.response?.data?.message || "Không thể kết nối đến server",
                data: null
            };
        }
    }

    // Gọi phương thức đăng xuất
    static async logout() {
        return await this.logoutUser();
    }

    // Làm mới token
    static async refreshToken() {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            throw new Error("Không có refresh token khả dụng");
        }
        const resp = await axios.post(`${this.BASE_URL}/auth/refresh-token`, {}, {
            headers: {
                "refresh-token": refreshToken
            }
        });
        if (resp.data.data && resp.data.data.accessToken) {
            this.saveToken(resp.data.data.accessToken);
            if (resp.data.data.refreshToken) {
                this.saveRefreshToken(resp.data.data.refreshToken);
            }
            if (resp.data.data.credentialId) {
                this.saveCredentialId(resp.data.data.credentialId);
            }
        }
        return resp.data;
    }

    // Quên mật khẩu
    static async forgetPassword(email) {
        const resp = await axios.post(`${this.BASE_URL}/auth/forget-password`, email);
        return resp.data;
    }

    // Đặt lại mật khẩu
    static async resetPassword(secretKey) {
        const resp = await axios.post(`${this.BASE_URL}/auth/reset-password`, secretKey);
        return resp.data;
    }

    // Thay đổi mật khẩu
    static async changePassword(resetPasswordData) {
        const resp = await axios.post(`${this.BASE_URL}/auth/change-password`, resetPasswordData, {
            headers: this.getHeader()
        });
        return resp.data;
    }

    // Đăng ký người dùng
    static async registerUser(registrationData) {
        const resp = await axios.post(`${this.BASE_URL}/auth/registration`, registrationData);
        if (resp.data.data && resp.data.data.accessToken) {
            this.saveToken(resp.data.data.accessToken);
            if (resp.data.data.refreshToken) {
                this.saveRefreshToken(resp.data.data.refreshToken);
            }
            if (resp.data.data.credentialId) {
                this.saveCredentialId(resp.data.data.credentialId);
            }
        }
        return resp.data;
    }

    // Lấy thông tin người dùng hiện tại bằng /api/auth/user-info
    static async getUserInfo() {
        try {
            const resp = await axios.post(`${this.BASE_URL}/auth/user-info`, {}, {
                headers: this.getHeader()
            });
            console.log("Phản hồi từ /auth/user-info:", resp.data);
            if (resp.data.data && resp.data.data.credentialId) {
                this.saveCredentialId(resp.data.data.credentialId); // Lưu credentialId nếu cần
            }
            return resp.data;
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error.response?.data || error.message);
            throw error;
        }
    }

    // Cập nhật thông tin người dùng bằng /api/users/me
    static async updateMyProfile(userUpdateData) {
        try {
            const resp = await axios.post(`${this.BASE_URL}/users/me`, userUpdateData, {
                headers: this.getHeader()
            });
            console.log("Phản hồi từ /api/users/me:", resp.data);
            if (resp.data.data && resp.data.data.credentialId) {
                this.saveCredentialId(resp.data.data.credentialId); // Cập nhật credentialId nếu có thay đổi
            }
            return resp.data;
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin người dùng:", error.response?.data || error.message);
            throw error;
        }
    }

    // Kiểm tra xem đã xác thực chưa
    static isAuthenticated() {
        const token = this.getToken();
        return !!token;
    }

    // Kiểm tra xem có phải admin không
    static isAdmin() {
        const role = this.getRole();
        return role === "ADMIN";
    }

    // Kiểm tra xem có phải người dùng thường không
    static isTenant() {
        const role = this.getRole();
        return role === "USER";
    }
}