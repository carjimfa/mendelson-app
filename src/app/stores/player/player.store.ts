import { Injectable } from "@angular/core";
import { Store } from "../store";
import { PlayerStoreData } from "./player-store.data";

@Injectable({
    providedIn: 'root'
})
export class PlayerStore extends Store<PlayerStoreData> {
    constructor() {
        const initialData: PlayerStoreData = {
            song: undefined
        };

        super(initialData);
    }
}