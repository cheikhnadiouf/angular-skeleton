import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SpinnerService } from './spinner.service';

describe('SpinnerService', () => {
  let service: SpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with visibility false', () => {
    service.visibility.subscribe(visible => {
      expect(visible).toBe(false);
    });
  });

  it('should show spinner', () => {
    service.show();
    service.visibility.subscribe(visible => {
      expect(visible).toBe(true);
    });
  });

  it('should hide spinner', () => {
    service.show();
    service.hide();
    service.visibility.subscribe(visible => {
      expect(visible).toBe(false);
    });
  });
});