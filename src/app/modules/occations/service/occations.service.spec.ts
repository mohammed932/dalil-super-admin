import { TestBed } from '@angular/core/testing';

import { HttpOccationsService } from './occations.service';

describe('HttpOccationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpOccationsService = TestBed.get(HttpOccationsService);
    expect(service).toBeTruthy();
  });
});
