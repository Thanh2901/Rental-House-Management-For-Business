package org.example.assetservice.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_room_asset")
public class RoomAsset {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer roomId;
    private String description;
    private LocalDateTime maintainedAt;
    private LocalDateTime repairedAt;
}
