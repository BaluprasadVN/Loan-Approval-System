import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { LoanService } from '../../services/loan.service';
import { LoanApplication, LoanStats } from '../../models/loan.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page">
      <div class="page-head">
        <div>
          <h1>Dashboard</h1>
          <p class="muted">Overview of all loan applications</p>
        </div>
        <a routerLink="/apply" class="btn btn-primary">+ New Application</a>
      </div>

      <div class="stat-grid" *ngIf="stats">
        <div class="stat-card">
          <span class="stat-label">Total</span>
          <span class="stat-value">{{ stats.total }}</span>
        </div>
        <div class="stat-card pending">
          <span class="stat-label">Pending</span>
          <span class="stat-value">{{ stats.pending }}</span>
        </div>
        <div class="stat-card approved">
          <span class="stat-label">Approved</span>
          <span class="stat-value">{{ stats.approved }}</span>
        </div>
        <div class="stat-card rejected">
          <span class="stat-label">Rejected</span>
          <span class="stat-value">{{ stats.rejected }}</span>
        </div>
        <div class="stat-card amount">
          <span class="stat-label">Approved Volume</span>
          <span class="stat-value">{{ stats.totalApprovedAmount | currency }}</span>
        </div>
      </div>

      <div class="card">
        <div class="card-head">
          <h2>Recent applications</h2>
          <a routerLink="/applications" class="link">View all</a>
        </div>

        <div *ngIf="loading" class="empty">Loading...</div>
        <div *ngIf="error" class="empty error">{{ error }}</div>

        <table *ngIf="!loading && recent.length > 0" class="table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Amount</th>
              <th>Credit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let loan of recent">
              <td>
                <div class="cell-main">{{ loan.applicantName }}</div>
                <div class="cell-sub">{{ loan.loanPurpose }}</div>
              </td>
              <td>{{ loan.loanAmount | currency }}</td>
              <td>{{ loan.creditScore }}</td>
              <td><span class="badge" [ngClass]="loan.status.toLowerCase()">{{ loan.status }}</span></td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="!loading && recent.length === 0 && !error" class="empty">
          No applications yet.
        </div>
      </div>
    </section>
  `
})
export class DashboardComponent implements OnInit {
  stats?: LoanStats;
  recent: LoanApplication[] = [];
  loading = true;
  error = '';

  constructor(private loanService: LoanService) {}

  ngOnInit(): void {
    this.loanService.getStats().subscribe({
      next: (s) => (this.stats = s),
      error: () => (this.error = 'Unable to reach the backend. Is Spring Boot running on port 8080?')
    });

    this.loanService.getAll().subscribe({
      next: (loans) => {
        this.recent = loans.slice(0, 5);
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to reach the backend. Is Spring Boot running on port 8080?';
        this.loading = false;
      }
    });
  }
}
