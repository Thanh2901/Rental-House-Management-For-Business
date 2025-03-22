import React, { useState, useEffect, useRef } from "react";
import ApiService from "../../service/ApiService.js";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "../../assets/css/RoomSearch.css";

const RoomSearch = ({ handleSearchResult }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [roomType, setRoomType] = useState("");
    const [roomTypes, setRoomTypes] = useState([]);
    const [error, setError] = useState("");

    const containerRef = useRef(null);

    // Fetch Room Types and transform to uppercase
    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                const types = await ApiService.getRoomTypes();
                // Transform room types to uppercase to match backend enum
                const formattedTypes = types.map(type => type.toUpperCase());
                setRoomTypes(formattedTypes);
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
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today to start of day for comparison

        // Validate all fields are selected
        if (!startDate || !endDate || !roomType) {
            showError("Please select all fields");
            return;
        }

        // Validate startDate >= today
        if (startDate < today) {
            showError("Check-in date must be today or in the future");
            return;
        }

        // Validate endDate > today
        if (endDate <= today) {
            showError("Check-out date must be in the future");
            return;
        }

        // Validate startDate < endDate
        if (startDate >= endDate) {
            showError("Check-in date must be before check-out date");
            return;
        }

        try {
            const formattedStartDate = startDate ? new Date(startDate).toLocaleDateString("en-CA") : null;
            const formattedEndDate = endDate ? new Date(endDate).toLocaleDateString("en-CA") : null;
            // Ensure roomType is in uppercase (redundant if roomTypes are already transformed, but added for safety)
            const formattedRoomType = roomType.toUpperCase();
            const resp = await ApiService.getAvailableRoom(formattedStartDate, formattedEndDate, formattedRoomType);

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
                        onChange={(date) => setStartDate(date[0])}
                        options={{
                            dateFormat: "Y-m-d",
                            minDate: "today",
                            maxDate: endDate ? new Date(endDate).setDate(new Date(endDate).getDate() - 1) : null,
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
                        onChange={(date) => setEndDate(date[0])}
                        options={{
                            dateFormat: "Y-m-d",
                            minDate: startDate
                                ? new Date(startDate).setDate(new Date(startDate).getDate() + 1)
                                : new Date().setDate(new Date().getDate() + 1),
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