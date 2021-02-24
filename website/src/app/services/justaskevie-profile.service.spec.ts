import { TestBed } from '@angular/core/testing';

import { JustAskEvieProfileService } from './justaskevie-profile.service';

describe('JustAskEvieProfileService', () => {
  let service: JustAskEvieProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JustAskEvieProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
