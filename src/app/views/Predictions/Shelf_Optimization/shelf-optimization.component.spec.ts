import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelfOptimizationComponent } from './shelf-optimization.component';

describe('ShelfOptimizationComponent', () => {
  let component: ShelfOptimizationComponent;
  let fixture: ComponentFixture<ShelfOptimizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShelfOptimizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShelfOptimizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
