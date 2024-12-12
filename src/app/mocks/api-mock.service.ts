import { Song } from "../core/models/song";
import { ApiService } from "../services/api.service";
import songs from "./songs.json";
import { Observable, of } from "rxjs"
import { Injectable } from "@angular/core";
import { QueryResult } from "@tauri-apps/plugin-sql";
import { Album } from "../core/models/album";

@Injectable({
    providedIn: 'root'
})
export class ApiMockService implements ApiService {
    constructor() {

    }

    getSongs(): Observable<Array<Song>> {
        const songList = songs.map((a) => new Song(a));
        return of(songList);
    }

    createSong(song: Song): Observable<QueryResult> {
        return of();
    }

    getAlbums(): Observable<Array<Album>> {
        return of();
    }
}