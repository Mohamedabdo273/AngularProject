import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Restaurants } from '../../../../Models/restaurants';
import { VendorService } from '../../Services/vendor.service';
import { FormBuilder, FormGroup, Validators ,ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../../../Models/category';

@Component({
  selector: 'app-add-restaurant',
  standalone: true,
  imports: [CommonModule ,ReactiveFormsModule],
  templateUrl: './add-restaurant.component.html',
  styleUrl: './add-restaurant.component.scss'
})
export class AddRestaurantComponent  implements OnInit {
  addRestaurantForm: FormGroup;
  categories = Object.entries(Category).map(([key, value]) => ({ key, value }));

  constructor(
    private restaurantService: VendorService,
    private fb: FormBuilder,
    private router : Router
  ) {
    this.addRestaurantForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: [null, Validators.required],
      location: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      numberOfTables: [0, [Validators.required, Validators.min(1)]],
      foodCategory: ['', Validators.required],
      rating: [0, Validators.required]
    });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  // Trigger the file input dialog
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.addRestaurantForm.patchValue({
        image: file
      });
    }
  }

  // Handle form submission
  onSubmit() {
    if (this.addRestaurantForm.valid) {
      const formData = new FormData();
      formData.append('name', this.addRestaurantForm.get('name')?.value);
      formData.append('description', this.addRestaurantForm.get('description')?.value);
      formData.append('image', this.addRestaurantForm.get('image')?.value);
      formData.append('location', this.addRestaurantForm.get('location')?.value);
      formData.append('latitude', this.addRestaurantForm.get('latitude')?.value);
      formData.append('longitude', this.addRestaurantForm.get('longitude')?.value);
      formData.append('numberOfTables', this.addRestaurantForm.get('numberOfTables')?.value);
      formData.append('foodCategory', this.addRestaurantForm.get('foodCategory')?.value);
      formData.append('rating', this.addRestaurantForm.get('rating')?.value);

      this.restaurantService.addRestaurant(formData).subscribe({
        next: (response) => {
          alert('Restaurant added successfully!');
          this.addRestaurantForm.reset();

        },
        error: (error) => {
          console.error('Error adding restaurant:', error);
          alert('Failed to add restaurant.');
        }
      });
    } else {
      alert('Please fill out all required fields correctly.');
    }
  }
}
