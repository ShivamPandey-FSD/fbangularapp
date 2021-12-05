import { TestBed } from '@angular/core/testing';

import { PostHelperService } from './post-helper.service';

describe('PostHelperService', () => {
  let service: PostHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
