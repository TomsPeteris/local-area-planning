import { Injectable, ErrorHandler } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private router: Router) {}

  handleError(): void {
    this.router.navigate(["/error"]);
  }
}
