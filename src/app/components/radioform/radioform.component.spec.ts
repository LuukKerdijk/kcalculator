import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioformComponent } from './radioform.component';

describe('RadioformComponent', () => {
  let component: RadioformComponent;
  let fixture: ComponentFixture<RadioformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RadioformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
