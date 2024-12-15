export interface Table {
    capacity: 6;
    _id: string;
    restaurantId: string;
    tableNumber: number;
}
export interface tableTimeslots {
tableId: string;
    tableTimeslotId: string;
    tableNumber: number;
    isAvailable: boolean;
    capacity:number
}
