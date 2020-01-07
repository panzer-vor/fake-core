import {SearchAppStartAdAJAXResponse$Ad, ListRestaurantAJAXAdResponse$Ad} from "type/api";
import {Pagination} from "fake-core-module";
import {Field} from "fake-core-widget/DataForm/form.ts";
export const LOAD_BANNER_LIST = "LOAD_BANNER_LIST";
export const SUBMIT_BANNER = "SUBMIT_BANNER";
export const LOAD_RESTAURANT_LIST_ADS = "LOAD_RESTAURANT_LIST_ADS";
export const GET_RESTAURANT_LIST_AD = "GET_RESTAURANT_LIST_AD";
export interface BannerListState {
    ads: SearchAppStartAdAJAXResponse$Ad[] | null;
    pagination: Pagination;
}
export interface BannerInfoState {
    bannerForm: {
        name: Field;
        image: Field;
        link: Field;
        status: Field;
    };
}
export interface RestaurantListAdsInfoState {
    adValue: GetRestaurantAdAJAXResponse | null;
    adForm: {
        sub_title: Field;
        title: Field;
        description: Field;
        action_url: Field;
        action_title: Field;
        action_type: Field;
        image_key: Field;
        editor: Field;
    };
    id: string;
    showEditor: boolean;
}
export interface RestaurantListAdsState {
    ads: ListRestaurantAJAXAdResponse$Ad[] | null;
}
export interface State {
    banners: BannerListState;
    bannerInfo: BannerInfoState;
    restaurantListAdsInfo: RestaurantListAdsInfoState;
    restaurantListAds: RestaurantListAdsState;
}
export interface GetRestaurantAdAJAXResponse {
    image_key: string | null;
    sub_title: string | null;
    title: string | null;
    description: string | null;
    action_title: string | null;
    action_type: ActionTypeAJAXView | null;
    action_url: string | null;
    sequence: number | null;
}
export enum ActionTypeAJAXView {
    EXTERNAL_LINK = "EXTERNAL_LINK",
    INTERNAL_LINK = "INTERNAL_LINK",
    INTERNAL_PAGE = "INTERNAL_PAGE",
}
