import { TestBed } from '@angular/core/testing';
import { HttpActivitiesOwnersService } from './activities-owners.service';

describe('HttpActivitiesOwnersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpActivitiesOwnersService = TestBed.get(HttpActivitiesOwnersService);
    expect(service).toBeTruthy();
  });
});
