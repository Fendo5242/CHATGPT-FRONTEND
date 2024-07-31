import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Guard que controla la visibilidad del Navbar
export const navbarGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  // Aquí puedes definir las rutas en las que no deseas mostrar el navbar
  const restrictedRoutes = ['/login'];

  // Retorna verdadero si la URL actual no está en las rutas restringidas
  return !restrictedRoutes.includes(state.url);
};
