import {
    CreateAppStartAdAJAXRequest,
    CreateAppStartAdAJAXResponse,
    SearchAppStartAdAJAXRequest,
    SearchAppStartAdAJAXResponse,
    UpdateAppStartAdStatusAJAXRequest,
    ListRestaurantAJAXAdResponse,
    CreateRestaurantAdAJAXRequest,
    CreateRestaurantAdAJAXResponse,
    GetRestaurantAdAJAXResponse,
    UpdateRestaurantAdAJAXRequest,
    UpdateRestaurantAdSequenceAJAXRequest,
} from "type/api";
import {ajax} from "core-fe";

export class AdAJAXWebService {
    static createAppStartAd(request: CreateAppStartAdAJAXRequest): Promise<CreateAppStartAdAJAXResponse> {
        return ajax("POST", "/ajax/app-start-ad", {}, request);
    }
    static searchAppStartAd(request: SearchAppStartAdAJAXRequest): Promise<SearchAppStartAdAJAXResponse> {
        return ajax("PUT", "/ajax/app-start-ad", {}, request);
    }
    static updateAppStartAdStatus(id: string, request: UpdateAppStartAdStatusAJAXRequest): Promise<void> {
        return ajax("PUT", "/ajax/app-start-ad/:id/status", {id}, request);
    }
    static listRestaurantAd(): Promise<ListRestaurantAJAXAdResponse> {
        return ajax("GET", "/ajax/restaurant-ad", {}, null);
    }
    static createRestaurantAd(request: CreateRestaurantAdAJAXRequest): Promise<CreateRestaurantAdAJAXResponse> {
        return ajax("POST", "/ajax/restaurant-ad", {}, request);
    }
    static getRestaurantAd(id: string): Promise<GetRestaurantAdAJAXResponse> {
        return ajax("GET", "/ajax/restaurant-ad/:id", {id}, null);
    }
    static updateRestaurantAd(id: string, request: UpdateRestaurantAdAJAXRequest): Promise<void> {
        return ajax("PUT", "/ajax/restaurant-ad/:id", {id}, request);
    }
    static deleteRestaurantAd(id: string): Promise<void> {
        return ajax("DELETE", "/ajax/restaurant-ad/:id", {id}, null);
    }
    static updateRestaurantAdSequence(request: UpdateRestaurantAdSequenceAJAXRequest): Promise<void> {
        return ajax("POST", "/ajax/restaurant-ad/sequence", {}, request);
    }
}
