import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClipperServicesComponent } from './dayoffs.component';

describe('ClipperServicesComponent', () => {
  let component: ClipperServicesComponent;
  let fixture: ComponentFixture<ClipperServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClipperServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClipperServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
