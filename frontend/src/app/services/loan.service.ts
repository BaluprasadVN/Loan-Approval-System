import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  LoanApplication,
  LoanApplicationRequest,
  LoanStats,
  LoanStatus
} from '../models/loan.model';

@Injectable({ providedIn: 'root' })
export class LoanService {
  private readonly baseUrl = 'http://localhost:8081/api/loans';

  constructor(private http: HttpClient) {}

  getAll(status?: LoanStatus): Observable<LoanApplication[]> {
    const url = status ? `${this.baseUrl}?status=${status}` : this.baseUrl;
    return this.http.get<LoanApplication[]>(url);
  }

  getById(id: number): Observable<LoanApplication> {
    return this.http.get<LoanApplication>(`${this.baseUrl}/${id}`);
  }

  getStats(): Observable<LoanStats> {
    return this.http.get<LoanStats>(`${this.baseUrl}/stats`);
  }

  apply(request: LoanApplicationRequest): Observable<LoanApplication> {
    return this.http.post<LoanApplication>(this.baseUrl, request);
  }

  approve(id: number, reason?: string): Observable<LoanApplication> {
    return this.http.put<LoanApplication>(`${this.baseUrl}/${id}/approve`, { reason });
  }

  reject(id: number, reason?: string): Observable<LoanApplication> {
    return this.http.put<LoanApplication>(`${this.baseUrl}/${id}/reject`, { reason });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
