import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivitiesOwnersComponent } from './activites-owners.component';

describe('ActivitiesOwnersComponent', () => {
  let component: ActivitiesOwnersComponent;
  let fixture: ComponentFixture<ActivitiesOwnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActivitiesOwnersComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesOwnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
