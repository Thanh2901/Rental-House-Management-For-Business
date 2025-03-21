package org.example.dataservice.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_booking_reference")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookingReference extends AbstractEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String referenceNo;
}
