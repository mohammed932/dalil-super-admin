import { TestBed } from '@angular/core/testing';
import { HttpDeliveryService } from './delivery.service';

describe('HttpDeliveryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpDeliveryService = TestBed.get(HttpDeliveryService);
    expect(service).toBeTruthy();
  });
});
