import { from, mergeMap, Observable, take, tap } from "rxjs";
import { Song } from "../core/models/song";
import Database, { QueryResult } from "@tauri-apps/plugin-sql";
import { Album } from "../core/models/album";
import { DbQueryBuilder } from "../core/db-query-builder";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    getSongs(): Observable<Array<Song>> {
        const db$ = from(Database.load("sqlite:test.db"));

        const queryBuilder = new DbQueryBuilder();
        queryBuilder.select('songs');

        return db$.pipe(
            take(1),
            mergeMap((db) => {
                return from(db.select<Song[]>(queryBuilder.build()));
            })
        );
    }

    createSong(song: Song): Observable<QueryResult> {
        const db$ = from(Database.load("sqlite:test.db"));

        const queryBuilder = new DbQueryBuilder();
        queryBuilder.insert(
            'songs',
            ['addedOn', 'modifiedOn', 'timesPlayed', 'rating', 'isFavorite', 'title', 'year', 'album', 'albumArtist', 'filePath']
        );

        return db$.pipe(
            take(1),
            mergeMap((db) => {
                return from(
                    db.execute(
                        queryBuilder.build(),
                        [song.addedOn, song.modifiedOn, song.timesPlayed, song.rating, song.isFavorite, song.title, song.year, song.album, song.albumArtist, song.filePath]
                    )
                );
            })
        );
    }

    getAlbums(): Observable<Array<Album>> {
        const db$ = from(Database.load("sqlite:test.db"));

        const builder = new DbQueryBuilder();

        builder.select('songs', ['album as title', 'MAX(albumArtist) as albumArtist'])
            .groupBy('album');

        return db$.pipe(
            take(1),
            mergeMap((db) => {
                return from(db.select<Album[]>("SELECT album as title, MAX(albumArtist) as albumArtist FROM songs GROUP BY album"));
            })
        );
    }
}