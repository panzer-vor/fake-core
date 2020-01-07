import React, {useState, useEffect} from "react";
import {Form, Input, Select, Switch, TimePicker, DatePicker, Icon, TreeSelect} from "antd";
import {Field, FieldType, SelectItem} from "./form";
import {HtmlEditor} from "../HtmlEditor";
import {FormComponentProps, FormItemProps} from "antd/lib/form";
import {WrappedFormUtils, GetFieldDecoratorOptions} from "antd/lib/form/Form";
import RadioGroup from "antd/lib/radio/group";
import CheckboxGroup from "antd/lib/checkbox/Group";
import moment from "moment";
import {DispatchProp, connect} from "react-redux";

import {Image} from "./Image";
import {UploadFile} from "antd/lib/upload/interface";
import {TagList} from "./Tag";
import TextArea from "antd/lib/input/TextArea";
export const DATE_FORMAT = "YYYY/MM/DD";
export const TIME_FORMAT = "hh:mm:ss";
const {TreeNode} = TreeSelect;
interface FieldEntryProps extends FormComponentProps {
    field: Field;
    value?: any;
}

interface Props extends FieldEntryProps, DispatchProp {}

const FileFolder = {
    default: "default",
    restaurant: "restaurant",
    product: "product",
    sku: "sku",
    banner: "banner",
};

const fieldOnChange = (name: string, form: WrappedFormUtils) => (value: any) => {
    form.setFieldsValue({[name]: value});
};

function formField(field: Field, form: WrappedFormUtils, value: any, items?: SelectItem[]) {
    const decorator = decorate(form);
    const initialValue = getValue(value, field);

    switch (field.type) {
        case FieldType.TEXT:
            const fieldValue = form.getFieldValue(field.fieldName);
            if (field.large) {
                return decorator(
                    field,
                    initialValue
                )(
                    <TextArea
                        disabled={field.disabled}
                        onBlur={() => {
                            form.setFieldsValue({
                                [field.fieldName]: fieldValue ? fieldValue.trim() : fieldValue,
                            });
                            form.validateFields([field.fieldName]);
                        }}
                        className="fti-form__textarea"
                        placeholder={field.placeholder}
                    />
                );
            }
            return decorator(
                field,
                initialValue
            )(
                <Input
                    disabled={field.disabled}
                    onBlur={() => {
                        form.setFieldsValue({
                            [field.fieldName]: fieldValue ? fieldValue.trim() : fieldValue,
                        });
                        form.validateFields([field.fieldName]);
                    }}
                    placeholder={field.placeholder}
                />
            );
        case FieldType.INTEGER:
        case FieldType.NUMBER:
            return decorator(field, initialValue)(<Input disabled={field.disabled} type="number" placeholder={field.placeholder} suffix={field.unit} />);
        case FieldType.MONEY:
            return decorator(field, initialValue)(<Input disabled={field.disabled} prefix="$" type="number" placeholder={field.placeholder} />);
        case FieldType.SELECT:
            return decorator(
                field,
                initialValue
            )(
                <Select disabled={field.disabled} {...(field.multiple && {mode: "multiple"})} loading={field.loadItemsFn && !field.itemsLoaded} placeholder={field.placeholder} onChange={value => field.onChange && field.onChange(value)}>
                    {items &&
                        items.map(item => (
                            <Select.Option key={item.value} value={item.value}>
                                {item.name}
                            </Select.Option>
                        ))}
                </Select>
            );
        case FieldType.TREESELECT:
            return decorator(
                field,
                initialValue
            )(
                <TreeSelect disabled={field.disabled} showSearch loading={field.loadItemsFn && !field.itemsLoaded} dropdownStyle={{maxHeight: 400, overflow: "auto"}} placeholder="Please select" allowClear treeDefaultExpandAll>
                    {items && items.map(item => <TreeNode value={item.value} title={item.name} key={item.value} />)}
                </TreeSelect>
            );
        case FieldType.CHECKBOX:
            if (field.loadItemsFn && !field.itemsLoaded) {
                return <Icon type="loading" />;
            }
            const options = items && items.map(item => ({label: item.name, value: item.value}));
            if (field.multiple) {
                return decorator(field, initialValue)(<CheckboxGroup disabled={field.disabled} options={options} onChange={value => field.onChange && field.onChange(value)} />);
            }
            return decorator(field, initialValue)(<RadioGroup disabled={field.disabled} options={options} onChange={event => field.onChange && field.onChange(event.target.value)} />);
        case FieldType.SWITCH:
            return decorator(field, initialValue)(<Switch disabled={field.disabled} defaultChecked={initialValue || false} onChange={value => field.onChange && field.onChange(value)} />);
        case FieldType.TIME:
            return decorator(field, initialValue)(<TimePicker />);
        case FieldType.DATE:
            return decorator(field, initialValue)(<DatePicker />);
        case FieldType.DATETIME:
            return decorator(field, initialValue)(<DatePicker showTime />);
        case FieldType.IMAGE:
            const props: {fileList?: string[]; file?: string; maxNum?: number} = {};

            if (field.multiple) {
                if (field.maxNum) {
                    props.maxNum = field.maxNum;
                }
                props.fileList = initialValue || form.getFieldValue(field.fieldName);
            } else {
                props.file = initialValue || form.getFieldValue(field.fieldName);
            }
            return (
                <Image
                    ref={ref => {
                        if (ref != null && !field.ref) {
                            field.ref = ref;
                        }
                    }}
                    onChange={fieldOnChange(field.fieldName, form)}
                    multiple={field.multiple}
                    decorator={decorator(field, initialValue)}
                    folder={field.uploadFolder || FileFolder.default}
                    {...props}
                />
            );
        case FieldType.TAG:
            return <TagList decorator={decorator(field, initialValue)} tags={initialValue || form.getFieldValue(field.fieldName) || []} onChange={fieldOnChange(field.fieldName, form)} />;
        case FieldType.CUSTOM:
            if (field.customField) {
                return field.customField(field, decorator(field, initialValue), form);
            }
        case FieldType.EDITOR:
            return <HtmlEditor data={initialValue || form.getFieldValue(field.fieldName) || ""} decorator={decorator(field, initialValue)} />;
            // return decorator(field, initialValue)(<HtmlEditor />);
        default:
            return <Input placeholder={field.placeholder} />;
    }
}

