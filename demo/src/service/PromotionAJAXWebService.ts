import {CreatePromotionAJAXRequest, SearchPromotionAJAXRequest, SearchPromotionAJAXResponse, GetPromotionAJAXResponse, ActivatePromotionAJAXRequest, UpdateDistributedPromotionAJAXRequest, UpdateUndistributedPromotionAJAXRequest} from "type/api";
import {ajax} from "core-fe";

export class PromotionAJAXWebService {
    static create(request: CreatePromotionAJAXRequest): Promise<void> {
        return ajax("POST", "/ajax/promotion", {}, request);
    }
    static search(request: SearchPromotionAJAXRequest): Promise<SearchPromotionAJAXResponse> {
        return ajax("PUT", "/ajax/promotion", {}, request);
    }
    static get(promotionCode: string): Promise<GetPromotionAJAXResponse> {
        return ajax("GET", "/ajax/promotion/:promotionCode", {promotionCode}, null);
    }
    static delete(promotionCode: string): Promise<void> {
        return ajax("DELETE", "/ajax/promotion/:promotionCode", {promotionCode}, null);
    }
    static activate(promotionCode: string, request: ActivatePromotionAJAXRequest): Promise<void> {
        return ajax("PUT", "/ajax/promotion/:promotionCode/activate", {promotionCode}, request);
    }
    static deactivate(promotionCode: string): Promise<void> {
        return ajax("PUT", "/ajax/promotion/:promotionCode/deactivate", {promotionCode}, null);
    }
    static updateDistributedPromotion(promotionCode: string, request: UpdateDistributedPromotionAJAXRequest): Promise<void> {
        return ajax("PUT", "/ajax/promotion/distributed-promotion/:promotionCode", {promotionCode}, request);
    }
    static updateUndistributedPromotion(promotionCode: string, request: UpdateUndistributedPromotionAJAXRequest): Promise<void> {
        return ajax("PUT", "/ajax/promotion/undistributed-promotion/:promotionCode", {promotionCode}, request);
    }
}
