import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule], // Asegúrate de importar RouterModule aquí
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  menuActive = false;

  constructor(private authService: AuthService) {}

  toggleMenu() {
    this.menuActive = !this.menuActive;
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated(); // Verifica si el usuario está autenticado
  }

  logout() {
    this.authService.logout(); // Llama al método logout del servicio
  }
}
