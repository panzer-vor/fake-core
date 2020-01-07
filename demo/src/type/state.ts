import {CoreState} from "fake-core-module/lib/types/state";
import {State as adState} from "module/marketing/restaurantListAds/type";
import {State as promotionState} from "module/marketing/promotion/type";

export interface RootState extends CoreState<{
    ad: adState;
    promotion: promotionState;
}> {}
