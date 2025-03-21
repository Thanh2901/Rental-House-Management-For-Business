package org.example.authservice.service.impl;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.example.authservice.client.UserClient;
import org.example.authservice.dto.CredentialDTO;
import org.example.authservice.dto.request.LoginRequest;
import org.example.authservice.dto.request.RegisterUserRequest;
import org.example.authservice.dto.request.RegistrationRequest;
import org.example.authservice.dto.request.ResetPasswordDTO;
import org.example.authservice.dto.response.TokenResponse;
import org.example.authservice.dto.response.UserResponse;
import org.example.authservice.entity.Credential;
import org.example.authservice.entity.Token;
import org.example.authservice.mapper.CredentialMapper;
import org.example.authservice.repository.CredentialRepository;
import org.example.authservice.repository.TokenRepository;
import org.example.authservice.service.AuthenticationService;
import org.example.authservice.service.JwtService;
import org.example.authservice.service.TokenService;
import org.example.authservice.service.UserService;
import org.example.authservice.util.TokenType;
import org.example.authservice.util.UserRole;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.example.authservice.util.TokenType.ACCESS_TOKEN;
import static org.example.authservice.util.TokenType.RESET_TOKEN;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final CredentialRepository credentialRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final TokenService tokenService;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final UserClient userClient;
    private final CredentialMapper credentialMapper;

    @Override
    public TokenResponse authenticate(LoginRequest loginRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        var credential = credentialRepository.findCredentialByEmail(loginRequest.getEmail()).orElseThrow(() -> new UsernameNotFoundException("Email or password incorrect!"));

        String accessToken = jwtService.generateAccessToken(credential);

        String refreshToken = jwtService.generateRefreshToken(credential);

        // save token to DB
        tokenService.saveToken(Token.builder().email(credential.getEmail()).accessToken(accessToken).refreshToken(refreshToken).build());

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    public TokenResponse refresh(HttpServletRequest request) {
        // validate
        String refreshToken = request.getHeader("refresh-token");
        if (StringUtils.isBlank(refreshToken)) {
            throw new RuntimeException("Token must be not blank");
        }

        // extract credential from token
        final String email = jwtService.extractEmail(refreshToken, TokenType.REFRESH_TOKEN);

        // check credential with  DB
        Optional<Credential> credential = credentialRepository.findCredentialByEmail(email);

        if (!jwtService.isValidToken(refreshToken, credential.get(), TokenType.REFRESH_TOKEN)) {
            throw new RuntimeException("Token is invalid");
        }

        String accessToken = jwtService.generateAccessToken(credential.get());

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    public String logout(HttpServletRequest request) {
        // validate
        String refreshToken = request.getHeader("refresh-token");
        if (StringUtils.isBlank(refreshToken)) {
            throw new RuntimeException("Token must be not blank");
        }

        // extract credential from token
        final String email = jwtService.extractEmail(refreshToken, TokenType.REFRESH_TOKEN);
        log.info("email: {}", email);

        // check token in DB
        Optional<Token> currentToken = tokenRepository.findByEmail(email);

        // delete token
        tokenService.deleteToken(currentToken.get());

        return "Deleted!";
    }

//    @Override
//    public String forgotPassword(String email) {
//        // check email exist or not
//        Credential credential = userService.getCredentialByEmail(email);
//        // user is active or inactivated
//        if (!credential.isEnabled()) {
//            throw new RuntimeException("Credential is not active");
//        }
//        // generate reset token
//        String resetToken = jwtService.generateResetToken(credential);
//
//        // TODO send email confirm link
//        String confirmLink = String.format("""
//                curl --location 'http://localhost:8080/auth/reset-password' \\
//                --header 'accept: */*' \\
//                --header 'Content-Type: application/json' \\
//                --data '%s'""", resetToken);
//
//        log.info("confirm link: {}", confirmLink);
//        return "Sent";
//    }

    @Override
    public String forgotPassword(String email) {
        Credential credential = userService.getCredentialByEmail(email);
        if (!credential.isEnabled()) {
            throw new RuntimeException("Tài khoản của bạn chưa được kích hoạt");
        }
        String resetToken = jwtService.generateResetToken(credential);
        String confirmLink = String.format("http://localhost:9008/auth/reset-password?token=%s", resetToken);
        log.info("confirm link: {}", confirmLink);
        return "Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email.";
    }

    @Override
    public String resetPassword(String secretKey) {
        Credential credential = isValidUserByToken(secretKey);
        return "Reset";
    }

    @Override
    public String changePassword(ResetPasswordDTO request) {
        Credential credential = isValidUserByToken(request.getSecretKey());
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }
        credential.setPassword(passwordEncoder.encode(request.getPassword()));
        return "Changed";
    }

    @Override
    public UserResponse registration(RegistrationRequest registrationRequest) {
        credentialRepository.findCredentialByEmail(registrationRequest.getEmail())
                .ifPresent(credential -> {
                    throw new RuntimeException("Credential already exists");
                });

        Credential newCredential = Credential.builder()
                .email(registrationRequest.getEmail())
                .password(passwordEncoder.encode(registrationRequest.getPassword()))
                .role(UserRole.USER)
                .createAt(LocalDateTime.now())
                .updateAt(LocalDateTime.now())
                .build();

        Credential credential = credentialRepository.save(newCredential);

        log.info("credential created: {}", credential);

        RegisterUserRequest registerUserRequest = RegisterUserRequest.builder()
                .credentialId(credential.getId())
                .firstName(registrationRequest.getFirstName())
                .lastName(registrationRequest.getLastName())
                .country(registrationRequest.getCountry())
                .identityCardNumber(registrationRequest.getIdentityCardNumber())
                .phoneNumber(registrationRequest.getPhoneNumber())
                .build();

        log.info("RegisterUserRequest before sending: credentialId={}, firstName={}, lastName={}, phoneNumber={}, identityCardNumber={}, country={}",
                registerUserRequest.getCredentialId(),
                registerUserRequest.getFirstName(),
                registerUserRequest.getLastName(),
                registerUserRequest.getPhoneNumber(),
                registerUserRequest.getIdentityCardNumber(),
                registerUserRequest.getCountry());

        log.info("Sending registration request to data service: {}", registerUserRequest);
        var userResponse = userClient.registerUser(registerUserRequest);
        log.info("Received response from data service: {}", userResponse);

        if (userResponse.getCode() != 200) {
            throw new RuntimeException("Failed to register new user profile");
        }

        return userResponse.getData();
    }

    @Override
    public CredentialDTO createCredentialTest(CredentialDTO credentialDTO) {
        Credential credential = credentialMapper.toCredential(credentialDTO);
        credentialRepository.save(credential);
        return credentialMapper.toCredentialResponse(credential);
    }

    private Credential isValidUserByToken(String secretKey) {
        final String email = jwtService.extractEmail(secretKey, RESET_TOKEN);
        var credential = userService.getCredentialByEmail(email);
        if (!jwtService.isValidToken(secretKey, credential, RESET_TOKEN)) {
            throw new RuntimeException("Not allowed to access this token");
        }
        userService.saveUser(credential);
        return credential;
    }

    private Credential findCredentialByToken(String token) {
        String email = jwtService.extractEmail(token, ACCESS_TOKEN);
        Credential credential = userService.getCredentialByEmail(email);
        return null;
    }

    @Override
    public UserResponse getUserInfo(HttpServletRequest request) {
        // Lấy access token từ header
        String accessToken = request.getHeader("Authorization");

        if (StringUtils.isBlank(accessToken) || !accessToken.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid token");
        }

        // Loại bỏ prefix "Bearer "
        accessToken = accessToken.substring(7);

        // Trích xuất email từ token
        final String email = jwtService.extractEmail(accessToken, ACCESS_TOKEN);

        // Kiểm tra xem người dùng tồn tại hay không
        Credential credential = credentialRepository.findCredentialByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Kiểm tra token có hợp lệ không
        if (!jwtService.isValidToken(accessToken, credential, ACCESS_TOKEN)) {
            throw new RuntimeException("Token is validate or expire");
        }

        // Gọi đến service người dùng để lấy thông tin chi tiết
        var userInfo = userClient.getUser(credential.getId());

        if (userInfo.getCode() != 200) {
            throw new RuntimeException("Token is invalid!");
        }

        return userInfo.getData();
    }

    @Override
    public CredentialDTO getCredentialById(String credentialId) {
        Credential existedCredential = credentialRepository.findById(credentialId).orElseThrow(()->new RuntimeException("Credential not found"));
        return credentialMapper.toCredentialResponse(existedCredential);
    }
}
