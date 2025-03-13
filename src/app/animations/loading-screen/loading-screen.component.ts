import { Component, ElementRef, input } from '@angular/core';
import { DotLottie } from '@lottiefiles/dotlottie-web';
import { LoadingComponent } from '../loading/loading.component';

@Component({
    selector: 'app-loading-screen',
    imports: [LoadingComponent],
    templateUrl: './loading-screen.component.html',
    styleUrl: './loading-screen.component.scss'
})
export class LoadingScreenComponent {
  text = input("loading...");

  constructor(
    private elementRef: ElementRef
  ) {}

  ngAfterViewInit() {
    // animation while fetching recipes
    const dotlottieCanvas: HTMLCanvasElement = this.elementRef.nativeElement.querySelector('#dotlottie-canvas');

    const dotLottie = new DotLottie({
      autoplay: true,
      loop: true,
      canvas: dotlottieCanvas,
      src: "animations/loading-animation.json", // or .json file
    });
  }
}
