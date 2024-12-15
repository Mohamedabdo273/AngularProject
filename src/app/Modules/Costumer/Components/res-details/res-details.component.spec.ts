import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResDetailsComponent } from './res-details.component';

describe('ResDetailsComponent', () => {
  let component: ResDetailsComponent;
  let fixture: ComponentFixture<ResDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
