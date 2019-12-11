import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayOffsComponent } from './dayoffs.component';

describe('DayOffsComponent', () => {
  let component: DayOffsComponent;
  let fixture: ComponentFixture<DayOffsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DayOffsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayOffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
