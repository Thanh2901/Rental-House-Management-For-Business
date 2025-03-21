package org.example.feeservice.service;

import org.example.feeservice.dto.request.FeeRequest;
import org.example.feeservice.dto.response.FeeResponse;

public interface FeeService {
    FeeResponse createFee(FeeRequest feeRequest);
    FeeResponse getFeeById(Long id);
    FeeResponse updateFee(Long id, FeeRequest feeRequest);
    void deleteFee(Long id);
}
