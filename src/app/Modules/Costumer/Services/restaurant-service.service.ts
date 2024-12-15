import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, switchMap, tap, timer } from 'rxjs';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Restaurants } from '../../../Models/restaurants';

@Injectable({
  providedIn: 'root'
})
export class RestaurantServiceService {
  
  
  private baseUrl: string = 'http://localhost:9000/api/restaurants';   constructor(private http: HttpClient,) {
   }

   
     // Fetch restaurants with Authorization token periodically
     getRestaurants(intervalMs: number = 8000): Observable<Restaurants[]> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
      // Polling mechanism using RxJS `timer` and `switchMap`
      return timer(0, intervalMs).pipe(
        switchMap(() =>
          this.http.get<{ success: boolean; data: Restaurants[] }>(this.baseUrl + '/viewAll', { headers }).pipe(
            map((response) => response.data) // Extract the `data` field
          )
        )
      );
    }
    
    // Fetch all restaurants
    getAllRestaurants(): Observable<Restaurants[]> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      
      return this.http.get<{ success: boolean; data: Restaurants[] }>(this.baseUrl + '/viewAll', { headers }).pipe(
        map((response) => response.data) // Extract the `data` field
      );
    }
  
  getRestaurantById(id: string): Observable<Restaurants> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // Make sure we're retrieving the data correctly
    return this.http.get<{ data: Restaurants }>(`${this.baseUrl}/getOne/${id}`, { headers }).pipe(
      map(response => response.data) // Extract the data from the "data" property in the response
    );
  }
  
  
  searchByCategory(category: string): Observable<Restaurants[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    const encodedCategory = encodeURIComponent(category);  // Encode the category
    return this.http.get<{ success: boolean; data: Restaurants[] }>(`${this.baseUrl}/searchByCategory/?foodCategory=${encodedCategory}`, { headers })
      .pipe(map(response => response.data));  // Extract the data from the "data" property in the response
  }
  
    // Search by location
    searchByLocation(location: string): Observable<any> {
      return this.http.get(`${this.baseUrl}/searchByLocation`, {
        params: { location },
      });
    }
  
    // Search by name
    searchByName(name: string): Observable<any> {
      return this.http.get(`${this.baseUrl}/searchByName`, {
        params: { name },
      });
    }
}
