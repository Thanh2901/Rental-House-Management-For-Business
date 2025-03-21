package org.example.feeservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NonNull;
import org.example.feeservice.util.FeeType;
import org.example.feeservice.util.FeeUnit;

import java.math.BigDecimal;

@Entity
@Table(name = "tbl_fee")
@Data
public class Fee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    @Enumerated(EnumType.STRING)
    private FeeType type;

    @Enumerated(EnumType.STRING)
    private FeeUnit feeUnit;

    private BigDecimal consumption;

    @NotBlank(message = "price per unit is required")
    private BigDecimal pricePerUnit;

    private BigDecimal totalPrice;

    // calculate total price on demand
    public BigDecimal getTotalPrice() {
        if (consumption != null && pricePerUnit != null) {
            return consumption.multiply(pricePerUnit);
        }
        return BigDecimal.ZERO;
    }
}

