package org.example.authservice.client;

import org.example.authservice.dto.NotificationDTO;
import org.example.authservice.dto.Response;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "notification-service")
public interface NotificationClient {
    @PostMapping("/api/notification/send/mail")
    ResponseEntity<Response> sendMail(@RequestBody NotificationDTO notificationDTO);
}
