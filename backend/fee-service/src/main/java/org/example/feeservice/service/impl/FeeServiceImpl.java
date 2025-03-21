package org.example.feeservice.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.feeservice.dto.request.FeeRequest;
import org.example.feeservice.dto.response.FeeResponse;
import org.example.feeservice.entity.Fee;
import org.example.feeservice.mapper.FeeMapper;
import org.example.feeservice.repository.FeeRepository;
import org.example.feeservice.service.FeeService;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class FeeServiceImpl implements FeeService {
    private final FeeRepository feeRepository;
    private final FeeMapper feeMapper;

    @Override
    public FeeResponse createFee(FeeRequest feeRequest) {
        Fee newFee = feeMapper.toFee(feeRequest);
        Fee fee = feeRepository.save(newFee);
        return feeMapper.toFeeResponse(fee);
    }

    @Override
    public FeeResponse getFeeById(Long id) {
        Fee existedFee = feeRepository.findById(id).orElseThrow(()->new RuntimeException("fee not found"));
        return feeMapper.toFeeResponse(existedFee);
    }

    @Override
    public FeeResponse updateFee(Long id, FeeRequest feeRequest) {
        Fee existedFee = feeRepository.findById(id).orElseThrow(()->new RuntimeException("fee not found"));
        feeMapper.updateFee(feeRequest, existedFee);
        feeRepository.save(existedFee);
        return feeMapper.toFeeResponse(existedFee);
    }

    @Override
    public void deleteFee(Long id) {
        feeRepository.deleteById(id);
    }
}
