import { SongMetadata } from "./song.metadata";

export class SongDbModel extends SongMetadata {
    id: string;
    addedOn: Date;
    modifiedOn: Date;
    timesPlayed: number;
}