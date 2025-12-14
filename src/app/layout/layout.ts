import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  routerLink?: string;
  command?: () => void;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.html',
  styleUrls: ['./layout.css'],
  imports: [RouterOutlet, CommonModule, RouterLink, ButtonModule, InputTextModule],
})
export class Layout {

  sidebarVisible = false;

  themeMenuVisible = false;

  menuItems: MenuItem[] = [
    {
      label: 'Eventos',
      icon: 'pi pi-calendar',
      routerLink: '/app/events'
    },
    {
      label: 'Cerrar Sesión',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];

  availableThemes = [
    { name: 'Aura Dark', color: '#1f2937' },
    { name: 'Aura Light', color: '#ffffff' },
    { name: 'Sakai Blue', color: '#3b82f6' },
    { name: 'Sakai Green', color: '#10b981' },
    { name: 'Sakai Purple', color: '#8b5cf6' },
    { name: 'Sakai Orange', color: '#f59e0b' }
  ];

  selectedTheme = 'Aura Dark';

  constructor(private router: Router, private authService: AuthService) {}

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  toggleThemeMenu() {
    this.themeMenuVisible = !this.themeMenuVisible;
  }

  selectTheme(theme: any) {
    this.selectedTheme = theme.name;
    this.themeMenuVisible = false;
    alert(`Tema seleccionado: ${theme.name}`);
    // Nota: Implementación completa requeriría cambiar el preset de PrimeNG dinámicamente
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}