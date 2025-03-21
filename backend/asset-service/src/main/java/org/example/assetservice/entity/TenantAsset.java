package org.example.assetservice.entity;

import jakarta.persistence.*;
import org.example.assetservice.util.VehicleType;

@Entity
@Table(name = "tbl_tenant_asset")
public class TenantAsset {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String description;

    @Enumerated(EnumType.STRING)
    private VehicleType vehicleType;
    private String vehiclePlate;
}
