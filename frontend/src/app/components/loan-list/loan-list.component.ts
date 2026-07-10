import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { LoanService } from '../../services/loan.service';
import { LoanApplication, LoanStatus } from '../../models/loan.model';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page">
      <div class="page-head">
        <div>
          <h1>Loan Applications</h1>
          <p class="muted">Review and decide on applications</p>
        </div>
        <a routerLink="/apply" class="btn btn-primary">+ New Application</a>
      </div>

      <div class="filters">
        <button class="chip" [class.active]="filter === 'ALL'" (click)="setFilter('ALL')">All</button>
        <button class="chip" [class.active]="filter === 'PENDING'" (click)="setFilter('PENDING')">Pending</button>
        <button class="chip" [class.active]="filter === 'APPROVED'" (click)="setFilter('APPROVED')">Approved</button>
        <button class="chip" [class.active]="filter === 'REJECTED'" (click)="setFilter('REJECTED')">Rejected</button>
      </div>

      <div *ngIf="loading" class="empty">Loading...</div>
      <div *ngIf="error" class="empty error">{{ error }}</div>

      <div class="loan-grid" *ngIf="!loading && loans.length > 0">
        <article class="loan-card" *ngFor="let loan of loans">
          <div class="loan-card-head">
            <div>
              <h3>{{ loan.applicantName }}</h3>
              <span class="muted small">{{ loan.email }}</span>
            </div>
            <span class="badge" [ngClass]="loan.status.toLowerCase()">{{ loan.status }}</span>
          </div>

          <div class="loan-meta">
            <div><span class="muted small">Amount</span><strong>{{ loan.loanAmount | currency }}</strong></div>
            <div><span class="muted small">Term</span><strong>{{ loan.loanTermMonths }} mo</strong></div>
            <div><span class="muted small">Credit</span><strong>{{ loan.creditScore }}</strong></div>
            <div><span class="muted small">Income</span><strong>{{ loan.annualIncome | currency }}</strong></div>
          </div>

          <p class="loan-purpose"><span class="muted small">Purpose:</span> {{ loan.loanPurpose }}</p>
          <p class="reason small">{{ loan.decisionReason }}</p>

          <div class="loan-actions">
            <button class="btn btn-success" (click)="approve(loan)"
                    [disabled]="loan.status === 'APPROVED'">Approve</button>
            <button class="btn btn-danger" (click)="reject(loan)"
                    [disabled]="loan.status === 'REJECTED'">Reject</button>
            <button class="btn btn-ghost" (click)="remove(loan)">Delete</button>
          </div>
        </article>
      </div>

      <div *ngIf="!loading && loans.length === 0 && !error" class="empty">
        No applications match this filter.
      </div>
    </section>
  `
})
export class LoanListComponent implements OnInit {
  loans: LoanApplication[] = [];
  filter: 'ALL' | LoanStatus = 'ALL';
  loading = true;
  error = '';

  constructor(private loanService: LoanService) {}

  ngOnInit(): void {
    this.load();
  }

  setFilter(filter: 'ALL' | LoanStatus): void {
    this.filter = filter;
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    const status = this.filter === 'ALL' ? undefined : this.filter;
    this.loanService.getAll(status).subscribe({
      next: (loans) => {
        this.loans = loans;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to reach the backend. Is Spring Boot running on port 8080?';
        this.loading = false;
      }
    });
  }

  approve(loan: LoanApplication): void {
    const reason = window.prompt('Approval note (optional):') ?? undefined;
    this.loanService.approve(loan.id, reason).subscribe({
      next: () => this.load()
    });
  }

  reject(loan: LoanApplication): void {
    const reason = window.prompt('Rejection reason (optional):') ?? undefined;
    this.loanService.reject(loan.id, reason).subscribe({
      next: () => this.load()
    });
  }

  remove(loan: LoanApplication): void {
    if (!window.confirm(`Delete application for ${loan.applicantName}?`)) {
      return;
    }
    this.loanService.delete(loan.id).subscribe({
      next: () => this.load()
    });
  }
}
