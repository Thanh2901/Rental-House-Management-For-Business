package org.example.dataservice.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.HeaderParam;
import lombok.RequiredArgsConstructor;
import org.example.dataservice.dto.BookingDTO;
import org.example.dataservice.dto.Response;
import org.example.dataservice.dto.request.BookingRequest;
import org.example.dataservice.dto.request.BookingUpdateRequest;
import org.example.dataservice.service.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/data/bookings")
public class BookingController {
    private final BookingService bookingService;

    @GetMapping("/all")
//    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> getAllBookings() {
        return new ResponseEntity<>(bookingService.getAllBookings(), HttpStatus.OK);
    }

    @PostMapping("/add")
//    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<Response> addBooking(@RequestBody BookingRequest bookingRequest, @RequestHeader("X-Credential") String credential) {
        return new ResponseEntity<>(bookingService.createBooking(bookingRequest, credential), HttpStatus.OK);
    }

    @GetMapping("/ref/{reference}")
    public ResponseEntity<Response> getBookingByReference(@PathVariable String reference) {
        return new ResponseEntity<>(bookingService.findBookingByReferenceNo(reference), HttpStatus.OK);
    }

    @PutMapping("/update")
//    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> updateBooking(@RequestBody BookingUpdateRequest request) {
        return new ResponseEntity<>(bookingService.updateBooking(request), HttpStatus.OK);
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<Response> getBookingById(@PathVariable Long bookingId) {
        return new ResponseEntity<>(bookingService.getBookingById(bookingId), HttpStatus.OK);
    }

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<Response> deleteBooking(@PathVariable Long bookingId) {
        return new ResponseEntity<>(bookingService.deleteBooking(bookingId), HttpStatus.OK);
    }
}
