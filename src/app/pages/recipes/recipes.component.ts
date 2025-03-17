import { Component } from '@angular/core';
import { RecipeComponent } from '../../recipe/recipe.component';
import { NotionApiService } from '../../services/notionApi.service';
import { Recipe } from '../../../types';
import { BtnComponent } from '../../components/btn/btn.component';

@Component({
  selector: 'app-recipes',
  imports: [BtnComponent, RecipeComponent],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss',
})
export class RecipesComponent {
  recipes: Recipe[];

  constructor(private notionApiService: NotionApiService) {
    this.recipes = this.notionApiService.recipes;
  }
}
