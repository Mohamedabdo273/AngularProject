import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl ,ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../Services/user.service';
@Component({
  standalone:true,
  imports:[ReactiveFormsModule, CommonModule, RouterModule,FormsModule ],
  selector: 'app-sing-up',
  templateUrl: './sing-up.component.html',
  styleUrls: ['./sing-up.component.scss']
})
export class SingUpComponent implements OnInit {
  signUpData = {
    Name: '',         // Ensure this is correctly initialized
    email: '',
    password: '',
    phoneNumber: ''    // If this is required
  };

  responseMessage: string = '';

  constructor(private userService: UserService) {}

  register() {
    console.log(this.signUpData); // Log to check if name is correctly set
    this.userService.register(this.signUpData).subscribe(
      (response) => {
        this.responseMessage = 'Sign up successful!';
      },
      (error) => {
        this.responseMessage = 'Sign up failed: ' + error.error.message;
      }
    );
  }

  ngOnInit(): void {}
}



