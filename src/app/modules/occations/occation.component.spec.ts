import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OccationComponent } from './occation.component';


describe('OccationComponent', () => {
  let component: OccationComponent;
  let fixture: ComponentFixture<OccationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OccationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OccationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
