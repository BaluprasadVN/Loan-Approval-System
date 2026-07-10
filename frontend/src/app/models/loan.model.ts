export type LoanStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LoanApplication {
  id: number;
  applicantName: string;
  email: string;
  age: number;
  annualIncome: number;
  creditScore: number;
  loanAmount: number;
  loanTermMonths: number;
  loanPurpose: string;
  existingMonthlyDebt: number;
  status: LoanStatus;
  decisionReason: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoanApplicationRequest {
  applicantName: string;
  email: string;
  age: number | null;
  annualIncome: number | null;
  creditScore: number | null;
  loanAmount: number | null;
  loanTermMonths: number | null;
  loanPurpose: string;
  existingMonthlyDebt: number | null;
}

export interface LoanStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  totalApprovedAmount: number;
}
