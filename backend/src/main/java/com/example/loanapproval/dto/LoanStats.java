package com.example.loanapproval.dto;

public class LoanStats {
    private long total;
    private long pending;
    private long approved;
    private long rejected;
    private double totalApprovedAmount;

    public LoanStats(long total, long pending, long approved, long rejected, double totalApprovedAmount) {
        this.total = total;
        this.pending = pending;
        this.approved = approved;
        this.rejected = rejected;
        this.totalApprovedAmount = totalApprovedAmount;
    }

    public long getTotal() {
        return total;
    }

    public long getPending() {
        return pending;
    }

    public long getApproved() {
        return approved;
    }

    public long getRejected() {
        return rejected;
    }

    public double getTotalApprovedAmount() {
        return totalApprovedAmount;
    }
}
