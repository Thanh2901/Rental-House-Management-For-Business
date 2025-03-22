package org.example.dataservice.service;

import org.example.dataservice.dto.Response;
import org.example.dataservice.dto.RoomDTO;
import org.example.dataservice.util.RoomType;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

public interface RoomService {
    Response addRoom(RoomDTO roomDTO, MultipartFile imageFile);
    Response updateRoom(RoomDTO roomDTO, MultipartFile imageFile);
    Response getRoomById(Long id);
    Response getAllRooms();
    Response deleteRoom(Long id);
    Response getAvailableRoom(LocalDate startDate, LocalDate endDate, RoomType roomType);
    List<String> getAllRoomTypes();
    Response searchRoom(String input);
}
