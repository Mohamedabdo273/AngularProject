import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OfferService } from '../../Services/offer.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-offer-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-offer-page.component.html',
  styleUrls: ['./add-offer-page.component.scss'],
})
export class AddOfferPageComponent implements OnInit {
  currentRestaurantId: string | null = '';
  offerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private offerService: OfferService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.offerForm = this.fb.group({
      offer: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit(): void {
    const restaurantId = this.route.snapshot.paramMap.get('id');
    if (restaurantId) {
      this.currentRestaurantId = restaurantId;
    }
  }

  saveOffer(): void {
    if (this.offerForm.valid && this.currentRestaurantId) {
      this.offerService.makeOffer(this.currentRestaurantId, this.offerForm.value).subscribe({
        next: () => {
          console.log('Offer added successfully');
          this.router.navigate(['/offer', this.currentRestaurantId]); // Redirect to the offers list
        },
        error: (error) => {
          console.error('Failed to add offer:', error);
        },
      });
    } else {
      console.warn('Form is invalid or restaurant ID is missing');
    }
  }
}
