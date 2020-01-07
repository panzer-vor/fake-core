import React from "react";
import {Table, PageHeader, Row, Col, Button, Popconfirm} from "antd";
import {Page} from "fake-core-module";
import {PromotionListState, LOAD_PROMOTION_LIST, APPLIED_TO_TYPE, DELETE_PROMOTION, PROMOTION_STATUS, PROMOTION_TYPE, PROMOTION_ELIGIBILITY_FILTER} from "../type";
import {PaginationConfig} from "antd/lib/table";
import {SearchPromotionAJAXResponse$Promotion, PromotionTypeAJAXView, PromotionStatusAJAXView, PromotionEligibilityAJAXView} from "type/api";
import {Dispatch} from "redux";
import {RootState} from "type/state";
import {connect} from "react-redux";
import {actions} from "../";
import {showLoading} from "core-fe";
import {Link} from "react-router-dom";
import {Pagination} from "fake-core-widget";
import PromotionFilter from "./PromotionFilter";
import "./index.less";
import {dateFormat} from "./tools";
import {getUTCDate} from "fake-core-utils";
interface Props extends PromotionListState {
    changePage: (current?: number, limit?: number) => void;
    deletePromotion: (code: string) => void;
    deleteLoading: boolean;
    loading: boolean;
    promotions: SearchPromotionAJAXResponse$Promotion[];
}
const PromotionList: React.SFC<Props> = ({promotions, pagination, changePage, loading, deleteLoading, deletePromotion}) => {
    const handleTableChange = ({current, pageSize}: PaginationConfig) => {
        changePage(current, pageSize);
    };
    const columns = [
        {
            title: "Code",
            dataIndex: "code",
            key: "code",
            className: "promotion-margin-left",
            render: (code: string, dataColumn: SearchPromotionAJAXResponse$Promotion, index: number) => {
                const promoCode = code.indexOf("%") > -1 ? encodeURIComponent(code) : code;
                return <Link to={`/promotion/${encodeURIComponent(dataColumn.code)}/readonly`}>{code}</Link>;
            },
        },
        {
            title: "Promotion Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Eligibility",
            dataIndex: "eligibility",
            key: "eligibility",
            render: (data: string) => {
                if (data === PromotionEligibilityAJAXView.ALL) {
                    return <span>{PROMOTION_ELIGIBILITY_FILTER[PromotionEligibilityAJAXView.ALL]}</span>;
                } else if (data === PromotionEligibilityAJAXView.NEW_BUYERS_ONLY) {
                    return <span>{PROMOTION_ELIGIBILITY_FILTER[PromotionEligibilityAJAXView.NEW_BUYERS_ONLY]}</span>;
                } else if (data === PromotionEligibilityAJAXView.NTH_BUYERS_ONLY) {
                    return <span>{PROMOTION_ELIGIBILITY_FILTER[PromotionEligibilityAJAXView.NTH_BUYERS_ONLY]}</span>;
                } else if (data === PromotionEligibilityAJAXView.RETURN_BUYERS_ONLY) {
                    return <span>{PROMOTION_ELIGIBILITY_FILTER[PromotionEligibilityAJAXView.RETURN_BUYERS_ONLY]}</span>;
                } else {
                    return null;
                }
            },
        },
        {
            title: "Promotion Type",
            dataIndex: "type",
            key: "type",
            render: (data: string) => {
                if (data === PromotionTypeAJAXView.FREE_SHIPPING) {
                    return <span>{PROMOTION_TYPE[PromotionTypeAJAXView.FREE_SHIPPING]}</span>;
                } else if (data === PromotionTypeAJAXView.AMOUNT) {
                    return <span>{PROMOTION_TYPE[PromotionTypeAJAXView.AMOUNT]}</span>;
                } else if (data === PromotionTypeAJAXView.PERCENTAGE) {
                    return <span>{PROMOTION_TYPE[PromotionTypeAJAXView.PERCENTAGE]}</span>;
                } else {
                    return null;
                }
            },
        },
        {
            title: "Discount",
            dataIndex: "discount",
            key: "amount",
            render: (data: string, record: SearchPromotionAJAXResponse$Promotion, index: number) => {
                const {type} = record;
                let offData = null;
                let overData = null;
                let maxData = null;
                if (type === PromotionTypeAJAXView.AMOUNT) {
                    offData = record.amount_off ? "$" + record.amount_off + " off" : "";
                }
                if (type === PromotionTypeAJAXView.PERCENTAGE) {
                    offData = record.percentage_off ? record.percentage_off + "% off" : "";
                }
                if (type === PromotionTypeAJAXView.FREE_SHIPPING) {
                    offData = "Free shipping";
                }
                if (type === PromotionTypeAJAXView.FREE_ITEM) {
                    offData = "Free meal";
                }
                if (!offData && !record.purchase_minimum) {
                    return null;
                }
                overData = record.purchase_minimum ? `over $${record.purchase_minimum}` : "";
                maxData = record.max_discount ? `, Max $${record.max_discount}` : "";
                return (
                    <span>
                        {offData} {overData}
                        {maxData}
                    </span>
                );
            },
        },
        {
            title: "Applied To",
            dataIndex: "apply_type",
            key: "apply_type",
            render: (data: string) => {
                return <span>{APPLIED_TO_TYPE[data]}</span>;
            },
        },
        {
            title: "Distribution Period",
            dataIndex: "distribution_start_date",
            key: "distribution_start_date",
            render: (data: Date, dataColumn: SearchPromotionAJAXResponse$Promotion, index: number) => {
                const startDate = getUTCDate(dataColumn.distribution_start_date);
                const endDate = getUTCDate(dataColumn.distribution_end_date);
                const dateString = `${startDate} ~ ${endDate}`;
                return <span>{dateString.length > 5 ? dateString : ""}</span>;
            },
        },
        {
            title: "Valid Period",
            dataIndex: "valid_start_date",
            key: "valid_start_date",
            render: (data: Date, dataColumn: SearchPromotionAJAXResponse$Promotion, index: number) => {
                const startDate = getUTCDate(dataColumn.valid_start_date);
                const endDate = getUTCDate(dataColumn.valid_end_date);
                return <span>{`${startDate} ~ ${endDate}`}</span>;
            },
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (data: string) => {
                if (data === PromotionStatusAJAXView.ACTIVE) {
                    return <span>{PROMOTION_STATUS[PromotionStatusAJAXView.ACTIVE]}</span>;
                } else if (data === PromotionStatusAJAXView.INACTIVE) {
                    return <span>{PROMOTION_STATUS[PromotionStatusAJAXView.INACTIVE]}</span>;
                } else {
                    return null;
                }
            },
        },
        {
            title: "Action",
            key: "Action",
            render: (data: null, dataColumn: SearchPromotionAJAXResponse$Promotion) => {
                // if (dataColumn.status === PromotionStatusAJAXView.ACTIVE && dateFormat.now() >= new Date(dataColumn.valid_start_date).getTime()) {
                //     return <Button type="link">Usage</Button>;
                // }

                if (dataColumn.status === PromotionStatusAJAXView.INACTIVE || (dataColumn.status === PromotionStatusAJAXView.ACTIVE && dateFormat.now() < new Date(dataColumn.distribution_start_date).getTime())) {
                    return (
                        <div style={{whiteSpace: "nowrap"}}>
                            <Link to={`/promotion/${encodeURIComponent(dataColumn.code)}`}>
                                <img style={{marginBottom: "6px"}} src={require("asset/icons/edit.png").default} alt="edit" />
                            </Link>
                            <Popconfirm placement="top" title="Are you sure to delete this promotion?" onConfirm={() => deletePromotion(dataColumn.code)} cancelText="No" okText="Yes">
                                <Button type="link">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{cursor: "pointer"}}>
                                        <path d="M15.8437 0.948462L15.0999 0.204712L8.03115 7.2719L0.963965 0.204712L0.220215 0.948462L7.2874 8.01565L0.220215 15.0844L0.963965 15.8281L8.03115 8.7594L15.0999 15.8281L15.8437 15.0844L8.77647 8.01565L15.8437 0.948462Z" fill="#A0006B" />
                                    </svg>
                                </Button>
                            </Popconfirm>
                        </div>
                    );
                }
                return (
                    <Link to={`/promotion/${encodeURIComponent(dataColumn.code)}`}>
                        <img src={require("asset/icons/edit.png").default} alt="edit" />
                    </Link>
                );
            },
        },
    ];
    const rowClassName = (record: any, index: number) => {
        if ((index + 1) % 2 !== 0) {
            return "promotion-list_table-row";
        }
        return "";
    };
    const onChange = (current: number, pageSize: number) => {
        handleTableChange({current, pageSize});
    };
    return (
        <React.Fragment>
            <Row justify="end" type="flex" style={{position: "absolute", top: "19px", right: 0, zIndex: 1}}>
                <Col>
                    <Link key="edit" to="/promotion/create">
                        <Button type="primary">Create New Promotion</Button>
                    </Link>
                </Col>
            </Row>
            <Page showBackground header={<PageHeader title="Promotion" subTitle="Manage promotion" />}>
                <PromotionFilter />
                <br />
                <Table
                    rowClassName={(record, index) => rowClassName(record, index)}
                    loading={loading || deleteLoading}
                    className="table-container promotion-list_table"
                    rowKey={(data, $index) => data.code || $index + ""}
                    columns={columns}
                    pagination={false}
                    dataSource={promotions || []}
                    onChange={pagination => handleTableChange(pagination)}
                />
                <Pagination onChange={onChange} {...pagination} />
            </Page>
        </React.Fragment>
    );
};
const mapStateToProps = (state: RootState) => ({
    loading: showLoading(state, LOAD_PROMOTION_LIST),
    deleteLoading: showLoading(state, DELETE_PROMOTION),
    promotions: state.app.promotion.promotions,
    pagination: state.app.promotion.pagination,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    changePage: (current?: number, limit?: number) => dispatch(actions.changePage(current, limit)),
    deletePromotion: (code: string) => dispatch(actions.deletePromotion(code)),
});
export default connect(mapStateToProps, mapDispatchToProps)(PromotionList);
