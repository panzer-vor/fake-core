export interface MainState {
    loading: boolean;
}
export interface NavState {
    nav: {
        collapsed: boolean;
    };
}

export interface State extends MainState, NavState {}
