import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeighComponent } from './weigh.component';

describe('WeighComponent', () => {
  let component: WeighComponent;
  let fixture: ComponentFixture<WeighComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeighComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeighComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
