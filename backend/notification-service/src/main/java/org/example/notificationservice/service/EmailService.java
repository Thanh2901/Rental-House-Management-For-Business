package org.example.notificationservice.service;

import org.example.notificationservice.dto.NotificationDTO;

public interface EmailService {
    void sendEmail(NotificationDTO notificationDTO);
}
