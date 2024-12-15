import { Component, OnInit } from '@angular/core';
import { RestaurantServiceService } from '../../Services/restaurant-service.service';
import { Restaurants } from '../../../../Models/restaurants';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-restaurants-view',
  standalone: true,
  templateUrl: './restaurants-veiw.component.html',
  styleUrls: ['./restaurants-veiw.component.scss'],
  imports: [RouterModule, CommonModule],
})
export class RestaurantsVeiwComponent implements OnInit {
  restaurants: Restaurants[] = [];
  filteredRestaurants: Restaurants[] = [];
  foodCategory: string[] = [];
  selectedCategory: string | 'All' = 'All';
  currentPage: number = 1;
  totalPages: number = 1;
  totalRestaurants: number = 0;
  limit: number = 10;
  isNavigating: boolean = false;

  constructor(private restaurantService: RestaurantServiceService) {}

  ngOnInit(): void {
    this.fetchRestaurants();
    console.log("onInit");
  }

  /**
   * Fetch restaurants from the service and update pagination
   */
  fetchRestaurants(): void {
    this.restaurantService.getRestaurants(10000).subscribe({
      next: (data) => {
        this.restaurants = data;
        this.filteredRestaurants = [...this.restaurants];
        this.updateCategories();
      },
      error: (err) => {
        console.error('Error fetching restaurants:', err.message);
        alert(
          `Unable to fetch restaurants. ${
            err.status === 401
              ? 'Unauthorized access. Please log in again.'
              : 'Please contact support.'
          }`
        );
      },
    });
  }
  /**
   * Handle category selection change and fetch restaurants by category
   */
  onCategoryChange(category: string): void {
    this.selectedCategory = category;

    // If "All" is selected, fetch all restaurants
    if (category === 'All') {
      this.fetchRestaurants(); // Fetch all restaurants
    } else {
      // Fetch restaurants by the selected category using searchByCategory method
      this.restaurantService.searchByCategory(category).subscribe({
        next: (data) => {
          this.filteredRestaurants = data; // Set filtered restaurants to the data returned from API
        },
        error: (err) => {
          console.error('Error fetching restaurants by category:', err.message);
          alert(
            `Unable to fetch restaurants for category "${category}". ${
              err.status === 401
                ? 'Unauthorized access. Please log in again.'
                : 'Please contact support.'
            }`
          );
        },
      });
    }
  }

  /**
   * Extract unique food categories from the restaurant data
   */
  updateCategories(): void {
    const uniqueCategories = new Set<string>();
    this.restaurants.forEach((restaurant) => {
      if (restaurant.foodCategory) {
        uniqueCategories.add(restaurant.foodCategory);
      }
    });
    this.foodCategory = [...Array.from(uniqueCategories)];
  }
}
