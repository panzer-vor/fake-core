import React from "react";
import { connect } from "react-redux";
import { Route, showLoading } from "core-fe";
import { RouteProps, Redirect } from "react-router";
import { Switch } from "react-router-dom";
import { Layout, Spin } from "antd";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import Nav from "./Nav";
import Header from "./Header";
import { CoreState } from "types/state";
import { Config } from "../../";
import { FTIRoute } from "types/route";
import "./main.less";
import { MainState } from "../type";
import { LoggedUser, AUTHENTICATE } from "../../account/type";
import "antd/lib/layout/style";
import "antd/lib/nav/style";
import "antd/lib/header/style";

export interface Props extends MainState, LoggedUser {}
@DragDropContext(HTML5Backend)
class Main extends React.Component<Props & RouteProps> {
  hasPermission(roles: string[] | null): boolean {
    return Boolean(
      roles &&
        (roles.indexOf("Customer") >= 0 || roles.indexOf("Marketing") >= 0)
    );
  }
  renderRoute(route: FTIRoute, parentPath?: string): JSX.Element[] {
    const { roles } = this.props;
    let routes = [];
    const path = this.pathName(route, parentPath);
    if (route.component) {
      if (this.hasPermission(roles)) {
        routes.push(
          <Route key={path} path={path} component={route.component} />
        );
      } else {
        return [];
      }
    } else if (
      route.children &&
      route.children.length > 0 &&
      route.children[0].component
    ) {
      routes.push(
        <Route key={path} path={path} component={route.children[0].component} />
      );
    }
    if (route.children) {
      for (const child of route.children) {
        routes = routes.concat(this.renderRoute(child, path));
      }
    }
    return routes;
  }
  private pathName(route: FTIRoute, parentPath: string | undefined) {
    if (route.path.startsWith("/")) {
      return route.path;
    } else if (parentPath) {
      if (route.path) {
        return parentPath + "/" + route.path;
      } else {
        return parentPath;
      }
    } else {
      return "/" + route.path;
    }
  }
  render() {
    const { location, loading } = this.props;
    return (
      <>
        {loading && <Spin className="fti-main-spin" />}
        <Layout className="fti">
          <Nav />
          <Layout>
            <Header />
            <Route
              exact
              key={"/nonexistence"}
              path={"/nonexistence"}
              component={() => <Nonexistence />}
            />
            <Route
              exact
              key={"/"}
              path={"/"}
              component={() => <Redirect to="/restaurant-list-ads" />}
            />
            <Layout.Content className="fti-layout">
              <div className="fti-layout__content">
                <div key={location && location.pathname}>
                  <Switch location={location}>
                    {Config.routes.map(route => this.renderRoute(route))}
                  </Switch>
                </div>
              </div>
            </Layout.Content>
          </Layout>
        </Layout>
      </>
    );
  }
}
export const Nonexistence = () => (
  <div style={{ padding: "32px" }}>
    <h1>
      Your account doesn't exist, please contact Administrator to create an
      account for you, or <a href="/logout">Logout</a> and then try another
      account.
    </h1>
  </div>
);
const mapStatesToProps = (state: CoreState): Props => {
  return {
    loading: showLoading(state, AUTHENTICATE),
    roles: state.app.account.currentUser.roles,
    email: state.app.account.currentUser.email,
    fullName: state.app.account.currentUser.fullName
  };
};
export default connect(mapStatesToProps)(Main);
