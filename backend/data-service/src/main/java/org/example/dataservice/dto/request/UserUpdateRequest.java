package org.example.dataservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserUpdateRequest {
    @NotBlank(message = "first name is required")
    private String firstName;
    @NotBlank(message = "last name is required")
    private String lastName;
    @NotBlank(message = "phone number is required")
    private String phoneNumber;
    @NotBlank(message = "identity card number is required")
    private String identityCardNumber;
    @NotBlank(message = "country is required")
    private String country;
}
