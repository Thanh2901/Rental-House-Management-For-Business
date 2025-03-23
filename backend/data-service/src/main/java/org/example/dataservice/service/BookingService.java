package org.example.dataservice.service;

import jakarta.servlet.http.HttpServletRequest;
import org.example.dataservice.dto.BookingDTO;
import org.example.dataservice.dto.Response;
import org.example.dataservice.dto.request.BookingRequest;
import org.example.dataservice.dto.request.BookingUpdateRequest;

public interface BookingService {
    Response createBooking(BookingRequest bookingRequest, String credential);
    Response getAllBookings();
    Response deleteBooking(Long bookingId);
    Response updateBooking(BookingUpdateRequest bookingUpdateRequest);
    Response getBookingById(Long bookingId);
    Response findBookingByReferenceNo(String bookingReference);
}
