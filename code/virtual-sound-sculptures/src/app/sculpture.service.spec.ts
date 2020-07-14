import { TestBed } from '@angular/core/testing';

import { SculptureService } from './sculpture.service';

describe('SculptureService', () => {
  let service: SculptureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SculptureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
