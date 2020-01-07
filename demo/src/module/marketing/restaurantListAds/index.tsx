import {call, Loading, register, Module, Lifecycle, SagaIterator} from "core-fe";
import {Location} from "history";
import {AdAJAXWebService} from "service/AdAJAXWebService";
import RestaurantListAdsComponent from "./component/RestaurantListAds";
import RestaurantListAdsInfoComponent from "./component/RestaurantListAdsInfo";
import {State, LOAD_RESTAURANT_LIST_ADS, GET_RESTAURANT_LIST_AD} from "./type";
import initialState from "./state";
import {CreateRestaurantAdAJAXRequest, UpdateRestaurantAdAJAXRequest, ActionTypeAJAXView} from "type/api";
import {app} from "core-fe/lib/app";
import {goBack} from "connected-react-router";
class UserModule extends Module<State> {
    @Loading(LOAD_RESTAURANT_LIST_ADS)
    *loadRestaurantListAds(): SagaIterator {
        const {restaurantListAds, restaurantListAdsInfo} = this.state;
        const response = yield* call(() => AdAJAXWebService.listRestaurantAd());
        restaurantListAds.ads = response.ads;
        restaurantListAdsInfo.id = "";
        this.setState({
            restaurantListAds,
            restaurantListAdsInfo,
        });
    }
    @Loading(GET_RESTAURANT_LIST_AD)
    *getRestaurantListAd(id: string): SagaIterator {
        const response = yield* call(AdAJAXWebService.getRestaurantAd, id);
        const adValue = response;
        let showEditor = false;
        if (response.action_type === ActionTypeAJAXView.INTERNAL_PAGE) {
            showEditor = true;
        }
        this.setState({restaurantListAdsInfo: {...this.state.restaurantListAdsInfo, adValue, showEditor, id}});
    }
    *delete(id: string): SagaIterator {
        try {
            yield* call(AdAJAXWebService.deleteRestaurantAd, id);
            yield* this.loadRestaurantListAds();
        } catch (error) {
            throw error;
        }
    }
    @Loading(LOAD_RESTAURANT_LIST_ADS)
    *updateRestaurantListAd(id: string, request: UpdateRestaurantAdAJAXRequest): SagaIterator {
        try {
            yield* call(AdAJAXWebService.updateRestaurantAd, id, request);
            yield* this.clearForm();
            yield* this.loadRestaurantListAds();
        } catch (error) {
            throw error;
        }
    }
    @Loading(LOAD_RESTAURANT_LIST_ADS)
    *submit(request: CreateRestaurantAdAJAXRequest): SagaIterator {
        try {
            yield* call(AdAJAXWebService.createRestaurantAd, request);
            yield* this.clearForm();
            yield* this.loadRestaurantListAds();
        } catch (error) {
            throw error;
        }
    }
    *moveRow(dragIndex: number, hoverIndex: number): SagaIterator {
        const ads = [...this.state.restaurantListAds.ads];
        const dragRow = ads[dragIndex];
        ads.splice(dragIndex, 1, ads[hoverIndex]);
        ads.splice(hoverIndex, 1, dragRow);
        this.setState({restaurantListAds: {...this.state.restaurantListAds, ads}});
    }
    @Loading(LOAD_RESTAURANT_LIST_ADS)
    *saveOrder(ids: string[]): SagaIterator {
        const request = {
            restaurant_ad_ids: ids,
        };
        yield* call(AdAJAXWebService.updateRestaurantAdSequence, request);
        yield* this.loadRestaurantListAds();
    }
    @Lifecycle()
    *onRender(routeParameters: any, location: Location): SagaIterator {
        if (location.pathname === "/restaurant-list-ads") {
            yield* this.loadRestaurantListAds();
        }
        const {id} = routeParameters;
        if (id) {
            const {restaurantListAdsInfo} = this.state;
            restaurantListAdsInfo.id = id;
            this.setState({
                restaurantListAdsInfo,
            });
            yield* this.getRestaurantListAd(id);
        }
    }
    *typeChange(value: ActionTypeAJAXView): SagaIterator {
        const {restaurantListAdsInfo} = this.state;
        restaurantListAdsInfo.showEditor = value === ActionTypeAJAXView.INTERNAL_PAGE;
        this.setState({
            restaurantListAdsInfo,
        });
    }
    *clearForm(): SagaIterator {
        const {restaurantListAdsInfo} = this.state;
        restaurantListAdsInfo.id = "";
        restaurantListAdsInfo.adValue = null;
        restaurantListAdsInfo.showEditor = false;
        this.setState({restaurantListAdsInfo});
    }
}
const module = register(new UserModule("ad", initialState));
export const actions = module.getActions();
export const RestaurantListAds = module.attachLifecycle(RestaurantListAdsComponent);
export const RestaurantListAdsInfo = module.attachLifecycle(RestaurantListAdsInfoComponent);
