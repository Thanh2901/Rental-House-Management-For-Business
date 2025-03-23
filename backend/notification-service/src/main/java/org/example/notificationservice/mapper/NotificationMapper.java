package org.example.notificationservice.mapper;

import org.example.notificationservice.dto.NotificationDTO;
import org.example.notificationservice.entity.Notification;
import org.springframework.stereotype.Component;

public interface NotificationMapper {
    NotificationDTO toNotificationDTO(Notification notification);
    Notification toNotification(NotificationDTO notificationDTO);
}

@Component
class NotificationMapperImpl implements NotificationMapper {

    @Override
    public NotificationDTO toNotificationDTO(Notification notification) {
        if (notification == null) {
            return null;
        }

        NotificationDTO notificationDTO = new NotificationDTO();
        notificationDTO.setId(notification.getId());
        notificationDTO.setRecipient(notification.getRecipient());
        notificationDTO.setSubject(notification.getSubject());
        notificationDTO.setBody(notification.getBody());
        notificationDTO.setBookingReference(notification.getBookingReference());
        notificationDTO.setNotificationType(notification.getNotificationType());
        return notificationDTO;
    }

    @Override
    public Notification toNotification(NotificationDTO notificationDTO) {
        if (notificationDTO == null) {
            return null;
        }

        Notification notification = new Notification();
        notification.setId(notificationDTO.getId());
        notification.setRecipient(notificationDTO.getRecipient());
        notification.setSubject(notificationDTO.getSubject());
        notification.setBody(notificationDTO.getBody());
        notification.setBookingReference(notificationDTO.getBookingReference());
        notification.setNotificationType(notificationDTO.getNotificationType());
        return notification;
    }
}


