import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <header class="topbar">
        <div class="brand">
          <span class="logo">LB</span>
          <span class="brand-text">LoanBridge</span>
        </div>
        <nav class="nav">
          <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/applications" routerLinkActive="active">Applications</a>
          <a routerLink="/apply" routerLinkActive="active" class="cta">New Application</a>
        </nav>
      </header>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
      <footer class="footer">
        <span>Loan Approval System &middot; Angular + Spring Boot</span>
      </footer>
    </div>
  `
})
export class AppComponent {}
