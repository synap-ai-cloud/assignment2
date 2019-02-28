import { TestBed } from '@angular/core/testing';

import { VMService } from './vm.service';

describe('VMService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VMService = TestBed.get(VMService);
    expect(service).toBeTruthy();
  });
});
