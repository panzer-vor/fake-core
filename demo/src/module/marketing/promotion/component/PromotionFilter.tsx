import React, {useState} from "react";
import {Button, Form, Row, Col, Select, Input, DatePicker, Dropdown, Menu} from "antd";
import {showLoading} from "core-fe";
import {Dispatch} from "redux";
import {RootState} from "type/state";
import {actions} from "../";
import {connect} from "react-redux";
import {FormComponentProps} from "antd/lib/form";
import moment from "moment";
import {Filter, LOAD_PROMOTION_LIST, PROMOTION_MAIN_FILTER, PROMOTION_TYPE, PROMOTION_STATUS, PROMOTION_ELIGIBILITY_FILTER} from "../type";
import {PromotionEligibilityAJAXView, PromotionStatusAJAXView, PromotionTypeAJAXView, SearchPromotionAJAXRequest} from "type/api";
import * as R from "ramda";
import "./index.less";
import {dateFormat} from "./tools";
import {DateFormat} from "@core/utils";
interface Props extends FormComponentProps {
    searchLoading: boolean;
    clearInput: () => void;
    searchPromotionList: (request: Filter) => void;
    searchRequest: SearchPromotionAJAXRequest;
}

const storageBoxListData = [
    {
        title: "Status",
        id: "status",
    },
    {
        title: "Eligibility",
        id: "eligibility",
    },
    {
        title: "Purchase Minimum",
        id: "purchase_minimum",
    },
    {
        title: "Valid Start Date",
        id: "valid_start_date",
    },
    {
        title: "Valid End Date",
        id: "valid_end_date",
    },
    {
        title: "Promotion Type",
        id: "type",
    },
];

interface StorageBoxItem {
    title: string;
    id: string;
}

