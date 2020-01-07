import Page from "./main/component/Page";
import {Main, actions as MainActions} from "./main";
import {ErrorHandler} from "./ErrorHandler";
import {Pagination} from "./account/type"
import {FTIRoute} from "./types/route";
import {startApp as start} from "core-fe";

interface StartAppConfig<T> {
    errorHandler?: ErrorHandler,
    routes: FTIRoute[],
    host: string,
    service: T
}

class ConfigSetting {
    routes: FTIRoute[];
    host: string;
    userService: any;

    constructor() {
        this.routes = [];
        this.host = ""
        this.userService = null
    }

    setRoute(routes: FTIRoute[]) {
        this.routes = routes;
    }
    setHost(host: string) {
        this.host = host
    }
    setService<T>(userService: T) {
        (this.userService as T)= userService
    }
}

export const Config = new ConfigSetting();

const startApp = <T>(config: StartAppConfig<T>) => {
    Config.setRoute(config.routes);
    Config.setHost(config.host)
    Config.setService<T>(config.service)
    start({
        componentType: Main,
        errorListener: config.errorHandler || new ErrorHandler(),
    });
};

export {Main, Page, MainActions, ErrorHandler, startApp, Pagination};
