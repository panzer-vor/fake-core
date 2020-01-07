import {async} from "core-fe";

const route = {
    name: "Promotions",
    menu: "Promotions",
    path: "promotion",
    role: "MARKETING",
    icon: "wallet",
    component: async(() => import("."), "PromotionList"),
    children: [
        {name: "promotion-create", path: "create", role: "MARKETING", component: async(() => import("."), "PromotionDetail")},
        {name: "promotion-edit", path: ":id", role: "MARKETING", component: async(() => import("."), "PromotionDetail")},
        {name: "promotion-readonly", path: ":id/readonly", role: "MARKETING", component: async(() => import("."), "PromotionDetailReadonly")},
    ],
};
export default route;
