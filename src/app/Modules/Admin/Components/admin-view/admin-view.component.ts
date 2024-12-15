import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminServicesService } from '../../services/admin-services.service';
import { Vendors } from '../../../../Models/vendors';
import { VendorResponse } from '../../../../Models/vendor-response';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2'; // Import SweetAlert for confirmation dialogs

@Component({
  selector: 'app-admin-view',
  standalone: true,
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.scss'],
  imports: [CommonModule, RouterModule],
})
export class AdminViewComponent implements OnInit {
  vendors: Vendors[] = [];
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private adminServices: AdminServicesService) {}

  ngOnInit(): void {
    this.fetchVendors();
  }

  fetchVendors(): void {
    this.loading = true;
    const token = localStorage.getItem('token');

    if (token) {
      this.adminServices.getAllVendors(token).subscribe(
        (response: VendorResponse) => {
          console.log(response);
          if (response && Array.isArray(response.data)) {
            this.vendors = response.data; // Assign data array to vendors
          } else {
            console.error('Invalid response structure:', response);
            this.vendors = [];
          }
          this.loading = false;
        },
        (error) => {
          console.error('Error fetching vendors:', error);
          this.errorMessage =
            error.status === 401
              ? 'Unauthorized: Token is invalid or expired'
              : 'Failed to fetch vendors. Please try again later.';
          this.loading = false;
        }
      );
    } else {
      this.errorMessage = 'Token is missing or expired';
      this.loading = false;
    }
  }

  deleteVendor(vendorId: string | undefined): void {
  if (!vendorId) {
    console.error('Vendor ID is missing');
    return; // Exit if vendorId is not available
  }

  const token = localStorage.getItem('token');

  if (token) {
    // Confirm before deletion
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminServices.deleteVendor(token, vendorId).subscribe(
          () => {
            Swal.fire('Deleted!', 'Vendor has been deleted.', 'success');
            this.fetchVendors(); // Re-fetch the vendors list
          },
          (error) => {
            Swal.fire('Error!', 'Failed to delete vendor. Please try again later.', 'error');
          }
        );
      }
    });
  } else {
    Swal.fire('Error', 'Authorization token is missing.', 'error');
  }
}
}
