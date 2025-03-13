import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { OpenFoodFactsIngredient, Options } from '../../types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OpenFoodFactsApiService {
  constructor(private apiService: ApiService) {}

  fetchIngredientFromBarcode(
    decodedText: string,
    options?: Options,
  ): Observable<OpenFoodFactsIngredient> {
    const url = `https://world.openfoodfacts.net/api/v2/product/${decodedText}?fields=code,product_name,brands_tags,stores_tags,image_url,serving_size,energy-kcal_100g,energy_100g,fat_100g,carbohydrates_100g,sugars_100g,proteins_100g,fiber_100g,salt_100g`;
    return this.apiService.get(url, options);
  }
}
