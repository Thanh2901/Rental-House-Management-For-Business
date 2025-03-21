package org.example.dataservice.service;

import org.example.dataservice.dto.BookingDTO;
import org.example.dataservice.dto.Response;

public interface BookingService {
    Response createBooking(BookingDTO bookingDTO);
    Response getAllBookings();
    Response deleteBooking(Long bookingId);
    Response updateBooking(BookingDTO bookingDTO);
    Response getBookingById(Long bookingId);
    Response findBookingByReferenceNo(String bookingReference);
}
