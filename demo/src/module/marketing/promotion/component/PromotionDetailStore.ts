import {Item, Restaurant} from "../type";
import * as R from "ramda";
import {PromotionApplyTypeAJAXView} from "type/api";

export const detailTypes = {
    CHANGE_APPLIED_TO: Symbol("CHANGE_APPLIED_TO"),
    CHANGE_RESTAURANTS: Symbol("CHANGE_RESTAURANTS"),
    CHANGE_RESTAURANTS_MENUS: Symbol("CHANGE_RESTAURANTS_MENUS"),
    CHANGE_RESTAURANTS_MEALS: Symbol("CHANGE_RESTAURANTS_MEALS"),
    CHANGE_RESTAURANTS_RESPONSE: Symbol("CHANGE_RESTAURANTS_RESPONSE"),
    CHANGE_ALL_RESTAURANTS_MENUS_RESPONSE: Symbol("CHANGE_ALL_RESTAURANTS_MENUS_RESPONSE"),
    CHANGE_ALL_RESTAURANTS_MEALS_RESPONSE: Symbol("CHANGE_ALL_RESTAURANTS_MEALS_RESPONSE"),
    CHANGE_RESTAURANTS_MENUS_RESPONSE: Symbol("CHANGE_RESTAURANTS_MENUS_RESPONSE"),
    CHANGE_RESTAURANTS_MEALS_RESPONSE: Symbol("CHANGE_RESTAURANTS_MEALS_RESPONSE"),
    CHANGE_DRAWER_VISIBLE: Symbol("CHANGE_DRAWER_VISIBLE"),
    SAVE_RESTAURANTS: Symbol("SAVE_RESTAURANTS"),
    SAVE_RESTAURANTS_MENUS: Symbol("SAVE_RESTAURANTS_MENUS"),
    SAVE_RESTAURANTS_MEALS: Symbol("SAVE_RESTAURANTS_MEALS"),
    SET_STATE: Symbol("SET_STATE"),
    CHANGE_RESTAURANTS_RESPONSE_ONCE: Symbol("CHANGE_RESTAURANTS_RESPONSE_ONCE"),
    SHOW_APPLIED_ERROR: Symbol("SHOW_APPLIED_ERROR"),
};

export interface DetailAction {
    payload?: any;
    type: symbol;
}

export interface AppliedError {
    type: PromotionApplyTypeAJAXView | null;
    message?: string;
}
export interface DetailState {
    appliedToType: PromotionApplyTypeAJAXView | null;
    restaurants: Restaurant[];
    restaurantsResponse: Restaurant[];
    restaurantsMenus: Restaurant[];
    restaurantsMenusResponse: Restaurant[];
    restaurantsMeals: Restaurant[];
    restaurantsMealsResponse: Restaurant[];
    restaurantsResponseRowSelection: string[];
    drawerVisible: boolean;
    appliedError: AppliedError;
}

const saveRestaurantsItems = (restaurants: Restaurant[]) =>
    restaurants
        .map(({items, ...rest}) => ({
            ...rest,
            items: items!.filter(R.prop("status")),
        }))
        .filter(({items}) => !R.isEmpty(items));

export const detailReducer = (state: DetailState, action: DetailAction) => {
    const {type, payload} = action;
    switch (type) {
        case detailTypes.CHANGE_APPLIED_TO:
            return {
                ...state,
                appliedToType: payload,
            };
        case detailTypes.CHANGE_RESTAURANTS:
            return R.over(payload[0], R.remove(payload[1], 1), state);
        case detailTypes.CHANGE_RESTAURANTS_MENUS:
        case detailTypes.CHANGE_RESTAURANTS_MEALS:
            return R.over(payload[0], R.remove(payload[1], 1), state);
        case detailTypes.CHANGE_RESTAURANTS_RESPONSE_ONCE:
            return {
                ...R.over(payload[0], R.F, state),
                restaurantsResponseRowSelection: state.restaurantsResponseRowSelection.filter(v => v !== payload[1]),
            };
        case detailTypes.CHANGE_RESTAURANTS_RESPONSE:
            return {
                ...state,
                restaurantsResponseRowSelection: payload,
                restaurantsResponse: state.restaurantsResponse.map(v => ({
                    ...v,
                    status: payload.indexOf(v.id) > -1 ? true : false,
                })),
            };
        case detailTypes.CHANGE_ALL_RESTAURANTS_MENUS_RESPONSE:
        case detailTypes.CHANGE_ALL_RESTAURANTS_MEALS_RESPONSE:
            return R.over(
                payload[0],
                R.map((v: Item) => ({...v, status: payload[1]})),
                state
            );
        case detailTypes.CHANGE_RESTAURANTS_MENUS_RESPONSE:
        case detailTypes.CHANGE_RESTAURANTS_MEALS_RESPONSE:
            return R.over(payload[0], R.not, state);
        case detailTypes.SAVE_RESTAURANTS:
            return {
                ...state,
                drawerVisible: false,
                restaurants: state.restaurantsResponse.filter(v => v.status),
            };
        case detailTypes.SAVE_RESTAURANTS_MENUS:
            return R.over(payload[0], () => saveRestaurantsItems(state.restaurantsMenusResponse), state);
        case detailTypes.SAVE_RESTAURANTS_MEALS:
            return R.over(payload[0], () => saveRestaurantsItems(state.restaurantsMealsResponse), state);
        case detailTypes.CHANGE_DRAWER_VISIBLE:
            return {
                ...state,
                drawerVisible: payload,
            };
        case detailTypes.SET_STATE:
            return {
                ...state,
                ...payload,
            };
        case detailTypes.SHOW_APPLIED_ERROR:
            return {
                ...state,
                appliedError: {
                    type: payload[0],
                    message: payload[1],
                },
            };
        default:
            return state;
    }
};

export const initialDetailState = {
    drawerVisible: false,
    appliedToType: null,
    restaurants: [],
    restaurantsResponse: [],
    restaurantsResponseRowSelection: [],
    restaurantsMenus: [],
    restaurantsMenusResponse: [],
    restaurantsMeals: [],
    restaurantsMealsResponse: [],
    appliedError: {type: null},
};
