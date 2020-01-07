import React, {useReducer, Reducer, useEffect, useRef} from "react";
import {Page} from "@core/module";
import {PageHeader, Skeleton, Row, Col, Form, Input, DatePicker, Radio, Tag, Button, Table, Drawer, Checkbox, Select, Popconfirm, message} from "antd";
import {
    LOAD_PROMOTION_DETAIL,
    LOAD_RESTAURANT_LIST,
    SAVE_PROMOTION_DETAIL,
    LOAD_RESTAURANT_MEAL_LIST,
    Item,
    LOAD_RESTAURANT_MENU_LIST,
    UPDATE_PROMOTION_STATUS,
    PromotionDetailState,
    APPLIED_TO_TYPE,
    Restaurant,
    PROMOTION_ELIGIBILITY,
    PROMOTION_TYPE,
    PromotionDetail,
    PromotionDetailRequest,
} from "../type";
import {RootState} from "type/state";
import {FormComponentProps} from "antd/lib/form";
import {actions} from "..";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {showLoading} from "core-fe";
import * as R from "ramda";
import {diffRestaurantsTree, dateFormat, handleApplyRestaurantItems, handleApplyRestaurantItemsRequest} from "./tools";
import {detailTypes, DetailState, initialDetailState, detailReducer, DetailAction} from "./PromotionDetailStore";
import {HtmlEditor} from "@core/widget";
import {
    PromotionEligibilityAJAXView,
    UpdateDistributedPromotionAJAXRequest,
    UpdateUndistributedPromotionAJAXRequest,
    GetPromotionAJAXResponse,
    PromotionTypeAJAXView,
    PromotionApplyTypeAJAXView,
    CreatePromotionAJAXRequest$PromotionAppliedRestaurant,
    ActivatePromotionAJAXRequest,
    PromotionStatusAJAXView,
} from "type/api";
import moment from "moment";
import {DateFormat} from "@core/utils";
interface Props extends FormComponentProps, PromotionDetailState {
    detailLoading: boolean;
    updateLoading: boolean;
    saveLoading: boolean;
    restaurantLoading: boolean;
    restaurantMealLoading: boolean;
    restaurantMenuLoading: boolean;
    restaurantsResponse: Restaurant[];
    restaurantMealsResponse: Restaurant[];
    restaurantMenusResponse: Restaurant[];
    promotion_code: string;
    promotion_detail: GetPromotionAJAXResponse;
    activePromotionStatus: (code: string, request?: ActivatePromotionAJAXRequest) => void;
    savePromotionDetail: (request: PromotionDetail) => void;
    savePromotionUndistributed: (code: string, request: UpdateUndistributedPromotionAJAXRequest) => void;
    savePromotionDistributed: (code: string, request: UpdateDistributedPromotionAJAXRequest) => void;
    deactivateStatus: (code: string) => void;
    fetchRestaurantMenuList: () => void;
    fetchRestaurantMealList: () => void;
    fetchRestaurantList: () => void;
}

const formItemLayout = {
    wrapperCol: {
        xs: {span: 24},
    },
};

