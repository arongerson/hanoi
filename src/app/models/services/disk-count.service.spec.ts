import { TestBed } from '@angular/core/testing';

import { DiskCountService } from './disk-count.service';

describe('DiskCountService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DiskCountService = TestBed.get(DiskCountService);
    expect(service).toBeTruthy();
  });
});
