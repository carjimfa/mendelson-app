import { SongDbModel } from "../core/models/song";
import { ApiService } from "./api.service";
import songs from "../mocks/songs.json";
import { Observable, of } from "rxjs"
import { Injectable } from "@angular/core";
import { QueryResult } from "@tauri-apps/plugin-sql";

@Injectable({
    providedIn: 'root'
})
export class ApiMockService implements ApiService {
    getSongs(): Observable<Array<SongDbModel>> {
        const songList = songs.map((a) => new SongDbModel(a));
        return of(songList);
    }

    createSong(song: SongDbModel): Observable<QueryResult> {
        return of();
    }
}