import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

// Guard que controla la visibilidad del Navbar y la autenticación del usuario
export const navbarGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si el usuario está autenticado
  if (!authService.isAuthenticated()) {
    // Redirigir al usuario a la ruta /form si no está autenticado
    router.navigate(['/form']);
    return false;
  }

  // Permitir la navegación
  return true;
};
