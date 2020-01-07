import {Icon, Layout, Menu, Button, Drawer} from "antd";
import React, {useState} from "react";
import {connect, MapStateToProps} from "react-redux";
import {Link, withRouter, RouteComponentProps} from "react-router-dom";
import {CoreState} from "types/state";
import {Config} from "../../";
import {HorizontalAppLink} from "./HorizontalAppLink";

interface Props extends RouteComponentProps {
    email: string | null;
    roles: string[];
}

const appLink = (app: string) => {
    return `https://${app}.${Config.host}`;
};

const Nav: React.SFC<Props> = ({email, roles, location}) => {
    const hasPermission = (role: string): boolean => {
        return Boolean(roles && roles.indexOf(role) >= 0);
    };
    const [collapsed, setCollapsed] = useState(false);
    const [menuOpened, setMenuOpened] = useState(false);
    if (location.pathname !== "" && location.pathname !== "/" && location.pathname !== "/login") {
        localStorage.setItem("PREV_LOCATION", location.pathname);
    }
    const openAppMenu = () => setMenuOpened(true);
    const closeAppMenu = () => setMenuOpened(false);
    return (
        <Layout.Sider width={250} collapsed={collapsed} collapsible onCollapse={setCollapsed}>
            <Button className="logo-btn" onClick={openAppMenu}>
                <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="2" cy="2" r="2" />
                    <circle cx="8" cy="2" r="2" />
                    <circle cx="14" cy="2" r="2" />
                    <circle cx="2" cy="8" r="2" />
                    <circle cx="8" cy="8" r="2" />
                    <circle cx="14" cy="8" r="2" />
                    <circle cx="2" cy="14" r="2" />
                    <circle cx="8" cy="14" r="2" />
                    <circle cx="14" cy="14" r="2" />
                </svg>
            </Button>
            <Drawer maskStyle={{background: "none", visibility: "visible"}} closable={false} maskClosable onClose={closeAppMenu} className="fti-app-menu" visible={menuOpened} placement="left" width={320}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <Button className="fti-nav-logo-btn" onClick={closeAppMenu}>
                        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="2" cy="2" r="2" />
                            <circle cx="8" cy="2" r="2" />
                            <circle cx="14" cy="2" r="2" />
                            <circle cx="2" cy="8" r="2" />
                            <circle cx="8" cy="8" r="2" />
                            <circle cx="14" cy="8" r="2" />
                            <circle cx="2" cy="14" r="2" />
                            <circle cx="8" cy="14" r="2" />
                            <circle cx="14" cy="14" r="2" />
                        </svg>
                    </Button>
                    <a href={`https://auth.${Config.host}`}>
                        <Button type="link" icon="arrow-right">
                            <span style={{float: "left", paddingRight: 10, color: "#212133"}}>All Apps </span>
                        </Button>
                    </a>
                </div>
                <div className="fti-header-menu__app">
                    <h2 className="fti-header-menu__app-title">Apps</h2>
                    <div className="fti-header-menu__app-list">
                        {hasPermission("User_Admin") && <HorizontalAppLink icon="SecurityGroup" text="Admin" link={appLink("auth") + "/user"} />}
                        {hasPermission("Restaurant") && <HorizontalAppLink icon="eatDrink" text="Restaurant" link={appLink("restaurant")} />}
                        {hasPermission("Customer") && <HorizontalAppLink icon="group" text="Customer Portal" link={appLink("crs")} />}
                        {hasPermission("Dynamic_365") && <HorizontalAppLink icon="dynamics365Logo" text="Dynamic 365" link="#" />}
                        {hasPermission("Marketing") && <HorizontalAppLink icon="market" text="Marketing" link={appLink("marketing")} />}
                        {hasPermission("Merchandising") && <HorizontalAppLink icon="telemarketer" text="Merchandising" link="#" />}
                        {hasPermission("Operation") && <HorizontalAppLink icon="deliveryTruck" text="Truck and Logistics " link={appLink("tl")} />}
                        {hasPermission("Ceridian") && <HorizontalAppLink icon="deliveryTruck" text="Ceridian" link="#" />}
                        {hasPermission("Simulator") && <HorizontalAppLink icon="mapPin" text="Simulator" link={appLink("simulator")} />}
                        {hasPermission("Demand_Forecasting") && <HorizontalAppLink icon="seeDo" text="Demand and Forecasting" link="#" />}
                        {hasPermission("Analytics") && <HorizontalAppLink icon="analyticsView" text="Analytics" link="#" />}
                    </div>
                </div>
            </Drawer>
            <div className="logo">
                <img src={require("./logo.png").default} />
            </div>
            {/* </div> */}
            <Menu theme="dark" mode="inline" selectedKeys={openedItem(location.pathname)} defaultOpenKeys={openedItem(location.pathname)}>
                {Config.routes.map(
                    route =>
                        route.menu &&
                        hasPermission("Marketing") && (
                            <Menu.Item key={route.path}>
                                <Link to={"/" + route.path}>
                                    <Icon type={route.icon} />
                                    <span>{route.menu}</span>
                                </Link>
                            </Menu.Item>
                        )
                )}
            </Menu>
        </Layout.Sider>
    );
};

function openedItem(pathname: string): string[] {
    const paths = pathname.split("/");
    if (paths.length === 1) {
        return ["/"];
    }
    const path = paths[1];
    return [path];
}

const mapStateToProps: MapStateToProps<Props, Props, CoreState> = (state: CoreState, ownProps): Props => {
    return {
        roles: state.app.account.currentUser.roles || [],
        ...ownProps,
    };
};

export default withRouter(connect<Props, {}, Props, CoreState>(mapStateToProps)(Nav) as any);
