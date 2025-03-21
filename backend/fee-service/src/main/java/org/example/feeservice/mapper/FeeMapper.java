package org.example.feeservice.mapper;

import org.example.feeservice.dto.request.FeeRequest;
import org.example.feeservice.dto.response.FeeResponse;
import org.example.feeservice.entity.Fee;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface FeeMapper {
    Fee toFee(FeeRequest feeRequest);
    FeeResponse toFeeResponse(Fee fee);
    void updateFee(FeeRequest feeRequest, @MappingTarget Fee fee);
}
