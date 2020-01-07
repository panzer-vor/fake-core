import {call, Loading, register, Module, Lifecycle, APIException, SagaIterator} from "core-fe";
import {State, Filter, LOAD_PROMOTION_LIST, SAVE_PROMOTION_DETAIL, DELETE_PROMOTION, UPDATE_PROMOTION_STATUS, LOAD_RESTAURANT_MEAL_LIST, LOAD_RESTAURANT_MENU_LIST, LOAD_PROMOTION_DETAIL, LOAD_RESTAURANT_LIST, PROMOTION_MAIN_FILTER, PromotionDetailRequest} from "./type";
import initialState, {initialFilter, initialPromotionDetail} from "./state";
import {Location} from "history";
import {message} from "antd";
import {PromotionAJAXWebService} from "service/PromotionAJAXWebService";
import PromotionDetailComponent from "./component/PromotionDetail";
import PromotionDetailReadonlyComponent from "./component/PromotionDetailReadonly";
import PromotionListComponent from "./component/PromotionList";
import {app} from "core-fe/lib/app";
import {replace, go} from "connected-react-router";
import {RestaurantAJAXWebService} from "service/RestaurantAJAXWebService";
import {UpdateDistributedPromotionAJAXRequest, UpdateUndistributedPromotionAJAXRequest, ActivatePromotionAJAXRequest} from "type/api";

const handlePromotionError = (error: APIException) => {
    const {responseData} = error;
    if (!responseData) {
        throw error;
    }
    if (error.responseData.error_code === "PROMOTION_CODE_EXISTS") {
        message.error("A promotion with the same code already exists. Please enter a new code.");
    } else {
        throw error;
    }
};

