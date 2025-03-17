import { Component, input } from '@angular/core';

@Component({
    selector: 'app-card',
    imports: [],
    templateUrl: './card.component.html',
    styleUrl: './card.component.scss'
})
export class CardComponent {
  color = input<'primary' | 'secondary' | 'tertiary' | 'accent'>('secondary');
  border = input<'primary' | 'secondary' | 'tertiary' | 'accent'>();
  shadow = input<boolean>(false);
}
