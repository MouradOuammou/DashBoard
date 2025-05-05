import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffPlanningComponent } from './staff-planning.component';

describe('StaffPlanningComponent', () => {
  let component: StaffPlanningComponent;
  let fixture: ComponentFixture<StaffPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffPlanningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
