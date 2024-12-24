import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FeedComponent } from '../feed/feed.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [SidebarComponent, FeedComponent],
})
export class DashboardComponent {
  // Component logic will go here
}
