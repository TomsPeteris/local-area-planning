import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-base-layout',
  imports: [RouterOutlet],
  templateUrl: './base-layout.component.html',
  styleUrl: './base-layout.component.scss',
})
export class BaseLayoutComponent {}
