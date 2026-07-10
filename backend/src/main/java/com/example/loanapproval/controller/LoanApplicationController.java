package com.example.loanapproval.controller;

import com.example.loanapproval.dto.DecisionRequest;
import com.example.loanapproval.dto.LoanApplicationRequest;
import com.example.loanapproval.dto.LoanStats;
import com.example.loanapproval.model.LoanApplication;
import com.example.loanapproval.model.LoanStatus;
import com.example.loanapproval.service.LoanApprovalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@CrossOrigin(origins = "*")
public class LoanApplicationController {

    private final LoanApprovalService service;

    public LoanApplicationController(LoanApprovalService service) {
        this.service = service;
    }

    @GetMapping
    public List<LoanApplication> getAll(@RequestParam(required = false) LoanStatus status) {
        if (status != null) {
            return service.getByStatus(status);
        }
        return service.getAll();
    }

    @GetMapping("/{id}")
    public LoanApplication getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/stats")
    public LoanStats getStats() {
        return service.getStats();
    }

    @PostMapping
    public ResponseEntity<LoanApplication> apply(@Valid @RequestBody LoanApplicationRequest request) {
        LoanApplication created = service.apply(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}/approve")
    public LoanApplication approve(@PathVariable Long id, @RequestBody(required = false) DecisionRequest request) {
        String reason = request != null ? request.getReason() : null;
        return service.approve(id, reason);
    }

    @PutMapping("/{id}/reject")
    public LoanApplication reject(@PathVariable Long id, @RequestBody(required = false) DecisionRequest request) {
        String reason = request != null ? request.getReason() : null;
        return service.reject(id, reason);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
