import React from "react";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {Layout, Row, Col} from "antd";
import {actions as uiActions} from "..";
import {CoreState} from "types/state";
import BreadCrumb from "./Breadcrumb";

import {Account} from "../../account";

import "./header.less";

interface Props {
    toggleNav: () => void;
    navCollpased: boolean;
}

const Header: React.FunctionComponent<Props> = ({navCollpased, toggleNav}) => {
    return (
        <Layout.Header className="fti-header">
            <Row type="flex" justify="space-between">
                <Col>
                    <BreadCrumb />
                </Col>
                <Col>
                    <Account />
                </Col>
            </Row>
        </Layout.Header>
    );
};

const mapStatsToProps = (state: CoreState) => {
    return {
        navCollpased: state.app.main.nav.collapsed,
    };
};
const mapDispatchToProps = (dispatch: Dispatch) => ({
    toggleNav() {
        dispatch(uiActions.toggleNav());
    },
});
export default connect(mapStatsToProps, mapDispatchToProps)(Header);
