import {PublishedRestaurantCategoriesAJAXResponse, PublishedRestaurantWithMealsAJAXResponse, PublishedRestaurantAJAXResponse} from "type/api";
import {ajax} from "core-fe";

export class RestaurantAJAXWebService {
    static listCategories(): Promise<PublishedRestaurantCategoriesAJAXResponse> {
        return ajax("GET", "/ajax/restaurant/restaurant-with-categories", {}, null);
    }
    static listMeals(): Promise<PublishedRestaurantWithMealsAJAXResponse> {
        return ajax("GET", "/ajax/restaurant/restaurant-with-products", {}, null);
    }
    static listRestaurants(): Promise<PublishedRestaurantAJAXResponse> {
        return ajax("GET", "/ajax/restaurant/restaurants", {}, null);
    }
}
