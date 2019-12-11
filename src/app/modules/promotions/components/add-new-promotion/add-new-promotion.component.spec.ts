import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddNewPromotionComponent } from './add-new-promotion.component';


describe('AddNewAreaComponent', () => {
  let component: AddNewPromotionComponent;
  let fixture: ComponentFixture<AddNewPromotionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewPromotionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
