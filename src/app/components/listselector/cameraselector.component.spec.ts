import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CameraselectorComponent } from './cameraselector.component';

describe('CameraselectorComponent', () => {
  let component: CameraselectorComponent;
  let fixture: ComponentFixture<CameraselectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CameraselectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CameraselectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
