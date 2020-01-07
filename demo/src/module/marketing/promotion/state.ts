import {State} from "./type";
import {Pagination} from "@core/module";
import {dateFormat} from "./component/tools";
export const initialFilter = {
    code: null,
    name: null,
    type: null,
    percentage_off: null,
    amount_off: null,
    purchase_minimum: null,
    valid_start_date_from: null,
    valid_start_date_to: null,
    status: null,
    eligibility: null,
    valid_end_date_from: dateFormat.nowDate(),
    valid_end_date_to: null,
};

export const initialPromotionDetail = {
    valid_start_date: null,
    valid_end_date: null,
    code: "",
    name: "",
    description: "",
    brief_description: "",
    distribution_start_date: null,
    distribution_end_date: null,
    applied_restaurants: [],
    apply_type: null,
    eligibility: null,
    nth_order: 2,
    type: null,
    percentage_off: null,
    amount_off: null,
    purchase_minimum: null,
    max_use_times: null,
    max_discount: null,
};

const initialState: State = {
    filter: {
        ...initialFilter,
    },
    promotionDetail: {
        valid_start_date: null,
        valid_end_date: null,
        code: "",
        name: "",
        description: "",
        brief_description: "",
        distribution_start_date: null,
        distribution_end_date: null,
        applied_restaurants: [],
        apply_type: null,
        eligibility: null,
        nth_order: 2,
        type: null,
        percentage_off: null,
        amount_off: null,
        purchase_minimum: null,
        max_use_times: null,
        max_discount: null,
    },
    restaurantList: [],
    restaurantMealsList: [],
    restaurantMenusList: [],
    pagination: new Pagination(),
    promotions: [],
    promotion_code: "",
};

export default initialState;
