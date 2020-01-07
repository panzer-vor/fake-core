import React, {ReactNode} from "react";
import {Link} from "react-router-dom";
import {Button} from "antd";
import "./horizontal-app-link.less";
import {getIconClassName} from "@uifabric/styling";

interface Props {
    icon?: string;
    iconComponent?: ReactNode;
    text: string;
    link: string;
    inSite?: boolean;
}
export const HorizontalAppLink = ({icon, text, link, inSite}: Props) => {
    const button = (
        <Button
            className="horizontal-app-link-btn"
            {...(link &&
                !inSite && {
                    href: link,
                })}
        >
            {icon && <i className={"horizontal-app-link-btn-icon " + getIconClassName(icon)} />}
            <span className="horizontal-app-link-btn-text">{text}</span>
        </Button>
    );
    if (inSite) {
        return <Link to={link}>{button}</Link>;
    }
    return button;
};
