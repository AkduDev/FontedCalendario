import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): Record<string, string> {
    const token = sessionStorage.getItem('authToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // Método genérico para GET
  get(endpoint: string): Observable<any> {
    console.log('GET to:', `${this.apiUrl}/${endpoint}`);
    return this.http.get(`${this.apiUrl}/${endpoint}`, { headers: this.getAuthHeaders() }).pipe(
      timeout(10000), // 10 seconds timeout
      catchError(this.handleError)
    );
  }

  // Método genérico para POST
  post(endpoint: string, data: any): Observable<any> {
    console.log('POST to:', `${this.apiUrl}/${endpoint}`, 'Data:', data);
    return this.http.post(`${this.apiUrl}/${endpoint}`, data, { headers: this.getAuthHeaders() }).pipe(
      timeout(10000), // 10 seconds timeout
      catchError(this.handleError)
    );
  }

  // Método genérico para PUT
  put(endpoint: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${endpoint}`, data, { headers: this.getAuthHeaders() }).pipe(
      timeout(10000),
      catchError(this.handleError)
    );
  }

  // Método genérico para DELETE
  delete(endpoint: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${endpoint}`, { headers: this.getAuthHeaders() }).pipe(
      timeout(10000),
      catchError(this.handleError)
    );
  }

  // Método específico para login
  login(credentials: { email: string, password: string }): Observable<any> {
    return this.post('identity/login', credentials);
  }

  // Método específico para registro
  register(userData: { email: string, password: string }): Observable<any> {
    return this.post('identity/custom-register', userData);
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    console.error('Full error:', error);
    let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
      if (error.error && error.error.detail) {
        errorMessage += `\nDetalle: ${error.error.detail}`;
      }
    }
    console.error('Error message:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}