const getValue = (value: any, field: Field): any => {
    if (value || value === false || value === 0) {
        return value;
    }
    if (field.value || field.value === false || field.value === 0) {
        return field.value;
    }
    if (field.defaultValue || field.defaultValue === false || field.defaultValue === 0) {
        return field.defaultValue;
    }
    return undefined;
};

const decorate = ({getFieldDecorator}: WrappedFormUtils) => (field: Field, value: any) => {
    const config: GetFieldDecoratorOptions = {
        rules: field.disabled ? [] : field.rules,
        validateFirst: true,
        initialValue: value,
    };
    if (field.type === FieldType.DATETIME) {
        config.initialValue = value ? moment(value, DATE_FORMAT) : undefined;
    } else if (field.type === FieldType.DATE) {
        config.initialValue = value ? moment(value, TIME_FORMAT) : undefined;
    } else if (field.type === FieldType.TIME) {
        config.initialValue = value.value ? moment(value, DATE_FORMAT + " " + TIME_FORMAT) : undefined;
    } else if (field.type === FieldType.SWITCH) {
        if (field.switchValues) {
            if (value === true) {
                config.initialValue = field.switchValues.true;
            } else {
                config.initialValue = field.switchValues.false;
            }
        } else {
            config.initialValue = value || false;
        }
    } else if (field.type === FieldType.CHECKBOX && field.multiple) {
        config.initialValue = value || [];
    } else if (field.type === FieldType.TREESELECT) {
        config.initialValue = value || [];
    } else if (field.type === FieldType.CUSTOM && field.setValue) {
        config.initialValue = field.setValue(value);
    }
    if (field.type === FieldType.INTEGER) {
        config.getValueFromEvent = event => (event.target.value ? parseInt(event.target.value, 10) : void 0);
    } else if (field.type === FieldType.NUMBER) {
        config.getValueFromEvent = event => parseFloat(event.target.value);
    } else if (field.type === FieldType.MONEY) {
        config.getValueFromEvent = event => parseFloat(event.target.value);
    } else if (field.type === FieldType.SWITCH) {
        config.getValueFromEvent = value => {
            return field.switchValues ? field.switchValues[value] : value;
        };
    } else if (field.type === FieldType.IMAGE) {
        config.getValueFromEvent = value => {
            if (field.multiple) {
                return value.fileList.filter((file: UploadFile) => (file.response && file.response.status === "done") || file.status === "done").map((file: UploadFile) => (file.response ? file.response.s3_key : file.name));
            } else {
                return value.file.response ? value.file.response.s3_key : null;
            }
        };
    } else if (field.type === FieldType.CUSTOM && field.getValue) {
        config.getValueFromEvent = field.getValue;
    }
    return getFieldDecorator(field.fieldName, config);
};

const label = (field: Field) => {
    if (field.type === FieldType.IMAGE && field.rules) {
        for (const rule of field.rules) {
            if (rule.required) {
                return (
                    <label htmlFor="name" className="ant-form-item-required" title="Name">
                        {field.label}
                    </label>
                );
            }
        }
    }

    return field.label;
};

const DataFormItem = ({field, form, dispatch, value}: Props) => {
    const props: FormItemProps = {
        label: label(field),
    };
    if (field.helpText) {
        props.help = field.helpText;
    }
    if (field.hide && field.hide === true) {
        props.style = {display: "none"};
    }
    if (field.type === FieldType.IMAGE && form.getFieldError(field.fieldName)) {
        if (field.ref.state.loading) {
            props.help = "uploading...";
        } else {
            props.validateStatus = "error";
            props.help = form.getFieldError(field.fieldName);
        }
    }
    if (field.type === FieldType.SELECT || field.type === FieldType.CHECKBOX || field.type === FieldType.TREESELECT) {
        const [items, setItems] = useState([] as SelectItem[]);
        const [loading, setLoading] = useState(false);
        const [loaded, setLoaded] = useState(false);

        useEffect(() => {
            if ((!items || items.length === 0) && !loading && !loaded) {
                if (field.loadItemsFn) {
                    field.itemsLoaded = false;
                    dispatch(field.loadItemsFn()());
                }
                setLoading(true);
            }
            if (field.items && field.items.length > 0) {
                setItems(field.items);
                if (field.itemsLoaded) {
                    setLoaded(true);
                    setLoading(true);
                }
            }
        }, [field.items]);
        return (
            <Form.Item key={field.fieldName} {...props}>
                {formField(field, form, value, items)}
            </Form.Item>
        );
    }
    return (
        <Form.Item key={field.fieldName} {...props}>
            {formField(field, form, value)}
        </Form.Item>
    );
};

export default connect()(DataFormItem);
