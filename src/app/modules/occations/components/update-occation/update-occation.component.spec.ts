import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateOccationComponent } from './update-occation.component';


describe('UpdateOccationComponent', () => {
  let component: UpdateOccationComponent;
  let fixture: ComponentFixture<UpdateOccationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateOccationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateOccationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
