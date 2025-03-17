import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Ingredient, Recipe, User } from '../../types';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotionApiService {
  fqdm = 'https://dev.kcalculator:3000';
  user: User;
  recipes: Recipe[];
  ingredients: Ingredient[];

  constructor(private apiService: ApiService) {}

  authorize(body: { code: string }): Observable<string> {
    return this.apiService.post(`${this.fqdm}/api/authorize`, body, {
      withCredentials: true,
    });
  }

  authenticate(): Observable<User> {
    return this.apiService.get(`${this.fqdm}/api/authenticate`, {
      withCredentials: true,
    });
  }

  getRecipes(): Observable<Recipe[]> {
    return this.apiService.get(`${this.fqdm}/api/getrecipes`, {
      withCredentials: true,
    });
  }

  getIngredients(): Observable<Ingredient[]> {
    return this.apiService.get(`${this.fqdm}/api/getingredients`, {
      withCredentials: true,
    });
  }

  async fetchAppdata() {
    await this.fetchRecipes();
    await this.fetchIngredients();
  }

  async fetchRecipes() {
    if (!sessionStorage.getItem('recipes')) {
      console.log('FETCHING RECIPES...');

      let recipes;
      try {
        const observable = this.getRecipes();
        recipes = await firstValueFrom(observable);
      } catch (err: any) {
        console.error(`ERROR FETCHING RECIPES: ${err.error}`);
      }

      console.log(recipes);

      const recipesB64 = JSON.stringify(recipes);
      sessionStorage.setItem('recipes', recipesB64);
    } else {
      console.log('RECIPES ALREADY FETCHED, SKIPPING...');
      const recipes: Recipe[] = JSON.parse(
        sessionStorage.getItem('recipes') as string,
      );
      this.recipes = recipes;
      console.log(this.recipes);
    }
  }

  async fetchIngredients() {
    if (!sessionStorage.getItem('ingredients')) {
      console.log('FETCHING INGREDIENTS...');

      let ingredients;
      try {
        const observable = this.getIngredients();
        ingredients = await firstValueFrom(observable);
      } catch (err: any) {
        console.error(`ERROR FETCHING INGREDIENTS: ${err.error}`);
      }

      console.log('FETCHING INGREDIENTS SUCCESS!');
      console.log(ingredients);

      const ingredientsB64 = JSON.stringify(ingredients);
      sessionStorage.setItem('ingredients', ingredientsB64);
    } else {
      console.log('INGREDIENTS ALREADY FETCHED, SKIPPING...');
      const ingredients: Ingredient[] = JSON.parse(
        sessionStorage.getItem('ingredients') as string,
      );
      this.ingredients = ingredients;
      console.log(this.ingredients);
    }
  }
}
