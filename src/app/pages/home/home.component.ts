// components
import { Component } from '@angular/core';
import { CardComponent } from "../../card/card.component";
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-home',
    imports: [RouterModule, CardComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(
  ) {}

  ngOnInit() {
  }
}
