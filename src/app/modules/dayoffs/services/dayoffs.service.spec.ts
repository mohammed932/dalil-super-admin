import { TestBed } from '@angular/core/testing';
import { HttpDayOffsService } from './dayoffs.service';


describe('HttpDayOffsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpDayOffsService = TestBed.get(HttpDayOffsService);
    expect(service).toBeTruthy();
  });
});
