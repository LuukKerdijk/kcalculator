import { Component, ElementRef, input } from '@angular/core';

@Component({
    selector: 'app-label',
    imports: [],
    templateUrl: './label.component.html',
    styleUrl: './label.component.scss'
})
export class LabelComponent {
  title = input.required<string>();
  description = input<string>();
  color = input<
    'red' | 'pink' | 'orange' | 'blue' | 'purple' | 'turqoise' | 'green'
  >();
  descriptionPosition: { x: 'right' | 'left'; y: 'top' | 'bottom' } | undefined;
  descriptionOpened = false;

  constructor(private self: ElementRef) {}

  ngOnInit() {
    this.calculateDescriptionPosition();
  }

  calculateDescriptionPosition() {
    const boundingClientRect = this.self.nativeElement.getBoundingClientRect();
    const labelPosition = {
      x: boundingClientRect.x + boundingClientRect.width / 2,
      y: boundingClientRect.y + boundingClientRect.height / 2,
    };
    this.descriptionPosition = {
      x: labelPosition.x < window.innerWidth / 2 ? 'right' : 'left',
      y: labelPosition.y < window.innerHeight / 2 ? 'bottom' : 'top',
    };
    //console.log(boundingClientRect);
    //console.log(labelPosition);
    console.log(this.descriptionPosition);
  }

  toggleDescription() {
    this.descriptionOpened
      ? (this.descriptionOpened = false)
      : (this.descriptionOpened = true);
  }
}
