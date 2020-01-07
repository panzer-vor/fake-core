import React from "react";
import {message, Card, Button} from "antd";
import {Link} from "react-router-dom";
import {connect} from "react-redux";

import "./permission-denied.less";

const PermissionDenied: React.SFC<{}> = () => {
    message.error("Permission denied", 3);
    return (
        <Card title="Sign in " className="fti-permission">
            <div>
                <Button type="primary" className="login-form-button">
                    <Link to="/login"> Sign in as another account</Link>
                </Button>
            </div>
        </Card>
    );
};

export default connect()(PermissionDenied);
