import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantsVeiwComponent } from './restaurants-veiw.component';

describe('RestaurantsVeiwComponent', () => {
  let component: RestaurantsVeiwComponent;
  let fixture: ComponentFixture<RestaurantsVeiwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantsVeiwComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantsVeiwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
