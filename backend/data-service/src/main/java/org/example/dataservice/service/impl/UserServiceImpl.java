package org.example.dataservice.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.dataservice.dto.BookingDTO;
import org.example.dataservice.dto.request.RegisterUserRequest;
import org.example.dataservice.dto.request.UserUpdateRequest;
import org.example.dataservice.dto.response.UserResponse;
import org.example.dataservice.entity.User;
import org.example.dataservice.mapper.BookingMapper;
import org.example.dataservice.mapper.UserMapper;
import org.example.dataservice.repository.BookingRepository;
import org.example.dataservice.repository.UserRepository;
import org.example.dataservice.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final BookingMapper bookingMapper;
    private final BookingRepository bookingRepository;

    @Override
    public UserResponse registerUser(RegisterUserRequest request) {
        log.info("Received registration request in data service: {}", request);

        userRepository.findByCredentialId(request.getCredentialId())
                .ifPresent(user -> {
                    throw new RuntimeException("User already exists");
                });

        User newUser = userMapper.toUser(request);
        User user = userRepository.save(newUser);

        return userMapper.toUserResponse(user);
    }

    @Override
    public UserResponse updateUser(String credentialId, UserUpdateRequest request) {

        User user = userRepository.findByCredentialId(credentialId)
                .orElseThrow(()-> new RuntimeException("User does not exist"));

        userMapper.updateUser(request, user);
        return userMapper.toUserResponse(user);
    }

    @Override
    public UserResponse getUser(String credentialId) {
        User user = userRepository.findByCredentialId(credentialId)
                .orElseThrow(()-> new RuntimeException("User does not exist"));

        return userMapper.toUserResponse(user);
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(()-> new RuntimeException("User does not exist"));
        userRepository.delete(user);
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(()-> new RuntimeException("User does not exist"));
        System.out.println(user);
        return userMapper.toUserResponse(user);
    }

    @Override
    public List<BookingDTO> getBookingHistory(Long id) {
        return bookingRepository.getBookingByUserId(id).stream().map(bookingMapper::toBookingDTO).toList();
    }
}
