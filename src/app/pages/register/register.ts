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
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [CommonModule, ReactiveFormsModule, CardModule, PasswordModule, ButtonModule, InputTextModule, RouterLink, ToastModule],
})
export class Register {

  registerForm: FormGroup;
  loading: boolean = false;

  constructor(private fb: NonNullableFormBuilder, private router: Router, private authService: AuthService, private messageService: MessageService) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: (form: any) => this.passwordMatchValidator(form) });
  }

  passwordMatchValidator(form: FormGroup): any {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      this.loading = true;
      this.authService.register({ email, password }).subscribe({
        next: (response) => {
          console.log('Registro exitoso', response);
          this.loading = false;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario registrado correctamente. Ahora puedes iniciar sesión.' });
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (error) => {
          console.error('Error en registro', error);
          this.loading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al registrar usuario. Inténtalo de nuevo.' });
        }
      });
    }
  }
}
