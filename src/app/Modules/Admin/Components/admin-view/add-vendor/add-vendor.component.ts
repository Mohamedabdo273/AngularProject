import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule ,Location } from '@angular/common';
import { AdminServicesService } from '../../../services/admin-services.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-vendor',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], // Import ReactiveFormsModule and CommonModule
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.scss']
})
export class AddVendorComponent implements OnInit {

 
  
  vendorForm!: FormGroup;

  constructor(private fb: FormBuilder, private adminService: AdminServicesService , private router: Router ,private location : Location) {}

  ngOnInit(): void {
    // Initialize the Reactive Form
    this.vendorForm = this.fb.group({
      Name: ['', Validators.required], // Name is required
      email: ['', [Validators.required, Validators.email]], // Email with validation
      phoneNumber: ['', Validators.required], // Phone number is required
      address: ['', Validators.required], // Address is required
      role: ['', Validators.required], // Role is required
      password: ['', [Validators.required, Validators.minLength(6)]] // Password minimum 6 characters
    });
  }

  onSubmit(): void {
    if (this.vendorForm.valid) {
      const token = localStorage.getItem('token'); // Retrieve the token for authentication
      if (token) {
        this.adminService.addVendor(token, this.vendorForm.value).subscribe(
          () => {
            Swal.fire('Success', 'Vendor added successfully!', 'success');
            this.vendorForm.reset(); // Reset the form after successful submission
            this.router.navigate(['/admin']);
          },
          (error) => {
            const errorMsg = error?.error?.message || 'Failed to add vendor. Try again later.';
            Swal.fire('Error', errorMsg, 'error');
          }
        );
      } else {
        Swal.fire('Error', 'Authorization token is missing.', 'error');
      }
    }
  }
  back(){
    this.location.back()
  }
}
