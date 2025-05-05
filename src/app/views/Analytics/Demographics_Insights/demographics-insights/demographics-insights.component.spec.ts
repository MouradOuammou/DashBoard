import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemographicsInsightsComponent } from './demographics-insights.component';

describe('DemographicsInsightsComponent', () => {
  let component: DemographicsInsightsComponent;
  let fixture: ComponentFixture<DemographicsInsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemographicsInsightsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemographicsInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
