package org.example.dataservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.dataservice.util.UserRole;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class Response {
    // generic
    private int status;
    private String message;

    // data output
    private UserDTO user;
    private List<UserDTO> users;

    // Booking data output
    private BookingDTO booking;
    private List<BookingDTO> bookings;

    // Room data output
    private RoomDTO room;
    private List<RoomDTO> rooms;

    private final LocalDateTime timestamp = LocalDateTime.now();
}
