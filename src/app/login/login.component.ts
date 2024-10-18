import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  signUpData = { username: '', email: '', password: '', languageID: 1 }; // Datos para el registro
  signInData = { username: '', password: '' }; // Datos para el inicio de sesión
  loginFailed: boolean = false; // Variable para controlar el mensaje de error

  constructor(
    private router: Router, 
    private authService: AuthService,
    public notificationService: NotificationService
  ) {}

  ngAfterViewInit(): void {
    if (this.isBrowser()) {
      const signUpButton = document.getElementById('signUp');
      const signInButton = document.getElementById('signIn');
      const signInGhostButton = document.getElementById('signInGhost');
      const container = document.getElementById('container');

      // Manejo de eventos para los botones de registro e inicio de sesión
      signUpButton?.addEventListener('click', () => {
        container?.classList.add('right-panel-active'); // Cambiar a la vista de registro
      });

      signInButton?.addEventListener('click', () => {
        container?.classList.remove('right-panel-active'); // Cambiar a la vista de inicio de sesión
      });

      signInGhostButton?.addEventListener('click', () => {
        container?.classList.remove('right-panel-active'); // Volver a la vista de inicio de sesión
      });
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }

  register() {
    this.authService.register(this.signUpData).subscribe({
      next: (response) => {
        console.log('User registered successfully', response);
        // Mostrar mensaje de éxito usando NotificationService
        this.notificationService.showMessage('User registered successfully');
        // Cambia a la vista de inicio de sesión después del registro
        const container = document.getElementById('container');
        if (container) {
          container.classList.remove('right-panel-active'); // Cambiar a la vista de inicio de sesión
        }
      },
      error: (error) => {
        console.error('Error registering user', error);
        // Mostrar mensaje de error usando NotificationService
        this.notificationService.showMessage('Error registering user. Please try again.');
      }
    });
  }

  login() {
    this.authService.login(this.signInData).subscribe({
      next: (response) => {
        console.log('User logged in successfully', response);
        // Guardar el token recibido
        this.authService.saveToken(response.token);
        // Redirigir a la página principal después del inicio de sesión
        this.router.navigate(['/form']);
        // Mostrar mensaje de éxito usando NotificationService
        this.notificationService.showMessage('User logged in successfully');
      },
      error: (error) => {
        console.error('Error logging in', error);
        if (error.status === 401) {
          this.loginFailed = true; // Mostrar error de credenciales incorrectas
          this.notificationService.showMessage('Invalid credentials. Please check your username and password.');
        } else {
          this.loginFailed = false; // Restablecer el estado de error para otros errores
          this.notificationService.showMessage('Error logging in. Please try again.');
        }
      }
    });
  }
}
