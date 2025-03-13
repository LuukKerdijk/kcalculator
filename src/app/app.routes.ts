import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DailymacrosComponent } from './pages/dailymacros/dailymacros.component';
import { IngredientsComponent } from './pages/ingredients/ingredients.component';
import { RecipesComponent } from './pages/recipes/recipes.component';
import { WeighComponent } from './pages/weigh/weigh.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dailymacros', component: DailymacrosComponent },
  { path: 'ingredients', component: IngredientsComponent },
  { path: 'recipes', component: RecipesComponent },
  { path: 'weigh', component: WeighComponent },
];
