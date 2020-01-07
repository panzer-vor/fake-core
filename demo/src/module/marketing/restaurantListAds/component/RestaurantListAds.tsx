import React from "react";
import {Button, Popconfirm, Icon, Modal, Drawer} from "antd";
import {Page} from "@core/module";
import {connect} from "react-redux";
import {RootState} from "type/state";
import {RestaurantListAdsState, LOAD_RESTAURANT_LIST_ADS} from "../type";
import "../index.less";
import {Dispatch} from "redux";
import {actions} from "..";
import {showLoading} from "core-fe";
import {DragableTable} from "@core/widget";
import {ActionTypeAJAXView, ListRestaurantAJAXAdResponse$Ad} from "type/api";
import RestaurantListAdsInfoComponent from "./RestaurantListAdsInfo";

interface StateProps extends RestaurantListAdsState {
    loading: boolean;
    id: string;
}
interface ActionProps {
    delete: (id: string) => void;
    moveRow: (dragIndex: number, hoverIndex: number) => void;
    saveOrder: (ids: string[]) => void;
    clearForm: () => void;
    getRestaurantListAd: (id: string) => void;
}
interface Props extends StateProps, ActionProps {}
class RestaurantListAdsComponent extends React.PureComponent<Props> {
    state = {visible: false, image: "", showForm: false};
    showModal = (image: string) => {
        this.setState({
            visible: true,
            image,
        });
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };
    onClose = () => {
        this.setState(
            {
                showForm: false,
            },
            () => {
                this.props.clearForm();
            }
        );
    };
    saveClose = () => {
        this.setState({
            showForm: false,
        });
    };
    showFormDrawer = (id: string) => {
        this.setState(
            {
                showForm: true,
            },
            () => {
                if (id) {
                    this.props.getRestaurantListAd(id);
                }
            }
        );
    };
    columns = [
        {title: "", key: "", dataIndex: "", render: () => <Icon type="menu" />},
        {title: "Line1", key: "sub_title", dataIndex: "sub_title", width: 150},
        {title: "Title", key: "title", dataIndex: "title"},
        {title: "Description", key: "description", dataIndex: "description", width: 300},
        {title: "Link Words", key: "action_title", dataIndex: "action_title", width: 150},
        {
            title: "Link Type",
            key: "action_type",
            dataIndex: "action_type",
            render: (type: ActionTypeAJAXView) => {
                switch (type) {
                    case ActionTypeAJAXView.EXTERNAL_LINK:
                        return "External URL";
                    case ActionTypeAJAXView.INTERNAL_LINK:
                        return "Internal page";
                    case ActionTypeAJAXView.INTERNAL_PAGE:
                        return "Editable page";
                }
            },
        },
        {
            title: "Link Contents",
            key: "action_url",
            dataIndex: "action_url",
            width: 200,
            render: (text: string, record: ListRestaurantAJAXAdResponse$Ad) => {
                if (record.action_type === ActionTypeAJAXView.INTERNAL_PAGE) {
                    return <div style={{width: "375px"}} dangerouslySetInnerHTML={{__html: text}} />;
                } else {
                    return text;
                }
            },
        },
        {title: "Image", key: "image_key", dataIndex: "image_key", render: (image: string) => (image ? <img onClick={() => this.showModal(image)} style={{maxHeight: "60px", cursor: "pointer"}} src={`/image/${image}`} /> : "")},
        {
            title: "Actions",
            key: "action",
            className: "fti-users__table-actions",
            render: (text: string, record: ListRestaurantAJAXAdResponse$Ad) => (
                <React.Fragment>
                    {/* <Link key="edit" to={`/restaurant-list-ads/update/${record.id}`}> */}
                    <Button type="link" onClick={() => this.showFormDrawer(record.id || "")}>
                        Edit
                    </Button>
                    {/* </Link> */}
                    <Popconfirm key={1} cancelText="No" okText="Yes" title="Are you sure to remove this advertisement?" onConfirm={() => this.props.delete(record.id || "")}>
                        <Button type="link">Delete</Button>
                    </Popconfirm>
                </React.Fragment>
            ),
        },
    ];
    saveOrder = () => {
        const {ads} = this.props;
        const request: string[] = [];
        (ads || []).map(ad => {
            request.push(ad.id || "");
        });
        this.props.saveOrder(request);
    };
    render() {
        const {ads, loading, id} = this.props;
        const {showForm} = this.state;
        return (
            <Page
                showBackground
                loading={loading}
                title="Restaurant List Ads"
                subtitle="Manage Restaurant List Ads"
                actions={[
                    <React.Fragment key={1}>
                        <Button type="primary" disabled={(ads || []).length >= 6 ? true : false} onClick={() => this.showFormDrawer("")}>
                            {/* <Link to="/restaurant-list-ads/add">Create</Link> */}
                            Create
                        </Button>
                        <Button type="primary" onClick={this.saveOrder}>
                            Save
                        </Button>
                    </React.Fragment>,
                ]}
            >
                <DragableTable
                    rowKey={(data, $index) => data.predefined_product_id || $index + ""}
                    dataSource={ads || []}
                    columns={this.columns}
                    onRow={(record, index) => ({
                        index,
                        moveRow: this.props.moveRow,
                    })}
                    pagination={false}
                />
                <Modal className="common-drawer" footer={null} visible={this.state.visible} onCancel={this.handleCancel}>
                    <img style={{width: "100%"}} src={`/image/${this.state.image}`} />
                </Modal>
                <Drawer className="common-drawer" width="835" title={id ? "Update Restaurant List Ad" : "Create Restaurant List Ad"} placement="right" closable onClose={this.onClose} visible={showForm}>
                    {showForm && <RestaurantListAdsInfoComponent onClose={this.saveClose} />}
                </Drawer>
                {/* <HtmlEditor /> */}
            </Page>
        );
    }
}
const mapStateToProps = (state: RootState): StateProps => ({
    ads: state.app.ad.restaurantListAds.ads,
    loading: showLoading(state, LOAD_RESTAURANT_LIST_ADS),
    id: state.app.ad.restaurantListAdsInfo.id,
});

const mapDispatchToProps = (dispatch: Dispatch): ActionProps => ({
    delete(id: string) {
        dispatch(actions.delete(id));
    },
    moveRow(dragIndex: number, hoverIndex: number) {
        dispatch(actions.moveRow(dragIndex, hoverIndex));
    },
    saveOrder(ids: string[]) {
        dispatch(actions.saveOrder(ids));
    },
    clearForm() {
        dispatch(actions.clearForm());
    },
    getRestaurantListAd(id: string) {
        dispatch(actions.getRestaurantListAd(id));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantListAdsComponent);
