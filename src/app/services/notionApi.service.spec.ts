import { TestBed } from '@angular/core/testing';

import { RecipesService } from './notionApi.service';

describe('RecipesService', () => {
  let service: RecipesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
