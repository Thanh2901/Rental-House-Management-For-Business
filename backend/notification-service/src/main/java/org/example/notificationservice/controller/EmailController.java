package org.example.notificationservice.controller;

import org.example.notificationservice.dto.NotificationDTO;
import org.example.notificationservice.dto.Response;
import org.example.notificationservice.service.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notification")
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/send/mail")
    public ResponseEntity<Response> sendMail(@RequestBody NotificationDTO notificationDTO) {
        return new ResponseEntity<>(emailService.sendEmail(notificationDTO), HttpStatus.OK);
    }
}
