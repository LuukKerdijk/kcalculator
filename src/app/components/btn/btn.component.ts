import {
  Component,
  ContentChild,
  effect,
  ElementRef,
  input,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { LoadingComponent } from '../../animations/loading/loading.component';

@Component({
  selector: 'app-btn',
  imports: [LoadingComponent],
  templateUrl: './btn.component.html',
  styleUrl: './btn.component.scss',
})
export class BtnComponent {
  color = input<'primary' | 'secondary' | 'tertiary' | 'accent'>();
  border = input<'primary' | 'secondary' | 'tertiary' | 'accent'>();
  contentColor = input<'dark' | 'light'>('dark');
  round = input<boolean>(false);
  shadow = input<boolean>(false);
  async = input<boolean>(false);
  loading = input<boolean>(false);

  @ViewChild('ngcontent') ngcontent: TemplateRef<any>;
  @ViewChild('vcr', { static: false, read: ViewContainerRef })
  vcr!: ViewContainerRef;
  @ContentChild('text') text: ElementRef<HTMLParagraphElement>;
  @ContentChild('icon') icon: ElementRef<any>;

  constructor(private renderer: Renderer2) {
    effect(() => {
      if (this.async() && this.loading() && this.text) {
        this.renderer.setStyle(this.text.nativeElement, 'opacity', '0');
      } else if (this.async() && this.text) {
        this.renderer.setStyle(this.text.nativeElement, 'opacity', '100');
      }
    });
  }

  ngAfterViewInit() {
    this.vcr.createEmbeddedView(this.ngcontent);
    this.renderNgContentStyles();
  }

  renderNgContentStyles() {
    if (this.contentColor() == 'light' && this.text) {
      this.renderer.addClass(this.text.nativeElement, 'text-secondary');
    }

    if (this.contentColor() == 'dark' && this.icon) {
      //this.renderer.setStyle(this.icon.nativeElement, "color", "secondary");
      this.renderer.addClass(this.icon.nativeElement, 'text-tertiary');
    }
  }
}
