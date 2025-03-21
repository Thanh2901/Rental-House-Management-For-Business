package org.example.dataservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.dataservice.util.NotificationType;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class NotificationDTO {
    private Long id;
    @NotBlank(message = "subject is required")
    private String subject;
    @NotBlank(message = "recipient is required")
    private String recipient;
    private String body;
    private String bookingReference;
    private NotificationType notificationType;
    private LocalDateTime createAt;
}
