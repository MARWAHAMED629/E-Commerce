import { TestBed } from '@angular/core/testing';

import { UsersIdService } from './users-id.service';

describe('UsersIdService', () => {
  let service: UsersIdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersIdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
