export interface Restaurants {
    _id: string;
    name: string; // 
    description: string; //
    image?: string; //.
    location: string; // 
    rating: number; // 
    latitude: string; // 
    longitude: string; // 
    numberOfTables: number; // 
    vendor_id?: string; // ID of the vendor managing the restaurant.
    foodCategory: string; // 
  
}
export interface ViewAllRestaurantsResponse {
    message: string;
    data: Restaurants[];
  }
  
  
        
        export interface Pagination {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
          hasNextPage: boolean;
          hasPrevPage: boolean;
        }
        
        export interface ViewAllRestaurantsResponse {
          message: string;
          data: Restaurants[];
      }
      