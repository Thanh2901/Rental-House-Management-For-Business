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

    // Lấy tất cả các phòng bằng /api/data/rooms/all
    static async getAllRooms() {
        try {
            const resp = await axios.get(`${this.BASE_URL}/data/rooms/all`, {
                headers: this.getHeader()
            });
            console.log("Phản hồi từ /api/data/rooms/all:", resp.data);

            // Kiểm tra xem response có chứa mảng rooms không
            if (resp.data && resp.data.rooms && Array.isArray(resp.data.rooms)) {
                return resp.data.rooms; // Trả về mảng các phòng (RoomDTO)
            } else {
                throw new Error('Unexpected response format: "rooms" array not found');
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phòng:", error.response?.data || error.message);
            throw error;
        }
    }

    // Lấy tất cả các loại phòng bằng /api/data/rooms/room-type
    static async getRoomTypes() {
        try {
            const resp = await axios.get(`${this.BASE_URL}/data/rooms/room-type`, {
                headers: this.getHeader()
            });
            console.log("Phản hồi từ /api/data/rooms/room-type:", resp.data);

            // Kiểm tra xem response có phải là mảng không
            if (Array.isArray(resp.data)) {
                return resp.data; // Trả về mảng các loại phòng (e.g., ["SINGLE", "DOUBLE", "SUIT", "TRIPLE"])
            } else {
                throw new Error('Unexpected response format: Expected an array of room types');
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách loại phòng:", error.response?.data || error.message);
            throw error;
        }
    }

    static async getRoomById(roomId) {
        try {
            const resp = await axios.get(`${this.BASE_URL}/data/rooms/${roomId}`, {
                headers: this.getHeader(),
            });
            console.log("Phản hồi từ /api/data/rooms/{roomId}:", resp.data);
            if (resp.data && resp.data.room) {
                return resp.data;
            } else {
                throw new Error("Unexpected response format: 'room' object not found");
            }
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết phòng:", error.response?.data || error.message);
            throw error;
        }
    }

    static async bookRoom(booking) {
        try {
            const resp = await axios.post(`${this.BASE_URL}/data/bookings`, booking, {
                headers: this.getHeader(),
            });
            console.log("Phản hồi từ /api/data/bookings:", resp.data);
            return resp.data;
        } catch (error) {
            console.error("Lỗi khi đặt phòng:", error.response?.data || error.message);
            throw error;
        }
    }

    // Fetch available rooms based on startDate, endDate, and roomType
    // Fetch available rooms based on startDate, endDate, and roomType
    static async getAvailableRoom(startDate, endDate, roomType) {
        console.log("Sending roomType:", roomType);
        try {
            // Kiểm tra định dạng đầu vào
            const validRoomTypes = ["SINGLE", "DOUBLE", "SUIT", "TRIPLE"];
            if (!startDate || !endDate || !roomType) {
                throw new Error("startDate, endDate, và roomType là bắt buộc");
            }
            if (!validRoomTypes.includes(roomType)) {
                throw new Error(`roomType phải thuộc ${validRoomTypes.join(", ")}`);
            }
            // Đảm bảo startDate và endDate ở định dạng hợp lệ (ví dụ: YYYY-MM-DD)
            if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
                throw new Error("startDate và endDate phải ở định dạng YYYY-MM-DD");
            }

            // Tạo params với URLSearchParams để đảm bảo định dạng chính xác
            const params = new URLSearchParams();
            params.append('startDate', startDate);
            params.append('endDate', endDate);
            params.append('roomType', roomType.toString());

            const resp = await axios.get(`${this.BASE_URL}/data/rooms/available`, {
                headers: this.getHeader(),
                params: params
            });

            console.log("Response from /api/data/rooms/available:", resp.data);

            // Kiểm tra dữ liệu phản hồi
            if (!resp.data || typeof resp.data !== "object") {
                throw new Error("Phản hồi từ server không hợp lệ");
            }

            return {
                status: resp.data.status || resp.status, // Lấy status từ body hoặc HTTP status
                message: resp.data.message || "Success",
                rooms: Array.isArray(resp.data.rooms) ? resp.data.rooms : [],
            };
        } catch (error) {
            console.error("Error fetching available rooms:", error.response?.data || error.message);
            throw {
                status: error.response?.status || 500,
                message: error.response?.data?.message || error.message || "Lỗi khi lấy danh sách phòng trống",
                rooms: [],
            };
        }
    }
}