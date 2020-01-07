import * as R from "ramda";
import {Restaurant} from "../type";
import moment, {Moment} from "moment";
import {GetPromotionAJAXResponse$PromotionAppliedRestaurant, CreatePromotionAJAXRequest$PromotionAppliedRestaurant} from "type/api";
export const diffRestaurantsTree = (a: Restaurant[], bOrigin: Restaurant[]) => {
    const b = R.clone(bOrigin);
    a.forEach(v => {
        let index = 0;
        let itemIndex = 0;
        const data = b.find(({id}, i) => {
            index = i;
            return id === v.id;
        });
        if (!data) {
            b.push({
                ...v,
                items: v.items!.map(val => ({
                    ...val,
                    status: true,
                })),
                checked: false,
                status: true,
            });
        } else {
            b[index].status = true;
            v.items!.forEach(val => {
                const item = data.items!.find(({id}, i) => {
                    itemIndex = i;
                    return id === val.id;
                });
                if (!item) {
                    b[index].items!.push({
                        ...val,
                        checked: false,
                    });
                } else {
                    b[index].items![itemIndex].status = true;
                }
            });
        }
    });
    return b;
};

export const handleApplyRestaurantItems = (data: GetPromotionAJAXResponse$PromotionAppliedRestaurant[]) =>
    data.map(v => ({
        id: v.restaurant_id,
        name: v.restaurant_name,
        status: false,
        checked: true,
        items: v.items.map(val => ({
            id: val.item_id,
            name: val.item_name,
            checked: true,
            status: false,
        })),
    }));

export const handleApplyRestaurantItemsRequest = (data: Restaurant[]) =>
    data.map(v => ({
        restaurant_id: v.id,
        restaurant_name: v.name,
        items: v.items!.map(val => ({
            item_id: val.id,
            item_name: val.name,
        })),
    })) as CreatePromotionAJAXRequest$PromotionAppliedRestaurant[];

export const dateFormat = {
    formatValidStartDate: (date: Moment) => date && moment(date.format("YYYY-MM-DD") + " 00:00:00", "YYYY-MM-DD HH:mm:ss").valueOf(),
    formatValidEndDate: (date: Moment) => date && moment(date.format("YYYY-MM-DD") + " 23:59:59", "YYYY-MM-DD HH:mm:ss").valueOf(),
    formatStartDate: (date: Moment) => new Date(moment(date.format("YYYY-MM-DD") + " 00:00:00", "YYYY-MM-DD HH:mm:ss").valueOf()),
    formatEndDate: (date: Moment) => new Date(moment(date.format("YYYY-MM-DD") + "  23:59:59", "YYYY-MM-DD HH:mm:ss").valueOf()),
    now: () => new Date(new Date().toLocaleDateString()).getTime(),
    nowDate: () => new Date(new Date().toLocaleDateString()),
};
