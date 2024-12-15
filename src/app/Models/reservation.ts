export interface Reservation {
    _id: string;
    restaurantName: string;
    tableNumber: number;
    timeslot: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    reservationDate: Date;
    reservationTime: string;
    status: string;
    tableTimeslotId: string;
    customerId: string;
    restaurantId: string;
    confirmationEmailSent : boolean;
    billSent : boolean;
}
