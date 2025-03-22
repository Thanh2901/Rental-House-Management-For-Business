import React from "react";
import ApiService from "../../service/ApiService.js"; // Replace MockApiService with ApiService
import { useNavigate } from "react-router-dom";
import "../../assets/css/RoomResult.css";

const RoomResult = ({ roomSearchResult }) => {
    const navigate = useNavigate();
    const isAdmin = ApiService.isAdmin(); // Use ApiService instead of MockApiService

    // Placeholder image URL for when the imageUrl is invalid or inaccessible
    const placeholderImage = "https://via.placeholder.com/150?text=No+Image";

    return (
        <section>
            <div className="room-result">
                {roomSearchResult.length === 0 ? (
                    <p>No rooms found</p>
                ) : (
                    roomSearchResult.map((room) => (
                        <div className="room-list-item" key={room.id}>
                            <img
                                className="room-list-item-image"
                                src={
                                    room.imageUrl && !room.imageUrl.startsWith("file://")
                                        ? room.imageUrl
                                        : placeholderImage
                                }
                                alt={`Room ${room.type || room.id}`}
                                onError={(e) => (e.target.src = placeholderImage)} // Fallback if image fails to load
                            />
                            <div>
                                <h3>{room.type}</h3>
                                <p>Price: {room.pricePerMonth} VND / Month</p>
                                <p>Description: {room.description || "N/A"}</p>
                            </div>
                            <div className="book-now-div">
                                {isAdmin ? (
                                    <button
                                        className="edit-room-button"
                                        onClick={() => navigate(`/admin/edit-room`)}
                                    >
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