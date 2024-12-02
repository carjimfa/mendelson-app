import { Song } from "./song";

export class SongDbModel extends Song {
    id: string;
    addedOn: Date;
    modifiedOn: Date;
}