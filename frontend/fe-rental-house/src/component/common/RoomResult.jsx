import React from "react";
import MockApiService from "../../service/MockApiService.js";
import {useNavigate} from "react-router-dom";
import "../../assets/css/RoomResult.css"

const RoomResult = ({ roomSearchResult }) => {
    const navigate = useNavigate();
    const isAdmin = MockApiService.isAdmin();

    return (
        <section>
            <div className="room-result">
                {roomSearchResult.length === 0 ? (
                    <p>No rooms found</p>
                ) : (
                    roomSearchResult.map((room) => (
                        <div className="room-list-item" key={room.id}>
                            <img className="room-list-item-image" src={room.imageUrl} alt="Room" />
                            <div>
                                <h3>{room.type}</h3>
                                <p>Price: {room.pricePerMonth} VND / Month</p>
                                <p>Description: {room.description}</p>
                            </div>
                            <div className="book-now-div">
                                {isAdmin ? (
                                    <button className="edit-room-button" onClick={() => navigate(`/admin/edit-room`)}>
                                        Edit Room
                                    </button>
                                ) : (
                                    <button
                                        className="book-now-button"
                                        onClick={() => navigate(`/room-details/${room.id}`)}
                                    >
                                        View/Book Now
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default RoomResult;