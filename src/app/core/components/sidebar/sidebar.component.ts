import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppRoutes } from '../../../app.routes';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  appRoutes = AppRoutes;
}
