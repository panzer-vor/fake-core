import {State as MainState} from "main/type";
import {State as AccountState} from "account/type";
import {State} from "core-fe";

interface CoreApp {
    main: MainState;
    account: AccountState;
}

interface CoreState<T = {}> extends State {
    app: T & CoreApp;
}

export {CoreState};
