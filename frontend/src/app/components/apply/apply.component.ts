import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { LoanService } from '../../services/loan.service';
import { LoanApplication, LoanApplicationRequest } from '../../models/loan.model';

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page narrow">
      <div class="page-head">
        <div>
          <h1>New Loan Application</h1>
          <p class="muted">Fill in the applicant and loan details for instant assessment</p>
        </div>
      </div>

      <div class="card" *ngIf="!result">
        <form #form="ngForm" (ngSubmit)="submit(form)" class="form">
          <div class="form-grid">
            <label class="field">
              <span>Applicant name</span>
              <input name="applicantName" [(ngModel)]="model.applicantName" required />
            </label>
            <label class="field">
              <span>Email</span>
              <input name="email" type="email" [(ngModel)]="model.email" required email />
            </label>
            <label class="field">
              <span>Age</span>
              <input name="age" type="number" [(ngModel)]="model.age" required min="18" max="100" />
            </label>
            <label class="field">
              <span>Annual income ($)</span>
              <input name="annualIncome" type="number" [(ngModel)]="model.annualIncome" required min="1" />
            </label>
            <label class="field">
              <span>Credit score (300-850)</span>
              <input name="creditScore" type="number" [(ngModel)]="model.creditScore" required min="300" max="850" />
            </label>
            <label class="field">
              <span>Loan amount ($)</span>
              <input name="loanAmount" type="number" [(ngModel)]="model.loanAmount" required min="1" />
            </label>
            <label class="field">
              <span>Loan term (months)</span>
              <input name="loanTermMonths" type="number" [(ngModel)]="model.loanTermMonths" required min="6" max="360" />
            </label>
            <label class="field">
              <span>Existing monthly debt ($)</span>
              <input name="existingMonthlyDebt" type="number" [(ngModel)]="model.existingMonthlyDebt" required min="0" />
            </label>
            <label class="field full">
              <span>Loan purpose</span>
              <input name="loanPurpose" [(ngModel)]="model.loanPurpose" required />
            </label>
          </div>

          <div *ngIf="error" class="alert error">{{ error }}</div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" [disabled]="submitting || form.invalid">
              {{ submitting ? 'Submitting...' : 'Submit application' }}
            </button>
          </div>
        </form>
      </div>

      <div class="card result" *ngIf="result">
        <div class="result-head">
          <span class="badge big" [ngClass]="result.status.toLowerCase()">{{ result.status }}</span>
          <h2>{{ result.applicantName }}</h2>
        </div>
        <p class="reason">{{ result.decisionReason }}</p>
        <dl class="result-grid">
          <div><dt>Amount</dt><dd>{{ result.loanAmount | currency }}</dd></div>
          <div><dt>Term</dt><dd>{{ result.loanTermMonths }} months</dd></div>
          <div><dt>Credit score</dt><dd>{{ result.creditScore }}</dd></div>
          <div><dt>Annual income</dt><dd>{{ result.annualIncome | currency }}</dd></div>
        </dl>
        <div class="form-actions">
          <button class="btn" (click)="reset()">Submit another</button>
          <button class="btn btn-primary" (click)="goToList()">View all applications</button>
        </div>
      </div>
    </section>
  `
})
export class ApplyComponent {
  model: LoanApplicationRequest = this.emptyModel();
  submitting = false;
  error = '';
  result?: LoanApplication;

  constructor(private loanService: LoanService, private router: Router) {}

  submit(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    this.submitting = true;
    this.error = '';
    this.loanService.apply(this.model).subscribe({
      next: (created) => {
        this.result = created;
        this.submitting = false;
      },
      error: (err) => {
        this.error = err?.error?.error
          ? 'Validation failed. Please review the fields.'
          : 'Unable to submit. Is the backend running on port 8080?';
        this.submitting = false;
      }
    });
  }

  reset(): void {
    this.model = this.emptyModel();
    this.result = undefined;
  }

  goToList(): void {
    this.router.navigate(['/applications']);
  }

  private emptyModel(): LoanApplicationRequest {
    return {
      applicantName: '',
      email: '',
      age: null,
      annualIncome: null,
      creditScore: null,
      loanAmount: null,
      loanTermMonths: null,
      loanPurpose: '',
      existingMonthlyDebt: null
    };
  }
}
