import { Song } from "../../core/models/song";

export class PlayerStoreData {
    playlist: Array<Song> = [];
    order: Array<number> = [];
    index = 0;
    currentTime = 0;
    onRepeat = true;
    shuffle = false;

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
    previous = 'previous',
    timeupdate = 'timeupdate',
    shuffleOn = 'shuffle-on',
    shuffleOff = 'shuffle-off',
    repeatOn = 'repeat-on',
    repeatOff = 'repeat-off'
}