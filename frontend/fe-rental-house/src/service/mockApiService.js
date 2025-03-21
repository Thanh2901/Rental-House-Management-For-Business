const mockRoomTypes = ["Single", "Double", "Suite", "Deluxe"];

const mockRooms = [
    {
        id: 1,
        type: "Single",
        pricePerMonth: 5000000,
        description: "A cozy single room with a great city view.",
        imageUrl: "https://source.unsplash.com/300x200/?hotel,room"
    },
    {
        id: 2,
        type: "Double",
        pricePerMonth: 7000000,
        description: "A spacious double room with modern decor.",
        imageUrl: "https://source.unsplash.com/300x200/?hotel,bedroom"
    },
    {
        id: 3,
        type: "Suite",
        pricePerMonth: 12000000,
        description: "A luxury suite with premium amenities.",
        imageUrl: "https://source.unsplash.com/300x200/?luxury,room"
    }
];

const MockApiService = {
    getRoomTypes: async () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockRoomTypes), 500);
        });
    },

    getAvailableRoom: async (startDate, endDate, roomType) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const filteredRooms = mockRooms.filter(room => room.type === roomType);
                resolve({ status: 200, rooms: filteredRooms });
            }, 1000);
        });
    },

    isAdmin: () => {
        return false; // Chỉnh thành true để thử nghiệm với tài khoản admin
    }
};

export default MockApiService;
