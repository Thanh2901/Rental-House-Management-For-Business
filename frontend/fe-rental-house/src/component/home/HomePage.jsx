import React from "react";
import { useState } from "react";
import RoomResult from "../common/RoomResult.jsx";
import RoomSearch from "../common/RoomSearch.jsx";
import "../../assets/css/HomePage.css";

const HomePage = () => {
    const [roomSearchResult, setRoomSearchResult] = useState([]);

    // Function to handle search result
    const handleSearchResult = (result) => {
        console.log("Search Results:", result); // Kiểm tra dữ liệu trả về
        setRoomSearchResult(result);
    };

    return (
        <div className="home">
            <section>
                <header className="header-banner">
                    <img src="./images/bg.jpg" alt="Rental House" className="header-image"/>
                    <div className="overlay"></div>
                    <div className="animated-texts overlay-content">
                        <h1>
                            Welcome to <span className="vivu-color">Happy Vivu</span>
                        </h1>{" "}
                        <br />
                        <h3>Comfort and Care</h3>
                    </div>
                </header>
            </section>

            {/* Thêm wrapper để kiểm soát khoảng cách giữa RoomSearch và RoomResult */}
            <div className="search-result-wrapper">
                <RoomSearch
                    handleSearchResult={handleSearchResult}
                    className="room-search-container"
                />
                <RoomResult roomSearchResult={roomSearchResult} className="room-result"/>
            </div>

            <h4>
                <a className="view-rooms-home" href="/room">
                    All Rooms
                </a>
            </h4>
            <h2 className="home-service">
                Service at <span className="vivu-color">Happy Vivu</span>
            </h2>
            <section className="service-section">
                <div className="service-card">
                    <img src="./images/electric.png" alt="Electricity"/>
                    <div className="service-details">
                        <h3 className="service-title">Electricity</h3>
                        <p className="service-description">More electric more convenient</p>
                    </div>
                </div>
                <div className="service-card">
                    <img src="./images/water.png" alt="Water"/>
                    <div className="service-details">
                        <h3 className="service-title">Water</h3>
                        <p className="service-description">More water more clean</p>
                    </div>
                </div>
                <div className="service-card">
                    <img src="./images/guaranty.png" alt="Vehicle attending"/>
                    <div className="service-details">
                        <h3 className="service-title">Vehicle attending</h3>
                        <p className="service-description">Secure make guarantee</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;