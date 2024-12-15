import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLogged = !!localStorage.getItem('token');
  if(isLogged)
    return true;
  else
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
