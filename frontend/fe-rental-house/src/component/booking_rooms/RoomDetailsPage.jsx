import React, { useState, useEffect, useRef } from "react";
import ApiService from "../../service/ApiService.js";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect";
import "flatpickr/dist/plugins/monthSelect/style.css";
import { useNavigate, useParams } from "react-router-dom";
import "../../assets/css/RoomDetailsPage.css";

const RoomDetailsPage = () => {
    const navigate = useNavigate();
    const { roomId } = useParams();

    const [room, setRoom] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [totalPrice, setTotalPrice] = useState(null);
    const [totalMonthsToStay, setTotalMonthsToStay] = useState(0);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showBookingPreview, setShowBookingPreview] = useState(false);
    const [showMessage, setShowMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const startDateRef = useRef(null);
    const endDateRef = useRef(null);

    const placeholderImage = "https://placehold.co/600x400?text=Room+Image";

    useEffect(() => {
        if (!roomId || isNaN(parseInt(roomId))) {
            setErrorMessage("ID phòng không hợp lệ. Vui lòng chọn phòng khác.");
            setTimeout(() => {
                setErrorMessage("");
                navigate("/rooms");
            }, 5000);
            return;
        }

        const fetchRoomDetails = async () => {
            setIsLoading(true);
            try {
                const resp = await ApiService.getRoomById(roomId);
                setRoom(resp.room);
            } catch (error) {
                console.error("Error fetching room details:", error);
                setErrorMessage(error.response?.data?.message || error.message);
                setTimeout(() => {
                    setErrorMessage("");
                    navigate("/rooms");
                }, 5000);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRoomDetails();
    }, [roomId, navigate]);

    useEffect(() => {
        if (showDatePicker && startDateRef.current && endDateRef.current) {
            const startPicker = flatpickr(startDateRef.current, {
                plugins: [new monthSelectPlugin({
                    shorthand: true,
                    dateFormat: "m.y",
                    altFormat: "F Y",
                    theme: "light"
                })],
                dateFormat: "Y-m",
                minDate: "today",
                onChange: (selectedDates) => {
                    setStartDate(selectedDates[0]);
                    if (endDate && selectedDates[0] > endDate) {
                        setEndDate(null);
                        endDateRef.current._flatpickr.clear();
                    }
                },
            });

            const endPicker = flatpickr(endDateRef.current, {
                plugins: [new monthSelectPlugin({
                    shorthand: true,
                    dateFormat: "m.y",
                    altFormat: "F Y",
                    theme: "light"
                })],
                dateFormat: "Y-m",
                minDate: startDate || "today",
                onChange: (selectedDates) => {
                    setEndDate(selectedDates[0]);
                },
            });

            if (startDate) {
                endPicker.set("minDate", startDate);
            }

            return () => {
                startPicker.destroy();
                endPicker.destroy();
            };
        }
    }, [showDatePicker, startDate, endDate]);

    const calculateTotalPrice = () => {
        if (!startDate || !endDate || !room) return 0;

        const startYear = startDate.getFullYear();
        const startMonth = startDate.getMonth();
        const endYear = endDate.getFullYear();
        const endMonth = endDate.getMonth();

        const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
        setTotalMonthsToStay(totalMonths);
        return room.pricePerMonth * totalMonths;
    };

    const handleConfirmation = () => {
        if (!startDate || !endDate) {
            setErrorMessage("Vui lòng chọn cả tháng bắt đầu và tháng kết thúc");
            setTimeout(() => setErrorMessage(""), 5000);
            return;
        }

        const calculatedPrice = calculateTotalPrice();
        setTotalPrice(calculatedPrice);
        setShowBookingPreview(true);
        setShowDatePicker(false);
    };

    const acceptBooking = async () => {
        try {
            const parsedRoomId = parseInt(roomId);
            if (isNaN(parsedRoomId)) {
                throw new Error("ID phòng không hợp lệ");
            }

            const formattedStartDate = startDate.toISOString().split("T")[0];
            const formattedEndDate = endDate.toISOString().split("T")[0];

            const booking = {
                roomId: parsedRoomId,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
            };

            const resp = await ApiService.bookRoom(booking);

            if (resp.status === 200) {
                setShowMessage(
                    "Đặt phòng thành công! Chi tiết đã được gửi vào email của bạn. Vui lòng tiếp tục thanh toán."
                );
                setShowBookingPreview(false);
                setTimeout(() => {
                    setShowMessage(null);
                    navigate("/rooms");
                }, 8000);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message);
            setTimeout(() => setErrorMessage(""), 5000);
        }
    };

    const formatMonthYear = (date) => {
        if (!date) return "";
        return date.toLocaleString("vi-VN", { month: "long", year: "numeric" });
    };

    const cancelBooking = () => {
        setShowBookingPreview(false);
        setShowDatePicker(true);
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Đang tải thông tin phòng...</p>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="error-container">
                <p>Không thể tải thông tin phòng. Vui lòng thử lại sau.</p>
                <button onClick={() => navigate("/rooms")}>Quay lại danh sách phòng</button>
            </div>
        );
    }

    const { roomNumber, type, pricePerMonth, capacity, description, imageUrl } = room;

    return (
        <div className="room-details-booking">
            {showMessage && (
                <div className="message-overlay">
                    <div className="message-box">
                        <div className="success-icon">✓</div>
                        <p className="booking-success-message">{showMessage}</p>
                    </div>
                </div>
            )}

            {errorMessage && (
                <div className="error-alert">
                    <span className="error-icon">⚠️</span>
                    <p className="error-message">{errorMessage}</p>
                </div>
            )}

            <h2>Chi tiết phòng</h2>

            <div className="room-details-card">
                <div className="room-image-container">
                    <img
                        src={imageUrl && !imageUrl.startsWith("file://") ? imageUrl : placeholderImage}
                        alt={type}
                        className="room-details-image"
                        onError={(e) => (e.target.src = placeholderImage)}
                    />
                    <div className="room-price-tag">
                        {pricePerMonth.toLocaleString()} VND/tháng
                    </div>
                </div>

                <div className="room-details-content">
                    <div className="room-details-info">
                        <h3>{type}</h3>
                        <div className="room-highlights">
                            <div className="highlight-item">
                                <span className="highlight-icon">🔢</span>
                                <div className="highlight-text">
                                    <span className="highlight-label">Số phòng</span>
                                    <span className="highlight-value">{roomNumber}</span>
                                </div>
                            </div>
                            <div className="highlight-item">
                                <span className="highlight-icon">📏</span>
                                <div className="highlight-text">
                                    <span className="highlight-label">Diện tích</span>
                                    <span className="highlight-value">{capacity} m²</span>
                                </div>
                            </div>
                        </div>

                        <div className="room-description">
                            <h4>Mô tả</h4>
                            <p>{description || "Chưa có mô tả chi tiết"}</p>
                        </div>
                    </div>

                    <div className="booking-info">
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setShowDatePicker(true);
                                setShowBookingPreview(false);
                            }}
                        >
                            <span className="button-icon">📅</span> Chọn ngày thuê
                        </button>
                    </div>
                </div>
            </div>

            {showDatePicker && (
                <div className="date-picker-container">
                    <h3 className="date-picker-title">Chọn thời gian thuê</h3>

                    <div className="date-pickers-wrapper">
                        <div className="date-picker">
                            <label>Tháng bắt đầu</label>
                            <div className="input-with-icon">
                                <span className="date-icon">📅</span>
                                <input
                                    type="text"
                                    ref={startDateRef}
                                    placeholder="Chọn tháng bắt đầu"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="date-picker">
                            <label>Tháng kết thúc</label>
                            <div className="input-with-icon">
                                <span className="date-icon">📅</span>
                                <input
                                    type="text"
                                    ref={endDateRef}
                                    placeholder="Chọn tháng kết thúc"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        className={`btn btn-primary ${!startDate || !endDate ? 'btn-disabled' : ''}`}
                        onClick={handleConfirmation}
                        disabled={!startDate || !endDate}
                    >
                        Tiếp tục
                    </button>
                </div>
            )}

            {showBookingPreview && (
                <div className="booking-preview-overlay">
                    <div className="booking-preview">
                        <h3>Xác nhận đặt phòng</h3>

                        <div className="preview-info">
                            <div className="preview-room-info">
                                <img
                                    src={imageUrl && !imageUrl.startsWith("file://") ? imageUrl : placeholderImage}
                                    alt={type}
                                    className="preview-image"
                                    onError={(e) => (e.target.src = placeholderImage)}
                                />
                                <div className="preview-room-details">
                                    <h4>{type}</h4>
                                    <p>Phòng số: {roomNumber}</p>
                                    <p>{capacity} m²</p>
                                </div>
                            </div>

                            <div className="preview-booking-details">
                                <div className="preview-item">
                                    <span className="preview-label">Thời gian thuê:</span>
                                    <span className="preview-value">
                                        {formatMonthYear(startDate)} - {formatMonthYear(endDate)}
                                    </span>
                                </div>
                                <div className="preview-item">
                                    <span className="preview-label">Tổng thời gian:</span>
                                    <span className="preview-value">{totalMonthsToStay} tháng</span>
                                </div>
                                <div className="preview-item total-price">
                                    <span className="preview-label">Tổng tiền:</span>
                                    <span className="preview-value">{totalPrice?.toLocaleString()} VND</span>
                                </div>
                            </div>
                        </div>

                        <div className="preview-actions">
                            <button className="btn btn-primary" onClick={acceptBooking}>
                                Xác nhận và đặt phòng
                            </button>
                            <button className="btn btn-secondary" onClick={cancelBooking}>
                                Thay đổi ngày
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomDetailsPage;