import { Song } from "../../core/models/song";

export class PlayerStoreData {
    playlist: Array<Song> = [];
    order: Array<number> = [];
    index = 0;

    get nowPlaying(): Song | null {
        if (this.playlist?.length && this.order?.length) {
            return this.playlist[this.order[this.index]]
        }

        return null;
    }

    constructor(values: Partial<PlayerStoreData>) {
        Object.assign(this, values);
    }
}

export enum PlayerStoreEvent {
    initialized = 'initialized',
    play = 'play',
    resume = 'resume',
    pause = 'pause',
    next = 'next',
    previous = 'previous'
}