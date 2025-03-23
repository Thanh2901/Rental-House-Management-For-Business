package org.example.notificationservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.example.notificationservice.util.NotificationType;
import org.springframework.data.domain.Auditable;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_notification")
public class Notification extends AbstractEntity{
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

    public Notification() {
    }

    public Notification(Long id, String subject, String recipient, String body, String bookingReference, NotificationType notificationType) {
        this.id = id;
        this.subject = subject;
        this.recipient = recipient;
        this.body = body;
        this.bookingReference = bookingReference;
        this.notificationType = notificationType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public @NotBlank(message = "recipient is required") String getRecipient() {
        return recipient;
    }

    public void setRecipient(@NotBlank(message = "recipient is required") String recipient) {
        this.recipient = recipient;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getBookingReference() {
        return bookingReference;
    }

    public void setBookingReference(String bookingReference) {
        this.bookingReference = bookingReference;
    }

    public NotificationType getNotificationType() {
        return notificationType;
    }

    public void setNotificationType(NotificationType notificationType) {
        this.notificationType = notificationType;
    }
}
