import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../Services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../Services/user.service';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginData = {
    email: '',
    password: '',
  };
  responseMessage: string = '';
  isUserLogged: boolean = false;

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {}

  login(): void {
    this.userService.login(this.loginData).subscribe(
      (response) => {
        // Store the token in localStorage
        localStorage.setItem('token', response.token);

        // Decode the JWT to get the user's role
        const decodedToken: any = jwtDecode(response.token);
        const role = decodedToken.role; // Ensure your backend includes 'role' in the token

        // Check the role and navigate to the appropriate view
        if (role === 'admin') {
          this.router.navigate(['/home']);
        } else if (role === 'customer') {
          this.router.navigate(['/home']);
        } else if (role === 'vendor') {
          this.router.navigate(['/home']);
        } else {
          Swal.fire('Access Denied', 'Role not recognized!', 'error');
        }

        // Show success message
        Swal.fire('Login Successful', 'You are now logged in!', 'success');
      },
      (error) => {
        // Handle login error
        this.responseMessage = 'Login failed: ' + error.error.message;
        const errorMsg = error?.error?.message || 'An unexpected error occurred.';
        Swal.fire('Login Failed', errorMsg, 'error');
      }
    );
  }
}
