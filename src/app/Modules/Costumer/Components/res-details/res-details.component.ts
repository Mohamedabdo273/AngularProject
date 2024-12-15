import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantServiceService } from '../../Services/restaurant-service.service';
import { ReservationService } from '../../Services/reservation.service';
import { CommonModule, Location } from '@angular/common';
import { Restaurants } from '../../../../Models/restaurants';
import { Table, tableTimeslots } from '../../../../Models/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { Timeslot } from '../../../../Models/timeslot';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-res-details',
  standalone:true,
  imports:[CommonModule ,ReactiveFormsModule ,FormsModule],
  templateUrl: './res-details.component.html',
  styleUrls: ['./res-details.component.scss']
})
export class ResDetailsComponent implements OnInit {
  restaurant: Restaurants | null = null;
  timeslots: Timeslot[] = [];
  tables: tableTimeslots[] = [];
  selectedTimeslotId: string = '';
  currentRestaurantId: string = '';

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantServiceService,
    private location: Location,
    private reservationService: ReservationService
  ) {}
  ngOnInit(): void {
    const restaurantId = this.route.snapshot.paramMap.get('id');
    if (restaurantId) {
      this.currentRestaurantId = restaurantId;
      this.getRestaurantDetails(restaurantId);
      this.getTimeslotsForRestaurant(restaurantId);
    }
  }

  // Fetch restaurant details
  getRestaurantDetails(restaurantId: string): void {
    this.restaurantService.getRestaurantById(restaurantId).subscribe({
      next: (data) => {
        this.restaurant = data;
        console.log(this.restaurant);
      },
      error: (err) => {
        console.error('Error fetching restaurant details:', err);
      }
    });
  }

// Fetch timeslots for the restaurant
getTimeslotsForRestaurant(restaurantId: string): void {
  this.reservationService.getTimeslots(restaurantId).subscribe({
    next: (response: any) => {
      console.log('API Response:', response); // Log the full response
      this.timeslots = response.timeslots || [];  // Assuming the timeslots are inside a 'timeslots' property
    },
    error: (err) => {
      console.error('Error fetching timeslots:', err);
    },
  });
}

  // Fetch tables based on selected timeslot// Fetch tables based on selected timeslot
getTablesForTimeslot(selectedTime: string): void {
  this.selectedTimeslotId = selectedTime; // Save selected timeslot ID
  if (this.selectedTimeslotId) {
    console.log(`Fetching tables for timeslot ID: ${this.selectedTimeslotId}`);
    this.reservationService
      .getTablesByRestaurantAndTimeslot(this.currentRestaurantId, this.selectedTimeslotId)
      .subscribe({
        next: (data) => {
          // Ensure data is an array and contains valid objects
          if (data && Array.isArray(data)) {
            this.tables = data;
            console.log('Fetched tables:', this.tables);
          } else {
            this.tables = [];
            console.error('No tables found for the selected timeslot.');
          }
        },
        error: (err) => {
          // Log error details for debugging
          this.tables = [];
          console.error('Error fetching tables:', err);
        }
      });
  } else {
    console.warn('No timeslot selected.');
  }
}
makeTableReservation(tableTimeslotId: string, restaurantId: string): void {
  this.reservationService.makeReservation(tableTimeslotId, restaurantId).subscribe({
    next: (response) => {
      console.log('Reservation successful:', response);
      Swal.fire({
        icon: 'success',
        title: 'Reservation Confirmed',
        text: `Your table has been reserved successfully!`,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
    },
    error: (error) => {
      console.error('Error making reservation:', error);
      Swal.fire({
        icon: 'error',
        title: 'Reservation Failed',
        text: `There was an error processing your reservation. Please try again.`,
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK',
      });
    },
  });
}


  // Navigate back to previous page
  back(): void {
    this.location.back();
  }
}
