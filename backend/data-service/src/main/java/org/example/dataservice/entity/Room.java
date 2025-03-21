package org.example.dataservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.example.dataservice.util.RoomType;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "tbl_room")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Room extends AbstractEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(value = 1, message = "Room Number must be at least 1")
    @Column(unique = true)
    private Integer roomNumber;

    @Enumerated(EnumType.STRING)
    @NotBlank(message = "Room type is required")
    private RoomType roomType;

    @Column(name = "price_per_month")
    @DecimalMin(value = "0.1", message = "price per month is required")
    private BigDecimal pricePerMonth;

//    private FeeDTO bill;

    @Min(value=1, message="capacity must be at least 1")
    private Integer capacity;

    private String description;
    private String imageUrl;

    @OneToMany(mappedBy = "room")
    Set<Booking> bookings = new HashSet<>();
}
