import { TestBed } from '@angular/core/testing';

import { AllorderService } from './allorder.service';

describe('AllorderService', () => {
  let service: AllorderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllorderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
