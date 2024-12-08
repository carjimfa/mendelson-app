import { SongMetadata } from "./song.metadata";

export class SongDbModel extends SongMetadata {
    id: number;
    addedOn: Date;
    modifiedOn: Date;
    timesPlayed = 0;
    rating = 0;
    isFavorite = false;
    genreNormalized?: string;

    constructor(values: Partial<SongDbModel>) {
        super(values);
        Object.assign(this, values);
    }
}