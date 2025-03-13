import { TestBed } from '@angular/core/testing';

import { OpenFoodFactsApiService } from './open-food-facts-api.service';

describe('OpenFoodFactsApiService', () => {
  let service: OpenFoodFactsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenFoodFactsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
