import {async} from "core-fe";
const route = {
    name: "Restaurant List Ads",
    menu: "Restaurant List Ads",
    path: "restaurant-list-ads",
    role: "MARKETING",
    icon: "project",
    component: async(() => import("."), "RestaurantListAds"),
    children: [
        {name: "Add", path: "add", role: "MARKETING", component: async(() => import("."), "RestaurantListAdsInfo")},
        {name: "Update", path: "update/:id", role: "MARKETING", component: async(() => import("."), "RestaurantListAdsInfo")},
    ],
};
export default route;
