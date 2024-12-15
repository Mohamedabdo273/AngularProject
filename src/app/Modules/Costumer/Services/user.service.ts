import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { Router } from '@angular/router'; // Import Router for navigation

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  private apiUrl = 'http://localhost:9000/api/users';
  private isLoggedSub = new BehaviorSubject<boolean>(this.isLogged);
  private tokenExpirationTimer: any; // To hold the interval timer for token expiration checks

  constructor(private http: HttpClient, private router: Router) {
    this.startTokenExpirationCheck();
  }

  // Decode and check token expiration
  private isTokenExpired(token: string): boolean {
    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      const expirationTime = decodedToken.exp ? decodedToken.exp * 1000 : 0; // Convert to milliseconds
      return Date.now() > expirationTime;
    } catch (err) {
      console.error('Failed to decode token:', err);
      return true; // If there's an issue decoding the token, treat it as expired
    }
  }

  // Add token to headers
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token && this.isTokenExpired(token)) {
      this.logout(); // Token expired, log the user out
      throw new Error('Token expired');
    }
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // Register a new user
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // Login
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          // Save the token in localStorage for authentication
          localStorage.setItem('token', response.token);
  
          // Update the user's login status
          this.isLoggedSub.next(true);
  
          // Start the token's expiration time func.
          this.startTokenExpirationCheck();
        }
      })
    );
  }
  get getRole(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode the token to extract the role
        const decodedToken: any = jwtDecode(token);
        
        return decodedToken.role; // Return the role from the decoded token
      } catch (error) {
        console.error('Error decoding token:', error);
        return null; // Return null if decoding fails
      }
    }
    return null; // Return null if no token is found
  }
  get getUserEmail(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode the token to extract the user's name
        const decodedToken: any = jwtDecode(token);
  
        return decodedToken.email || null; // Return the name from the decoded token, or null if not found
      } catch (error) {
        console.error('Error decoding token:', error);
        return null; // Return null if decoding fails
      }
    }
    return null; // Return null if no token is found
  }
  
  
  

  // Logout and redirect to login
  logout(): void {
    localStorage.removeItem('token');
    this.isLoggedSub.next(false); // Update login status
    this.stopTokenExpirationCheck(); // Stop the expiration check when logged out
    this.router.navigate(['/login']); // Redirect to the login page
  }

  // Check if the user is logged in
  get isLogged(): boolean {
    const token = localStorage.getItem('token');
    if (token && this.isTokenExpired(token)) {
      this.logout(); // Automatically logout if token is expired
      return false;
    }
    return !!token;
  }

  // User status observable (login or not)
  userStatus(): BehaviorSubject<boolean> {
    return this.isLoggedSub;
  }

  // Start checking for token expiration every 60 seconds
  private startTokenExpirationCheck(): void {
    this.tokenExpirationTimer = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token && this.isTokenExpired(token)) {
        this.logout(); // Automatically logout if token is expired
        this.showTokenExpiredAlert(); // Show alert when token is expired
      }
    }, 60000); // Check every 60 seconds
  }

  // Stop checking for token expiration when logged out
  private stopTokenExpirationCheck(): void {
    if (this.tokenExpirationTimer) {
      clearInterval(this.tokenExpirationTimer);
    }
  }

  // Show SweetAlert when token expires
  private showTokenExpiredAlert(): void {
    Swal.fire({
      title: 'Session Expired',
      text: 'Your session has expired. Please login again.',
      icon: 'error',
      confirmButtonText: 'OK',
    }).then(() => {
      // Optionally redirect to login page after closing the alert
      this.router.navigate(['/login']); // Redirect to login page
    });
  }

  ngOnDestroy(): void {
    this.stopTokenExpirationCheck(); // Clean up when the service is destroyed
  }
}
