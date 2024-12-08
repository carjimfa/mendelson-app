import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ApiServicesFactory } from '../../services/api-services.factory';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SongDbModel } from '../../core/models/song';
import { take } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-songs',
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule
  ],
  providers: [
    {
      provide: ApiService,
      useFactory: ApiServicesFactory
    }
  ],
  templateUrl: './songs.component.html',
  styleUrl: './songs.component.scss'
})
export class SongsComponent {
  data: Array<SongDbModel>;
  displayedColumns: string[] = ['title', 'albumArtist', 'album'];

  constructor(private readonly apiService: ApiService) {
    this.getSongs();
  }

  getSongs(): void {
    this.apiService.getSongs().pipe(take(1)).subscribe((data) => {
      this.data = data;
      console.log(this.data);
    });
  }
}
