package org.example.notificationservice;

import org.example.notificationservice.dto.NotificationDTO;
import org.example.notificationservice.service.EmailService;
import org.example.notificationservice.util.NotificationType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableDiscoveryClient
@EnableAsync
public class NotificationServiceApplication {

//    @Autowired
//    private EmailService emailService;
//
//    @Override
//    public void run(String... args) throws Exception {
//        NotificationDTO notificationDTO = new NotificationDTO();
//        notificationDTO.setNotificationType(NotificationType.EMAIL);
//        notificationDTO.setRecipient("thanhvuvpt@gmail.com");
//        notificationDTO.setSubject("Notification Service");
//        notificationDTO.setBody("This is a notification service");
//        emailService.sendEmail(notificationDTO);
//    }

    public static void main(String[] args) {
        SpringApplication.run(NotificationServiceApplication.class, args);
    }

}
