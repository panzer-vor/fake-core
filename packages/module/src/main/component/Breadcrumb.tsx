import React from "react";
import {connect} from "react-redux";
import {Breadcrumb} from "antd";
import {Link, withRouter, RouteComponentProps} from "react-router-dom";

import {Config} from "../../";
import {FTIRoute} from "types/route";

import "./breadcrumb.less";

interface HistoryRoute {
    name: string;
    path: string;
}

const BreadCrumb: React.FunctionComponent<RouteComponentProps> = ({location}) => {
    const historyRoutes: HistoryRoute[] = routes(location.pathname);
    return (
        <div className="fti-breadcrumb">
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/">Home</Link>
                </Breadcrumb.Item>
                {historyRoutes.map((route, index) => (
                    <Breadcrumb.Item key={route.path}>{index === historyRoutes.length - 1 ? <span>{route.name}</span> : <Link to={route.path}>{route.name}</Link>}</Breadcrumb.Item>
                ))}
            </Breadcrumb>
        </div>
    );
};

function routes(pathname: string): HistoryRoute[] {
    const paths = pathname.split("/");
    if (paths.length === 1) {
        return [];
    }
    paths.splice(0, 1);
    const routes: FTIRoute[] = matchRoute(paths, Config.routes, 0);
    const result: HistoryRoute[] = [];
    for (let i = 0; i < routes.length; i += 1) {
        const route = routes[i];
        const historyRoute: HistoryRoute = {
            name: route.name,
            path: i > 0 ? result[i - 1].path + "/" + route.path : "/" + route.path,
        };
        result.push(historyRoute);
    }
    return result;
}

function matchRoute(paths: string[], routes: FTIRoute[], level: number): FTIRoute[] {
    const path = paths[level];
    const result: FTIRoute[] = [];
    for (const route of routes) {
        if (matchPattern(route.path, path)) {
            result.push(route);
            if (route.children && route.children.length > 0) {
                return result.concat(matchRoute(paths, route.children, level + 1));
            }
        }
    }

    return result;
}

function matchPattern(pattern: string, path: string) {
    if (!pattern || !path) {
        return false;
    }
    if (pattern === path) {
        return true;
    }
    const index = pattern.indexOf(":");
    if (index >= 0) {
        return pattern.substr(0, index - 1) === path.substr(0, index - 1);
    }
    return false;
}

export default withRouter(connect()(BreadCrumb));
