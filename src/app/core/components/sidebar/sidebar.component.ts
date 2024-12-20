import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppRoutes } from '../../../app.routes';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ImportService } from '../../../services/import.service';

@Component({
  selector: 'app-sidebar',
  imports: [
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    RouterModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  appRoutes = AppRoutes;

  constructor(
    private readonly importService: ImportService
  ) { }

  openFileSelectorDialog(): void {
    this.importService.importSongsWithDialog().subscribe();
  }
}
