package com.example.loanapproval.service;

import com.example.loanapproval.dto.LoanApplicationRequest;
import com.example.loanapproval.dto.LoanStats;
import com.example.loanapproval.model.LoanApplication;
import com.example.loanapproval.model.LoanStatus;
import com.example.loanapproval.repository.LoanApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class LoanApprovalService {

    private final LoanApplicationRepository repository;

    public LoanApprovalService(LoanApplicationRepository repository) {
        this.repository = repository;
    }

    public List<LoanApplication> getAll() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    public List<LoanApplication> getByStatus(LoanStatus status) {
        return repository.findByStatusOrderByCreatedAtDesc(status);
    }

    public LoanApplication getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Loan application not found: " + id));
    }

    public LoanApplication apply(LoanApplicationRequest request) {
        LoanApplication loan = new LoanApplication();
        loan.setApplicantName(request.getApplicantName());
        loan.setEmail(request.getEmail());
        loan.setAge(request.getAge());
        loan.setAnnualIncome(request.getAnnualIncome());
        loan.setCreditScore(request.getCreditScore());
        loan.setLoanAmount(request.getLoanAmount());
        loan.setLoanTermMonths(request.getLoanTermMonths());
        loan.setLoanPurpose(request.getLoanPurpose());
        loan.setExistingMonthlyDebt(request.getExistingMonthlyDebt());

        evaluate(loan);
        return repository.save(loan);
    }

    /**
     * Automated underwriting rules. Sets status and decisionReason.
     * - Reject if credit score below 580.
     * - Compute debt-to-income (DTI) using estimated new monthly payment + existing debt.
     * - Approve if credit score >= 680 and DTI <= 40%.
     * - Reject if DTI > 50%.
     * - Otherwise leave PENDING for manual review.
     */
    public void evaluate(LoanApplication loan) {
        int creditScore = loan.getCreditScore();
        double monthlyIncome = loan.getAnnualIncome() / 12.0;
        double newMonthlyPayment = estimateMonthlyPayment(loan.getLoanAmount(), loan.getLoanTermMonths());
        double totalMonthlyDebt = newMonthlyPayment + loan.getExistingMonthlyDebt();
        double dti = monthlyIncome > 0 ? (totalMonthlyDebt / monthlyIncome) * 100.0 : 100.0;

        String dtiInfo = String.format("Estimated monthly payment $%.2f, DTI %.1f%%.", newMonthlyPayment, dti);

        if (creditScore < 580) {
            loan.setStatus(LoanStatus.REJECTED);
            loan.setDecisionReason("Auto-rejected: credit score below 580. " + dtiInfo);
            return;
        }

        if (dti > 50.0) {
            loan.setStatus(LoanStatus.REJECTED);
            loan.setDecisionReason("Auto-rejected: debt-to-income ratio exceeds 50%. " + dtiInfo);
            return;
        }

        if (creditScore >= 680 && dti <= 40.0) {
            loan.setStatus(LoanStatus.APPROVED);
            loan.setDecisionReason("Auto-approved: strong credit score and healthy DTI. " + dtiInfo);
            return;
        }

        loan.setStatus(LoanStatus.PENDING);
        loan.setDecisionReason("Pending manual review: borderline credit or DTI. " + dtiInfo);
    }

    /**
     * Standard amortized monthly payment assuming a fixed 8% annual interest rate.
     */
    private double estimateMonthlyPayment(double principal, int termMonths) {
        double annualRate = 0.08;
        double monthlyRate = annualRate / 12.0;
        if (monthlyRate == 0) {
            return principal / termMonths;
        }
        double factor = Math.pow(1 + monthlyRate, termMonths);
        return principal * (monthlyRate * factor) / (factor - 1);
    }

    public LoanApplication approve(Long id, String reason) {
        LoanApplication loan = getById(id);
        loan.setStatus(LoanStatus.APPROVED);
        loan.setDecisionReason(reason != null && !reason.isBlank()
                ? "Manually approved: " + reason
                : "Manually approved by loan officer.");
        return repository.save(loan);
    }

    public LoanApplication reject(Long id, String reason) {
        LoanApplication loan = getById(id);
        loan.setStatus(LoanStatus.REJECTED);
        loan.setDecisionReason(reason != null && !reason.isBlank()
                ? "Manually rejected: " + reason
                : "Manually rejected by loan officer.");
        return repository.save(loan);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new NoSuchElementException("Loan application not found: " + id);
        }
        repository.deleteById(id);
    }

    public LoanStats getStats() {
        List<LoanApplication> all = repository.findAll();
        long pending = all.stream().filter(l -> l.getStatus() == LoanStatus.PENDING).count();
        long approved = all.stream().filter(l -> l.getStatus() == LoanStatus.APPROVED).count();
        long rejected = all.stream().filter(l -> l.getStatus() == LoanStatus.REJECTED).count();
        double totalApprovedAmount = all.stream()
                .filter(l -> l.getStatus() == LoanStatus.APPROVED)
                .mapToDouble(LoanApplication::getLoanAmount)
                .sum();
        return new LoanStats(all.size(), pending, approved, rejected, totalApprovedAmount);
    }
}
