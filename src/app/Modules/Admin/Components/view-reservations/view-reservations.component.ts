import { Component, OnInit } from '@angular/core';
import { Reservation } from '../../../../Models/reservation';
import { AdminServicesService } from '../../services/admin-services.service';
import { CommonModule } from '@angular/common';
import { VendorService } from '../../../Vendor/Services/vendor.service';
import { UserService } from '../../../Costumer/Services/user.service';
import Swal from 'sweetalert2';
import { ReservationService } from '../../../Costumer/Services/reservation.service';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-reservations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-reservations.component.html',
  styleUrls: ['./view-reservations.component.scss']
})
export class ViewReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  errorMessage: string = '';
  loading: boolean = false;
  role: null | string = '';
  email: null | string = '';

  constructor(
    private adminService: AdminServicesService,
    private vendorService: VendorService,
    private userServ: UserService,
    private reservationService: ReservationService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.fetchReservations();
    this.role = this.userServ.getRole;
    this.email = this.userServ.getUserEmail;
    console.log(this.email);
  }

  // Fetch all reservations and initialize isBillSent flag
  fetchReservations(): void {
    this.loading = true;
    const token = localStorage.getItem('token'); // Retrieve the token

    if (token) {
      this.adminService.getAllReservations(token).subscribe(
        (response: any) => { // Adjust the type if necessary
          console.log(response); // Debugging the response structure
          if (response && Array.isArray(response.reservations)) {
            this.reservations = response.reservations.map((reservation: { status: string; }) => ({
              ...reservation,
              isBillSent: reservation.status === 'Confirmed' ? false : true // Add flag for bill sent
            }));
            console.log(this.reservations);
          } else {
            console.error('Invalid response structure:', response);
            this.reservations = []; // Fallback to empty array
          }
          this.loading = false;
        },
        (error) => {
          console.error('Error fetching reservations:', error);
          this.errorMessage = 'Failed to fetch reservations. Please try again later.';
          this.loading = false;
        }
      );
    } else {
      this.errorMessage = 'Authorization token is missing or expired';
      this.loading = false;
    }
  }

  // Confirm reservation with SweetAlert
  onConfirmReservation(reservationId: string): void {
    Swal.fire({
      title: 'Confirm Reservation',
      text: 'Are you sure you want to confirm this reservation?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, confirm it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('token');
        if (token) {
          this.vendorService.confirmReservation(reservationId).subscribe({
            next: (response) => {
              console.log('Reservation confirmed:', response);
              // Show success alert
              Swal.fire('Confirmed!', 'The reservation has been confirmed.', 'success').then(() => {
                // Refresh the page after confirmation
                window.location.reload();
              });
            },
            error: (error) => {
              console.error('Error confirming reservation:', error);
              Swal.fire('Error', 'Could not confirm reservation. Please try again.', 'error');
            },
          });
        } else {
          console.error('Token not found');
          Swal.fire('Error', 'Authorization token is missing.', 'error');
        }
      }
    });
  }

  // Cancel reservation with SweetAlert
  onCancelReservation(reservationId: string): void {
    Swal.fire({
      title: 'Cancel Reservation',
      text: 'Are you sure you want to cancel this reservation?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('token');
        if (token) {
          this.vendorService.cancelReservation(reservationId).subscribe({
            next: (response) => {
              console.log('Reservation canceled:', response);
              // Show success alert
              Swal.fire('Canceled!', 'The reservation has been canceled.', 'success');
              // Remove the reservation from the list
              this.reservations = this.reservations.filter(res => res._id !== reservationId);
            },
            error: (error) => {
              console.error('Error canceling reservation:', error);
              Swal.fire('Error', 'Could not cancel reservation. Please try again.', 'error');
            },
          });
        } else {
          console.error('Token not found');
          Swal.fire('Error', 'Authorization token is missing.', 'error');
        }
      }
    });
  }

  // Send bill
  onSendBill(reservationId: string): void {
    Swal.fire({
      title: 'Send Bill',
      text: 'Do you want to send the bill for this reservation?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, send it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservationService.sendBill(reservationId).subscribe({
          next: (response) => {
            Swal.fire('Success', 'The bill has been sent successfully.', 'success');
            console.log('Bill sent successfully:', response);

            // Update the reservation to mark the bill as sent
            const reservation = this.reservations.find(res => res._id === reservationId);
            if (reservation) {
              reservation.billSent = true; // Disable the button for this reservation
            }
          },
          error: (error) => {
            console.error('Error sending bill:', error);
            Swal.fire('Error', 'Could not send the bill. Please try again.', 'error');
          }
        });
      }
    });
  }
}
