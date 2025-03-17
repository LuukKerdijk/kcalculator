import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DailymacrosComponent } from './dailymacros.component';

describe('DailymacrosComponent', () => {
  let component: DailymacrosComponent;
  let fixture: ComponentFixture<DailymacrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailymacrosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DailymacrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
