import React, {ReactNode} from "react";
import {Form, Button, Row, Col} from "antd";
import {FormComponentProps} from "antd/lib/form";
import {Field, BaseCondition, BaseConditionType, FormUI} from "./form"
import 'antd/lib/upload/style'
import "./data-form.less";
import DataFormItem from "./DataFormItem";
import {WrappedFormUtils} from "antd/lib/form/Form";
import {TweenOneGroup} from "rc-tween-one";

interface StateProps {
    fields: {
        [fieldName: string]: Field;
    };
    loading?: boolean;
    onSubmit?: (values: {[name: string]: any}, form: WrappedFormUtils) => void;
    UI?: FormUI;
    value?: {
        [fieldName: string]: any;
    };
}

interface Props extends StateProps, FormComponentProps {}

const checkCondition = (
    condition: BaseCondition,
    form: WrappedFormUtils,
    value: {
        [fieldName: string]: any;
    },
    fields: {
        [fieldName: string]: Field;
    }
): boolean => {
    if (condition.type === BaseConditionType.AND) {
        for (const item of condition.conditions) {
            if (form.getFieldValue(item.name) === undefined) {
                if (value[item.name] !== undefined) {
                    if (value[item.name] !== item.value) {
                        return false;
                    }
                } else if (fields[item.name].defaultValue !== item.value) {
                    return false;
                }
            } else if (form.getFieldValue(item.name) !== item.value) {
                return false;
            }
            if (item.children && !checkCondition(item.children, form, value, fields)) {
                return false;
            }
        }
        return true;
    }
    for (const item of condition.conditions) {
        if (form.getFieldValue(item.name) === undefined && value[item.name]) {
            if (value[item.name] === item.value) {
                return true;
            }
            if (item.children) {
                if (checkCondition(item.children, form, value, fields)) {
                    return true;
                }
            } else {
                return true;
            }
        } else if (form.getFieldValue(item.name) === item.value) {
            if (item.children) {
                if (checkCondition(item.children, form, value, fields)) {
                    return true;
                }
            } else {
                return true;
            }
        }
    }
    return false;
};
const DataFormComponent = React.forwardRef<WrappedFormUtils, Props>(({fields, onSubmit, form, loading, UI, value}: Props, ref) => {
    const formItemLayout = {
        labelCol: {
            xs: {span: 24},
            sm: {span: 8},
        },
        wrapperCol: {
            xs: {span: 24},
            sm: {span: 16},
        },
    };
    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.validateFieldsAndScroll((errors, values) => {
            if (errors) {
                return;
            }
            if (onSubmit) {
                onSubmit(values, form);
            }
        });
    };
    const customForm = (UI: FormUI) => {
        return UI.sections.map((section, index) => (
            <Row key={index} gutter={40}>
                {section.name && (
                    <Col key="title" span={24}>
                        <h3 className="fti-form__section-title">{section.name}</h3>
                    </Col>
                )}
                {section.columns.map((column, index) => (
                    <Col key={index} xs={24} sm={24 / section.columns.length}>
                        {column.map(name => formField(fields[name]))}
                    </Col>
                ))}
            </Row>
        ));
    };

    const formField = (field: Field): ReactNode => field && (!field.basedOn || checkCondition(field.basedOn, form, value || {}, fields)) && <DataFormItem key={field.fieldName} form={form} field={field} {...(value ? {value: value[field.fieldName]} : {})} />;
    let single = true;
    if (UI) {
        for (const section of UI.sections) {
            if (section.columns.length > 1) {
                single = false;
            }
        }
    }
    return (
        <Form
            ref={thisRef => {
                if (ref && typeof ref === "function") {
                    ref(form);
                }
            }}
            {...formItemLayout}
            className={(single ? "fti-form--single-column " : "") + "fti-form"}
            onSubmit={event => submit(event)}
        >
            <TweenOneGroup
                enter={{
                    height: 0,
                    opacity: 0,
                    type: "from",
                    duration: 200,
                }}
                leave={{opacity: 0, height: 0, duration: 200}}
                appear={false}
            >
                {UI ? customForm(UI) : Object.values(fields).map(field => formField(field))}
            </TweenOneGroup>

            {onSubmit && (
                <Row>
                    <Col xs={24} sm={8} />
                    <Col xs={24} sm={16}>
                        <Button loading={loading} key="1" type="primary" htmlType="submit">
                            Save
                        </Button>
                    </Col>
                </Row>
            )}
        </Form>
    );
});

export const DataForm = Form.create<Props>()(DataFormComponent);
