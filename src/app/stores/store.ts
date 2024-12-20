import { BehaviorSubject, Observable } from "rxjs";

export class Store<E, T> {
    states$: Observable<StoreState<E, T>>;
    protected _states$: BehaviorSubject<StoreState<E, T>>;

    constructor(initialEvent: E, initialData: T) {
        this._states$ = new BehaviorSubject({
            event: initialEvent,
            data: initialData
        });

        this.states$ = this._states$.asObservable();
    }

    setState(event: E, newState: Partial<T> = {}): void {
        const data = this._states$.value.data;

        const newData = {
            ...data,
            ...newState
        };

        const state = {
            data: newData,
            event: event
        }

        this._states$.next(state);
    }
}

export class StoreState<E, T> {
    data: T;
    event: E;
}