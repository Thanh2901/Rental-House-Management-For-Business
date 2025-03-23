package org.example.dataservice.mapper;

import org.example.dataservice.dto.BookingDTO;
import org.example.dataservice.entity.Booking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BookingMapper {
    @Mapping(source = "bookingStatus", target = "bookingStatus")
    BookingDTO toBookingDTO(Booking booking);
    Booking toBooking(BookingDTO bookingDTO);
}
