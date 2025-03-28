package org.example.dataservice.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.dataservice.client.NotificationClient;
import org.example.dataservice.dto.BookingDTO;
import org.example.dataservice.dto.NotificationDTO;
import org.example.dataservice.dto.Response;
import org.example.dataservice.dto.request.BookingRequest;
import org.example.dataservice.dto.request.BookingUpdateRequest;
import org.example.dataservice.entity.Booking;
import org.example.dataservice.entity.Room;
import org.example.dataservice.entity.User;
import org.example.dataservice.exception.InvalidBookingException;
import org.example.dataservice.exception.NotFoundException;
import org.example.dataservice.mapper.BookingMapper;
import org.example.dataservice.repository.BookingRepository;
import org.example.dataservice.repository.RoomRepository;
import org.example.dataservice.repository.UserRepository;
import org.example.dataservice.service.BookingCodeGenerator;
import org.example.dataservice.service.BookingService;
import org.example.dataservice.service.UserService;
import org.example.dataservice.util.BookingStatus;
import org.example.dataservice.util.PaymentStatus;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
    private final NotificationClient notificationClient;
    private final RoomRepository roomRepository;
    private final BookingCodeGenerator bookingCodeGenerator;
    private final BookingMapper bookingMapper;
    private final BookingRepository bookingRepository;
    private final UserService userService;
    private final UserRepository userRepository;

    @Override
    public Response createBooking(BookingRequest bookingRequest, String credentialId) {

        User currentUser = userRepository.findByCredentialId(credentialId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (bookingRepository.findByUserId(currentUser.getId()).contains(currentUser)) {
            throw new InvalidBookingException("Booking already exists");
        }

        Room room = roomRepository.findById(bookingRequest.getRoomId())
                .orElseThrow(()-> new NotFoundException("Room not found"));
        // validate
        if (bookingRequest.getStartDate().isBefore(LocalDate.now())) {
            throw new InvalidBookingException("start date can not before today");
        }
        if (bookingRequest.getStartDate().isAfter(bookingRequest.getEndDate())) {
            throw new InvalidBookingException("start date can not after end date");
        }
        if (bookingRequest.getEndDate().isBefore(bookingRequest.getStartDate())) {
            throw new InvalidBookingException("end date can not before start date");
        }
        if (bookingRequest.getEndDate().isBefore(LocalDate.now())) {
            throw new InvalidBookingException("end date can not before today");
        }

        boolean isAvailable = bookingRepository.isRoomAvailable(room.getId(), bookingRequest.getStartDate(), bookingRequest.getEndDate());
        if (!isAvailable) {
            throw new InvalidBookingException("Room is not available for the selected date ranges");
        }
        // calculate the total price needed to pay for the stay
        BigDecimal totalPrice = calculateTotalPrice(room, bookingRequest);
        String bookingReference = bookingCodeGenerator.generateBookingReference();

        // create and save the booking
        Booking booking = new Booking();
        booking.setUser(currentUser);
        booking.setRoom(room);
        booking.setBookingReference(bookingReference);
        booking.setStartDate(bookingRequest.getStartDate());
        booking.setEndDate(bookingRequest.getEndDate());
        booking.setTotalPrice(totalPrice);
        booking.setBookingStatus(BookingStatus.BOOKED);
        booking.setPaymentStatus(PaymentStatus.PENDING);
        booking.setCreatedAt(LocalDateTime.now());

        bookingRepository.save(booking);

        String paymentUrl = "http://locahost:3000/payment" + bookingReference + "/" + totalPrice;

        // send notification via email
        NotificationDTO notificationDTO = NotificationDTO.builder()
//                .recipient(currentUser.getEmail())
                .subject("Booking Confirmation")
                .body(String.format("""
                        Your booking has been created successfully. Please proceed with your payment using the payment link below\
                        %s""", paymentUrl))
                .bookingReference(bookingReference)
                .build();

        notificationClient.sendEmail(notificationDTO);

        return Response.builder()
                .status(200)
                .message("Booking room successfully")
                .booking(bookingMapper.toBookingDTO(booking))
                .build();
    }

    private BigDecimal calculateTotalPrice(Room room, BookingRequest bookingRequest) {
        BigDecimal pricePerMoth = room.getPricePerMonth();
        BigDecimal totalPrice = BigDecimal.ZERO;
        long months = ChronoUnit.MONTHS.between(bookingRequest.getStartDate(), bookingRequest.getEndDate());
        return pricePerMoth.multiply(BigDecimal.valueOf(months));
    }

    @Override
    public Response getAllBookings() {
        List<BookingDTO> bookingDTOList = bookingRepository.findAll(Sort.by(Sort.Direction.DESC, "id")).stream().
                map(bookingMapper::toBookingDTO).
                toList();
        for (BookingDTO bookingDTO : bookingDTOList) {
            bookingDTO.setUser(null);
            bookingDTO.setRoom(null);
        }
        return Response.builder()
                .status(200)
                .message("All bookings found")
                .bookings(bookingDTOList)
                .build();
    }

    @Override
    public Response deleteBooking(Long bookingId) {
        bookingRepository.deleteById(bookingId);
        return Response.builder()
                .status(200)
                .message("Booking deleted")
                .build();
    }

    @Override
    public Response updateBooking(BookingUpdateRequest updateRequest) {
        if (updateRequest == null) throw new NotFoundException("Booking id is required");
        Booking existingBooking = bookingRepository.findById(updateRequest.getId())
                .orElseThrow(()-> new NotFoundException("Booking not found"));
        if (existingBooking.getBookingReference() != null) {
            existingBooking.setBookingStatus(updateRequest.getBookingStatus());
        }
        if (existingBooking.getPaymentStatus() != null) {
            existingBooking.setPaymentStatus(updateRequest.getPaymentStatus());
        }
        bookingRepository.save(existingBooking);
        return Response.builder()
                .status(200)
                .message("Booking updated successfully")
                .booking(bookingMapper.toBookingDTO(existingBooking))
                .build();
    }

    @Override
    public Response getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(()->new NotFoundException("Booking not found"));
        return Response.builder()
                .status(200)
                .message("Booking found")
                .booking(bookingMapper.toBookingDTO(booking))
                .build();
    }

    @Override
    public Response findBookingByReferenceNo(String bookingReference) {
        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(()-> new NotFoundException("Booking with reference No: " + bookingReference + " not found"));
        return Response.builder()
                .status(200)
                .message("Booking found")
                .booking(bookingMapper.toBookingDTO(booking))
                .build();
    }
}
