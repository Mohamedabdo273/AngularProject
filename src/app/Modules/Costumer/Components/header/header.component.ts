import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { BehaviorSubject } from 'rxjs';
import { UserService } from '../../Services/user.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit , OnChanges {
  isUserLogged : boolean=false
  role : null | string =''
  constructor(private userServ : UserService, private router : Router ,private route : ActivatedRoute){

  }
  ngOnChanges(changes: SimpleChanges): void {

    // this.userServ.userStatus().subscribe((status)=>this.isUserLogged=status)
  }
  ngOnInit(): void {
    this.userServ.userStatus().subscribe((status)=>this.isUserLogged=status)
      this.role= this.userServ.getRole

  }
  
  logOut() {
    // Show SweetAlert2 confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, log out',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the logout method from your service (assuming it's named 'author')
        this.userServ.logout();
  
        // Update the logged-in status
        this.isUserLogged = this.userServ.isLogged
  
        // Optionally, show a success message
        Swal.fire(
          'Logged Out!',
          'You have been successfully logged out.',
          'success'
        ).then(() => {
          // Navigate to the home page (or any other page)
          this.router.navigate(['/Home']);
        });
      }
    });
  }
}
