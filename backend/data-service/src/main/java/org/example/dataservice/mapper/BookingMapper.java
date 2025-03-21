package org.example.dataservice.mapper;

import org.example.dataservice.dto.BookingDTO;
import org.example.dataservice.entity.Booking;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BookingMapper {
    BookingDTO toBookingDTO(Booking booking);
    Booking toBooking(BookingDTO bookingDTO);
}
