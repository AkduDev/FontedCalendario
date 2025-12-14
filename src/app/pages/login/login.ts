import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [CommonModule, ReactiveFormsModule, CardModule, PasswordModule, ButtonModule, InputTextModule, RouterLink, ToastModule],
})
export class Login{

  loginForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private fb: NonNullableFormBuilder, private router: Router, private authService: AuthService, private messageService: MessageService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.errorMessage = '';
      this.loading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login exitoso', response);
          this.loading = false;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Usuario ${this.loginForm.value.email} se ha iniciado correctamente.` });
          setTimeout(() => this.router.navigate(['/dashboard']), 1500); // Delay to show message
        },
        error: (error) => {
          console.error('Error en login', error);
          this.loading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Usuario o contraseña incorrecto.' });
        }
      });
    }
  }
}