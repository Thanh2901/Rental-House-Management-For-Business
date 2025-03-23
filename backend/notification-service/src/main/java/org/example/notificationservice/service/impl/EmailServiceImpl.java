package org.example.notificationservice.service.impl;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.example.notificationservice.dto.NotificationDTO;
import org.example.notificationservice.dto.Response;
import org.example.notificationservice.entity.Notification;
import org.example.notificationservice.mapper.NotificationMapper;
import org.example.notificationservice.repository.NotificationRepository;
import org.example.notificationservice.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.nio.charset.StandardCharsets;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final NotificationRepository notificationRepository;
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    @Value("thanhvuworkspace@gmail.com")
    private String from;
    private final NotificationMapper notificationMapper;

    public EmailServiceImpl(NotificationRepository notificationRepository,
                            JavaMailSender mailSender,
                            TemplateEngine templateEngine,
                            NotificationMapper notificationMapper) {
        this.notificationRepository = notificationRepository;
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.notificationMapper = notificationMapper;
    }

    @Override
    public Response sendEmail(NotificationDTO notificationDTO) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, StandardCharsets.UTF_8.name());

            // load template with content
            Context context = new Context();
            context.setVariable("name", notificationDTO.getRecipient());
            context.setVariable("content", notificationDTO.getBody());
            context.setVariable("sender", from);
            String html = templateEngine.process("welcome-email", context);

            // send email
            helper.setTo(notificationDTO.getRecipient());
            helper.setFrom(from);
            helper.setText(html, true);
            helper.setSubject(notificationDTO.getSubject());
            mailSender.send(message);

            Notification notification = notificationMapper.toNotification(notificationDTO);
            Notification newNotification = notificationRepository.save(notification);

            Response response = new Response();
            response.setMessage("mail was successfully sent");
            response.setStatus(200);
            response.setNotification(notificationMapper.toNotificationDTO(newNotification));

            return response;

        } catch (MessagingException e) {

            Response response = new Response();
            response.setMessage("mail could not be sent" + e.getMessage());
            response.setStatus(500);
            return response;
        }
    }
}
