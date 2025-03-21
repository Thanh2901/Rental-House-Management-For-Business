package org.example.financeservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.financeservice.util.PaymentGateway;
import org.example.financeservice.util.PaymentStatus;


import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class PaymentDTO {
    private Long id;
//    private BookingDTO bookingDTO;
    private String transactionId;
    private BigDecimal amount;
    private PaymentGateway paymentMethod;
    private LocalDateTime paymentDate;
    private PaymentStatus status;
    private String bookingReference;
    private String failureReason;
    private String approvalLink;
}
