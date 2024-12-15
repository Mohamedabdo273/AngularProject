import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, switchMap, tap, throwError, timer } from 'rxjs';
import { Restaurants, ViewAllRestaurantsResponse } from '../../../Models/restaurants';
import { Reservation } from '../../../Models/reservation';
import { Vendors } from '../../../Models/vendors';
import { FormArray } from '@angular/forms';
import { Timeslot } from '../../../Models/timeslot';


@Injectable({
  providedIn: 'root',
})
export class VendorService {
  private baseApiUrl = 'http://localhost:9000/api/';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    console.log('Token retrieved from localStorage:', token); // Debugging token
    if (!token) {
      alert('No token found. Please log in first.');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  getCategories(): Observable<{ categories: Record<string, string> }> {
    return this.http.get<{ categories: Record<string, string> }>(`${this.baseApiUrl}restaurants/categories`);
}

  addRestaurant(formData: FormData): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log('Token:', localStorage.getItem('token'));
    console.log('Headers:', headers);
    return this.http.post(`${this.baseApiUrl + 'restaurants/add'}`, formData, { headers });
  }
  
  viewRestaurantsByVendor(vendorId: string): Observable<Restaurants[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.baseApiUrl + "restaurants/viewVendor'sRestaurants"}`, { headers }).pipe(
      tap((response: any) => console.log('Response received:', response)),
      map((response: { data: any }) => response?.data ?? []), // Safeguard by falling back to empty array
      catchError((error: any) => {
        console.error('Error during fetch', error);
        return throwError(() => error);
      })
    );
  }

  
  deleteRestaurant(id: string): Observable<any> {
    const headers = this.getAuthHeaders(); // Ensure Authorization headers are included
    return this.http.delete(`${this.baseApiUrl}restaurants/delete/${id}`, { headers });
  }

  updateRestaurant(id: string, formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.put(`${this.baseApiUrl}restaurants/update/${id}`, formData, { headers });
  }

  getRestaurantById(id: string): Observable<Restaurants> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // Make sure we're retrieving the data correctly
    return this.http.get<{ data: Restaurants }>(`${this.baseApiUrl}restaurants/getOne/${id}`, { headers }).pipe(
      map(response => response.data) // Extract the data from the "data" property in the response
    );
  }
// Fetch reservations with real-time updates using polling
getAllReservations(intervalMs: number = 8000): Observable<Reservation[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  // Polling mechanism with RxJS
  return timer(0, intervalMs).pipe(
    switchMap(() =>
      this.http.get<{ success: boolean; data: Reservation[] }>(
        `${this.baseApiUrl + 'reservation/viewReservations'}`,
        { headers }
      ).pipe(
        map((response) => response.data) // Extract the `data` field
      )
    )
  );
}


  
    updateVendor(token: string,updatedVendor: Vendors): Observable<any> {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      });
  
      return this.http.put(`${this.baseApiUrl +'users/updateVendor/'}`, updatedVendor, { headers });
    }
    getVendorById(vendorId: string): Observable<Vendors> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
      return this.http.get<{ data: Vendors }>(`${this.baseApiUrl}users/getVendor`, { headers }).pipe(
        map(response => response.data), // Extract the vendor data from the "data" property
        catchError(error => {
          console.error('Error fetching vendor by ID:', error);
          return throwError(() => error);
        })
      );
    }
    confirmReservation(reservationId: string): Observable<any> {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      return this.http.post(`${this.baseApiUrl}reservation/confirm/${reservationId}`,{}, { headers });
    }
      // Cancel a reservation
      cancelReservation(id: string): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.post(
          `${this.baseApiUrl}reservation/cancel/${id}`,
          {}, // No additional body data
          { headers }
        );
      }
      getTimeslots(restaurantId: string): Observable<Timeslot[]> {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.get<Timeslot[]>(`${this.baseApiUrl}timeslot/${restaurantId}`,{headers});
      }
    
      // Add Timeslot for a restaurant
      addTimeslot(restaurantId: string, timeslots: string[]): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        // Constructing the request body with time slots
        const body = {
          time1: timeslots[0],
          time2: timeslots[1],
          time3: timeslots[2],
          time4: timeslots[3],
          time5: timeslots[4]
        };
      
        return this.http.post<any>(`${this.baseApiUrl}timeslot/add/${restaurantId}`, body, { headers });
      }
}
