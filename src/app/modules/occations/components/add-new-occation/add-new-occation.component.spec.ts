import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddNewOccationComponent } from './add-new-occation.component';


describe('AddNewOccationComponent', () => {
  let component: AddNewOccationComponent;
  let fixture: ComponentFixture<AddNewOccationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewOccationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewOccationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
