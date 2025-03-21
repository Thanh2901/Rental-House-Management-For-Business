package org.example.notificationservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.example.notificationservice.util.NotificationType;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_notification")
@Data
public class Notification {
    @Id
    @GeneratedValue
    private Long id;

    private String subject;
    @NotBlank(message = "recipient is required")
    private String recipient;

    private String body;

    private String bookingReference;

    @Enumerated(EnumType.STRING)
    private NotificationType notificationType;

    private final LocalDateTime createAt = LocalDateTime.now();
}
