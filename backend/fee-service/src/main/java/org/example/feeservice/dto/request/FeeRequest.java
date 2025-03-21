package org.example.feeservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import org.example.feeservice.util.FeeType;
import org.example.feeservice.util.FeeUnit;

import java.math.BigDecimal;

public class FeeRequest {
    @NotBlank(message = "description is required")
    private String description;
    @NotBlank(message = "fee type is required")
    private FeeType type;
    @NotBlank(message = "fee unit is required")
    private FeeUnit feeUnit;
    @NotBlank(message = "consumption is required")
    private BigDecimal consumption;
    @NotBlank(message = "price per unit is required")
    private BigDecimal pricePerUnit;
}
