package org.example.dataservice.mapper;

import org.example.dataservice.dto.request.RegisterUserRequest;
import org.example.dataservice.dto.request.UserUpdateRequest;
import org.example.dataservice.dto.response.UserResponse;
import org.example.dataservice.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(RegisterUserRequest registerUserRequest);
    UserResponse toUserResponse(User user);
    void updateUser(UserUpdateRequest request, @MappingTarget User user);
}
