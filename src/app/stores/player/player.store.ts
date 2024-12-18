import { Injectable } from "@angular/core";
import { Store } from "../store";
import { PlayerStoreData, PlayerStoreEvent } from "./player-store.data";

@Injectable({
    providedIn: 'root'
})
export class PlayerStore extends Store<PlayerStoreEvent, PlayerStoreData> {
    constructor() {
        const initialData = new PlayerStoreData({});
        super(PlayerStoreEvent.initialized, initialData);
    }

    resume(): void {
        this.setState(PlayerStoreEvent.resume);
    }

    pause(): void {
        this.setState(PlayerStoreEvent.pause)
    }

    next(): void {
        const current = this._states$.getValue().data;
        current.index += 1;
        this.setState(PlayerStoreEvent.next, current);
    }

    previous(): void {
        const current = this._states$.getValue().data;
        current.index -= 1;
        this.setState(PlayerStoreEvent.previous, current);
    }
}