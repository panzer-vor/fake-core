import {State} from "./type";
import {Field, FieldType} from "fake-core-widget/lib/DataForm/form";
import {Pagination} from "fake-core-module";
import {AdStatusAJAXView, ActionTypeAJAXView} from "type/api";
import {FileFolder} from "type/file-folders";

const initialState: State = {
    banners: {
        ads: [],
        pagination: new Pagination(),
    },
    bannerInfo: {
        bannerForm: {
            name: {
                name: "name",
                fieldName: "name",
                label: "Banner Name",
                placeholder: "",
                type: FieldType.TEXT,
                rules: [
                     {
                        required: true,
                        message: "Name is required",
                    },
                ],
            },
            link: {
                name: "link",
                fieldName: "action_url",
                label: "Link",
                placeholder: "",
                type: FieldType.TEXT,
                rules: [
                    {
                        required: true,
                        message: "Link is required",
                    },
                ],
            },
            image: {
                name: "image_key",
                fieldName: "image_key",
                label: "Banner Image",
                placeholder: "",
                type: FieldType.IMAGE,
                uploadFolder: FileFolder.banner,
                rules: [
                    {
                        required: true,
                        message: "Banner Image is required",
                    },
                ],
            },
            status: {
                name: "status",
                fieldName: "status",
                label: "Status",
                placeholder: "",
                type: FieldType.CHECKBOX,
                defaultValue: AdStatusAJAXView.INACTIVE,
                items: [
                    {
                        name: "ACTIVE",
                        value: AdStatusAJAXView.ACTIVE,
                    },
                    {
                        name: "INACTIVE",
                        value: AdStatusAJAXView.INACTIVE,
                    },
                ],
            },
        },
    },
    restaurantListAds: {
        ads: [],
    },
    restaurantListAdsInfo: {
        showEditor: false,
        adValue: null,
        id: "",
        adForm: {
            sub_title: {
                name: "sub_title",
                fieldName: "sub_title",
                label: "Line1",
                placeholder: "",
                type: FieldType.TEXT,
                rules: [
                    {
                        required: true,
                        message: "Line1 is required",
                    },
                ],
            },
            title: {
                name: "title",
                fieldName: "title",
                label: "Title",
                placeholder: "",
                type: FieldType.TEXT,
                rules: [
                    {
                        required: true,
                        message: "Title is required",
                    },
                ],
            },
            description: {
                name: "description",
                fieldName: "description",
                label: "Description",
                placeholder: "",
                type: FieldType.TEXT,
                large: true,
                rules: [
                    {
                        required: true,
                        message: "Description is required",
                    },
                ],
            },
            action_title: {
                name: "action_title",
                fieldName: "action_title",
                label: "Link Words",
                placeholder: "",
                type: FieldType.TEXT,
                rules: [
                    {
                        required: true,
                        message: "Link Words is required",
                    },
                ],
            },
            action_type: {
                name: "action_type",
                fieldName: "action_type",
                label: "Link Type",
                placeholder: "",
                type: FieldType.SELECT,
                items: [
                    {
                        name: "External URL",
                        value: ActionTypeAJAXView.EXTERNAL_LINK,
                    },
                    {
                        name: "Internal page",
                        value: ActionTypeAJAXView.INTERNAL_LINK,
                    },
                    {
                        name: "Editable page",
                        value: ActionTypeAJAXView.INTERNAL_PAGE,
                    },
                ],
                rules: [
                    {
                        required: true,
                        message: "Link Type is required",
                    },
                ],
            },
            action_url: {
                name: "action_url",
                fieldName: "action_url",
                label: "Link Contents",
                placeholder: "",
                type: FieldType.TEXT,
                rules: [
                    {
                        required: true,
                        message: "Link Contents is required",
                    },
                    {
                        validator: (rule: any, v: string, cb: any) => {
                            const pattern = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/;
                            if (pattern.test(v)) {
                                cb();
                                return;
                            }
                            cb("Link Contents is invalid.");
                        },
                    },
                ],
            },
            editor: {
                name: "editor",
                fieldName: "editor",
                label: "Link Contents",
                placeholder: "",
                type: FieldType.EDITOR,
                hide: true,
                rules: [
                    {
                        required: false,
                        message: "Link Contents is required",
                    },
                ],
            },
            image_key: {
                name: "image_key",
                fieldName: "image_key",
                label: "Background Image",
                placeholder: "",
                type: FieldType.IMAGE,
                uploadFolder: FileFolder.banner,
            },
        },
    },
};
export default initialState;
