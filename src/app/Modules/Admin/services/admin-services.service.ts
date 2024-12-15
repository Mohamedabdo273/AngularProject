// src/app/services/admin_services.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vendors } from '../../../Models/vendors';
import { VendorResponse } from '../../../Models/vendor-response';
import { Reservation } from '../../../Models/reservation';

@Injectable({
  providedIn: 'root',
})
export class AdminServicesService {
  private apiUrl = 'http://localhost:9000/api/'; // Your correct API URL

  constructor(private http: HttpClient) {}

  // Method to fetch all vendors
  getAllVendors(token: string): Observable<VendorResponse> {
    return this.http.get<VendorResponse>(this.apiUrl +'users/getAllVendors', {  // Use this.apiUrl here
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Add Vendor Service
  addVendor(token: string, vendor: Vendors): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiUrl + 'users/addVendor'}`, vendor, { headers });
  }
    // Method to delete a vendor by ID
    deleteVendor(token: string, vendorId: string): Observable<any> {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
  
      return this.http.delete(`${this.apiUrl + 'users/deleteVendor/'}${vendorId}`, { headers });
    }
     // Update Vendor Service
 
    // Method to fetch all reservations
    getAllReservations(token: string): Observable<Reservation[]> {
      return this.http.get<Reservation[]>(`${this.apiUrl + 'reservation/viewReservations'}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
}
