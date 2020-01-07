import {ComponentType, ComponentClass, FunctionComponent} from "react";

export declare type Component = ComponentType | ComponentClass<Pick<any, any>> | FunctionComponent<Pick<any, any>> | ComponentType<any>;

export interface FTIRoute {
    name: string;
    path: string;
    menu?: string;
    icon?: string;
    hash?: string;
    role: string | null;
    component?: Component;
    children?: FTIRoute[];
}
