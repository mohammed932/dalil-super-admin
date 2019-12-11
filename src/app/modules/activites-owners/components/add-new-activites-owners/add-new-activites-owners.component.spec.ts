import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddNewActivitiesOwnerComponent } from './add-new-activites-owners.component';


describe('AddNewActivitiesOwnerComponent', () => {
  let component: AddNewActivitiesOwnerComponent;
  let fixture: ComponentFixture<AddNewActivitiesOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewActivitiesOwnerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewActivitiesOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
