package org.example.feeservice.dto.response;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import org.example.feeservice.util.FeeType;
import org.example.feeservice.util.FeeUnit;

import java.math.BigDecimal;

public class FeeResponse {
    private Long id;
    private String description;
    private FeeType type;
    private FeeUnit feeUnit;
    private BigDecimal consumption;
    private BigDecimal pricePerUnit;
    private BigDecimal totalPrice;
}
