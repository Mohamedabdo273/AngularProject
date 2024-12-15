import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { SideBarComponent } from "../side-bar/side-bar.component";
import { RestaurantsVeiwComponent } from "../restaurants-veiw/restaurants-veiw.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from "../../../../app.component";
import { BehaviorSubject } from 'rxjs';
import { UserService } from '../../Services/user.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, HeaderComponent, SideBarComponent, HttpClientModule,CommonModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit {
  role : null | string ='' 
  isVisible:boolean= true;
  constructor(private userServ: UserService){}
  ngOnInit(): void {
    this.role = this.userServ.getRole; // Verify if this retrieves the correct value
    console.log('Role:', this.role); // Debug log
    if (this.role === 'customer') {
      this.isVisible = false;
    }
    else{
      this.isVisible = true;
    }
    console.log('isVisible:', this.isVisible); // Debug log
  }
  
}
