import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //private apiUrl = 'https://localhost:7071'; // URL de la API local
  private apiUrl = 'http://www.apichatgpt.somee.com'; // URL de la API en la nube
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public token$: Observable<string | null> = this.tokenSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    if (this.isBrowser()) {
      const token = localStorage.getItem('token');
      this.tokenSubject.next(token); // Establecer el token inicial
    }
  }

  // Método para registrar un nuevo usuario
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, userData);
  }

  // Método para iniciar sesión
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/Login`, credentials);
  }

  // Método para cerrar sesión
  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('token'); // Eliminar el token del almacenamiento local
      this.tokenSubject.next(null); // Notificar a los suscriptores que no hay token
      this.router.navigate(['/login']); // Redirigir al usuario a la página de inicio de sesión
    }
  }

  // Método para guardar el token en el almacenamiento local
  saveToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('token', token); // Guardar el token
      this.tokenSubject.next(token); // Notificar a los suscriptores del nuevo token
    }
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.tokenSubject.value !== null; // Retorna true si hay un token
  }

  // Método para verificar si estamos en el navegador
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
