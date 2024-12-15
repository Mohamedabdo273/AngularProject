import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators , ReactiveFormsModule } from '@angular/forms';  // Import necessary modules for form handling
import { ActivatedRoute, Router } from '@angular/router';
import { VendorService } from '../../Services/vendor.service';
import { Location } from '@angular/common';
import { Restaurants } from '../../../../Models/restaurants';  // Assuming you have a Restaurant model
import { CommonModule } from '@angular/common';
import { Category } from '../../../../Models/category';
@Component({
  selector: 'app-update-restaurant',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './update-restaurant.component.html',
  styleUrls: ['./update-restaurant.component.scss']
})
export class UpdateRestaurantComponent implements OnInit {

  restaurant: Restaurants | null = null;
  updateRestaurantForm: FormGroup;  // Form group for the reactive form
  categories = Object.entries(Category).map(([key, value]) => ({ key, value }));

  constructor(
    private route: ActivatedRoute,
    private router : Router,
    private vendorService: VendorService,
    private location: Location,
    private fb: FormBuilder  // Inject FormBuilder to create the form
  ) {
    // Initialize the form with default values or empty fields
    this.updateRestaurantForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      numberOfTables: [0, [Validators.required, Validators.min(1)]],
      rating: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
      image: [null],  // Assuming image is handled separately
      foodCategory: ['', Validators.required]  // Add foodCategory field
    });
    
  }

  ngOnInit(): void {
    // Retrieve the restaurant ID from the route parameters
    const restaurantId = this.route.snapshot.paramMap.get('id');
    if (restaurantId) {
      // Fetch the restaurant data if the ID exists
      this.vendorService.getRestaurantById(restaurantId).subscribe({
        next: (data) => {
          this.restaurant = data;  // Assign the fetched data to the restaurant property
          console.log(this.restaurant);
          // Patch the form with the fetched restaurant data
          if (this.restaurant) {
            this.updateRestaurantForm.patchValue({
              name: this.restaurant.name,
              description: this.restaurant.description,
              location: this.restaurant.location,
              latitude: this.restaurant.latitude,
              longitude: this.restaurant.longitude,
              numberOfTables: this.restaurant.numberOfTables,
              rating: this.restaurant.rating,
              image: this.restaurant.image  // Assuming image is stored in the restaurant object
            });
          }
        },
        error: (err) => {
          console.error('Error fetching restaurant details:', err);
        }
      });
    }
  }

  // Handle form submission
  onSubmit(): void {


    if (this.updateRestaurantForm.valid) {
      // Collect form data to send in FormData format
      const formData = new FormData();
      formData.append('name', this.updateRestaurantForm.get('name')?.value);
      formData.append('description', this.updateRestaurantForm.get('description')?.value);
      formData.append('location', this.updateRestaurantForm.get('location')?.value);
      formData.append('latitude', this.updateRestaurantForm.get('latitude')?.value);
      formData.append('longitude', this.updateRestaurantForm.get('longitude')?.value);
      formData.append('numberOfTables', this.updateRestaurantForm.get('numberOfTables')?.value);
      formData.append('rating', this.updateRestaurantForm.get('rating')?.value);
  
      // Check if there is an image, and if so, append it
      const image = this.updateRestaurantForm.get('image')?.value;
      if (image) {
        formData.append('image', image);
      }
  
      // Log the form data to check what is being sent
      console.log('Form Data to be Sent:', formData);
  
      // Make sure restaurantId is valid
      if (this.restaurant?._id) {
        this.vendorService.updateRestaurant(this.restaurant._id, formData).subscribe({
          next: (response) => {
            console.log('Restaurant updated successfully:', response);
            alert('Restaurant updated successfully!');
            this.router.navigate(['/restaurants']);  // Navigate back to the list after success
          },
          error: (error) => {
            console.error('Error updating restaurant:', error);
            alert('Failed to update restaurant. Please check the details or try again later.');
          }
        });
      } else {
        alert('Invalid restaurant ID.');
      }
    } else {
      alert('Please fill out all required fields correctly.');
    }
  }
  
  
  
}
