import React, { useEffect } from "react";
import { useState } from "react";
import ApiService from "../../service/ApiService.js";
import Pagination from "../common/Pagination.jsx";
import RoomResult from "../common/RoomResult.jsx";
import RoomSearch from "../common/RoomSearch.jsx";
import "../../assets/css/AllRoomPage.css"; // Import the updated CSS file

const AllRoomPage = () => {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [selectedRoomType, setSelectedRoomType] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [roomsPerPage] = useState(5);

    const handleSearchResult = (results) => {
        setRooms(results);
        setFilteredRooms(results);
        setCurrentPage(1); // Reset to first page after search
    };

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const resp = await ApiService.getAllRooms();
                setRooms(resp);
                setFilteredRooms(resp);
            } catch (error) {
                console.log("Error fetching rooms:", error);
            }
        };

        const fetchRoomTypes = async () => {
            try {
                const types = await ApiService.getRoomTypes();
                setRoomTypes(types);
            } catch (error) {
                console.log("Error fetching room types:", error);
            }
        };
        fetchRooms();
        fetchRoomTypes();
    }, []);

    // Handle changes to room type filter
    const handleRoomTypeChange = (e) => {
        const selectedType = e.target.value;
        setSelectedRoomType(selectedType);
        filterRooms(selectedType);
    };

    // Filter rooms by type
    const filterRooms = (type) => {
        if (type === "") {
            setFilteredRooms(rooms);
        } else {
            const filtered = rooms.filter((room) => room.roomType === type);
            setFilteredRooms(filtered);
        }
        setCurrentPage(1);
    };

    // Pagination calculation
    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

    // Define the paginate function
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="all-rooms-page">
            <h2>All Rooms</h2>
            <div className="all-rooms-filter">
                <label>Filter By Room Type</label>
                <select value={selectedRoomType} onChange={handleRoomTypeChange}>
                    <option value="">All Types</option>
                    {roomTypes.map((type) => (
                        <option value={type} key={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            <RoomSearch handleSearchResult={handleSearchResult} roomTypes={roomTypes} />
            <RoomResult roomSearchResult={currentRooms} />
            <Pagination
                roomsPerPage={roomsPerPage}
                totalRooms={filteredRooms.length}
                currentPage={currentPage}
                paginate={paginate}
            />
        </div>
    );
};

export default AllRoomPage;