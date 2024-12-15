import { Component } from '@angular/core';
import { VendorService } from '../../Services/vendor.service';
import { ActivatedRoute } from '@angular/router';
import { Restaurants } from '../../../../Models/restaurants';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restaurant',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent {
  Vrestaurants: Restaurants[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  vendorId: string = '';  // You can set this value from route or any other source

  constructor(
    private viewVendorRestaurantsService: VendorService,
    private route: ActivatedRoute,
    private router: Router  // Injecting Router properly
  ) {}

  ngOnInit(): void {
    this.fetchVendorRestaurants();
  }

  fetchVendorRestaurants(): void {
    this.isLoading = true;
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
      this.viewVendorRestaurantsService.viewRestaurantsByVendor(token).subscribe({
        next: (restaurants) => {
          this.Vrestaurants = restaurants;
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

  onUpdate(restaurantId: string): void {
    // Make sure the router is injected and used correctly
    this.router.navigate(['/update-restaurant', restaurantId]);  // Navigate to the UpdateRestaurantComponent
  }

  deleteRestaurant(id: string): void {
    if (confirm('Are you sure you want to delete this restaurant?')) {
      this.isLoading = true;
      this.viewVendorRestaurantsService.deleteRestaurant(id).subscribe({
        next: () => {
          this.Vrestaurants = this.Vrestaurants.filter(
            (restaurant) => restaurant._id !== id
          );
          this.isLoading = false;
          alert('Restaurant deleted successfully!');
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete restaurant.';
          this.isLoading = false;
          console.error('Error:', error);
        }
      });
    }
  }
}
