import React, { useState, useEffect, useRef } from "react";
import MockApiService from "../../service/MockApiService.js";
import Flatpickr from "react-flatpickr"; // Import Flatpickr
import "flatpickr/dist/flatpickr.min.css"; // Import CSS của Flatpickr
import "../../assets/css/RoomSearch.css"; // Import CSS tùy chỉnh

const RoomSearch = ({ handleSearchResult }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [roomType, setRoomType] = useState("");
    const [roomTypes, setRoomTypes] = useState([]);
    const [error, setError] = useState("");

    const containerRef = useRef(null);

    // Fetch Room Types
    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                const types = await MockApiService.getRoomTypes();
                setRoomTypes(types);
            } catch (error) {
                console.log("Error fetching RoomTypes: " + error);
            }
        };
        fetchRoomTypes();
    }, []);

    // Ensure search bar is visible
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.style.display = "flex";
            containerRef.current.style.opacity = "1";
        }
    }, []);

    // Show error message
    const showError = (message, timeout = 5000) => {
        setError(message);
        setTimeout(() => setError(""), timeout);
    };

    // Handle Search
    const handleInternalSearch = async () => {
        if (!startDate || !endDate || !roomType) {
            showError("Please select all fields");
            return;
        }

        try {
            const formattedStartDate = startDate ? new Date(startDate).toLocaleDateString("en-CA") : null;
            const formattedEndDate = endDate ? new Date(endDate).toLocaleDateString("en-CA") : null;
            const resp = await MockApiService.getAvailableRoom(formattedStartDate, formattedEndDate, roomType);

            if (resp.status === 200) {
                if (resp.rooms.length === 0) {
                    showError("Room not available for the selected dates");
                    return;
                }
                handleSearchResult(resp.rooms);
                setError("");
            }
        } catch (error) {
            showError(error?.response?.data?.message || error.message);
        }
    };

    return (
        <section className="search-container" ref={containerRef}>
            <div className="search-fields">
                {/* Check-in Date */}
                <div className="search-field">
                    <label>Check-in Date</label>
                    <Flatpickr
                        value={startDate}
                        onChange={(date) => setStartDate(date[0])} // Flatpickr trả về mảng, lấy ngày đầu tiên
                        options={{
                            dateFormat: "Y-m-d", // Định dạng ngày
                            minDate: "today", // Không cho phép chọn ngày trước hôm nay
                        }}
                        placeholder="Select Check-in Date"
                        className="date-input"
                    />
                </div>

                {/* Check-out Date */}
                <div className="search-field">
                    <label>Check-out Date</label>
                    <Flatpickr
                        value={endDate}
                        onChange={(date) => setEndDate(date[0])} // Flatpickr trả về mảng, lấy ngày đầu tiên
                        options={{
                            dateFormat: "Y-m-d", // Định dạng ngày
                            minDate: startDate ? new Date(startDate).setDate(new Date(startDate).getDate() + 1) : "today", // Ngày check-out phải sau ngày check-in
                        }}
                        placeholder="Select Check-out Date"
                        className="date-input"
                    />
                </div>

                {/* Room Type */}
                <div className="search-field">
                    <label>Room Type</label>
                    <select value={roomType} onChange={(e) => setRoomType(e.target.value)} className="room-select">
                        <option disabled value="">Select Room Type</option>
                        {roomTypes.map((type) => (
                            <option value={type} key={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Search Button */}
            <div className="search-button-container">
                <button className="search-button" onClick={handleInternalSearch}>
                    Search Rooms
                </button>
            </div>

            {/* Error Message */}
            {error && <p className="error-message">{error}</p>}
        </section>
    );
};

export default RoomSearch;