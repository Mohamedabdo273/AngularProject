import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './Modules/Costumer/Components/main-layout/main-layout.component';
// import { ResDetailsComponent } from './Modules/Costumer/Components/res-details/res-details.component';
import { RestaurantsVeiwComponent } from './Modules/Costumer/Components/restaurants-veiw/restaurants-veiw.component';
import { SingUpComponent } from './Modules/Costumer/Components/sing-up/sing-up.component';
import { LoginComponent } from './Modules/Costumer/Components/login/login.component';
import { guardGuard } from './Guards/guard.guard';
import { HomeComponent } from './Modules/Costumer/Components/home/home.component';
import { ResDetailsComponent } from './Modules/Costumer/Components/res-details/res-details.component';
import { AdminViewComponent } from './Modules/Admin/Components/admin-view/admin-view.component';
import { AddVendorComponent } from './Modules/Admin/Components/admin-view/add-vendor/add-vendor.component';
import { ViewReservationsComponent } from './Modules/Admin/Components/view-reservations/view-reservations.component';
import { AddRestaurantComponent } from './Modules/Vendor/Components/add-restaurant/add-restaurant.component';
import { RestaurantComponent } from './Modules/Vendor/Components/restaurant/restaurant.component';
import { UpdateRestaurantComponent } from './Modules/Vendor/Components/update-restaurant/update-restaurant.component';
import { UpdateVendorComponent } from './Modules/Vendor/Components/update-vendor/update-vendor.component';
import { TimeslotsComponent  } from './Modules/Vendor/Components/timeslots/timeslots.component';
import { GoogleMapsComponent } from './google-maps/google-maps.component';
import { OffersComponent } from './Modules/Vendor/Components/offers/offers.component';
import { AddOfferPageComponent } from './Modules/Vendor/Components/add-offer-page/add-offer-page.component';

export const routes: Routes = [
    {
      path: '',
      component: MainLayoutComponent,canActivate:[guardGuard],
      children: [
        {path : '' , component : HomeComponent},
        {path : 'admin' , component : AdminViewComponent},
        {path: 'addVendor' , component : AddVendorComponent},
        {path: 'addRestuarant' , component : AddRestaurantComponent},
        {path: 'vendorRestaurant' , component : RestaurantComponent},
        {path: 'map' , component : GoogleMapsComponent},
        {path: 'offer/:id' , component : OffersComponent},
        {path: 'offer' , component : OffersComponent},
        { path: 'add-offer/:id', component: AddOfferPageComponent },
        {path: 'UpdateVendor' , component : UpdateVendorComponent},
        {path: 'Timeslot/:id' , component : TimeslotsComponent},
        {path: 'reservation/viewReservations',component:ViewReservationsComponent},
        {path: 'reservation/vendorReservations' , component : ViewReservationsComponent},
        // { path: 'hh', redirectTo: 'Home', pathMatch: 'full' },
        {path:'Home', component:HomeComponent,canActivate:[guardGuard]} ,// Fix redirectTo
        { path: 'restaurants', component: RestaurantsVeiwComponent,canActivate:[guardGuard]  }, // Correct route
        { path: 'restaurant/:id', component: ResDetailsComponent },
        { path: 'update-restaurant/:id', component: UpdateRestaurantComponent }, 
      ],
      
    },
    {path : 'login' , component : LoginComponent},
    {path : 'signup' , component :SingUpComponent},

    // Optionally handle 404 errors
    { path: '**', redirectTo: 'Home' }, // Redirect unknown paths
  ];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
  })
  export class AppRoutingModule {}