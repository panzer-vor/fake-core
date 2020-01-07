import {FTIRoute} from "@core/module/types/route";
import adRoute from "./restaurantListAds/route";
import promotionRoute from "./promotion/route";
const routes: FTIRoute = {
    name: "Customer Service",
    menu: "Customer Service",
    icon: "user",
    role: "Customer",
    path: "customer-service",
    children: [adRoute, promotionRoute],
};
export default routes;
