import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Options, Recipe, User } from '../../types';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotionApiService {
  // fqdm = "http://http://localhost:3000";
  fqdm = "https://dev.kcalculator:3000";
  authorized: boolean;
  user: User;
  appData: {
    recipes: Recipe[]
  };
  
  constructor(
    private apiService: ApiService
  ) {}

  authenticate(url: string, options?: Options): Observable<User> {
    return this.apiService.get(url, options);
  }

  authorize(url: string, body: {code: string}, options?: Options): Observable<User> {
    return this.apiService.post(url, body, options);
  }

  getRecipes(url: string, options?: Options): Observable<Recipe[]> {
    return this.apiService.get(url, options);
  }

  async fetchAppData(): Promise<{recipes: Recipe[]}> {
    console.info("FETCHING APPDATA FROM NOTION...");

    // if (!sessionStorage.getItem("recipes")) {
    //   console.log("FETCHING DAILY MACROS...");
    // }

    if (!sessionStorage.getItem("recipes")) {
      console.log("FETCHING RECIPES..."); 
      try {
        const observable = this.getRecipes(`${this.fqdm}/api/getrecipes`, {withCredentials: true});
        const recipes: Recipe[] = await firstValueFrom(observable);
        
        console.log("FETCHING RECIPES SUCCESS!");
        console.log(recipes)

        const recipesB64 = JSON.stringify(recipes);
        sessionStorage.setItem("recipes", recipesB64);
      } 
      catch (err: any) {
        console.error(`FETCHING ERROR: ${JSON.stringify(err.error.errors)}`);
      }
    } else {
      console.log("RECIPES ALREADY FETCHED, SKIPPING...");
      const recipes: Recipe[] = JSON.parse(sessionStorage.getItem("recipes") as string);
      this.appData = {recipes: recipes};
    }

    // if(!sessionStorage.getItem("ingredients")) {
    //   console.log("FETCHING INGREDIENTS");
    // }

    return this.appData;
  }
}
