import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './Modules/Costumer/Components/header/header.component';
import { RestaurantsVeiwComponent } from './Modules/Costumer/Components/restaurants-veiw/restaurants-veiw.component';
import { CommonModule } from '@angular/common';  // Correct module for directives like NgIf, NgFor
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule to use HttpClient
import { HttpClient } from '@angular/common/http';
import { SingUpComponent } from './Modules/Costumer/Components/sing-up/sing-up.component';

import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-root',
  standalone: true,
  
  imports: [
    RouterOutlet,
    // HeaderComponent,
    // RestaurantsVeiwComponent,
    HttpClientModule,  // Use HttpClientModule
    CommonModule, 
    ReactiveFormsModule,

    // SingUpComponent // Use CommonModule for directives like NgIf, NgFor
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'Restaurant';
}