class PromotionModule extends Module<State> {
    @Loading(LOAD_PROMOTION_LIST)
    *fetchPromotionList(): SagaIterator {
        const {pagination, filter} = this.state;
        if (!filter.valid_end_date_from) {
            filter.valid_end_date_from = initialFilter.valid_end_date_from;
        }
        const request = {
            ...filter,
            limit: pagination.limit,
            skip: pagination.skip,
        };
        try {
            const response = yield* call(PromotionAJAXWebService.search, request);
            console.log(response)
            pagination.total = response.total!;
            this.setState({
                pagination,
                promotions: response.promotions || [],
                filter: {
                    ...initialFilter,
                },
            });
        } catch (error) {
            handlePromotionError(error);
        }
    }
    @Loading(LOAD_PROMOTION_LIST)
    *searchPromotionList(request: Filter): SagaIterator {
        const {filter, pagination} = this.state;

        pagination.current = 1;
        pagination.skip = 0;
        this.setState({filter: Object.assign(filter, request), pagination});
        yield* this.fetchPromotionList();
    }
    *changePage(page: number = 1, limit: number = 10): SagaIterator {
        const {pagination} = this.state;
        pagination.page = page;
        pagination.current = page;
        pagination.limit = limit;
        this.setState({
            pagination,
        });
        yield* this.fetchPromotionList();
    }
    @Loading(DELETE_PROMOTION)
    *deletePromotion(code: string): SagaIterator {
        try {
            yield* call(PromotionAJAXWebService.delete, code);
            yield* this.fetchPromotionList();
        } catch (error) {
            handlePromotionError(error);
        }
    }
    @Loading(LOAD_PROMOTION_DETAIL)
    *fetchPromotionDetail(code: string): SagaIterator {
        try {
            const response = yield* call(PromotionAJAXWebService.get, code);
            this.setState({
                promotionDetail: response,
            });
        } catch (error) {
            handlePromotionError(error);
        }
    }
    @Loading(UPDATE_PROMOTION_STATUS)
    *activePromotionStatus(promotionCode: string, request: ActivatePromotionAJAXRequest): SagaIterator {
        try {
            yield* call(PromotionAJAXWebService.activate, promotionCode, request);
            app.store.dispatch(go(0));
        } catch (error) {
            handlePromotionError(error);
        }
    }
    @Loading(UPDATE_PROMOTION_STATUS)
    *deactivateStatus(promotionCode: string): SagaIterator {
        try {
            yield* call(PromotionAJAXWebService.deactivate, promotionCode);
            app.store.dispatch(go(0));
        } catch (error) {
            handlePromotionError(error);
        }
    }
    @Loading(SAVE_PROMOTION_DETAIL)
    *savePromotionDetail(request: PromotionDetailRequest): SagaIterator {
        try {
            yield* call(PromotionAJAXWebService.create, request);
            app.store.dispatch(replace("/promotion"));
            message.success(`Promotion ${request.code} has been saved. You should activate it to make it active.`);
        } catch (error) {
            handlePromotionError(error);
        }
    }
    @Loading(LOAD_RESTAURANT_LIST)
    *fetchRestaurantList(): SagaIterator {
        try {
            const response = yield* call(RestaurantAJAXWebService.listRestaurants);
            const {restaurants} = response;
            this.setState({
                restaurantList: restaurants!.map(v => ({
                    id: v.id,
                    name: v.name,
                    status: false,
                    checked: true,
                    items: [],
                })),
            });
        } catch (error) {
            throw error;
        }
    }
    @Loading(LOAD_RESTAURANT_MENU_LIST)
    *fetchRestaurantMenuList(): SagaIterator {
        try {
            const response = yield* call(RestaurantAJAXWebService.listCategories);
            const {restaurants} = response;
            this.setState({
                restaurantMenusList: restaurants!.map(v => ({
                    id: v.id,
                    name: v.name,
                    status: false,
                    checked: true,
                    items:
                        v.categories &&
                        v.categories.map(val => ({
                            id: val.category_id,
                            name: val.category_name,
                            checked: true,
                            status: false,
                        })),
                })),
            });
        } catch (error) {
            throw error;
        }
    }
    @Loading(LOAD_RESTAURANT_MEAL_LIST)
    *fetchRestaurantMealList(): SagaIterator {
        try {
            const response = yield* call(RestaurantAJAXWebService.listMeals);
            const {restaurants} = response;
            this.setState({
                restaurantMealsList: restaurants!.map(v => ({
                    id: v.id,
                    name: v.name,
                    status: false,
                    checked: true,
                    items:
                        v.meals &&
                        v.meals.map(val => ({
                            id: val.meal_id,
                            name: val.meal_name,
                            checked: true,
                            status: false,
                        })),
                })),
            });
        } catch (error) {
            throw error;
        }
    }
    @Loading(SAVE_PROMOTION_DETAIL)
    *savePromotionDistributed(code: string, request: UpdateDistributedPromotionAJAXRequest): SagaIterator {
        try {
            yield* call(PromotionAJAXWebService.updateDistributedPromotion, code, request);
        } catch (error) {
            handlePromotionError(error);
        }
        app.store.dispatch(replace("/promotion"));
        message.success(`Promotion ${code} has been saved.`);
    }
    @Loading(SAVE_PROMOTION_DETAIL)
    *savePromotionUndistributed(code: string, request: UpdateUndistributedPromotionAJAXRequest): SagaIterator {
        try {
            yield* call(PromotionAJAXWebService.updateUndistributedPromotion, code, request);
        } catch (error) {
            handlePromotionError(error);
        }
        app.store.dispatch(replace("/promotion"));
        message.success(`Promotion ${code} has been saved.`);
    }
    @Lifecycle()
    *onRender(routeParameters: any, location: Location): SagaIterator {
        if (location.pathname === "/promotion") {
            yield* this.fetchPromotionList();
        }
        let id = null;
        try {
            id = routeParameters.id && routeParameters.id.indexOf("%") > -1 ? decodeURIComponent(routeParameters.id) : routeParameters.id;
        } catch {
            id = routeParameters.id;
        }
        if (id) {
            this.setState({promotion_code: id});
            yield* this.fetchPromotionDetail(id);
        } else {
            this.setState({
                promotion_code: undefined,
                promotionDetail: {...initialPromotionDetail},
            });
        }
    }
}
const module = register(new PromotionModule("promotion", initialState));
export const actions = module.getActions();
export const PromotionList = module.attachLifecycle(PromotionListComponent);
export const PromotionDetail = module.attachLifecycle(PromotionDetailComponent);
export const PromotionDetailReadonly = module.attachLifecycle(PromotionDetailReadonlyComponent);
