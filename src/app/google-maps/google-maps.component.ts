import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMapsModule, MapInfoWindow } from '@angular/google-maps';
import { RestaurantServiceService } from '../Modules/Costumer/Services/restaurant-service.service';
import { Restaurants } from '../Models/restaurants';
import { CommonModule } from '@angular/common';
import { UserService } from '../Modules/Costumer/Services/user.service';
import { VendorService } from '../Modules/Vendor/Services/vendor.service';

@Component({
  selector: 'app-google-maps',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule],
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.scss'],
})
export class GoogleMapsComponent implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  restaurants: Restaurants[] = [];
  role : null | string = ''

  // Google Map options
  options: google.maps.MapOptions = {
    mapId: "38a26197f56d9b34", // Custom map ID
    center: { lat: 30.033333, lng: 31.233334 }, // Cairo's coordinates
    zoom: 14, // Adjust the zoom level as needed
  };

  // Markers array
  markers: { position: { lat: number; lng: number }; label: google.maps.MarkerLabel }[] = [];
  map: google.maps.Map | undefined;
  isLoading: boolean =false;
  errorMessage: string ='';

  constructor(private restaurantService: RestaurantServiceService,  private userServ : UserService
    , private vendorServ :VendorService  ) {}

  ngOnInit(): void {
    this.role=this.userServ.getRole
    if(this.role=='admin' || this.role=='customer'){
    this.fetchRestaurants();
  }
  else if (this.role=='vendor'){
    this.fetchVendorRestaurants();
  }
}

  // Method to add markers to the map
  addMarkers(): void {
    if (!this.map) return;

    // Create a new InfoWindow instance
    const infoWindow = new google.maps.InfoWindow();

    for (const marker of this.markers) {
      const googleMarker = new google.maps.Marker({
        position: marker.position,
        map: this.map,
        label: marker.label,
      });

      // Set content and add listener for marker click event
      googleMarker.addListener('click', () => {
        // Set the content of the InfoWindow dynamically based on the marker
        infoWindow.setContent(`<div>${marker.label.text}</div>`);
        infoWindow.open(this.map, googleMarker); // Open the InfoWindow
      });
    }
  }

  // Fetch restaurant data from the service
  fetchRestaurants(): void {
    this.restaurantService.getRestaurants().subscribe({
      next: (restaurants: Restaurants[]) => {
        this.restaurants = restaurants;
        this.markers = restaurants.map((restaurant) => ({
          position: {
            lat: parseFloat(restaurant.latitude), // Ensure latitude is a number
            lng: parseFloat(restaurant.longitude), // Ensure longitude is a number
          },
          label: {
            text: restaurant.name || 'Unnamed', // Fallback to 'Unnamed' if name is undefined
            color: 'black', // Set the label color
            fontSize: '16px', // Set the font size
          },
          
        }));

        if (this.map) {
          this.addMarkers(); // Add markers after fetching data
        }

      },
      error: (err) => {
        console.error('Error fetching restaurants:', err);
      },
    });
  }
  fetchVendorRestaurants(): void {
    this.isLoading = true;
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
      this.vendorServ.viewRestaurantsByVendor(token).subscribe({
        next: (restaurants: Restaurants[]) => {
          this.restaurants = restaurants;
          console.log(restaurants);
  
          // Map restaurant data to markers for the map
          this.markers = restaurants.map((restaurant) => ({
            position: {
              lat: parseFloat(restaurant.latitude), // Ensure latitude is a number
              lng: parseFloat(restaurant.longitude), // Ensure longitude is a number
            },
            label: {
              text: restaurant.name || 'Unnamed', // Fallback to 'Unnamed' if name is undefined
              color: 'black', // Set the label color
              fontSize: '16px', // Set the font size
            },
          }));        console.log(this.markers)


  
          // Add markers to the map
          if (this.map) {
            this.addMarkers();
          }
  
          this.isLoading = false; // Stop loading spinner
        },
        error: (error) => {
          this.errorMessage = 'Failed to load restaurants.';
          this.isLoading = false; // Stop loading spinner
          console.error('Error:', error);
        },
      });
    } else {
      console.error('No token found in localStorage');
      this.isLoading = false; // Stop loading spinner
    }
  }

  // Event fired when the map is loaded
  onMapLoad(map: google.maps.Map): void {
    this.map = map;
    this.addMarkers(); // Add markers when the map is loaded
  }
}
