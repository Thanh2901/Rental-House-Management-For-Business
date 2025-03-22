package org.example.dataservice.repository;

import org.example.dataservice.entity.Room;
import org.example.dataservice.util.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    @Query("""
    SELECT r FROM Room r
    WHERE r.id NOT IN (
        SELECT b.room.id
        FROM Booking b
        WHERE CAST(b.bookingStatus AS string) IN ('BOOKED', 'CHECKED_IN')
        AND b.startDate <= :checkOutDate
        AND b.endDate >= :checkInDate
    )
    AND (:roomType IS NULL OR r.roomType = :roomType)
    """)
    List<Room> findAvailableRooms(@Param("checkInDate") LocalDate checkInDate,
                                  @Param("checkOutDate") LocalDate checkOutDate,
                                  @Param("roomType") RoomType roomType);

    @Query("""
                SELECT r FROM Room r
                WHERE CAST(r.roomNumber AS string) LIKE %:searchParam%
                   OR LOWER(r.roomType) LIKE LOWER(:searchParam)
                   OR CAST(r.pricePerMonth AS string) LIKE %:searchParam%
                   OR CAST(r.capacity AS string) LIKE %:searchParam%
                   OR LOWER(r.description) LIKE LOWER(CONCAT('%', :searchParam, '%'))
            """)
    List<Room> searchRooms(@Param("searchParam") String searchParam);

    @Query("SELECT DISTINCT r.roomType FROM Room r")
    List<RoomType> getAllRoomTypes();
}
