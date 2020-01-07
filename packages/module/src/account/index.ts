import {call, Lifecycle, Module, register, Loading} from "core-fe";
import {State, LOGOUT, AUTHENTICATE} from "./type";
import {SagaIterator} from "redux-saga";
import AccountComponent, {Authentication as AuthenticationComponent} from "./component/Account";
import {Modal} from "antd";
import {Config} from '../'

const initialState: State = {
    currentUser: {
        email: null,
        fullName: null,
        roles: null,
    },
    login: {
        success: false,
        errorMessage: null,
    },
};

class AccountModule extends Module<State> {
    @Loading(LOGOUT)
    *logout(): SagaIterator {
        window.location.href = `https://auth.${Config.host}/logout`;
    }

    @Lifecycle()
    @Loading(AUTHENTICATE)
    *onEnter(): SagaIterator {
        const pathname = window.location.pathname;
        if (pathname.indexOf("nonexistence") >= 0) {
            return;
        }
        try {
            const response = yield* call(Config.userService.current);

            this.setState({
                currentUser: {
                    roles: response.roles,
                    fullName: response.full_name,
                    email: response.email,
                },
            });
        } catch (e) {
            if (e.responseData && e.responseData.error_code === "UNAUTHORIZED") {
                window.location.href = e.responseData.login_url + "?redirect_url=" + encodeURIComponent(window.location.href);
            }
        }
    }

    @Lifecycle()
    *onRender(): SagaIterator {
        Modal.destroyAll();
    }
}

const module = register(new AccountModule("account", initialState));
export const actions = module.getActions();
export const Account = module.attachLifecycle(AccountComponent);

export const Authentication = module.attachLifecycle(AuthenticationComponent);
