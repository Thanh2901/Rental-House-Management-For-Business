package org.example.dataservice.service;

import lombok.RequiredArgsConstructor;
import org.example.dataservice.entity.BookingReference;
import org.example.dataservice.repository.BookingReferenceRepository;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class BookingCodeGenerator {
    private final BookingReferenceRepository referenceRepository;

    public String generateBookingReference() {
        String bookingReference;
        do {
            bookingReference = generateRandomAlphaNumericCode(10);
        } while (isBookingReferenceExist(bookingReference));
        saveBookingReferenceToDatabase(bookingReference);
        return bookingReference;
    }

    private String generateRandomAlphaNumericCode(int length) {
        String characters = "ABCDEFGIJKLMNOPQRSTUVWXYZ123456789";
        Random random = new Random();
        StringBuilder stringBuilder = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int index = random.nextInt(characters.length());
            stringBuilder.append(characters.charAt(index));
        }
        return stringBuilder.toString();
    }

    private boolean isBookingReferenceExist(String bookingReference) {
        return referenceRepository.findByReferenceNo(bookingReference).isPresent();
    }

    private void saveBookingReferenceToDatabase(String bookingReference) {
        BookingReference newBookingReference = BookingReference.builder().referenceNo(bookingReference).build();
        referenceRepository.save(newBookingReference);
    }
}
