package com.example.loanapproval.repository;

import com.example.loanapproval.model.LoanApplication;
import com.example.loanapproval.model.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {
    List<LoanApplication> findByStatusOrderByCreatedAtDesc(LoanStatus status);
    List<LoanApplication> findAllByOrderByCreatedAtDesc();
}
