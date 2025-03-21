package org.example.feeservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.feeservice.dto.request.FeeRequest;
import org.example.feeservice.dto.response.FeeResponse;
import org.example.feeservice.service.FeeService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fees")
@RequiredArgsConstructor
public class FeeController {
    private final FeeService feeService;

    @PostMapping("/add")
    public FeeResponse addFee(@RequestBody FeeRequest feeRequest) {
        return feeService.createFee(feeRequest);
    }

    @GetMapping("/{id}")
    public FeeResponse getFee(@PathVariable Long id) {
        return feeService.getFeeById(id);
    }

    @PutMapping("/{id}")
    public FeeResponse updateFee(@PathVariable Long id, @RequestBody FeeRequest feeRequest) {
        return feeService.updateFee(id, feeRequest);
    }

    @DeleteMapping("/{id}")
    public String deleteFee(@PathVariable Long id) {
        feeService.deleteFee(id);
        return "Deleted!";
    }
}
