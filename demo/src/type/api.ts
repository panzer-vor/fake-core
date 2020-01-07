export interface UserAJAXResponse {
    email: string | null;
    full_name: string | null;
    roles: string[] | null;
}
export interface CreateAppStartAdAJAXRequest {
    name: string;
    action_url: string;
    image_key: string;
    status: AdStatusAJAXView;
}
export interface CreateAppStartAdAJAXResponse {
    id: string | null;
}
export interface SearchAppStartAdAJAXRequest {
    limit: number;
    skip: number;
}
export interface SearchAppStartAdAJAXResponse {
    total: number | null;
    ads: SearchAppStartAdAJAXResponse$Ad[] | null;
}
export interface SearchAppStartAdAJAXResponse$Ad {
    id: string | null;
    name: string | null;
    action_url: string | null;
    image_key: string | null;
    status: AdStatusAJAXView | null;
    created_by: string | null;
    created_time: Date | null;
}
export interface UpdateAppStartAdStatusAJAXRequest {
    status: AdStatusAJAXView;
}
export interface ListRestaurantAJAXAdResponse {
    ads: ListRestaurantAJAXAdResponse$Ad[] | null;
}
export interface ListRestaurantAJAXAdResponse$Ad {
    id: string | null;
    image_key: string | null;
    sub_title: string | null;
    title: string | null;
    description: string | null;
    action_url: string | null;
    action_title: string | null;
    action_type: ActionTypeAJAXView | null;
    sequence: number | null;
}
export interface CreateRestaurantAdAJAXRequest {
    sub_title: string;
    title: string;
    description: string;
    action_url: string;
    action_title: string;
    action_type: ActionTypeAJAXView;
    image_key: string | null;
}
export interface CreateRestaurantAdAJAXResponse {
    id: string | null;
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
export interface UpdateRestaurantAdAJAXRequest {
    sub_title: string;
    title: string;
    description: string;
    action_title: string;
    action_type: ActionTypeAJAXView;
    action_url: string;
    image_key: string | null;
}
export interface UpdateRestaurantAdSequenceAJAXRequest {
    restaurant_ad_ids: string[];
}
export interface CreatePromotionAJAXRequest {
    code: string;
    name: string;
    description: string;
    brief_description: string | null;
    distribution_start_date: Date | null;
    distribution_end_date: Date | null;
    valid_start_date: Date;
    valid_end_date: Date;
    apply_type: PromotionApplyTypeAJAXView;
    applied_restaurants: CreatePromotionAJAXRequest$PromotionAppliedRestaurant[];
    eligibility: PromotionEligibilityAJAXView;
    nth_order: number | null;
    type: PromotionTypeAJAXView;
    percentage_off: number | null;
    amount_off: number | null;
    purchase_minimum: number | null;
    max_use_times: number | null;
    max_discount: number | null;
}
export interface CreatePromotionAJAXRequest$PromotionAppliedRestaurant {
    restaurant_id: string;
    restaurant_name: string;
    items: CreatePromotionAJAXRequest$PromotionAppliedItem[];
}
export interface CreatePromotionAJAXRequest$PromotionAppliedItem {
    item_id: string;
    item_name: string;
}
export interface SearchPromotionAJAXRequest {
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
    skip: number;
    limit: number;
}
export interface SearchPromotionAJAXResponse {
    total: number | null;
    promotions: SearchPromotionAJAXResponse$Promotion[];
}
export interface SearchPromotionAJAXResponse$Promotion {
    code: string;
    name: string;
    eligibility: PromotionEligibilityAJAXView;
    type: PromotionTypeAJAXView;
    percentage_off: number | null;
    amount_off: number | null;
    purchase_minimum: number | null;
    max_use_times: number | null;
    max_discount: number | null;
    apply_type: PromotionApplyTypeAJAXView;
    distribution_start_date: Date;
    distribution_end_date: Date;
    valid_start_date: Date;
    valid_end_date: Date;
    status: PromotionStatusAJAXView;
}
export interface GetPromotionAJAXResponse {
    code: string;
    name: string;
    description: string;
    brief_description: string | null;
    distribution_start_date: Date;
    distribution_end_date: Date;
    valid_start_date: Date;
    valid_end_date: Date;
    apply_type: PromotionApplyTypeAJAXView;
    applied_restaurants: GetPromotionAJAXResponse$PromotionAppliedRestaurant[];
    eligibility: PromotionEligibilityAJAXView;
    nth_order: number | null;
    type: PromotionTypeAJAXView;
    percentage_off: number | null;
    amount_off: number | null;
    purchase_minimum: number | null;
    max_use_times: number | null;
    max_discount: number | null;
    status: PromotionStatusAJAXView;
}
export interface GetPromotionAJAXResponse$PromotionAppliedRestaurant {
    restaurant_id: string;
    restaurant_name: string;
    items: GetPromotionAJAXResponse$PromotionAppliedItem[];
}
export interface GetPromotionAJAXResponse$PromotionAppliedItem {
    item_id: string;
    item_name: string;
}
export interface ActivatePromotionAJAXRequest {
    name: string;
    description: string;
    brief_description: string | null;
    distribution_start_date: Date | null;
    distribution_end_date: Date | null;
    valid_start_date: Date;
    valid_end_date: Date;
    apply_type: PromotionApplyTypeAJAXView;
    applied_restaurants: ActivatePromotionAJAXRequest$PromotionAppliedRestaurant[];
    eligibility: PromotionEligibilityAJAXView;
    nth_order: number | null;
    type: PromotionTypeAJAXView;
    percentage_off: number | null;
    amount_off: number | null;
    purchase_minimum: number | null;
    max_use_times: number | null;
    max_discount: number | null;
}
export interface ActivatePromotionAJAXRequest$PromotionAppliedRestaurant {
    restaurant_id: string;
    restaurant_name: string;
    items: ActivatePromotionAJAXRequest$PromotionAppliedItem[];
}
export interface ActivatePromotionAJAXRequest$PromotionAppliedItem {
    item_id: string;
    item_name: string;
}
export interface UpdateDistributedPromotionAJAXRequest {
    name: string;
    description: string;
    brief_description: string | null;
    distribution_end_date: Date | null;
}
export interface UpdateUndistributedPromotionAJAXRequest {
    name: string;
    description: string;
    brief_description: string | null;
    distribution_start_date: Date | null;
    distribution_end_date: Date | null;
    valid_start_date: Date;
    valid_end_date: Date;
    apply_type: PromotionApplyTypeAJAXView;
    applied_restaurants: UpdateUndistributedPromotionAJAXRequest$PromotionAppliedRestaurant[];
    eligibility: PromotionEligibilityAJAXView;
    nth_order: number | null;
    type: PromotionTypeAJAXView;
    percentage_off: number | null;
    amount_off: number | null;
    purchase_minimum: number | null;
    max_use_times: number | null;
    max_discount: number | null;
}
export interface UpdateUndistributedPromotionAJAXRequest$PromotionAppliedRestaurant {
    restaurant_id: string;
    restaurant_name: string;
    items: UpdateUndistributedPromotionAJAXRequest$PromotionAppliedItem[];
}
export interface UpdateUndistributedPromotionAJAXRequest$PromotionAppliedItem {
    item_id: string;
    item_name: string;
}
export interface PublishedRestaurantCategoriesAJAXResponse {
    restaurants: PublishedRestaurantCategoriesAJAXResponse$Restaurant[] | null;
}
export interface PublishedRestaurantCategoriesAJAXResponse$Restaurant {
    id: string | null;
    name: string | null;
    categories: PublishedRestaurantCategoriesAJAXResponse$Restaurant$Category[] | null;
}
export interface PublishedRestaurantCategoriesAJAXResponse$Restaurant$Category {
    category_id: string | null;
    category_name: string | null;
}
export interface PublishedRestaurantWithMealsAJAXResponse {
    restaurants: PublishedRestaurantWithMealsAJAXResponse$Restaurant[] | null;
}
export interface PublishedRestaurantWithMealsAJAXResponse$Restaurant {
    id: string | null;
    name: string | null;
    meals: PublishedRestaurantWithMealsAJAXResponse$Restaurant$Meal[] | null;
}
export interface PublishedRestaurantWithMealsAJAXResponse$Restaurant$Meal {
    meal_id: string | null;
    meal_name: string | null;
}
export interface PublishedRestaurantAJAXResponse {
    restaurants: PublishedRestaurantAJAXResponse$Restaurant[] | null;
}
export interface PublishedRestaurantAJAXResponse$Restaurant {
    id: string | null;
    name: string | null;
}
export interface AJAXErrorResponse {
    id: string | null;
    errorCode: string | null;
    message: string | null;
}
export interface WebsiteErrorHandler$AJAXErrorResponse {
    error_code: string | null;
    error_message: string | null;
}
export interface WebsiteErrorHandler$AJAXUnauthorizedErrorResponse {
    error_code: string | null;
    error_message: string | null;
    login_url: string | null;
}
export interface WebsiteErrorHandler$AJAXForbiddenErrorResponse {
    error_code: string | null;
    error_message: string | null;
    contact_url: string | null;
}
export interface FileUploadResponse {
    s3_key: string | null;
}
export enum AdStatusAJAXView {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}
export enum ActionTypeAJAXView {
    EXTERNAL_LINK = "EXTERNAL_LINK",
    INTERNAL_LINK = "INTERNAL_LINK",
    INTERNAL_PAGE = "INTERNAL_PAGE",
}
export enum PromotionApplyTypeAJAXView {
    ALL = "ALL",
    RESTAURANTS = "RESTAURANTS",
    CATEGORIES = "CATEGORIES",
    MEALS = "MEALS",
}
export enum PromotionEligibilityAJAXView {
    ALL = "ALL",
    NEW_BUYERS_ONLY = "NEW_BUYERS_ONLY",
    RETURN_BUYERS_ONLY = "RETURN_BUYERS_ONLY",
    NTH_BUYERS_ONLY = "NTH_BUYERS_ONLY",
}
export enum PromotionTypeAJAXView {
    PERCENTAGE = "PERCENTAGE",
    AMOUNT = "AMOUNT",
    FREE_SHIPPING = "FREE_SHIPPING",
    FREE_ITEM = "FREE_ITEM",
}
export enum PromotionStatusAJAXView {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}
