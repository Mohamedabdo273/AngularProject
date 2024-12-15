import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { RestaurantServiceService } from './restaurant-service.service';

describe('RestaurantServiceService', () => {
  let service: RestaurantServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestaurantServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
