import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const accessGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  return true;
};
