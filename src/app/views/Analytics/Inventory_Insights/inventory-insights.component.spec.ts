import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryInsightsComponent } from './inventory-insights.component';

describe('InventoryInsightsComponent', () => {
  let component: InventoryInsightsComponent;
  let fixture: ComponentFixture<InventoryInsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryInsightsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
