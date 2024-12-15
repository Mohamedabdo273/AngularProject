import { Component } from '@angular/core';
import { OfferService } from '../../Services/offer.service';
import { CommonModule, Location } from '@angular/common';
import { Offers } from '../../../../Models/offers';
import { UserService } from '../../../Costumer/Services/user.service';
import {MatDialog} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AddOfferPageComponent } from "../add-offer-page/add-offer-page.component";
import Swal from 'sweetalert2';
@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule, RouterModule, AddOfferPageComponent],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.scss'
})
export class OffersComponent {
  offers: Offers[] = [];
  displayedOffers: Offers[] = [];
  vendorResId : string ='';
  isLoading: boolean = false;
  errorMessage: string = '';
  role : null| string =''
  constructor(private offerService: OfferService, private userServ: UserService,private dialog: MatDialog,private router: Router , 
    private route : ActivatedRoute , private location : Location
  ) {}

  ngOnInit(): void {
    this.role=this.userServ.getRole
    if(this.role=='admin' || this.role=='customer')
      this.fetchAllOffers();
  else if(this.role=='vendor'){
    const restaurantId = this.route.snapshot.paramMap.get('id');
    if (restaurantId) {
      this.vendorResId = restaurantId;
      this.getVendorRestaurantOffers(restaurantId);
    }

  }
  }

  // Fetch all offers from the backend
  fetchAllOffers(): void {
    this.isLoading = true;
    this.offerService.getAllOffers().subscribe({
      next: (response) => {
        // If the response is wrapped in an object like { offers: [...] }
        this.offers = response; // Ensure it handles both cases
  
        // If the response directly returns the array, this will still work
        console.log(this.offers); // Check the array
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load offers.';
        this.isLoading = false;
        console.error('Error:', error);
      },
    });
  }

  // Call the method to make an offer
  makeOffer(restaurantId: string, offerData: any): void {
    this.offerService.makeOffer(restaurantId, offerData).subscribe({
      next: (response) => {
        console.log('Offer made successfully', response);
        this.fetchAllOffers(); // Re-fetch the list after making an offer
      },
      error: (error) => {
        this.errorMessage = 'Failed to make offer.';
        console.error('Error:', error);
      },
    });
  }

  // Call the method to delete an offer
  deleteOffer(offerId: string): void {
    // SweetAlert2 Confirmation Dialog
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the delete service if confirmed
        this.offerService.deleteOffer(offerId).subscribe({
          next: (response) => {
            Swal.fire('Deleted!', 'The offer has been deleted.', 'success');
            window.location.reload();          },
          error: (error) => {
            this.errorMessage = 'Failed to delete offer.';
            Swal.fire('Error!', 'Failed to delete the offer.', 'error');
            console.error('Error:', error);
          },
        });
      }
    });
  }

  // Get offers for a specific restaurant
  getVendorRestaurantOffers(restaurantId: string): void {
    this.offerService.getVendorsRestaurantOffers(restaurantId).subscribe({
      next: (offers) => {
        this.offers = offers;
        console.log('Vendor restaurant offers:', offers);
      },
      error: (error) => {
        this.errorMessage = 'Failed to fetch restaurant offers.';
        console.error('Error:', error);
      },
    });
  }

  goAddOfferPage(){
    this.router.navigate(['/add-offer', this.vendorResId]); 
   }


}
