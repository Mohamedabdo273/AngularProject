import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Offers } from '../../../Models/offers';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private baseApiUrl = 'http://localhost:9000/api/offer';
  constructor(private http: HttpClient) { }

  // Helper function to get the authorization header
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
    // Get all offers
    getAllOffers(): Observable<Offers[]> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      console.log(headers)
      // if(token)
      // console.log(jwtDecode(token))
      return this.http.get<Offers[]>(`${this.baseApiUrl}/getalloffers`, {headers})
      };
    
      // Make an offer
  makeOffer(restaurantId: string, offerData: any): Observable<any> {
    return this.http.post(`${this.baseApiUrl}/makeoffer/${restaurantId}`, offerData, {
      headers: this.getAuthHeaders(),
    });
  }
    // Delete an offer
    deleteOffer(offerId: string): Observable<any> {
      return this.http.delete(`${this.baseApiUrl}/deleteoffer/${offerId}`, {
        headers: this.getAuthHeaders(),
      });
    }
  
    // Get offer by ID
    getOfferById(offerId: string): Observable<any> {
      return this.http.get(`${this.baseApiUrl}/getoffer/${offerId}`, {
        headers: this.getAuthHeaders(),
      });
    }
  
    // Get offers for a vendor's restaurant
    getVendorsRestaurantOffers(restaurantId: string): Observable<any> {
      return this.http.get(`${this.baseApiUrl}/getvendorsrestaurantoffers/${restaurantId}`, {
        headers: this.getAuthHeaders(),
      });
    }
}
