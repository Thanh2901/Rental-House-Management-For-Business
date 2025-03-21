package org.example.dataservice.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.dataservice.dto.Response;
import org.example.dataservice.dto.RoomDTO;
import org.example.dataservice.entity.Room;
import org.example.dataservice.exception.InvalidBookingException;
import org.example.dataservice.exception.NotFoundException;
import org.example.dataservice.mapper.RoomMapper;
import org.example.dataservice.repository.RoomRepository;
import org.example.dataservice.service.RoomService;
import org.example.dataservice.util.RoomType;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final RoomMapper roomMapper;

    private static final String IMAGE_DIRECTORY = System.getProperty("user.dir") + "/product-image";

    @Override
    public Response addRoom(RoomDTO roomDTO, MultipartFile imageFile) {
        Room room = roomMapper.toRoom(roomDTO);
        if (imageFile != null) {
            String imagePath = saveImage(imageFile);
            room.setImageUrl(imagePath);
        }
        roomRepository.save(room);
        return Response.builder()
                .status(200)
                .message("Room successfully added")
                .room(roomMapper.toRoomDTO(room))
                .build();
    }

    @Override
    public Response updateRoom(RoomDTO roomDTO, MultipartFile imageFile) {
        Room existingRoom = roomRepository.findById(roomDTO.getId()).orElseThrow(()-> new NotFoundException("room not found"));
        if (imageFile != null && !imageFile.isEmpty()) {
            String imagePath = saveImage(imageFile);
            existingRoom.setImageUrl(imagePath);
        }

        if (roomDTO.getRoomNumber() != null && roomDTO.getRoomNumber() >= 0) {
            existingRoom.setRoomNumber(roomDTO.getRoomNumber());
        }

        if (roomDTO.getPricePerMonth() != null && roomDTO.getPricePerMonth().compareTo(BigDecimal.ZERO) >= 0) {
            existingRoom.setPricePerMonth(roomDTO.getPricePerMonth());
        }

        if (roomDTO.getCapacity() != null && roomDTO.getCapacity() > 0) {
            existingRoom.setCapacity(roomDTO.getCapacity());
        }

        if (roomDTO.getRoomType() != null) existingRoom.setRoomType(roomDTO.getRoomType());

        if (roomDTO.getDescription() != null && !roomDTO.getDescription().isEmpty()) {
            existingRoom.setDescription(roomDTO.getDescription());
        }

        roomRepository.save(existingRoom);

        return Response.builder()
                .status(200)
                .message("Room successfully updated")
                .room(roomMapper.toRoomDTO(existingRoom))
                .build();
    }

    @Override
    public Response getRoomById(Long id) {
        Room existingRoom = roomRepository.findById(id).orElseThrow(()-> new NotFoundException("room not found"));
        return Response.builder()
                .status(200)
                .message("Room successfully get")
                .room(roomMapper.toRoomDTO(existingRoom))
                .build();
    }

    @Override
    public Response getAllRooms() {
        List<RoomDTO> roomDTOList = roomRepository.findAll(Sort.by(Sort.Direction.DESC, "id"))
                .stream().map(roomMapper::toRoomDTO).toList();
        return Response.builder()
                .status(200)
                .message("All rooms successfully retrieved")
                .rooms(roomDTOList)
                .build();
    }

    @Override
    public Response deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new NotFoundException("room not found");
        }
        roomRepository.deleteById(id);
        return Response.builder()
                .status(200)
                .message("Room successfully deleted")
                .build();
    }

    @Override
    public Response getAvailableRoom(LocalDate startDate, LocalDate endDate, RoomType roomType) {
        if (startDate.isBefore(LocalDate.now())) {
            throw new InvalidBookingException("start date can not before today");
        }
        if (startDate.isAfter(endDate)) {
            throw new InvalidBookingException("start date can not after end date");
        }
        if (endDate.isBefore(startDate)) {
            throw new InvalidBookingException("end date can not before start date");
        }
        if (endDate.isAfter(LocalDate.now())) {
            throw new InvalidBookingException("end date can not after today");
        }

        List<RoomDTO> roomDTOList = roomRepository.findAvailableRooms(startDate, endDate, roomType.toString())
                .stream().map(roomMapper::toRoomDTO).toList();

        return Response.builder()
                .status(200)
                .message("Available rooms successfully retrieved")
                .rooms(roomDTOList)
                .build();
    }

    @Override
    public List<RoomType> getAllRoomTypes() {
        return roomRepository.getAllRoomTypes();
    }

    @Override
    public Response searchRoom(String input) {
        List<RoomDTO> roomDTOList = roomRepository.searchRooms(input).stream().map(roomMapper::toRoomDTO).toList();
        return Response.builder()
                .status(200)
                .message("All rooms successfully retrieved")
                .rooms(roomDTOList)
                .build();
    }

    private String saveImage(MultipartFile imageFile) {
        if (!Objects.requireNonNull(imageFile.getContentType()).startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }
        // create directory to store image if it does not exist
        File directory = new File(IMAGE_DIRECTORY);
        if (!directory.exists()) {
            directory.mkdir();
        }
        // generate unique file name for the image
        String uniqueFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
        // get the absolute path of the image
        String imagePath = IMAGE_DIRECTORY + uniqueFileName;
        try {
            File destination = new File(imagePath);
            imageFile.transferTo(destination);
        } catch (Exception ex) {
            throw new IllegalArgumentException(ex.getMessage());
        }
        return imagePath;
    }
}
