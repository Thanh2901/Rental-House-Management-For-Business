package org.example.notificationservice.service;

import org.example.notificationservice.dto.NotificationDTO;
import org.example.notificationservice.dto.Response;

public interface EmailService {
    Response sendEmail(NotificationDTO notificationDTO);
}
