import { Vendors } from "./vendors";

export interface VendorResponse {
    data: Vendors[];  // Array of vendors
    pagination: {
      total: number;  // Total count of vendors (or other pagination details)
    };
}
