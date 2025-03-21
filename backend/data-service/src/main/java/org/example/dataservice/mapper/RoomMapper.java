package org.example.dataservice.mapper;

import org.example.dataservice.dto.RoomDTO;
import org.example.dataservice.entity.Room;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoomMapper {
    @Mapping(source = "roomType", target = "roomType")
    Room toRoom(RoomDTO roomDTO);
    RoomDTO toRoomDTO(Room room);
}
