import {AnyAction} from "redux";
import {ValidationRule} from "antd/lib/form";
import {ReactNode} from "react";
import {WrappedFormUtils} from "antd/lib/form/Form";

export enum FieldType {
    TEXT,
    INTEGER,
    NUMBER,
    MONEY,
    SELECT,
    CHECKBOX,
    SWITCH,
    DATE,
    TIME,
    DATETIME,
    IMAGE,
    READ_ONLY,
    TAG,
    CUSTOM,
    TREESELECT,
    EDITOR,
}

export interface SelectItem {
    name: string;
    value: string | number;
    [key: string]: any;
}

export enum BaseConditionType {
    AND,
    OR,
}
export interface BaseCondition {
    type: BaseConditionType;
    conditions: Array<{name: string; value: any; children?: BaseCondition}>;
}

export interface BaseField {
    readonly?: boolean;
    name: string;
    fieldName: string;
    label: string;
    type: FieldType;
    switchValues?: {
        true: any;
        false: any;
    };
    items?: SelectItem[];
    loadItemsFn?: () => () => AnyAction;
    itemsLoaded?: boolean;
    itemsLoading?: boolean;
    defaultValue?: string | number | string[] | number[] | boolean;
    multiple?: boolean;
    placeholder?: string;
    value?: any;
    rules?: ValidationRule[];
    uploadFolder?: string;
    customField?: (field: Field, decorator: (field: ReactNode) => ReactNode, form: WrappedFormUtils) => ReactNode;
    setValue?: (value: any) => void;
    getValue?: (...args: any[]) => any;
    helpText?: string;
    basedOn?: BaseCondition;
    hide?: boolean;
    large?: boolean;
    unit?: string;
    minNum?: number;
    maxNum?: number;
    onChange?: (value: any) => void;
    ref?: any;
    disabled?: boolean;
}

export interface NormalField extends BaseField {
    type: FieldType.TEXT | FieldType.INTEGER | FieldType.NUMBER | FieldType.SWITCH | FieldType.DATE | FieldType.TIME | FieldType.DATETIME | FieldType.IMAGE | FieldType.READ_ONLY | FieldType.TAG | FieldType.TREESELECT | FieldType.EDITOR;
}

export interface ChosenField extends BaseField {
    type: FieldType.CHECKBOX | FieldType.SELECT | FieldType.TREESELECT;
    items: SelectItem[];
}

export interface CustomField<valueType extends any = any> extends BaseField {
    type: FieldType.CUSTOM;
    customField: (field: Field, decorator: (field: ReactNode) => ReactNode, form: WrappedFormUtils) => ReactNode;
    setValue?: (value: valueType) => void;
    getValue?: (...args: any[]) => valueType;
}

export type Field = CustomField | ChosenField | BaseField;

export interface Filters {
    [filterName: string]: string | number | null | undefined;
}

type UIColumns = string[];
interface UISection {
    name?: string;
    columns: UIColumns[];
}
export interface FormUI {
    sections: UISection[];
}
