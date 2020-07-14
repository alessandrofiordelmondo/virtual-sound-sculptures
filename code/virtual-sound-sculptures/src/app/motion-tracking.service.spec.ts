import { TestBed } from '@angular/core/testing';

import { MotionTrackingService } from './motion-tracking.service';

describe('MotionTrackingService', () => {
  let service: MotionTrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MotionTrackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
