import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'authToken';

  constructor(private apiService: ApiService) { }

  login(credentials: { email: string, password: string }): Observable<any> {
    const loginData = {
      email: credentials.email,
      password: credentials.password,
      twoFactorCode: "",
      twoFactorRecoveryCode: ""
    };
    return this.apiService.login(loginData).pipe(
      tap(response => {
        if (response && response.accessToken) {
          sessionStorage.setItem(this.tokenKey, response.accessToken);
        }
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem(this.tokenKey);
  }

  register(userData: { email: string, password: string }): Observable<any> {
    return this.apiService.register(userData).pipe(
      tap(response => {
        console.log('Registro exitoso', response);
      })
    );
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }
}