import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddNewDeliveryComponent } from './add-new-delivery.component';


describe('AddNewAreaComponent', () => {
  let component: AddNewDeliveryComponent;
  let fixture: ComponentFixture<AddNewDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewDeliveryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
