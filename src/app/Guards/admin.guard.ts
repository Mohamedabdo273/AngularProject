import { Component, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userRole = this.getUserRoleFromToken(token);
        if (userRole === 'admin') {
          return true; // Grant access if the user role is admin
        } else {
          console.warn('Access denied: User is not an admin');
          this.router.navigate(['/home']); // Redirect non-admin users to home
          return false;
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        this.router.navigate(['/login']); // Redirect to login on error
        return false;
      }
    } else {
      console.warn('No token found. Redirecting to login...');
      this.router.navigate(['/login']); // Redirect to login if no token
      return false;
    }
  }

  private getUserRoleFromToken(token: string): string {
    try {
      const decodedToken: any = jwt_decode(token); // Decode the token using jwt-decode
      return decodedToken?.role || ''; // Extract the role
    } catch (error) {
      console.error('Failed to decode token:', error);
      throw new Error('Invalid token format');
    }
  }
  
  
}
function jwt_decode(token: string): any {
  throw new Error('Function not implemented.');
}

