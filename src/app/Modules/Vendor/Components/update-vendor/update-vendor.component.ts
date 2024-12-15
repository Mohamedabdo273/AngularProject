import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Vendors } from '../../../../Models/vendors';
import { VendorService } from '../../Services/vendor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-update-vendor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './update-vendor.component.html',
  styleUrl: './update-vendor.component.scss'
})
export class UpdateVendorComponent implements OnInit {
  vendor: Vendors | null = null;
  updateVendorForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vendorService: VendorService,
    private location: Location,
    private fb: FormBuilder
  ) {
    this.updateVendorForm = this.fb.group({
      Name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['',],
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      console.log(token);
      // Fetch the vendor data if the ID exists
      this.vendorService.getVendorById(token).subscribe({
        next: (data: Vendors) => {
          this.vendor = data; // Assign the fetched data to the vendor property
          console.log(this.vendor);
          console.log(data)
          // Patch the form with the fetched vendor data
          if (this.vendor) {
            this.updateVendorForm.patchValue({
              Name: this.vendor.Name,
              email: this.vendor.email,
              phoneNumber: this.vendor.phoneNumber,
            });
          }
        },
        error: (err) => {
          console.error('Error fetching vendor details:', err);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.updateVendorForm.valid) {
      const updatedVendor: Vendors = {
        ...this.vendor,
        ...this.updateVendorForm.value
      };

      const token = localStorage.getItem('token');
      if (token && this.vendor?._id) {
        this.vendorService.updateVendor(token, updatedVendor).subscribe({
          next: (data) => {
            console.log('Updated successfully:', data);
            this.router.navigate(['/vendor']);
          },
          error: (err) => {
            console.error('Error updating vendor:', err);
          }
        });
      } else {
        console.error('Token not found or vendor ID is missing');
      }
    } else {
      console.error('Form is invalid');
    }
  }
}
