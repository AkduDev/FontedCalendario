import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  templateUrl: './unauthorized.html',
  styleUrls: ['./unauthorized.css'],
  imports: [ButtonModule, CardModule],
})
export class Unauthorized {

  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }
}