package org.example.dataservice.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.example.dataservice.dto.Response;
import org.example.dataservice.dto.RoomDTO;
import org.example.dataservice.service.RoomService;
import org.example.dataservice.util.RoomType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/data/rooms")
@RequiredArgsConstructor
public class RoomController {

    private static final Logger log = LoggerFactory.getLogger(RoomController.class);
    private final RoomService roomService;

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Add a new room", description = "Creates a new room with the provided details and an optional image file")
    @ApiResponse(responseCode = "200", description = "Room added successfully", content = @Content(schema = @Schema(implementation = Response.class)))
    //    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Response> createRoom(
            @RequestParam("roomNumber") Integer roomNumber,
            @RequestParam("roomType") RoomType roomType,
            @RequestParam("pricePerMonth") BigDecimal pricePerMonth,
            @RequestParam("capacity") Integer capacity,
            @RequestParam("description") String description,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile
    ) {
        RoomDTO roomDTO = RoomDTO.builder()
                .roomNumber(roomNumber)
                .roomType(roomType)
                .pricePerMonth(pricePerMonth)
                .capacity(capacity)
                .description(description)
                .build();
        return new ResponseEntity<>(roomService.addRoom(roomDTO, imageFile), HttpStatus.OK);
    }

    @PutMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Update a room", description = "Updates an existing room with the provided details and an optional image file")
    @ApiResponse(responseCode = "200", description = "Room updated successfully", content = @Content(schema = @Schema(implementation = Response.class)))
    public ResponseEntity<Response> updateRoom(
            @RequestParam(value = "roomNumber", required = false) Integer roomNumber,
            @RequestParam(value = "roomType", required = false) RoomType roomType,
            @RequestParam(value = "pricePerMonth", required = false) BigDecimal pricePerMonth,
            @RequestParam(value = "capacity", required = false) Integer capacity,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
            @RequestParam(value = "id", required = true) Long id
    ) {
        RoomDTO roomDTO = RoomDTO.builder()
                .id(id)
                .roomNumber(roomNumber)
                .roomType(roomType)
                .pricePerMonth(pricePerMonth)
                .capacity(capacity)
                .description(description)
                .build();
        return new ResponseEntity<>(roomService.updateRoom(roomDTO, imageFile), HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<Response> getAllRoom() {
        return new ResponseEntity<>(roomService.getAllRooms(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response> getRoomById(@PathVariable Long id) {
        return new ResponseEntity<>(roomService.getRoomById(id), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
//    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Response> deleteRoom(@PathVariable Long id) {
        return new ResponseEntity<>(roomService.deleteRoom(id), HttpStatus.OK);
    }

    @GetMapping("/available")
    public ResponseEntity<Response> getAvailableRooms(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam("roomType") RoomType roomType)
    {
        log.info("Room Type: {}", roomType);
        return new ResponseEntity<>(roomService.getAvailableRoom(startDate, endDate, roomType), HttpStatus.OK);
    }

    @GetMapping("/room-type")
    public List<RoomType> getAllRoomType() {
        return Arrays.asList(RoomType.values());
    }

    @GetMapping("/search")
    public ResponseEntity<Response> getRoomId(@RequestParam String input) {
        return new ResponseEntity<>(roomService.searchRoom(input), HttpStatus.OK);
    }
}
