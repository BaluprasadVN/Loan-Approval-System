# Loan Approval System

A full-stack loan approval application with an **Angular** frontend and a **Spring Boot** backend.
Applicants submit loan requests that are automatically underwritten by a rules engine, and loan
officers can manually approve, reject, or delete applications from a dashboard.

## Features

- Submit loan applications with validation (name, income, credit score, amount, term, etc.)
- Automated underwriting on submission:
  - Rejects credit scores below 580.
  - Computes an amortized monthly payment (8% APR) and debt-to-income (DTI) ratio.
  - Auto-approves strong applications (credit >= 680 and DTI <= 40%).
  - Auto-rejects DTI > 50%.
  - Flags borderline cases as **Pending** for manual review.
- Loan officer actions: manual **Approve** / **Reject** (with optional notes) and **Delete**.
- Dashboard with live stats (total, pending, approved, rejected, approved volume).
- Filterable applications list.
- In-memory H2 database seeded with sample applications on startup.

## Tech Stack

- **Frontend:** Angular 17 (standalone components), TypeScript, RxJS, plain CSS.
- **Backend:** Spring Boot 3.3, Spring Web, Spring Data JPA, Hibernate Validator, H2.
- **Java:** 17

## Project Structure

```
loan-approval-system/
  backend/    Spring Boot REST API
  frontend/   Angular single-page app
```

## Prerequisites

- Java 17+ and Maven 3.9+
- Node.js 18+ and npm

## Running the Backend

```bash
cd backend
mvn spring-boot:run
```

- API base URL: `http://localhost:8080/api/loans`
- H2 console: `http://localhost:8080/h2-console` (JDBC URL `jdbc:h2:mem:loandb`, user `sa`, no password)

## Running the Frontend

```bash
cd frontend
npm install
npm start
```

- App runs at `http://localhost:4200` and talks to the backend on port 8080.

## API Endpoints

| Method | Path                       | Description                          |
|--------|----------------------------|--------------------------------------|
| GET    | `/api/loans`               | List all applications (`?status=`)   |
| GET    | `/api/loans/{id}`          | Get a single application             |
| GET    | `/api/loans/stats`         | Aggregate statistics                 |
| POST   | `/api/loans`               | Submit a new application             |
| PUT    | `/api/loans/{id}/approve`  | Manually approve (optional `reason`) |
| PUT    | `/api/loans/{id}/reject`   | Manually reject (optional `reason`)  |
| DELETE | `/api/loans/{id}`          | Delete an application                |

## Notes

- The H2 database is in-memory, so data resets on each backend restart (sample data is re-seeded).
- To persist data, switch the datasource in `backend/src/main/resources/application.properties`
  to a file-based H2 URL or another database.
