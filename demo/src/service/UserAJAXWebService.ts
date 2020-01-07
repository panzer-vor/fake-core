import {UserAJAXResponse} from "type/api";
import {ajax} from "core-fe";

export class UserAJAXWebService {
    static current(): Promise<UserAJAXResponse> {
        return ajax("GET", "/ajax/user/current", {}, null);
    }
}
