import React from "react";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {RootState} from "type/state";
import {showLoading} from "core-fe";
import {Button, Icon, Modal, Spin} from "antd";
import {DataForm} from "fake-core-widget";
import {WrappedFormUtils} from "antd/lib/form/Form";
import {actions} from "..";
import {RouteProps} from "react-router";
import {CreateRestaurantAdAJAXRequest, UpdateRestaurantAdAJAXRequest, ActionTypeAJAXView} from "type/api";
import {RestaurantListAdsInfoState, GET_RESTAURANT_LIST_AD} from "../type";
import "../index.less";
import draftToHtml from "draftjs-to-html";
interface StateProps extends RestaurantListAdsInfoState {
    loading: boolean;
}
interface State {
    visible: boolean;
    previewVisible: boolean;
    data: string;
}
interface Props extends RouteProps, StateProps {
    submit: (request: CreateRestaurantAdAJAXRequest) => void;
    updateRestaurantListAd: (id: string, request: UpdateRestaurantAdAJAXRequest) => void;
    typeChange: (value: ActionTypeAJAXView) => void;
    onClose: () => void;
}
let form: WrappedFormUtils;

class RestaurantListAdsInfoComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            visible: false,
            previewVisible: false,
            data: "",
        };
    }
    // state = {visible: false, previewVisible: false, data: null};
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({
            visible: false,
        });
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };
    onSubmit = () => {
        const {submit, updateRestaurantListAd, id, showEditor, onClose} = this.props;
        if (form) {
            form.validateFieldsAndScroll((err, values: any) => {
                // console.log(draftToHtml(values.editor))
                if (!err) {
                    const form = {
                        ...values,
                        action_url: showEditor && values.editor ? (draftToHtml(values.editor) ? draftToHtml(values.editor) : values.editor) : values.action_url,
                    };
                    delete form.editor;
                    if (!id) {
                        submit(form);
                    } else {
                        updateRestaurantListAd(id, form);
                    }
                    onClose();
                }
            });
        }
    };
    showPreview = () => {
        const {submit, updateRestaurantListAd, id, showEditor, onClose} = this.props;
        this.setState({
            data: form.getFieldValue("editor").toHTML(),
            previewVisible: true,
        });
    };
    hidePreview = () => {
        this.setState({
            previewVisible: false,
        });
    };
    render() {
        const {id, loading, adValue, adForm, showEditor, typeChange} = this.props;
        const {previewVisible, data} = this.state;
        return (
            // <Page loading={id ? loading : false} header={<PageHeader title={`${id ? "Edit" : "Add"} Restaurant List Ad`} subTitle={<Icon type="question-circle" onClick={this.showModal} />} extra={} />}>
            <Spin spinning={loading}>
                <Icon type="question-circle" onClick={this.showModal} />
                <DataForm
                    wrappedComponentRef={(ref: WrappedFormUtils) => {
                        if (ref) {
                            form = ref;
                        }
                    }}
                    value={adValue || {}}
                    // fields={adForm}
                    fields={{
                        ...adForm,
                        action_type: {
                            ...adForm.action_type,
                            onChange: typeChange,
                        },
                        action_url: {
                            ...adForm.action_url,
                            hide: showEditor,
                            rules: [
                                {
                                    required: !showEditor,
                                    message: "Link Contents is required",
                                },
                            ],
                        },
                        editor: {
                            ...adForm.editor,
                            hide: !showEditor,
                            rules: [
                                {
                                    required: showEditor,
                                    message: "Link Contents is required",
                                },
                            ],
                            value: adValue && adValue.action_type === ActionTypeAJAXView.INTERNAL_PAGE ? adValue.action_url : "",
                        },
                    }}
                />
                <Modal title="Instructions" footer={null} visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <div>
                        <div>
                            Restaurant List Ads are displayed in the restaurant list page as shown in the bottom.
                            <br />
                            <br />
                            <div>
                                1. Line 1 <br />
                                2. Title <br />
                                3. Description <br />
                                4. Back ground image <br />
                                5. Link: Click on the link will redirect the user to the required page <br />
                            </div>
                        </div>
                        <br />
                        <img src={require("../static/tip.png").default} alt="" />
                    </div>
                </Modal>
                {/* <Modal title="Preview" footer={null} visible={previewVisible} onCancel={this.hidePreview}>
                    <div dangerouslySetInnerHTML={{__html: data}} />
                </Modal> */}
                <div className="saveBtn">
                    <Button type="primary" onClick={this.onSubmit}>
                        Save
                    </Button>
                    {/* {showEditor ? (
                        <Button type="default" onClick={() => this.showPreview()}>
                            Preview
                        </Button>
                    ) : null} */}
                </div>
            </Spin>
        );
    }
}

const mapStateToProps = (state: RootState): StateProps => ({
    adForm: state.app.ad.restaurantListAdsInfo.adForm,
    id: state.app.ad.restaurantListAdsInfo.id,
    loading: showLoading(state, GET_RESTAURANT_LIST_AD),
    adValue: state.app.ad.restaurantListAdsInfo.adValue,
    showEditor: state.app.ad.restaurantListAdsInfo.showEditor,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
    typeChange: (value: ActionTypeAJAXView) => dispatch(actions.typeChange(value)),
    submit: (request: CreateRestaurantAdAJAXRequest) => dispatch(actions.submit(request)),
    updateRestaurantListAd: (id: string, request: UpdateRestaurantAdAJAXRequest) => dispatch(actions.updateRestaurantListAd(id, request)),
});
export default connect(mapStateToProps, mapDispatchToProps)(RestaurantListAdsInfoComponent);
