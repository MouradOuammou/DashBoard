import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private readonly AUTH_KEY = 'isAuthenticated';

  // Identifiants de test
  private readonly TEST_USER = {
    username: 'admin',
    password: '123'
  };

  constructor(private router: Router) {
    this.isAuthenticated = localStorage.getItem(this.AUTH_KEY) === 'true';
  }

  login(username: string, password: string): boolean {
    if (username === this.TEST_USER.username && password === this.TEST_USER.password) {
      this.isAuthenticated = true;
      localStorage.setItem(this.AUTH_KEY, 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    this.isAuthenticated = false;
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']); 
    console.log('User logged out successfully');
  }
  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
}
