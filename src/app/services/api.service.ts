import { from, mergeMap, Observable, take, tap } from "rxjs";
import { SongDbModel } from "../core/models/song";
import Database, { QueryResult } from "@tauri-apps/plugin-sql";

export class ApiService {
    getSongs(): Observable<Array<SongDbModel>> {
        const db$ = from(Database.load("sqlite:test.db"));

        return db$.pipe(
            take(1),
            mergeMap((db) => {
                return from(db.select<SongDbModel[]>("SELECT * FROM songs"));
            })
        );
    }

    createSong(song: SongDbModel): Observable<QueryResult> {
        console.log('Creating song')
        const db$ = from(Database.load("sqlite:test.db"));

        return db$.pipe(
            take(1),
            mergeMap((db) => {
                return from(
                    db.execute(`INSERT INTO songs (addedOn, modifiedOn, timesPlayed, rating, isFavorite, title, year, album, albumArtist, filePath) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                    [song.addedOn, song.modifiedOn, song.timesPlayed, song.rating, song.isFavorite, song.title, song.year, song.album, song.albumArtist, song.filePath])
                );
            })
        );
    }
}