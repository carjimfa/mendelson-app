import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { take, tap } from 'rxjs';
import { Album } from '../../core/models/album';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-albums',
  imports: [
    MatTableModule
  ],
  templateUrl: './albums.component.html',
  styleUrl: './albums.component.scss'
})
export class AlbumsComponent {
  data: Array<Album>;
  displayedColumns: string[] = ['title', 'albumArtist'];

  constructor(private readonly apiService: ApiService) {
    this.getAlbums();
  }

  getAlbums(): void {
    this.apiService.getAlbums()
      .pipe(
        take(1),
        tap((albums) => {
          this.data = albums;
        })
      )
      .subscribe();
  }
}
