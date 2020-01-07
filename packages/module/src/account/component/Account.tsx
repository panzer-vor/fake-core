import {Button} from "antd";

import {actions} from "..";
import React from "react";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {CoreState} from "types/state";
import "./loginForm.less";
import {showLoading} from "core-fe";
import {LOGOUT} from "../type";

export interface Props {
    loading: boolean;
    email: string | null;
    fullName: string | null;
    logout: () => void;
}
const Account: React.FunctionComponent<Props> = ({loading, email, fullName, logout}) => {
    return (
        <div>
            Hello <b>{fullName}</b>,
            <Button type="link" loading={loading} onClick={logout}>
                Logout
            </Button>
        </div>
    );
};

const mapStateToProps = (state: CoreState) => {
    return {
        loading: showLoading(state, LOGOUT),
        email: state.app.account.currentUser.email,
        fullName: state.app.account.currentUser.fullName,
    };
};
const mapDispatchToProps = (dispatch: Dispatch) => ({
    logout() {
        dispatch(actions.logout());
    },
});
export default connect(mapStateToProps, mapDispatchToProps)(Account);

export const Authentication = () => <div />;
