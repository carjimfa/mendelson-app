import { Injectable } from "@angular/core";
import { Store } from "../store";
import { PlayerStoreData, PlayerStoreEvent } from "./player-store.data";
import { Song } from "../../core/models/song";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PlayerStore extends Store<PlayerStoreEvent, PlayerStoreData> {
    playerData$: Observable<PlayerStoreData>;

    constructor() {
        const initialData = new PlayerStoreData({});
        super(PlayerStoreEvent.initialized, initialData);

        this.playerData$ = this.states$.pipe(
            map((s) => new PlayerStoreData(s.data))
        );
    }

    play(playlist: Array<Song>, startAt = 0) {
        const newState: PlayerStoreData = new PlayerStoreData({
            playlist,
            order: playlist.map((e, i) => i),
            index: startAt
        });

        this.setState(PlayerStoreEvent.play, newState);
    }

    resume(): void {
        this.setState(PlayerStoreEvent.resume);
    }

    pause(): void {
        this.setState(PlayerStoreEvent.pause)
    }

    next(): void {
        const current = this._states$.getValue().data;

        if (current.index === current.playlist.length - 1 && current.onRepeat) {
            current.index = 0;
        } else {
            current.index += 1;
        }

        this.setState(PlayerStoreEvent.next, current);
    }

    previous(): void {
        const current = this._states$.getValue().data;

        if (current.index === 0 && current.onRepeat) {
            current.index = current.playlist.length - 1;
        } else {
            current.index -= 1;
        }

        this.setState(PlayerStoreEvent.previous, current);
    }

    timeupdate(currentTime: number): void {
        const current = this._states$.getValue().data;
        current.currentTime = Math.floor(currentTime);
        this.setState(PlayerStoreEvent.timeupdate, current);
    }

    toggleRepeat(): void {
        const current = new PlayerStoreData(this._states$.getValue().data);
        current.onRepeat = !current.onRepeat;
        this.setState(current.onRepeat ? PlayerStoreEvent.repeatOn : PlayerStoreEvent.repeatOff, current);
    }

    toggleShuffle(): void {
        const current = new PlayerStoreData(this._states$.getValue().data);
        current.shuffle = !current.shuffle;
        const currentId = current.nowPlaying?.id;

        current.order = current.shuffle
            ? this.shuffleOrder(current.order, current.index)
            : Array.from(new Array(current.order.length).keys());

        current.index = current.shuffle
            ? 0
            : current.playlist.findIndex((d) => d.id === currentId);

        this.setState(
            current.shuffle
                ? PlayerStoreEvent.shuffleOn
                : PlayerStoreEvent.shuffleOff,
            current
        );
    }

    shuffleOrder(order: Array<number>, currentIndex: number): Array<number> {
        const newOrder = [];
        const oldOrder = [...order];
        const total = oldOrder.length - 1;

        newOrder.push(oldOrder[currentIndex]);
        oldOrder.splice(currentIndex, 1);

        for (let i = 0; i < total; i++) {
            const position = Math.floor(Math.random() * (oldOrder.length - 1));

            if (position !== currentIndex) {
                newOrder.push(oldOrder[position]);
                oldOrder.splice(position, 1);
            }
        }

        return newOrder;
    }
}