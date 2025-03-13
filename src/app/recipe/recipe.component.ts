import { Component, Input } from '@angular/core';
import { Recipe, StyleParams } from '../../types';
import { CardComponent } from '../card/card.component';
import { BtnComponent } from "../components/btn/btn.component";

@Component({
    selector: 'app-recipe',
    imports: [CardComponent, BtnComponent],
    templateUrl: './recipe.component.html',
    styleUrl: './recipe.component.scss'
})
export class RecipeComponent {
  @Input() recipe: Recipe;

  // params
  iconProtein = { type: "protein", }
  iconKcal = { type: "kcal", }
  iconRecipeDropdown = { type: "arrow", styles: {'transform-origin': 'center', transform: 'rotate(90deg)'} }
  btnChooseRecipe = { type: "arrow" };
  iconError = { type: "error" }

  // recipeOpened state
  recipeOpened: boolean = false;
  recipeInfoStyles: StyleParams = {"grid-template-rows": "0fr"};
  iconDropdownStyles: StyleParams = {"transform": "scaleY(1)"};
  
  openRecipeInfo() {
    console.log("dropdown clicked!")
    if(!this.recipeOpened) {
      this.recipeOpened = true;
      const newRecipeStyles = Object.assign({}, this.recipeInfoStyles)
      newRecipeStyles["grid-template-rows"] = "1fr";
      this.recipeInfoStyles = newRecipeStyles;

      const newDropdownStyles = Object.assign({}, this.iconDropdownStyles);
      newDropdownStyles["transform"] = "scaleY(-1)"
      this.iconDropdownStyles = newDropdownStyles;
    } else {
      this.recipeOpened = false;
      const newStyles = Object.assign({}, this.recipeInfoStyles)
      newStyles["grid-template-rows"] = "0fr";
      this.recipeInfoStyles = newStyles

      const newDropdownStyles = Object.assign({}, this.iconDropdownStyles);
      newDropdownStyles["transform"] = "scaleY(1)"
      this.iconDropdownStyles = newDropdownStyles;
    }
  }

  hasImage: boolean;

  ngOnInit() {
    // display recipe img if available, else display error icon
    if (this.recipe.cover != null) {
      this.hasImage = true;
    }
  }
}
