import React from "react";
import {connect} from "react-redux";

const NotFound: React.SFC<{}> = () => (
    <div className="fti-full-screen">
        <h1>Not Found</h1>
    </div>
);

export default connect()(NotFound);
