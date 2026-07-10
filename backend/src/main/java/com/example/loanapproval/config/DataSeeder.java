package com.example.loanapproval.config;

import com.example.loanapproval.dto.LoanApplicationRequest;
import com.example.loanapproval.repository.LoanApplicationRepository;
import com.example.loanapproval.service.LoanApprovalService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final LoanApprovalService service;
    private final LoanApplicationRepository repository;

    public DataSeeder(LoanApprovalService service, LoanApplicationRepository repository) {
        this.service = service;
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) {
            return;
        }

        service.apply(build("Alice Johnson", "alice@example.com", 34, 95000, 760,
                25000, 48, "Car purchase", 300));
        service.apply(build("Bob Smith", "bob@example.com", 45, 42000, 610,
                30000, 60, "Home renovation", 1200));
        service.apply(build("Carol Davis", "carol@example.com", 29, 30000, 540,
                20000, 36, "Debt consolidation", 900));
        service.apply(build("David Lee", "david@example.com", 51, 120000, 700,
                15000, 24, "Business expansion", 500));
    }

    private LoanApplicationRequest build(String name, String email, int age, double income,
                                         int creditScore, double amount, int term,
                                         String purpose, double existingDebt) {
        LoanApplicationRequest r = new LoanApplicationRequest();
        r.setApplicantName(name);
        r.setEmail(email);
        r.setAge(age);
        r.setAnnualIncome(income);
        r.setCreditScore(creditScore);
        r.setLoanAmount(amount);
        r.setLoanTermMonths(term);
        r.setLoanPurpose(purpose);
        r.setExistingMonthlyDebt(existingDebt);
        return r;
    }
}