const PromotionDetailReadonlyComponent: React.SFC<Props> = ({
    form: {getFieldDecorator, validateFields, getFieldValue},
    restaurantMealLoading,
    restaurantMenuLoading,
    restaurantMenusResponse,
    restaurantMealsResponse,
    restaurantsResponse,
    savePromotionDetail,
    promotion_code,
    saveLoading,
    detailLoading,
    restaurantLoading,
    promotionDetail,
    activePromotionStatus,
    savePromotionUndistributed,
    savePromotionDistributed,
    updateLoading,
    fetchRestaurantMealList,
    fetchRestaurantMenuList,
    fetchRestaurantList,
    deactivateStatus,
}) => {
    const [state, dispatch] = useReducer<Reducer<DetailState, DetailAction>>(detailReducer, initialDetailState);
    const formEl = useRef<any>(null);

    useEffect(() => {
        const promotionDetailInitialState: {
            appliedToType: string | null;
            restaurants?: Restaurant[];
            restaurantsMeals?: Restaurant[];
            restaurantsMenus?: Restaurant[];
            restaurantsResponseRowSelection?: Array<string | null>;
        } = {
            appliedToType: promotionDetail.apply_type,
        };
        if (promotionDetail.apply_type === PromotionApplyTypeAJAXView.RESTAURANTS) {
            promotionDetailInitialState.restaurants = handleApplyRestaurantItems(promotionDetail.applied_restaurants);
            fetchRestaurantList();
        }
        if (promotionDetail.apply_type === PromotionApplyTypeAJAXView.CATEGORIES) {
            promotionDetailInitialState.restaurantsMenus = handleApplyRestaurantItems(promotionDetail.applied_restaurants);
            fetchRestaurantMenuList();
        }
        if (promotionDetail.apply_type === PromotionApplyTypeAJAXView.MEALS) {
            promotionDetailInitialState.restaurantsMeals = handleApplyRestaurantItems(promotionDetail.applied_restaurants);
            fetchRestaurantMealList();
        }
        dispatch({
            type: detailTypes.SET_STATE,
            payload: promotionDetailInitialState,
        });
    }, [promotionDetail]);

    useEffect(() => {
        const response = diffRestaurantsTree(state.restaurants, restaurantsResponse);
        const restaurantsResponseRowSelection = response.filter(v => v.status).map(v => v.id);
        dispatch({
            type: detailTypes.SET_STATE,
            payload: {
                restaurantsResponse: response,
                restaurantsResponseRowSelection,
            },
        });
    }, [restaurantsResponse]);
    useEffect(() => {
        const response = diffRestaurantsTree(state.restaurantsMenus, restaurantMenusResponse);
        dispatch({
            type: detailTypes.SET_STATE,
            payload: {
                restaurantsMenusResponse: response,
            },
        });
    }, [restaurantMenusResponse]);

    useEffect(() => {
        const response = diffRestaurantsTree(state.restaurantsMeals, restaurantMealsResponse);
        dispatch({
            type: detailTypes.SET_STATE,
            payload: {
                restaurantsMealsResponse: response,
            },
        });
    }, [restaurantMealsResponse]);

    const ValidRules = {
        code: [{type: "string", required: true, pattern: /^[a-zA-Z0-9\$\%]{4,20}$/, message: "Required, at least 4 characters. at most 20 characters, allow: a-z, A-Z, 0-9, $, %."}],
        name: [{type: "string", required: true, min: 4, max: 50}],
        description: [{type: "string", required: true, max: 400, min: 1, message: "Required, at most 400 characters. It should support enter."}],
        brief_description: [{type: "string", required: true, max: 50, message: "Required, at most 50 characters."}],
        distribution_start_date: [
            {
                type: "number",
                max: Math.min((getFieldValue("distribution_end_date") || {}).valueOf(), (getFieldValue("valid_start_date") || {}).valueOf()),
                transform: dateFormat.formatValidStartDate,
                message: "start date should <= end date and valid start date",
            },
            {
                type: "number",
                min: dateFormat.now(),
                message: "start date should >= now",
            },
        ],
        distribution_end_date: [
            {
                type: "number",
                min: (getFieldValue("distribution_start_date") || {}).valueOf(),
                max: getFieldValue("valid_end_date") && dateFormat.formatValidEndDate(getFieldValue("valid_end_date")),
                transform: dateFormat.formatValidEndDate,
                message: "end date should >= start date and <= valid end date",
            },
        ],
        valid_start_date: [
            {
                type: "number",
                required: true,
                min: moment(dateFormat.now())
                    .add(1, "days")
                    .valueOf(),
                max: (getFieldValue("valid_end_date") || {}).valueOf(),
                transform: dateFormat.formatValidStartDate,
                message: "start date should <= end date and > now",
            },
        ],
        valid_end_date: [
            {
                type: "number",
                required: true,
                min: (getFieldValue("valid_start_date") || {}).valueOf(),
                transform: dateFormat.formatValidEndDate,
                message: "end date should >= start date",
            },
        ],
        eligibility: [{required: true, message: "Promotion eligibility is required"}],
        type: [{required: true, message: "Promotion type is required"}],
        amount: [
            {required: true, message: "Promotion amount is required"},
            {type: "number", transform: Number, required: true},
        ],
        percentage: [
            {
                required: true,
                message: "Promotion percentage is required",
            },
            {
                validator: (rule: any, value: number, callback: any) => {
                    if ((value <= 0 || value >= 61 || isNaN(Number(value))) && !R.isNil(value) && !R.isEmpty(value)) {
                        callback(true);
                    } else {
                        callback();
                    }
                },
                message: "percentage should be an integer >0 and <61",
            },
        ],
        max_discount: [
            {
                type: "number",
                transform: Number,
            },
        ],
        minimum: [
            {
                type: "number",
                required: getFieldValue("type") === PromotionTypeAJAXView.AMOUNT,
                min: Number(getFieldValue("amount_off")),
                transform: Number,
                message: "purchase min should >Amount.",
            },
        ],
        max_use_times: [
            {
                validator: (rule: any, value: string, callback: any) => {
                    if (typeof value === "undefined" || value === null || value === "") {
                        callback();
                        return;
                    }
                    const val = Number(value);
                    if (isNaN(val) || parseInt(val + "", 10) !== val || val < 1) {
                        callback("Max # of use times should be an integer >= 1");
                    } else if ((getFieldValue("eligibility") === PromotionEligibilityAJAXView.NEW_BUYERS_ONLY || getFieldValue("eligibility") === PromotionEligibilityAJAXView.NTH_BUYERS_ONLY) && val !== 1) {
                        callback("For new buyers only/Nth buyers only promotion, Max # of use times should always be 1");
                    } else {
                        callback();
                    }
                },
            },
        ],
    };

    if (detailLoading) {
        return (
            <Page header={<PageHeader title="Promotion" subTitle="Manage Promotion Detail" />}>
                <Skeleton />
            </Page>
        );
    }
    const isActiveEdit = (() => {
        if (!promotion_code) {
            return false;
        }
        if (promotionDetail.status === PromotionStatusAJAXView.INACTIVE || (promotionDetail.status === PromotionStatusAJAXView.ACTIVE && new Date().getTime() < new Date(promotionDetail.distribution_start_date || "").getTime())) {
            return false;
        }
        return true;
    })();

    const isActiveButton = () => {
        if (promotionDetail.status === PromotionStatusAJAXView.INACTIVE && dateFormat.now() <= new Date(promotionDetail.valid_end_date || "").getTime()) {
            return (
                <Popconfirm
                    placement="top"
                    cancelText="No"
                    okText="Yes"
                    title="Are you sure to activate this promotion?"
                    onConfirm={() => {
                        if (promotionDetail.distribution_end_date && dateFormat.now() >= getFieldValue("distribution_end_date").valueOf()) {
                            message.error("the distribution end date should later then system date");
                            return;
                        }
                        formEl!.current!.props!.onSubmit(null, PromotionStatusAJAXView.ACTIVE);
                    }}
                >
                    <Button type="primary" loading={updateLoading}>
                        Activate
                    </Button>
                </Popconfirm>
            );
        }
        if (promotionDetail.status === PromotionStatusAJAXView.ACTIVE && dateFormat.now() < new Date(promotionDetail.distribution_start_date || "").getTime()) {
            return (
                <Popconfirm placement="top" title="Are you sure to deactivate this promotion?" cancelText="No" okText="Yes" onConfirm={() => deactivateStatus(promotion_code)}>
                    <Button type="primary" loading={updateLoading}>
                        Deactivate
                    </Button>
                </Popconfirm>
            );
        }
        return null;
    };

    const changeRestaurants = (i: number, id: string) => {
        dispatch({type: detailTypes.CHANGE_RESTAURANTS, payload: [R.lensPath(["restaurants"]), i]});
        const index = R.findIndex((v: Restaurant) => v.id === id, state.restaurantsResponse);
        dispatch({type: detailTypes.CHANGE_RESTAURANTS_RESPONSE_ONCE, payload: [R.lensPath(["restaurantsResponse", index, "status"]), id]});
    };

    const handleSubmit = (event: React.FormEvent<any> | null, status?: PromotionStatusAJAXView) => {
        if (event) {
            event.preventDefault();
        }
        validateFields((err, values) => {
            let restaurantsData: CreatePromotionAJAXRequest$PromotionAppliedRestaurant[] = [];
            if (state.appliedToType === PromotionApplyTypeAJAXView.RESTAURANTS) {
                if (R.isEmpty(state.restaurants)) {
                    dispatch({type: detailTypes.SHOW_APPLIED_ERROR, payload: [PromotionApplyTypeAJAXView.RESTAURANTS, "Please select applied to restaurants."]});
                    return;
                }
                restaurantsData = handleApplyRestaurantItemsRequest(state.restaurants);
            } else if (state.appliedToType === PromotionApplyTypeAJAXView.CATEGORIES) {
                if (R.isEmpty(state.restaurantsMenus)) {
                    dispatch({type: detailTypes.SHOW_APPLIED_ERROR, payload: [PromotionApplyTypeAJAXView.CATEGORIES, "Please select applied to menu categories."]});
                    return;
                }
                restaurantsData = handleApplyRestaurantItemsRequest(state.restaurantsMenus);
            } else if (state.appliedToType === PromotionApplyTypeAJAXView.MEALS) {
                if (R.isEmpty(state.restaurantsMeals)) {
                    dispatch({type: detailTypes.SHOW_APPLIED_ERROR, payload: [PromotionApplyTypeAJAXView.MEALS, "Please select applied to meals."]});
                    return;
                }
                restaurantsData = handleApplyRestaurantItemsRequest(state.restaurantsMeals);
            } else if (state.appliedToType !== PromotionApplyTypeAJAXView.ALL) {
                dispatch({type: detailTypes.SHOW_APPLIED_ERROR, payload: [PromotionApplyTypeAJAXView.ALL, "Applied to is required."]});
                return;
            }

            if (!err) {
                if (values.type === "FREE_ITEM" && state.appliedToType !== PromotionApplyTypeAJAXView.MEALS) {
                    dispatch({type: detailTypes.SHOW_APPLIED_ERROR, payload: [PromotionApplyTypeAJAXView.MEALS, "For Free Item type of promotion, please select specific meals can be applied to."]});
                    return;
                }
                const request = {
                    name: values.name,
                    description: values.description,
                    distribution_end_date: (values.distribution_end_date && dateFormat.formatEndDate(values.distribution_end_date)) || null,
                    brief_description: values.brief_description,
                };
                if (isActiveEdit && !status) {
                    savePromotionDistributed(promotion_code, request);
                    return;
                }

                const requestRest = {
                    distribution_start_date: (values.distribution_start_date && dateFormat.formatStartDate(values.distribution_start_date)) || null,
                    valid_end_date: dateFormat.formatEndDate(values.valid_end_date),
                    valid_start_date: dateFormat.formatStartDate(values.valid_start_date),
                    type: values.type || null,
                    eligibility: values.eligibility || null,
                    nth_order: values.nth_order || null,
                    percentage_off: values.percentage_off || null,
                    amount_off: values.amount_off || null,
                    purchase_minimum: values.purchase_minimum || null,
                    applied_restaurants: restaurantsData,
                    apply_type: state.appliedToType,
                    max_discount: values.max_discount || null,
                    max_use_times: values.max_use_times || null,
                };

                if (promotion_code) {
                    if (status === PromotionStatusAJAXView.ACTIVE) {
                        activePromotionStatus(promotion_code, {
                            ...request,
                            ...requestRest,
                        });
                        return;
                    }

                    savePromotionUndistributed(promotion_code, {
                        ...request,
                        ...requestRest,
                    });
                    return;
                }
                savePromotionDetail({
                    ...request,
                    ...requestRest,
                    code: values.code,
                });
            }
        });
    };

    const restaurantSelection = {
        onChange: (selectedRowKeys: number[] | string[]) => {
            dispatch({type: detailTypes.CHANGE_RESTAURANTS_RESPONSE, payload: selectedRowKeys});
        },
        selectedRowKeys: state.restaurantsResponseRowSelection,
    };

    const saveRestaurantsTemp = () => {
        const type = state.appliedToType;
        dispatch({
            type: detailTypes.CHANGE_DRAWER_VISIBLE,
            payload: false,
        });
        switch (type) {
            case PromotionApplyTypeAJAXView.RESTAURANTS:
                dispatch({type: detailTypes.SAVE_RESTAURANTS});
                break;
            case PromotionApplyTypeAJAXView.CATEGORIES:
                dispatch({type: detailTypes.SAVE_RESTAURANTS_MENUS, payload: [R.lensPath(["restaurantsMenus"])]});
                break;
            case PromotionApplyTypeAJAXView.MEALS:
                dispatch({type: detailTypes.SAVE_RESTAURANTS_MEALS, payload: [R.lensPath(["restaurantsMeals"])]});
                break;
            default:
        }
    };

    const MenuResponseColumns = [
        {
            title: "Restaurant",
            dataIndex: "name",
            key: "restaurant",
            render: (data: string, columnData: Restaurant, index: number) => {
                return (
                    <Checkbox
                        checked={columnData.status}
                        value={columnData.id}
                        indeterminate={columnData.items!.some(v => v.status) && !columnData.items!.every(v => v.status)}
                        onChange={() => {
                            dispatch({
                                type: detailTypes.CHANGE_ALL_RESTAURANTS_MENUS_RESPONSE,
                                payload: [R.lensPath(["restaurantsMenusResponse", index, "items"]), !columnData.status],
                            });
                            dispatch({
                                type: detailTypes.CHANGE_RESTAURANTS_MENUS_RESPONSE,
                                payload: [R.lensPath(["restaurantsMenusResponse", index, "status"])],
                            });
                        }}
                    >
                        {columnData.name} {!columnData.checked && <span style={{color: "red"}}>(Unpublished)</span>}
                    </Checkbox>
                );
            },
        },
        {
            title: "Menu Category",
            key: "menu",
            dataIndex: "items",
            render: (data: Item[], columnData: Restaurant, index: number) => {
                return (
                    <React.Fragment>
                        {data.map((v, i) => (
                            <Checkbox
                                onChange={() => {
                                    dispatch({
                                        type: detailTypes.CHANGE_RESTAURANTS_MENUS_RESPONSE,
                                        payload: [R.lensPath(["restaurantsMenusResponse", index, "items", i, "status"]), index],
                                    });
                                    if (state.restaurantsMenusResponse[index].items!.every((v: Item) => v.status)) {
                                        dispatch({
                                            type: detailTypes.CHANGE_RESTAURANTS_MENUS_RESPONSE,
                                            payload: [R.lensPath(["restaurantsMenusResponse", index, "status"])],
                                        });
                                    } else if (state.restaurantsMenusResponse[index].items!.every((v: Item) => !v.status)) {
                                        dispatch({
                                            type: detailTypes.CHANGE_RESTAURANTS_MENUS_RESPONSE,
                                            payload: [R.lensPath(["restaurantsMenusResponse", index, "status"])],
                                        });
                                    }
                                }}
                                checked={v.status}
                                value={v.id}
                                key={`menu_response-${v.name}-${v.id}`}
                            >
                                {v.name} {!v.checked && <span style={{color: "red"}}>(Delete)</span>}
                            </Checkbox>
                        ))}
                    </React.Fragment>
                );
            },
        },
    ];
    const MealResponseColumns = [
        {
            title: "Restaurant",
            dataIndex: "name",
            key: "restaurant",
            render: (data: string, columnData: Restaurant, index: number) => {
                return (
                    <Checkbox
                        checked={columnData.status}
                        value={columnData.id}
                        indeterminate={columnData.items!.some(v => v.status) && !columnData.items!.every(v => v.status)}
                        onChange={() => {
                            dispatch({
                                type: detailTypes.CHANGE_ALL_RESTAURANTS_MEALS_RESPONSE,
                                payload: [R.lensPath(["restaurantsMealsResponse", index, "items"]), !columnData.status],
                            });
                            dispatch({
                                type: detailTypes.CHANGE_RESTAURANTS_MEALS_RESPONSE,
                                payload: [R.lensPath(["restaurantsMealsResponse", index, "status"])],
                            });
                        }}
                    >
                        {columnData.name} {!columnData.checked && <span style={{color: "red"}}>(Unpublished)</span>}
                    </Checkbox>
                );
            },
        },
        {
            title: "Meal",
            key: "meal",
            dataIndex: "items",
            render: (data: Item[], columnData: Restaurant, index: number) => {
                return (
                    <React.Fragment>
                        {data.map((v, i) => (
                            <Checkbox
                                onChange={() => {
                                    dispatch({
                                        type: detailTypes.CHANGE_RESTAURANTS_MEALS_RESPONSE,
                                        payload: [R.lensPath(["restaurantsMealsResponse", index, "items", i, "status"]), index],
                                    });
                                    if (state.restaurantsMealsResponse[index].items!.every((v: Item) => v.status)) {
                                        dispatch({
                                            type: detailTypes.CHANGE_RESTAURANTS_MEALS_RESPONSE,
                                            payload: [R.lensPath(["restaurantsMealsResponse", index, "status"])],
                                        });
                                    } else if (state.restaurantsMealsResponse[index].items!.every((v: Item) => !v.status)) {
                                        dispatch({
                                            type: detailTypes.CHANGE_RESTAURANTS_MEALS_RESPONSE,
                                            payload: [R.lensPath(["restaurantsMealsResponse", index, "status"])],
                                        });
                                    }
                                }}
                                checked={v.status}
                                value={v.id}
                                key={`meals_response-${v.name}-${v.id}`}
                            >
                                {v.name} {!v.checked && <span style={{color: "red"}}>(Delete)</span>}
                            </Checkbox>
                        ))}
                    </React.Fragment>
                );
            },
        },
    ];
    const RestaurantResponseColumn = [
        {},
        {
            title: "Restaurant Name",
            key: "name",
            dataIndex: "name",
        },
        {
            title: "Restaurant Status",
            key: "checked",
            dataIndex: "checked",
            render: (data: boolean) => {
                return data ? <span>Published</span> : <span>Unpublished</span>;
            },
        },
    ];
    const MenuColumns = [
        {
            title: "Restaurant",
            dataIndex: "name",
            key: "restaurant",
            className: "column-center",
            rowKey: (record: Restaurant) => `${record.name}-${record.id}`,
        },
        {
            title: "Menu Category",
            key: "item",
            className: "column-padding",
            dataIndex: "items",
            render: (data: Item[], columnData: Restaurant, index: number) => {
                return data.map((v, i) => (
                    <Tag
                        closable={state.appliedToType === PromotionApplyTypeAJAXView.CATEGORIES && !isActiveEdit}
                        key={`Menu-${v.name}-${v.id}`}
                        onClose={() => {
                            const restaurantIndex = R.findIndex((restaurant: Restaurant) => columnData.id === restaurant.id, state.restaurantsMenusResponse);
                            const itemIndex = R.findIndex((item: Item) => v.id === item.id, state.restaurantsMenusResponse[restaurantIndex].items!);
                            dispatch({
                                type: detailTypes.CHANGE_RESTAURANTS_MENUS_RESPONSE,
                                payload: [R.lensPath(["restaurantsMenusResponse", restaurantIndex, "items", itemIndex, "status"])],
                            });
                            if (data.length === 1) {
                                dispatch({
                                    type: detailTypes.CHANGE_RESTAURANTS,
                                    payload: [R.lensPath(["restaurantsMenus"]), index],
                                });
                                return;
                            }
                            dispatch({
                                type: detailTypes.CHANGE_RESTAURANTS_MENUS,
                                payload: [R.lensPath(["restaurantsMenus", index, "items"]), i],
                            });
                        }}
                    >
                        {v.name}
                    </Tag>
                ));
            },
        },
    ];
    const MealColumns = [
        {
            title: "Restaurant",
            dataIndex: "name",
            key: "restaurant",
            className: "column-center",
        },
        {
            title: "Meals",
            key: "meal",
            className: "column-padding",
            dataIndex: "items",
            render: (data: Item[], columnData: Restaurant, index: number) => {
                return data.map((v, i) => (
                    <Tag
                        closable={state.appliedToType === PromotionApplyTypeAJAXView.MEALS && !isActiveEdit}
                        key={`Meal-${v.name}-${v.id}`}
                        onClose={() => {
                            const restaurantIndex = R.findIndex((restaurant: Restaurant) => columnData.id === restaurant.id, state.restaurantsMealsResponse);
                            const itemIndex = R.findIndex((item: Item) => v.id === item.id, state.restaurantsMealsResponse[restaurantIndex].items!);
                            dispatch({
                                type: detailTypes.CHANGE_RESTAURANTS_MEALS_RESPONSE,
                                payload: [R.lensPath(["restaurantsMealsResponse", restaurantIndex, "items", itemIndex, "status"])],
                            });
                            if (data.length === 1) {
                                dispatch({
                                    type: detailTypes.CHANGE_RESTAURANTS,
                                    payload: [R.lensPath(["restaurantsMeals"]), index],
                                });
                                return;
                            }
                            dispatch({
                                type: detailTypes.CHANGE_RESTAURANTS_MEALS,
                                payload: [R.lensPath(["restaurantsMeals", index, "items"]), i, index],
                            });
                        }}
                    >
                        {v.name}
                    </Tag>
                ));
            },
        },
    ];
    return (
        <div className="promotion-detail-outer readonly">
            <Page showBackground header={<PageHeader title="Promotion" subTitle="Manage Promotion Detail" />}>
                <Form onSubmit={handleSubmit} {...formItemLayout} labelAlign="left" className="ant-advanced-search-form" ref={formEl}>
                    <Row type="flex" style={{position: "absolute", right: 0, marginTop: "19px", top: 0}}>
                        {/* {promotion_code && isActiveButton()}
                        <Button type="default" onClick={() => app.store.dispatch(goBack())}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" loading={saveLoading}>
                            Save
                        </Button> */}
                    </Row>
                    <Row>
                        <h1 style={{marginBottom: "32px"}}>General</h1>
                        <Row gutter={20}>
                            <Col span={12}>
                                <Row gutter={20} style={{marginLeft: 0, marginRight: 0}}>
                                    <Form.Item label="Promotion Code" labelCol={{span: 10}} style={{marginBottom: 0}}>
                                        {getFieldDecorator("code", {initialValue: promotionDetail.code, rules: ValidRules.code})(<Input disabled />)}
                                    </Form.Item>
                                    <Form.Item label="Promotion Name" labelCol={{span: 10}} style={{marginBottom: 0}}>
                                        {getFieldDecorator("name", {initialValue: promotionDetail.name, rules: ValidRules.name})(<Input disabled />)}
                                    </Form.Item>
                                    <Form.Item label="Brief Description" labelCol={{span: 10}} style={{marginBottom: 0}}>
                                        {getFieldDecorator("brief_description", {initialValue: promotionDetail.brief_description, rules: ValidRules.brief_description})(<Input disabled />)}
                                    </Form.Item>
                                    <div style={{height: "1px", background: "#d9d9d9", margin: "49px 0px 41px"}} />
                                    <Form.Item label="Date" labelCol={{span: 10}} style={{marginBottom: 0}} />
                                    {/* <div className="promotion-list_search-form promotion-list_form"> */}
                                    <Col span={12}>
                                        <Form.Item labelCol={{span: 10}} style={{marginBottom: 0}} label="Distribution Start Date">
                                            {getFieldDecorator("distribution_start_date", {
                                                initialValue: promotionDetail.distribution_start_date && moment(promotionDetail.distribution_start_date),
                                                rules: !isActiveEdit ? ValidRules.distribution_start_date : [],
                                            })(<DatePicker placeholder="" disabled format={DateFormat.DATE_UTC} style={{width: "100%"}} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item labelCol={{span: 10}} style={{marginBottom: 0}} label="Distribution End Date">
                                            {getFieldDecorator("distribution_end_date", {
                                                initialValue: promotionDetail.distribution_end_date && moment(promotionDetail.distribution_end_date),
                                                rules: ValidRules.distribution_end_date,
                                            })(<DatePicker placeholder="" format={DateFormat.DATE_UTC} style={{width: "100%"}} disabled />)}
                                        </Form.Item>
                                    </Col>
                                    {/* </div> */}
                                    {/* <Row gutter={20} className="promotion-list_search-form promotion-list_form"> */}
                                    <Col span={12}>
                                        <Form.Item labelCol={{span: 10}} style={{marginBottom: 0}} label="Valid Start Date">
                                            {getFieldDecorator("valid_start_date", {
                                                initialValue: promotionDetail.valid_start_date && moment(promotionDetail.valid_start_date),
                                                rules: !isActiveEdit ? ValidRules.valid_start_date : [],
                                            })(<DatePicker placeholder="" disabled format={DateFormat.DATE_UTC} style={{width: "100%"}} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item labelCol={{span: 10}} style={{marginBottom: 0}} label="Valid End Date">
                                            {getFieldDecorator("valid_end_date", {
                                                initialValue: promotionDetail.valid_end_date && moment(promotionDetail.valid_end_date),
                                                rules: !isActiveEdit ? ValidRules.valid_end_date : [],
                                            })(<DatePicker placeholder="" disabled format={DateFormat.DATE_UTC} style={{width: "100%"}} />)}
                                        </Form.Item>
                                    </Col>
                                    {/* </Row> */}
                                </Row>
                            </Col>
                            <Col span={12} style={{marginTop: 0}}>
                                <Form.Item className="promo-desc" label="Description (Terms & Conditions)" labelCol={{span: 10}}>
                                    <HtmlEditor disabled decorator={getFieldDecorator("description", {initialValue: promotionDetail.description})} data={promotionDetail.description || getFieldValue("description")} />
                                    {/* {getFieldDecorator("description", {initialValue: promotionDetail.description, rules: ValidRules.description})(<Input.TextArea style={{marginTop: "4px", minHeight: "190px"}} />)} */}
                                </Form.Item>
                            </Col>
                            {/* </Row> */}
                            {/* <Row className="promotion-date"> */}
                        </Row>
                        <div style={{height: "1px", background: "#d9d9d9", marginBottom: "20px"}} />
                    </Row>
                    <Row className="promotion-apply-to">
                        <h1 style={{marginBottom: "32px"}}>
                            Applied To
                            {state.appliedError.type === PromotionApplyTypeAJAXView.ALL && !state.appliedToType && <span className="error-warning">{state.appliedError.message}</span>}
                        </h1>
                        <Row>
                            <Radio.Group
                                name="appliedTo"
                                disabled
                                onChange={e => {
                                    dispatch({type: detailTypes.SHOW_APPLIED_ERROR, payload: [null]});
                                    dispatch({type: detailTypes.CHANGE_APPLIED_TO, payload: e.target.value});
                                }}
                                style={{width: "100%"}}
                                value={state.appliedToType}
                            >
                                <Row>
                                    <Radio value={APPLIED_TO_TYPE["All Restaurants"]}>{APPLIED_TO_TYPE[PromotionApplyTypeAJAXView.ALL]}</Radio>
                                </Row>
                                <Row type="flex" style={{flexWrap: "nowrap", marginTop: "18px", width: "755px"}}>
                                    <Radio value={APPLIED_TO_TYPE["Only these restaurants"]}>
                                        {APPLIED_TO_TYPE[PromotionApplyTypeAJAXView.RESTAURANTS]}
                                        {state.appliedError.type === PromotionApplyTypeAJAXView.RESTAURANTS && R.isEmpty(state.restaurants) && <span className="error-warning">{state.appliedError.message}</span>}
                                    </Radio>
                                    <div style={{boxSizing: "border-box", paddingRight: "20px"}}>
                                        {state.restaurants.map((v: Restaurant, i: number) => (
                                            <Tag closable={state.appliedToType === PromotionApplyTypeAJAXView.RESTAURANTS && !isActiveEdit} onClose={() => changeRestaurants(i, v.id!)} style={{marginBottom: "10px"}} key={`restaurant-${v.id}-${v.name}`}>
                                                {v.name}
                                            </Tag>
                                        ))}
                                    </div>
                                    {PromotionApplyTypeAJAXView.RESTAURANTS === state.appliedToType && !isActiveEdit && (
                                        <Button
                                            type="link"
                                            style={{left: "700px"}}
                                            className="applied-to-edit"
                                            onClick={() => {
                                                if (R.isEmpty(state.restaurantsResponse)) {
                                                    fetchRestaurantList();
                                                }
                                                dispatch({type: detailTypes.CHANGE_DRAWER_VISIBLE, payload: true});
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    )}
                                </Row>
                                {/* issue FT-1628 note: hide 👇 */}
                                {/* <Row style={{marginTop: "20px"}}>
                                    <Col span={21}>
                                        <Radio value={APPLIED_TO_TYPE["Only these menu categories"]}>
                                            {APPLIED_TO_TYPE[PromotionApplyTypeAJAXView.CATEGORIES]}
                                            {state.appliedError.type === PromotionApplyTypeAJAXView.CATEGORIES && R.isEmpty(state.restaurantsMenus) && <span className="error-warning">{state.appliedError.message}</span>}
                                            {PromotionApplyTypeAJAXView.CATEGORIES === state.appliedToType && !isActiveEdit && (
                                                <Button
                                                    type="link"
                                                    className="applied-to-edit"
                                                    onClick={() => {
                                                        if (R.isEmpty(state.restaurantsMenusResponse)) {
                                                            fetchRestaurantMenuList();
                                                        }
                                                        dispatch({type: detailTypes.CHANGE_DRAWER_VISIBLE, payload: true});
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                            )}
                                        </Radio>
                                        {PromotionApplyTypeAJAXView.CATEGORIES === state.appliedToType && state.restaurantsMenus.length > 0 && (
                                            <Table style={{width: "755px", marginTop: "20px", borderBottom: "1px solid #f3f2f1"}} columns={MenuColumns} rowKey="id" dataSource={state.restaurantsMenus} pagination={false} />
                                        )}
                                    </Col>
                                </Row> */}
                                <Row style={{margin: "20px 0"}}>
                                    <Col span={21}>
                                        <Radio value={APPLIED_TO_TYPE["Only these meals"]}>
                                            {APPLIED_TO_TYPE[PromotionApplyTypeAJAXView.MEALS]}
                                            {state.appliedError.type === PromotionApplyTypeAJAXView.MEALS && R.isEmpty(state.restaurantsMeals) && <span className="error-warning">{state.appliedError.message}</span>}
                                            {PromotionApplyTypeAJAXView.MEALS === state.appliedToType && !isActiveEdit && (
                                                <Button
                                                    type="link"
                                                    className="applied-to-edit"
                                                    onClick={() => {
                                                        if (R.isEmpty(state.restaurantsMeals)) {
                                                            fetchRestaurantMealList();
                                                        }
                                                        dispatch({type: detailTypes.CHANGE_DRAWER_VISIBLE, payload: true});
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                            )}
                                        </Radio>
                                        {PromotionApplyTypeAJAXView.MEALS === state.appliedToType && state.restaurantsMeals.length > 0 && (
                                            <Table style={{width: "755px", marginTop: "20px", borderBottom: "1px solid #f3f2f1"}} columns={MealColumns} rowKey="id" dataSource={state.restaurantsMeals} pagination={false} />
                                        )}
                                    </Col>
                                </Row>
                            </Radio.Group>
                            <div style={{height: "1px", background: "#d9d9d9"}} />
                        </Row>
                    </Row>
                    <Row style={{marginTop: "20px"}}>
                        <h1 style={{marginBottom: "32px"}}>Eligibility</h1>
                        <Row>
                            <Form.Item className="promotion-list_search-form promotion-list_form" style={{paddingBottom: "24px", marginBottom: 0}}>
                                {getFieldDecorator("eligibility", {
                                    initialValue: promotionDetail.eligibility,
                                    rules: ValidRules.eligibility,
                                })(
                                    <Radio.Group disabled>
                                        <Row type="flex">
                                            <Col span={2} className="promotion-list_form-field">
                                                <Radio value={PROMOTION_ELIGIBILITY.All}>{PROMOTION_ELIGIBILITY[PromotionEligibilityAJAXView.ALL]}</Radio>
                                            </Col>
                                            <Col span={6}>
                                                <Radio value={PROMOTION_ELIGIBILITY["New Buyers only"]}>{PROMOTION_ELIGIBILITY[PromotionEligibilityAJAXView.NEW_BUYERS_ONLY]}</Radio>
                                            </Col>
                                            <Col span={6}>
                                                <Radio value={PROMOTION_ELIGIBILITY["Return Buyers only"]}>{PROMOTION_ELIGIBILITY[PromotionEligibilityAJAXView.RETURN_BUYERS_ONLY]}</Radio>
                                            </Col>
                                            <Col span={6}>
                                                <Radio value={PROMOTION_ELIGIBILITY["Nth buyers only"]}>
                                                    {PROMOTION_ELIGIBILITY[PromotionEligibilityAJAXView.NTH_BUYERS_ONLY]}
                                                    {getFieldDecorator("nth_order", {
                                                        initialValue: promotionDetail.nth_order,
                                                    })(
                                                        <Select style={{width: "80px", marginLeft: "10px"}} disabled={getFieldValue("eligibility") !== PROMOTION_ELIGIBILITY["Nth buyers only"] || isActiveEdit}>
                                                            {R.range(1, 6).map(v => (
                                                                <Select.Option key={`Detail-Nth-${v}`} value={v}>
                                                                    {v}
                                                                </Select.Option>
                                                            ))}
                                                        </Select>
                                                    )}
                                                </Radio>
                                            </Col>
                                        </Row>
                                    </Radio.Group>
                                )}
                            </Form.Item>
                            <div style={{height: "1px", background: "#d9d9d9"}} />
                        </Row>
                    </Row>
                    <Row style={{marginTop: "20px"}}>
                        <h1 style={{marginBottom: "32px"}}>Purchase Condition</h1>
                        <Col className="promotion-condition" style={{marginLeft: "0"}}>
                            <Row className="promotion-list_search-form promotion-list_form" gutter={10}>
                                <Col span={6}>
                                    <Form.Item label="Promotion Type" labelCol={{span: 8}} className="promotion-list_form-field">
                                        {getFieldDecorator("type", {
                                            initialValue: promotionDetail.type,
                                            rules: ValidRules.type,
                                        })(
                                            <Select disabled={isActiveEdit}>
                                                <Select.Option value={PROMOTION_TYPE["Free Shipping"]}>{PROMOTION_TYPE[PromotionTypeAJAXView.FREE_SHIPPING]}</Select.Option>
                                                <Select.Option value={PROMOTION_TYPE.Amount}>{PROMOTION_TYPE[PromotionTypeAJAXView.AMOUNT]}</Select.Option>
                                                <Select.Option value={PROMOTION_TYPE.Percentage}>{PROMOTION_TYPE[PromotionTypeAJAXView.PERCENTAGE]}</Select.Option>
                                                <Select.Option value={PROMOTION_TYPE["Free Item"]}>Free Item</Select.Option>
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                {(() => {
                                    switch (getFieldValue("type")) {
                                        case PROMOTION_TYPE.Amount:
                                            return (
                                                <Col span={6}>
                                                    <Form.Item label={PROMOTION_TYPE[PromotionTypeAJAXView.AMOUNT]} labelCol={{span: 10}} className="promotion-list_form-field promotion-purchase-condition">
                                                        {getFieldDecorator("amount_off", {initialValue: promotionDetail.amount_off, rules: ValidRules.amount})(<Input addonBefore="$" disabled />)}
                                                    </Form.Item>
                                                </Col>
                                            );
                                        case PROMOTION_TYPE.Percentage:
                                            return (
                                                <>
                                                    <Col span={6}>
                                                        <Form.Item label={PROMOTION_TYPE[PromotionTypeAJAXView.PERCENTAGE]} labelCol={{span: 8}} className="promotion-list_form-field">
                                                            {getFieldDecorator("percentage_off", {initialValue: promotionDetail.percentage_off, rules: ValidRules.percentage})(<Input addonAfter="%" disabled />)}
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={6}>
                                                        <Form.Item label="Max $ discount each time" labelCol={{span: 10}} className="promotion-list_form-field promotion-purchase-condition">
                                                            {getFieldDecorator("max_discount", {initialValue: promotionDetail.max_discount, rules: ValidRules.max_discount})(<Input addonBefore="$" disabled />)}
                                                        </Form.Item>
                                                    </Col>
                                                </>
                                            );
                                        case PROMOTION_TYPE["Free Item"]:
                                            return (
                                                <Col span={6}>
                                                    <Form.Item labelCol={{span: 10}} label="Max $ discount each time" className="promotion-list_form-field promotion-purchase-condition">
                                                        {getFieldDecorator("max_discount", {initialValue: promotionDetail.max_discount, rules: ValidRules.max_discount})(<Input addonBefore="$" disabled />)}
                                                    </Form.Item>
                                                </Col>
                                            );
                                        default:
                                            return null;
                                    }
                                })()}
                                <Col span={6}>
                                    <Form.Item label="Purchase at least" labelCol={{span: 10}} className="promotion-list_form-field promotion-purchase-condition">
                                        {getFieldDecorator("purchase_minimum", {initialValue: promotionDetail.purchase_minimum, rules: ValidRules.minimum})(<Input addonBefore="$" style={{width: "191px"}} disabled />)}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <div style={{height: "1px", background: "#d9d9d9", marginTop: "10px"}} />
                    <Row style={{marginTop: "20px", marginLeft: 0}} gutter={10}>
                        <h1 style={{marginBottom: "32px"}}>Other Parameters</h1>
                        <Row>
                            <Col span={6} style={{marginLeft: 0}}>
                                <Form.Item label="Max # of use Times" labelCol={{span: 10}} className="promotion-list_form-field promotion-list_search-form promotion-list_form" style={{paddingBottom: "24px", marginBottom: 0, paddingRight: "5px"}}>
                                    {getFieldDecorator("max_use_times", {
                                        initialValue: promotionDetail.max_use_times,
                                        rules: ValidRules.max_use_times,
                                    })(<Input placeholder="Empty means no limit" disabled />)}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Row>
                </Form>
                <Drawer className="promotion-detail-item-title" width="800" title={APPLIED_TO_TYPE[state.appliedToType!]} placement="right" visible={state.drawerVisible} onClose={() => dispatch({type: detailTypes.CHANGE_DRAWER_VISIBLE, payload: false})}>
                    <Row>
                        {state.appliedToType === PromotionApplyTypeAJAXView.CATEGORIES && (
                            <div style={{marginTop: "20px"}}>
                                <div className="drawer-sub-title">This promotion can be applied to the following menu categories :</div>
                                <Table columns={MenuResponseColumns} rowKey="id" loading={restaurantMenuLoading || detailLoading} dataSource={state.restaurantsMenusResponse} pagination={false} />
                            </div>
                        )}
                        {state.appliedToType === PromotionApplyTypeAJAXView.MEALS && (
                            <div style={{marginTop: "20px"}}>
                                <div className="drawer-sub-title">This promotion can be applied to the following meals :</div>
                                <Table columns={MealResponseColumns} rowKey="id" loading={restaurantMealLoading || detailLoading} dataSource={state.restaurantsMealsResponse} pagination={false} />
                            </div>
                        )}
                        {state.appliedToType === PromotionApplyTypeAJAXView.RESTAURANTS && (
                            <div style={{marginTop: "20px"}}>
                                <div className="drawer-sub-title">This promotion can be applied to the following restaurants :</div>
                                <Table rowSelection={restaurantSelection} rowKey="id" loading={restaurantLoading || detailLoading} columns={RestaurantResponseColumn} dataSource={state.restaurantsResponse} pagination={false} />
                            </div>
                        )}
                    </Row>
                    <Button type="primary" onClick={saveRestaurantsTemp} style={{margin: "17px 0", float: "right"}}>
                        Save
                    </Button>
                </Drawer>
            </Page>
        </div>
    );
};

const mapStateToProps = (state: RootState) => ({
    detailLoading: showLoading(state, LOAD_PROMOTION_DETAIL),
    updateLoading: showLoading(state, UPDATE_PROMOTION_STATUS),
    saveLoading: showLoading(state, SAVE_PROMOTION_DETAIL),
    restaurantLoading: showLoading(state, LOAD_RESTAURANT_LIST),
    restaurantMealLoading: showLoading(state, LOAD_RESTAURANT_MEAL_LIST),
    restaurantMenuLoading: showLoading(state, LOAD_RESTAURANT_MENU_LIST),
    promotionDetail: state.app.promotion.promotionDetail,
    restaurantsResponse: state.app.promotion.restaurantList,
    restaurantMenusResponse: state.app.promotion.restaurantMenusList,
    restaurantMealsResponse: state.app.promotion.restaurantMealsList,
    promotion_code: state.app.promotion.promotion_code,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    savePromotionDetail: (request: PromotionDetail) => dispatch(actions.savePromotionDetail((request as unknown) as PromotionDetailRequest)),
    fetchPromotionDetail: (code: string) => dispatch(actions.fetchPromotionDetail(code)),
    activePromotionStatus: (code: string, request: ActivatePromotionAJAXRequest) => dispatch(actions.activePromotionStatus(code, request)),
    deactivateStatus: (code: string) => dispatch(actions.deactivateStatus(code)),
    savePromotionDistributed: (code: string, request: UpdateDistributedPromotionAJAXRequest) => dispatch(actions.savePromotionDistributed(code, request)),
    savePromotionUndistributed: (code: string, request: UpdateUndistributedPromotionAJAXRequest) => dispatch(actions.savePromotionUndistributed(code, request)),
    fetchRestaurantList: () => dispatch(actions.fetchRestaurantList()),
    fetchRestaurantMealList: () => dispatch(actions.fetchRestaurantMealList()),
    fetchRestaurantMenuList: () => dispatch(actions.fetchRestaurantMenuList()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(PromotionDetailReadonlyComponent));
