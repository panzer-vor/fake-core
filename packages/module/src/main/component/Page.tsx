import {Layout, PageHeader, Spin, Skeleton} from "antd";
import React, {ReactNode} from "react";
import {connect} from "react-redux";

import "./page.less";
import RcQueueAnim from "rc-queue-anim";

const {Content, Footer} = Layout;
interface Props {
    title?: ReactNode;
    subtitle?: string;
    actions?: ReactNode;
    children?: ReactNode;
    header?: ReactNode;
    footer?: ReactNode;
    loading?: boolean;
    showBackground?: boolean;
}

interface StateProps extends Props {}

class Page extends React.Component<StateProps> {
    constructor(props: StateProps) {
        super(props);
    }

    render() {
        const {title, subtitle, actions, header, children, footer, loading, showBackground} = this.props;
        return (
            <Layout className={"fti-page"}>
                <RcQueueAnim type={["right", "left"]}>
                    {header || <PageHeader title={loading ? "Loading..." : title} subTitle={subtitle} extra={actions} />}
                    <div className={showBackground ? "fti-page__main-white" : "fti-page__main"}>
                        <Skeleton active={loading} loading={loading} className="skeleton">
                            <Content key="content" className="fti-page__content">
                                {children}
                            </Content>
                            {footer && (
                                <Footer key="footer" className="fti-page__footer">
                                    {footer}
                                </Footer>
                            )}
                        </Skeleton>
                    </div>
                </RcQueueAnim>
            </Layout>
        );
    }
}

export default connect()(Page);
