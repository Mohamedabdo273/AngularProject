import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Timeslot } from '../../../Models/timeslot';
import { Table, tableTimeslots } from '../../../Models/table';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private baseUrl: string = 'http://localhost:9000/api/';   constructor(private http: HttpClient,) {
   }

   // Get timeslots for a given restaurant
   getTimeslots(restaurantId: string): Observable<Timeslot[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Timeslot[]>(`${this.baseUrl}timeslot/${restaurantId}`, { headers });
  }
  
  // Get tables for a given restaurant and timeslot
  getTablesByRestaurantAndTimeslot(restaurantId: string, timeslotId: string): Observable<tableTimeslots[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<{ tables: tableTimeslots[] }>(`${this.baseUrl}TableTimeslot/${restaurantId}/${timeslotId}`, { headers })
      .pipe(map(response => response.tables || []));
  }


  // Method to make a reservation
makeReservation(tableTimeslotId: string, restaurantId: string): Observable<any> {
  const token = localStorage.getItem('token'); // Retrieve token from local storage
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Set authorization header

  // Send POST request with optional reservation data if needed
  return this.http.post<any>(`${this.baseUrl}reservation/make/${tableTimeslotId}/${restaurantId}`,{}, { headers });
}
  // Method to send a bill
sendBill(reservationId: string): Observable<any> {
  const token = localStorage.getItem('token'); // Retrieve token from local storage
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Set authorization header

  // Send POST request with bill data
  return this.http.post<any>(`${this.baseUrl}reservation/bill/${reservationId}/`,{}, { headers });
}

}
