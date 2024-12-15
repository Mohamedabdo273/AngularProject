import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../Services/user.service';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent implements OnInit{
role : null | string ='' 
isVisible: boolean = true;
  constructor(private userServ: UserService){}
  ngOnInit(): void {
  this.role=this.userServ.getRole
  if(this.role=='customer'){
    this.isVisible=false
  }
  }
}
