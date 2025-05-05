import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficInsightsComponent } from './traffic-insights.component';

describe('TrafficInsightsComponent', () => {
  let component: TrafficInsightsComponent;
  let fixture: ComponentFixture<TrafficInsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrafficInsightsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