const PromotionListFilter: React.FunctionComponent<Props> = ({form: {getFieldDecorator, resetFields, validateFields, getFieldValue}, searchLoading, searchPromotionList, searchRequest}) => {
    const [storageBox, setStorageBox] = useState<StorageBoxItem[]>([]);
    const [storageBoxList, setStorageBoxList] = useState<StorageBoxItem[]>(storageBoxListData);

    const putStorageBox = (id: string) => {
        const data = storageBoxList.find(v => v.id === id) as StorageBoxItem;
        setStorageBoxList(storageBoxList.filter(v => v.id !== id));
        setStorageBox([...storageBox, data]);
    };

    const removeStorageBox = (id: string) => {
        resetFields([id]);
        const data = storageBox.find(v => v.id === id) as StorageBoxItem;
        setStorageBox(storageBox.filter(v => v.id !== id));
        setStorageBoxList([...storageBoxList, data]);
    };

    const ValidRules = {
        code: [{type: "string", min: 3, message: "at least 3 characters"}],
        name: [{type: "string", min: 3, message: "at least 3 characters"}],
        amount: [{type: "number", transform: Number}],
        percentage: [{type: "number", transform: Number}],
        minimum: [{type: "number", transform: Number}],
    };

    const handleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
        validateFields((err, values) => {
            if (!err) {
                const request = {
                    name: R.equals(values.promotionUniqueKey, PROMOTION_MAIN_FILTER["Promotion Name"]) ? values.promotionUniqueValue || null : null,
                    code: R.equals(values.promotionUniqueKey, PROMOTION_MAIN_FILTER["Promotion Code"]) ? values.promotionUniqueValue || null : null,
                    type: values.type || null,
                    amount_off: values.type === PROMOTION_TYPE.Amount ? values.amount_off || null : null,
                    percentage_off: values.type === PROMOTION_TYPE.Percentage ? values.percentage_off || null : null,
                    purchase_minimum: values.purchase_minimum || null,
                    status: values.status || null,
                    eligibility: values.eligibility || null,
                    valid_start_date_from: values.valid_start_date_from ? dateFormat.formatStartDate(values.valid_start_date_from) : null,
                    valid_start_date_to: values.valid_start_date_to ? dateFormat.formatEndDate(values.valid_start_date_to) : null,
                    valid_end_date_from: values.valid_end_date_from ? dateFormat.formatStartDate(values.valid_end_date_from) : null,
                    valid_end_date_to: values.valid_end_date_to ? dateFormat.formatEndDate(values.valid_end_date_to) : null,
                };
                searchPromotionList(request);
            }
        });
    };

    const handleClear = () => {
        resetFields();
        const request = getFieldValue("");
        setStorageBox([]);
        setStorageBoxList(storageBoxListData);
        searchPromotionList(request);
    };

    return (
        <Form className="ant-advanced-search-form promotion-list_search-form" onSubmit={handleSearch}>
            <div className="promotion-list_form" style={{display: "block"}}>
                <Row gutter={10} style={{marginBottom: "15px"}}>
                    <Col span={8}>
                        <div className="promotion-list_form-field promotion-select-label">
                            <Input.Group compact>
                                <Form.Item>
                                    {getFieldDecorator("promotionUniqueKey", {initialValue: PROMOTION_MAIN_FILTER["Promotion Code"]})(
                                        <Select>
                                            <Select.Option value={PROMOTION_MAIN_FILTER["Promotion Code"]}>{PROMOTION_MAIN_FILTER[0]}</Select.Option>
                                            <Select.Option value={PROMOTION_MAIN_FILTER["Promotion Name"]}>{PROMOTION_MAIN_FILTER[1]}</Select.Option>
                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item style={{width: "100%"}}>
                                    {getFieldDecorator("promotionUniqueValue", {
                                        rules: getFieldValue("promotionUniqueKey") === PROMOTION_MAIN_FILTER["Promotion Code"] ? ValidRules.code : ValidRules.name,
                                    })(<Input />)}
                                </Form.Item>
                            </Input.Group>
                        </div>
                    </Col>
                    <Col span={8} className="promotion-list_form-field">
                        <Dropdown
                            overlay={
                                <Menu multiple>
                                    {storageBoxList.map(v => (
                                        <Menu.Item key={v.id} onClick={() => putStorageBox(v.id)}>
                                            {v.title}
                                        </Menu.Item>
                                    ))}
                                </Menu>
                            }
                            placement="bottomLeft"
                        >
                            <Button className="promotion-storage_box">+filters</Button>
                        </Dropdown>
                    </Col>
                    <Col span={8} style={{display: "flex", justifyContent: "flex-end"}}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Search
                            </Button>
                            <Button type="default" onClick={() => handleClear()}>
                                Clear
                            </Button>
                        </Form.Item>
                    </Col>
                    {storageBox.find(v => v.id === "status") && (
                        <Col span={8}>
                            <div className="promotion-list_form-field">
                                <Form.Item label="Status" labelCol={{span: 5}}>
                                    {getFieldDecorator("status", {initialValue: searchRequest.status})(
                                        <Select showArrow={false}>
                                            <Select.Option value={PromotionStatusAJAXView.ACTIVE}>{PROMOTION_STATUS[PromotionStatusAJAXView.ACTIVE]}</Select.Option>
                                            <Select.Option value={PromotionStatusAJAXView.INACTIVE}>{PROMOTION_STATUS[PromotionStatusAJAXView.INACTIVE]}</Select.Option>
                                        </Select>
                                    )}
                                    <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" style={{cursor: "pointer", position: "absolute", right: "8px", top: "2px"}} onClick={() => removeStorageBox("status")}>
                                        <path
                                            stroke="null"
                                            id="svg_1"
                                            fill="#d2d0ce"
                                            d="m13.765778,0.849541l-0.644875,-0.644831l-6.128607,6.127255l-6.127255,-6.127255l-0.644823,0.644831l6.127246,6.127255l-6.127255,6.128607l0.64484,0.644788l6.127246,-6.128564l6.128607,6.128564l0.644875,-0.644788l-6.127289,-6.128607l6.127289,-6.127255z"
                                        />
                                    </svg>
                                </Form.Item>
                            </div>
                        </Col>
                    )}
                    {storageBox.find(v => v.id === "eligibility") && (
                        <Col span={8}>
                            <div className="promotion-list_form-field">
                                <Form.Item label="Eligibility" labelCol={{span: 5}}>
                                    {getFieldDecorator("eligibility", {initialValue: searchRequest.eligibility})(
                                        <Select placeholder="Please select one" showArrow={false}>
                                            <Select.Option value={PROMOTION_ELIGIBILITY_FILTER["All Buyers"]}>{PROMOTION_ELIGIBILITY_FILTER[PromotionEligibilityAJAXView.ALL]}</Select.Option>
                                            <Select.Option value={PROMOTION_ELIGIBILITY_FILTER["New buyers only"]}>{PROMOTION_ELIGIBILITY_FILTER[PromotionEligibilityAJAXView.NEW_BUYERS_ONLY]}</Select.Option>
                                            <Select.Option value={PROMOTION_ELIGIBILITY_FILTER["Return buyers only"]}>{PROMOTION_ELIGIBILITY_FILTER[PromotionEligibilityAJAXView.RETURN_BUYERS_ONLY]}</Select.Option>
                                            <Select.Option value={PROMOTION_ELIGIBILITY_FILTER["Nth buyers only"]}>{PROMOTION_ELIGIBILITY_FILTER[PromotionEligibilityAJAXView.NTH_BUYERS_ONLY]}</Select.Option>
                                        </Select>
                                    )}
                                    <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" style={{cursor: "pointer", position: "absolute", right: "8px", top: "2px"}} onClick={() => removeStorageBox("eligibility")}>
                                        <path
                                            stroke="null"
                                            id="svg_1"
                                            fill="#d2d0ce"
                                            d="m13.765778,0.849541l-0.644875,-0.644831l-6.128607,6.127255l-6.127255,-6.127255l-0.644823,0.644831l6.127246,6.127255l-6.127255,6.128607l0.64484,0.644788l6.127246,-6.128564l6.128607,6.128564l0.644875,-0.644788l-6.127289,-6.128607l6.127289,-6.127255z"
                                        />
                                    </svg>
                                </Form.Item>
                            </div>
                        </Col>
                    )}
                    {storageBox.find(v => v.id === "purchase_minimum") && (
                        <Col span={8}>
                            <div className="promotion-list_form-field">
                                <Form.Item label="Purchase Minimum" labelCol={{span: 5}}>
                                    {getFieldDecorator("purchase_minimum", {initialValue: searchRequest.purchase_minimum, rules: getFieldValue("promotion_type") === PROMOTION_TYPE.Amount ? ValidRules.minimum : ValidRules.amount})(<Input />)}
                                    <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" style={{cursor: "pointer", position: "absolute", right: "8px", top: "2px"}} onClick={() => removeStorageBox("eligibility")}>
                                        <path
                                            stroke="null"
                                            id="svg_1"
                                            fill="#d2d0ce"
                                            d="m13.765778,0.849541l-0.644875,-0.644831l-6.128607,6.127255l-6.127255,-6.127255l-0.644823,0.644831l6.127246,6.127255l-6.127255,6.128607l0.64484,0.644788l6.127246,-6.128564l6.128607,6.128564l0.644875,-0.644788l-6.127289,-6.128607l6.127289,-6.127255z"
                                        />
                                    </svg>
                                </Form.Item>
                            </div>
                        </Col>
                    )}
                    {storageBox.find(v => v.id === "valid_start_date") && (
                        <Col span={8}>
                            <Form.Item label="Valid Start Date" labelCol={{span: 8}} className="promotion-date-picker" style={{display: "flex"}}>
                                {getFieldDecorator("valid_start_date_from", {initialValue: searchRequest.valid_start_date_from ? moment(searchRequest.valid_start_date_from) : null})(<DatePicker placeholder="" format={DateFormat.DATE_UTC} suffixIcon={<span />} />)}
                                <span className="date-picker-connect">To</span>
                                {getFieldDecorator("valid_start_date_to", {initialValue: searchRequest.valid_start_date_to ? moment(searchRequest.valid_start_date_to) : null})(
                                    <DatePicker
                                        format={DateFormat.DATE_UTC}
                                        suffixIcon={
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{cursor: "pointer"}} onClick={() => removeStorageBox("valid_start_date")}>
                                                <path d="M15.8437 0.948462L15.0999 0.204712L8.03115 7.2719L0.963965 0.204712L0.220215 0.948462L7.2874 8.01565L0.220215 15.0844L0.963965 15.8281L8.03115 8.7594L15.0999 15.8281L15.8437 15.0844L8.77647 8.01565L15.8437 0.948462Z" fill="#d2d0ce" />
                                            </svg>
                                        }
                                        placeholder=""
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    )}
                    {storageBox.find(v => v.id === "valid_end_date") && (
                        <Col span={8}>
                            <Form.Item label="Valid End Date" labelCol={{span: 8}} className="promotion-date-picker">
                                {getFieldDecorator("valid_end_date_from", {initialValue: searchRequest.valid_end_date_from ? moment(searchRequest.valid_end_date_from) : null})(<DatePicker placeholder="" format={DateFormat.DATE_UTC} suffixIcon={<span />} />)}
                                <span className="date-picker-connect">To</span>
                                {getFieldDecorator("valid_end_date_to", {initialValue: searchRequest.valid_end_date_to ? moment(searchRequest.valid_end_date_to) : null})(
                                    <DatePicker
                                        format={DateFormat.DATE_UTC}
                                        suffixIcon={
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{cursor: "pointer"}} onClick={() => removeStorageBox("valid_end_date")}>
                                                <path d="M15.8437 0.948462L15.0999 0.204712L8.03115 7.2719L0.963965 0.204712L0.220215 0.948462L7.2874 8.01565L0.220215 15.0844L0.963965 15.8281L8.03115 8.7594L15.0999 15.8281L15.8437 15.0844L8.77647 8.01565L15.8437 0.948462Z" fill="#d2d0ce" />
                                            </svg>
                                        }
                                        placeholder=""
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    )}
                    {storageBox.find(v => v.id === "type") && (
                        <React.Fragment>
                            <Col span={8}>
                                <div className="promotion-list_form-field">
                                    <Form.Item label="Promotion Type" labelCol={{span: 5}}>
                                        <Input.Group compact style={{display: "flex"}} className="input-group-wrapper">
                                            {getFieldDecorator("type", {initialValue: searchRequest.type})(
                                                <Select showArrow={false}>
                                                    <Select.Option value={PROMOTION_TYPE["Free Shipping"]}>{PROMOTION_TYPE[PromotionTypeAJAXView.FREE_SHIPPING]}</Select.Option>
                                                    <Select.Option value={PROMOTION_TYPE.Amount}>{PROMOTION_TYPE[PromotionTypeAJAXView.AMOUNT]}</Select.Option>
                                                    <Select.Option value={PROMOTION_TYPE.Percentage}>{PROMOTION_TYPE[PromotionTypeAJAXView.PERCENTAGE]}</Select.Option>
                                                </Select>
                                            )}
                                            {(() => {
                                                switch (getFieldValue("type")) {
                                                    case PROMOTION_TYPE.Amount:
                                                        return <React.Fragment>{getFieldDecorator("amount_off", {initialValue: searchRequest.amount_off, rules: ValidRules.amount})(<Input style={{borderLeft: "2px solid #d2d0ce"}} />)}</React.Fragment>;
                                                    case PROMOTION_TYPE.Percentage:
                                                        return <React.Fragment>{getFieldDecorator("percentage_off", {initialValue: searchRequest.percentage_off, rules: ValidRules.percentage})(<Input style={{borderLeft: "2px solid #d2d0ce"}} />)}</React.Fragment>;
                                                    default:
                                                        return null;
                                                }
                                            })()}
                                        </Input.Group>
                                    </Form.Item>
                                </div>
                                <svg
                                    width="14"
                                    height="14"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={Object.assign(
                                        {cursor: "pointer", position: "absolute", top: "8px", zIndex: 1},
                                        getFieldValue("type") === PROMOTION_TYPE.Amount || getFieldValue("type") === PROMOTION_TYPE.Percentage
                                            ? {
                                                  right: "15px",
                                              }
                                            : {
                                                  left: "265px",
                                              }
                                    )}
                                    onClick={() => removeStorageBox("type")}
                                >
                                    <path
                                        stroke="null"
                                        id="svg_1"
                                        fill="#d2d0ce"
                                        d="m13.765778,0.849541l-0.644875,-0.644831l-6.128607,6.127255l-6.127255,-6.127255l-0.644823,0.644831l6.127246,6.127255l-6.127255,6.128607l0.64484,0.644788l6.127246,-6.128564l6.128607,6.128564l0.644875,-0.644788l-6.127289,-6.128607l6.127289,-6.127255z"
                                    />
                                </svg>
                            </Col>
                        </React.Fragment>
                    )}
                </Row>
            </div>
        </Form>
    );
};

const mapStateToProps = (state: RootState) => ({
    searchLoading: showLoading(state, LOAD_PROMOTION_LIST),
    searchRequest: state.app.promotion.filter,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    searchPromotionList: (request: Filter) => dispatch(actions.searchPromotionList(request)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(PromotionListFilter));
