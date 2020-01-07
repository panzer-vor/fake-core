import {Pagination} from "@core/module";
import {SearchPromotionAJAXResponse$Promotion, PromotionApplyTypeAJAXView, CreatePromotionAJAXRequest$PromotionAppliedRestaurant, PromotionStatusAJAXView, PromotionTypeAJAXView, PromotionEligibilityAJAXView, SearchPromotionAJAXRequest} from "type/api";

export const LOAD_PROMOTION_LIST = "LOAD_PROMOTION_LIST";
export const LOAD_PROMOTION_DETAIL = "LOAD_PROMOTION_DETAIL";
export const LOAD_RESTAURANT_LIST = "LOAD_RESTAURANT_LIST";
export const LOAD_RESTAURANT_MENU_LIST = "LOAD_RESTAURANT_MENU_LIST";
export const LOAD_RESTAURANT_MEAL_LIST = "LOAD_RESTAURANT_MEAL_LIST";
export const SAVE_PROMOTION_DETAIL = "SAVE_PROMOTION_DETAIL";
export const UPDATE_PROMOTION_STATUS = "UPDATE_PROMOTION_STATUS";
export const DELETE_PROMOTION = "DELETE_PROMOTION";
export enum PROMOTION_MAIN_FILTER {
    "Promotion Code",
    "Promotion Name",
}
export enum PROMOTION_STATUS {
    Active = PromotionStatusAJAXView.ACTIVE,
    Inactive = PromotionStatusAJAXView.INACTIVE,
}
export enum PROMOTION_TYPE {
    "Free Shipping" = PromotionTypeAJAXView.FREE_SHIPPING,
    Amount = PromotionTypeAJAXView.AMOUNT,
    Percentage = PromotionTypeAJAXView.PERCENTAGE,
    "Free Item" = PromotionTypeAJAXView.FREE_ITEM,
}
export enum PROMOTION_ELIGIBILITY_FILTER {
    "All Buyers" = PromotionEligibilityAJAXView.ALL,
    "New buyers only" = PromotionEligibilityAJAXView.NEW_BUYERS_ONLY,
    "Return buyers only" = PromotionEligibilityAJAXView.RETURN_BUYERS_ONLY,
    "Nth buyers only" = PromotionEligibilityAJAXView.NTH_BUYERS_ONLY,
}
export enum PROMOTION_ELIGIBILITY {
    "All" = PromotionEligibilityAJAXView.ALL,
    "New Buyers only" = PromotionEligibilityAJAXView.NEW_BUYERS_ONLY,
    "Return Buyers only" = PromotionEligibilityAJAXView.RETURN_BUYERS_ONLY,
    "Nth buyers only" = PromotionEligibilityAJAXView.NTH_BUYERS_ONLY,
}
export enum PURCHASE_CONDITION_TYPE {
    Free,
    Percentage,
    Amount,
}
export type PROMOTION_ELIGIBILITY_NTH = 1 | 2 | 3 | 4 | 5;
export enum APPLIED_TO_TYPE {
    "All Restaurants" = PromotionApplyTypeAJAXView.ALL,
    "Only these restaurants" = PromotionApplyTypeAJAXView.RESTAURANTS,
    "Only these menu categories" = PromotionApplyTypeAJAXView.CATEGORIES,
    "Only these meals" = PromotionApplyTypeAJAXView.MEALS,
}

export interface PromotionDetailRequest extends PromotionDetail {
    valid_start_date: Date;
    valid_end_date: Date;
    apply_type: PromotionApplyTypeAJAXView;
    eligibility: PromotionEligibilityAJAXView;
    type: PromotionTypeAJAXView;
}

export interface Item {
    id: string | null;
    name: string | null;
    checked?: boolean;
    status: boolean;
}

export interface Restaurant {
    id: string | null;
    name: string | null;
    status: boolean;
    checked?: boolean;
    items: Item[] | null;
}

export interface PromotionDetailState {
    promotionDetail: PromotionDetail;
    restaurantList: Restaurant[];
    restaurantMealsList: Restaurant[];
    restaurantMenusList: Restaurant[];
}

interface PromotionDetailRestaurantItem {
    id: number;
    name: string;
    status: string;
}

interface PromotionDetailRestaurant {
    id: number;
    name: string;
    status: string;
    items?: PromotionDetailRestaurantItem[];
}

export interface ApplyRestaurants {
    type: APPLIED_TO_TYPE;
    item?: PromotionDetailRestaurant[];
}

export interface PromotionDetail {
    code: string;
    name: string;
    description: string;
    brief_description: string | null;
    distribution_start_date: Date | null;
    distribution_end_date: Date | null;
    valid_start_date: Date | null;
    valid_end_date: Date | null;
    apply_type: PromotionApplyTypeAJAXView | null;
    applied_restaurants: CreatePromotionAJAXRequest$PromotionAppliedRestaurant[];
    eligibility: PromotionEligibilityAJAXView | null;
    nth_order: number | null;
    type: PromotionTypeAJAXView | null;
    percentage_off: number | null;
    amount_off: number | null;
    purchase_minimum: number | null;
    status?: PromotionStatusAJAXView;
    max_use_times: number | null;
    max_discount: number | null;
}

export interface Filter {
    code: string | null;
    name: string | null;
    type: PromotionTypeAJAXView | null;
    percentage_off: number | null;
    amount_off: number | null;
    purchase_minimum: number | null;
    status: PromotionStatusAJAXView | null;
    eligibility: PromotionEligibilityAJAXView | null;
    valid_start_date_from: Date | null;
    valid_start_date_to: Date | null;
    valid_end_date_from: Date | null;
    valid_end_date_to: Date | null;
}

export interface PromotionListState {
    filter: Filter;
    promotions: SearchPromotionAJAXResponse$Promotion[];
    pagination: Pagination;
}

export interface State extends PromotionListState, PromotionDetailState {
    promotion_code?: string;
}
