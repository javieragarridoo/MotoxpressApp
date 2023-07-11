import { TestBed } from '@angular/core/testing';

import { AuthriderService } from './authrider.service';

describe('AuthriderService', () => {
  let service: AuthriderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthriderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
