import {startApp} from "@core/module";
import axios from "axios";
import {Modal} from "antd";
import {FTIRoutes} from "./route";
import {initializeIcons} from "@uifabric/icons";
import config from "conf/config";
import {UserAJAXWebService} from "service/UserAJAXWebService";
initializeIcons();

let sessionExpired = false;

axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.responseData && error.responseData.error_code === "UNAUTHORIZED") {
            window.location.href = error.responseData.login_url + "?redirect_url=" + encodeURIComponent(window.location.href);
            return;
        }
        if (!sessionExpired && error.statusCode && error.statusCode === 401) {
            sessionExpired = true;
            Modal.info({
                title: "You had logged out. Please login again.",
                okText: "Okay",
                onOk: () => {
                    sessionExpired = false;
                    window.location.reload();
                },
                onCancel: () => {
                    sessionExpired = false;
                    window.location.reload();
                },
            });
        }
        throw error;
    }
);
startApp<UserAJAXWebService>({
    routes: FTIRoutes,
    host: config.host,
    service: UserAJAXWebService,
});
