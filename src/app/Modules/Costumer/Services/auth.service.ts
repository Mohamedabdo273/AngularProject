import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private isLoggedSub : BehaviorSubject<boolean>;
  constructor( 
    
  ) { this.isLoggedSub =new BehaviorSubject<boolean> (this.isLogged)}
  login(userName : string , password : string)
  {
    let userToken='1501';
    localStorage.setItem('token',userToken);
    this.isLoggedSub.next(true)
  }
  logout()
  {
    localStorage.removeItem('token');
    this.isLoggedSub.next(false)
  }
  get isLogged(): boolean{
    return (localStorage.getItem('token'))? true : false;
  }
  userStatus()
  {
    return this.isLoggedSub;
  }
}
  