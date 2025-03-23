package org.example.dataservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.dataservice.util.BookingStatus;
import org.example.dataservice.util.PaymentStatus;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingUpdateRequest {
    private long id;
    private long roomId;
    private LocalDate startDate;
    private LocalDate endDate;
    private BookingStatus bookingStatus;
    private PaymentStatus paymentStatus;
}
