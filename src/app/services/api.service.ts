import { from, mergeMap, Observable, take, tap } from "rxjs";
import { Song } from "../core/models/song";
import Database, { QueryResult } from "@tauri-apps/plugin-sql";
import { Album } from "../core/models/album";

export class ApiService {
    getSongs(): Observable<Array<Song>> {
        const db$ = from(Database.load("sqlite:test.db"));

        return db$.pipe(
            take(1),
            mergeMap((db) => {
                return from(db.select<Song[]>("SELECT * FROM songs"));
            })
        );
    }

    createSong(song: Song): Observable<QueryResult> {
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

    getAlbums(): Observable<Array<Album>> {
        const db$ = from(Database.load("sqlite:test.db"));

        return db$.pipe(
            take(1),
            mergeMap((db) => {
                return from(db.select<Album[]>("SELECT album as title, MAX(albumArtist) as albumArtist FROM songs GROUP BY album"));
            })
        );
    }
}