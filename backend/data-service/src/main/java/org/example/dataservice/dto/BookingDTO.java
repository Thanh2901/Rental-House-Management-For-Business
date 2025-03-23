package org.example.dataservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.dataservice.util.BookingStatus;
import org.example.dataservice.util.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class BookingDTO {
    private Long id;
    private UserDTO user;
    private RoomDTO room;
    private PaymentStatus paymentStatus;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalPrice;
    private String bookingReference;
    private LocalDateTime createdAt;
    private BookingStatus bookingStatus;
}
