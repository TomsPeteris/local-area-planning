import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  OnChanges,
  ViewContainerRef,
} from "@angular/core";
import { MatProgressSpinner } from "@angular/material/progress-spinner";

@Directive({
  selector: "[appLoadingOnSubmit]",
  standalone: true,
})
export class LoadingOnSubmitDirective implements OnChanges {
  @Input("appLoadingOnSubmit") isLoading!: boolean;
  private overlayElement: HTMLElement | null = null;
  private progressElement: HTMLElement | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnChanges(): void {
    if (this.isLoading) {
      this.showLoadingOverlay();
    } else {
      this.hideLoadingOverlay();
    }
  }

  private showLoadingOverlay(): void {
    if (!this.overlayElement) {
      this.overlayElement = this.renderer.createElement("div");
      this.renderer.addClass(this.overlayElement, "overlay");

      const componentRef =
        this.viewContainerRef.createComponent(MatProgressSpinner);
      const spinnerInstance = componentRef.instance;
      spinnerInstance.diameter = 40;
      spinnerInstance.mode = "indeterminate";

      this.progressElement = componentRef.location.nativeElement;

      this.renderer.appendChild(this.overlayElement, this.progressElement);

      this.renderer.appendChild(this.el.nativeElement, this.overlayElement);
    }
  }

  private hideLoadingOverlay(): void {
    if (this.overlayElement) {
      this.renderer.removeChild(this.el.nativeElement, this.overlayElement);
      this.overlayElement = null;
    }
  }
}
