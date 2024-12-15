import { Component, OnInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { GoogleMapsComponent } from "../../../../google-maps/google-maps.component";
import { RestaurantServiceService } from '../../Services/restaurant-service.service';
import { CommonModule } from '@angular/common';
import { Restaurants } from '../../../../Models/restaurants';
import { UserService } from '../../Services/user.service';
import { VendorService } from '../../../Vendor/Services/vendor.service';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GoogleMapsModule, GoogleMapsComponent , CommonModule,RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  restaurants: Restaurants[] = [];
  errorMessage: string = '';
  role : null | string =''
  isLoading: boolean = false;
    constructor(private restaurantServ : RestaurantServiceService ,private userServ: UserService,
    private vendorServ:VendorService ){}
  ngOnInit(): void {
    this.role=this.userServ.getRole;
    if(this.role=='customer' || this.role=='admin'){
      this.fetchRestaurants();
    }else if (this.role=='vendor'){
      this.fetchVendorRestaurants()
    }
  }

  fetchVendorRestaurants(): void {
    this.isLoading = true;
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
      this.vendorServ.viewRestaurantsByVendor(token).subscribe({
        next: (restaurants) => {
          this.restaurants = restaurants;
          console.log(restaurants);
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load restaurants.';
          this.isLoading = false;
          console.error('Error:', error);
        }
      });
    }
  }

  
  // Fetch restaurant data from the service
  fetchRestaurants(): void {
    this.restaurantServ.getRestaurants().subscribe({
      next: (restaurants: Restaurants[]) => {
        this.restaurants = restaurants;
        console.log(restaurants)
      },
      error: (err) => {
        console.error('Error fetching restaurants:', err);
      },
    });
  }
}
