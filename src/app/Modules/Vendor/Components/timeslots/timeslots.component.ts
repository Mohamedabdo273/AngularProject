import { Component, OnInit } from '@angular/core';
import { VendorService } from '../../Services/vendor.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timeslots',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './timeslots.component.html',
  styleUrls: ['./timeslots.component.scss']
})
export class TimeslotsComponent implements OnInit {
  timeSlotForm: FormGroup;
  restaurantId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private vendorServ: VendorService,
    private route: ActivatedRoute
  ) {
    this.timeSlotForm = this.fb.group({
      timeslots: this.fb.array([]) // Initialize empty array
    });
  }

  ngOnInit(): void {
    this.restaurantId = this.route.snapshot.paramMap.get('id');
    if (!this.restaurantId) {
      alert('Invalid restaurant ID. Please navigate back to the restaurant list.');
      return;
    }

    // Add 5 initial time slots
    for (let i = 0; i < 5; i++) {
      this.addTimeSlot();
    }
  }

  // Getter for the timeSlots form array
  get timeslots(): FormArray {
    return this.timeSlotForm.get('timeslots') as FormArray;
  }

  // Add a new time slot group
  addTimeSlot(): void {
    const timeSlotGroup = this.fb.group({
      time: ['', Validators.required] // Single control for start time
    });
    this.timeslots.push(timeSlotGroup);
  }

  // Function to convert 24-hour format to 12-hour format with AM/PM
  convertTo12HourFormat(time: string): string {
    const [hour, minute] = time.split(':').map(Number);
    let suffix = 'AM';
    let newHour = hour;

    if (hour >= 12) {
      suffix = 'PM';
      if (hour > 12) {
        newHour = hour - 12; // Convert PM hour to 12-hour format
      }
    } else if (hour === 0) {
      newHour = 12; // Midnight case
    }

    // Format the hour and minute to have leading zeros if needed
    return `${newHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${suffix}`;
  }

  // Submit the form
  onSubmit(): void {
    if (this.timeSlotForm.valid && this.restaurantId) {
      // Extract individual time slots from form data and convert to 12-hour format
      const formData = this.timeSlotForm.value.timeslots.map((slot: any) => this.convertTo12HourFormat(slot.time));

      // Ensure we have exactly 5 time slots
      if (formData.length !== 5) {
        alert("Please provide exactly 5 time slots.");
        return;
      }

      // Send the request to the backend
      this.vendorServ.addTimeslot(this.restaurantId, formData).subscribe({
        next: (response) => {
          console.log('Time Slots added successfully:', response);
          alert('Time slots submitted successfully!');
        },
        error: (err) => {
          console.error('Error adding time slots:', err);
          alert('An error occurred while submitting time slots.');
        }
      });
    } else {
      alert('Please fill in all the required fields and ensure the restaurant ID is valid.');
    }
  }
}
