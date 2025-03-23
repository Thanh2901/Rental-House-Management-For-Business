package org.example.notificationservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.notificationservice.util.NotificationType;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationDTO {
    private Long id;
    @NotBlank(message = "subject is required")
    private String subject;
    @NotBlank(message = "recipient is required")
    private String recipient;
    private String body;
    private String bookingReference;
    private NotificationType notificationType;

    public NotificationDTO() {
    }

    public NotificationDTO(Long id, String subject, String recipient, String body, String bookingReference, NotificationType notificationType) {
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

    public @NotBlank(message = "subject is required") String getSubject() {
        return subject;
    }

    public void setSubject(@NotBlank(message = "subject is required") String subject) {
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
