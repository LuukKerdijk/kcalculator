import { Component, ElementRef, input, InputSignal } from '@angular/core';
import { DotLottie } from '@lottiefiles/dotlottie-web';

@Component({
    selector: 'app-loading',
    imports: [],
    templateUrl: './loading.component.html',
    styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  color = input("light")

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    // set animation url (lottiefiles cdn)
    let animationUrl = "";
    
    switch(this.color()) {
      case "light":
        animationUrl = "https://lottie.host/60344a14-d2b0-47e4-b04c-edc3e0125947/Xny77JmS2B.lottie";
        break;
      case "dark":
        animationUrl = "https://lottie.host/f64cd7e1-b1ab-493a-b664-7df97857b3c7/pjYgtI20Td.lottie";
        break;
    }

    // animation while fetching recipes
    const dotlottieCanvas: HTMLCanvasElement = this.elementRef.nativeElement.querySelector('#dotlottie-canvas');

    const dotLottie = new DotLottie({
      autoplay: true,
      loop: true,
      canvas: dotlottieCanvas,
      src: animationUrl, // or .json file
    });
  }
}
