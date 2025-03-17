import { Component, Input } from '@angular/core';
import { Recipe } from '../../types';
import { CardComponent } from '../card/card.component';
import { BtnComponent } from '../components/btn/btn.component';

@Component({
  selector: 'app-recipe',
  imports: [CardComponent, BtnComponent],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.scss',
})
export class RecipeComponent {
  @Input() recipe: Recipe;
  dropdownOpened = false;

  toggleDropdown() {
    this.dropdownOpened
      ? (this.dropdownOpened = false)
      : (this.dropdownOpened = true);
  }
}
