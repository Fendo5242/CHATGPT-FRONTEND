import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { navbarGuard } from './navbar.guard';

describe('navbarGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => navbarGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
