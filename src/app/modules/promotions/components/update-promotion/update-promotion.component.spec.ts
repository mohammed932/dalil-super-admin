import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdatePromotionComponent } from './update-promotion.component';

describe('AddNewAreaComponent', () => {
  let component: UpdatePromotionComponent;
  let fixture: ComponentFixture<UpdatePromotionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatePromotionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
