import React, {ReactNode} from "react";
import {Editor} from "react-draft-wysiwyg";
import Draft, {EditorState, ContentState, Modifier, RichUtils, AtomicBlockUtils, ContentBlock, SelectionState, convertToRaw} from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {SketchPicker, TwitterPicker} from "react-color";
import {Icon, Button, Form, Input, InputNumber, Upload, Modal} from "antd";
import "./editor.less";
// @ts-ignore
import {getSelectedBlocksMetadata, setBlockData} from "draftjs-utils";

import * as Immutable from "immutable";
import htmlToDraft from "html-to-draftjs";
import draftToHtml from "draftjs-to-html";

const {Dragger} = Upload;
const InputGroup = Input.Group;
// text & highlight color picker
interface ColorPickerProps {
    expanded: boolean;
    onExpandEvent: () => void;
    onChange: (name: string, color: any) => void;
    currentState: any;
    doExpand: () => void;
    doCollapse: () => void;
    config: any;
}
interface ColorPickerState {
    color: string;
    flag: boolean;
    currentStyle: string;
}
class ColorPic extends React.PureComponent<ColorPickerProps, ColorPickerState> {
    state: ColorPickerState = {
        color: "#fff",
        flag: true,
        currentStyle: "color",
    };
    stopPropagation = (event: any) => {
        event.stopPropagation();
    };
    saveColor = () => {
        const {color, currentStyle} = this.state;
        const {onChange, doCollapse} = this.props;
        this.setState(
            {
                flag: true,
                color: "",
            },
            () => {
                onChange(currentStyle, color);
            }
        );
    };
    onChangeColor = (color: any) => {
        let opacity = "";
        if (color.rgb.a < 1) {
            opacity = color.hex + color.rgb.a * 100;
        } else {
            opacity = color.hex.toString();
        }
        this.setState({
            color: opacity,
        });
    };
    static getDerivedStateFromProps(nextProps: ColorPickerProps, prevState: ColorPickerState) {
        const {color} = nextProps.currentState;
        if (color && color !== prevState.color && prevState.flag) {
            return {
                color,
                flag: false,
            };
        }
        return null;
    }
    setCurrentStyleColor = (): void => {
        this.setState({
            currentStyle: "color",
        });
    };

    setCurrentStyleBgcolor = (): void => {
        this.setState({
            currentStyle: "bgcolor",
        });
    };
    renderModal = () => {
        const {currentStyle} = this.state;
        return (
            <div className="colorPicker" onClick={this.stopPropagation}>
                <span className="rdw-colorpicker-modal-header">
                    <span className={"rdw-colorpicker-modal-style-label " + (currentStyle === "color" ? "rdw-colorpicker-modal-style-label-active" : "")} onClick={() => this.setCurrentStyleColor()}>
                        Color
                    </span>
                    <span className={"rdw-colorpicker-modal-style-label " + (currentStyle === "bgcolor" ? "rdw-colorpicker-modal-style-label-active" : "")} onClick={() => this.setCurrentStyleBgcolor()}>
                        High Light
                    </span>
                </span>
                <SketchPicker color={this.state.color} onChange={this.onChangeColor} presetColors={["#A0006B", "#900061", "#6F004B", "#FFB533", "#9EC630", "#F95C41", "#231F20", "#f8f5f3", "#848284", "#f6e8f3"]} />
                <Button className="btn" onClick={() => this.saveColor()}>
                    Ok
                </Button>
            </div>
        );
    };
    showPicker = () => {
        const {onExpandEvent} = this.props;
        this.setState({
            flag: true,
        });
        onExpandEvent();
    };
    render() {
        const {expanded, onExpandEvent, config} = this.props;
        return (
            <div className="rdw-embedded-wrapper" aria-haspopup="true" aria-expanded={expanded} aria-label="rdw-color-picker">
                <div className="rdw-option-wrapper" onClick={() => this.showPicker()}>
                    <img src={config.icon} alt="" />
                </div>
                {expanded ? this.renderModal() : undefined}
            </div>
        );
    }
}

// text align
interface TextAlignProps {
    onChange: (data: any) => void;
    editorState: any;
    modalHandler: any;
    key: string;
}
class TextAlign extends React.PureComponent<TextAlignProps> {
    state = {
        color: "#fff",
        flag: true,
        currentStyle: "color",
    };
    stopPropagation = (event: any) => {
        event.stopPropagation();
    };
    getAllBlockType = (background: string, width: number, height: number, padding: string, margin: string, borderRadius: string, lineHeight: number, letterSpacing: string, textAlign: string) => {
        return {background, width: `${width}`, height: `${height}`, padding, margin, "border-radius": borderRadius, "line-height": lineHeight, "letter-spacing": letterSpacing, "text-align": textAlign, "box-sizing": "border-box"};
    };
    handleClick = (option: string) => {
        const {onChange, editorState} = this.props;
        const selectedBlocksMetadata = getSelectedBlocksMetadata(editorState);
        let newEditorState = null;
        const types = this.getAllBlockType(
            selectedBlocksMetadata.get("background"),
            selectedBlocksMetadata.get("width"),
            selectedBlocksMetadata.get("height"),
            selectedBlocksMetadata.get("padding"),
            selectedBlocksMetadata.get("margin"),
            selectedBlocksMetadata.get("border-radius"),
            selectedBlocksMetadata.get("line-height"),
            selectedBlocksMetadata.get("letter-spacing"),
            option
        );
        newEditorState = setBlockData(editorState, types);
        onChange(newEditorState);
    };
    render() {
        return (
            <div className="rdw-text-align-wrapper" aria-label="rdw-textalign-control">
                <div className="rdw-option-wrapper" aria-selected="false" title="Left" onClick={() => this.handleClick("left")}>
                    <Icon type="align-left" />
                </div>
                <div className="rdw-option-wrapper" aria-selected="false" title="Center" onClick={() => this.handleClick("center")}>
                    <Icon type="align-center" />
                </div>
                <div className="rdw-option-wrapper" aria-selected="false" title="Right" onClick={() => this.handleClick("right")}>
                    <Icon type="align-right" />
                </div>
                {/* <div className="rdw-option-wrapper" aria-selected="false" title="Justify" onClick={() => this.handleClick("justify")}>
                    <img src={config.justify.icon} alt="" />
                </div> */}
            </div>
        );
    }
}

// background block
interface CustomOptionProps {
    onChange: (data: any) => void;
    editorState: any;
    modalHandler: any;
    key: string;
}
class BackgroundBlock extends React.PureComponent<CustomOptionProps> {
    state = {
        expanded: false,
        visible: false,
        background: "",
        width: 375,
        height: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        mTop: 0,
        mRight: 0,
        mBottom: 0,
        mLeft: 0,
        currentStyle: "bgColor",
        url: "",
        borderRadius: 0,
    };
    signalExpanded = false;
    onExpandEvent = (): void => {
        this.signalExpanded = !this.state.expanded;
    };
    expandCollapse = (): void => {
        this.setState({
            expanded: this.signalExpanded,
        });
        this.signalExpanded = false;
    };
    doExpand = (): void => {
        this.setState({
            expanded: true,
        });
    };
    doCollapse = (): void => {
        this.setState({
            expanded: false,
        });
    };
    componentWillMount(): void {
        const {modalHandler} = this.props;
        modalHandler.registerCallBack(this.expandCollapse);
    }
    componentWillUnmount(): void {
        const {modalHandler} = this.props;
        modalHandler.deregisterCallBack(this.expandCollapse);
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    getAllBlockType = (
        background: string,
        backgroundImage: string,
        width: number,
        height: number,
        padding: {top: number; right: number; bottom: number; left: number},
        margin: {mTop: number; mRight: number; mBottom: number; mLeft: number},
        borderRadius: number,
        lineHeight: number,
        letterSpacing: string,
        textAlign: string
    ) => {
        return {
            background: background ? background : "#000",
            // "background-image": backgroundImage,
            // width: `${width}px`,
            height: `${height ? height + "px" : "auto"}`,
            padding: `${padding.top ? padding.top + "px" : 0} ${padding.right ? padding.right + "px" : 0} ${padding.bottom ? padding.bottom + "px" : 0} ${padding.left ? padding.left + "px" : 0}`,
            margin: `${margin.mTop ? margin.mTop + "px" : 0} ${margin.mRight ? margin.mRight + "px" : 0} ${margin.mBottom ? margin.mBottom + "px" : 0} ${margin.mLeft ? margin.mLeft + "px" : 0}`,
            "border-radius": `${borderRadius ? borderRadius + "px" : 0}`,
            "line-height": lineHeight,
            "letter-spacing": letterSpacing,
            "text-align": textAlign,
            "box-sizing": "border-box",
        };
    };
    stopPropagation = (event: any) => {
        event.stopPropagation();
    };
    save = () => {
        const {editorState, onChange, modalHandler} = this.props;
        const {background, width, height, top, right, bottom, left, url, mTop, mRight, mBottom, mLeft, borderRadius} = this.state;
        this.setState({
            expanded: false,
        });
        const selectedBlocksMetadata = getSelectedBlocksMetadata(editorState);
        let newEditorState = null;
        const types = this.getAllBlockType(background, url, width, height, {top, right, bottom, left}, {mTop, mRight, mBottom, mLeft}, borderRadius, selectedBlocksMetadata.get("line-height"), selectedBlocksMetadata.get("letter-spacing"), selectedBlocksMetadata.get("text-align"));
        newEditorState = setBlockData(editorState, types);
        const blockKey = newEditorState.getSelection().getAnchorKey();
        const blockType = newEditorState
            .getCurrentContent()
            .getBlockForKey(blockKey)
            .getType();
        // MyCustomBlock change to MyCustomBlock will be unstyled
        if (blockType !== "MyCustomBlock") {
            newEditorState = RichUtils.toggleBlockType(newEditorState, "MyCustomBlock");
        }
        onChange(newEditorState);
    };
    onChangeColor = (color: any) => {
        let opacity = "";
        if (color.rgb.a < 1) {
            opacity = color.hex + color.rgb.a * 100;
        } else {
            opacity = color.hex.toString();
        }
        this.setState({
            background: opacity,
        });
    };
    setCurrentStyle = (style: string) => {
        this.setState({
            currentStyle: style,
        });
    };
    uploadChange = (info: any) => {
        if (info.file.response) {
            this.setState({
                url: info.file.response.s3_key,
            });
        }
    };
    renderSetBackgroundModal = () => {
        const {background, width, height, top, right, bottom, left, mTop, mRight, mBottom, mLeft, borderRadius, currentStyle, url} = this.state;
        const props = {
            name: "file",
            action: `/file-uploader/banner`,
            onChange: this.uploadChange,
        };
        return (
            <div className="backgroundModal" onClick={this.stopPropagation}>
                {/* <span className="rdw-colorpicker-modal-header">
                    <span className={"rdw-colorpicker-modal-style-label " + (currentStyle === "bgColor" ? "rdw-colorpicker-modal-style-label-active" : "")} onClick={() => this.setCurrentStyle("bgColor")}>
                        Background Color
                    </span>
                    <span className={"rdw-colorpicker-modal-style-label " + (currentStyle === "bgImage" ? "rdw-colorpicker-modal-style-label-active" : "")} onClick={() => this.setCurrentStyle("bgImage")}>
                        Background Image
                    </span>
                </span> */}
                <Form.Item label="Background Color" className="colorPic">
                    <TwitterPicker color={background} onChange={this.onChangeColor} colors={["#A0006B", "#900061", "#6F004B", "#FFB533", "#9EC630", "#F95C41", "#231F20", "#f8f5f3", "#848284", "#f6e8f3"]} />
                    {/* <SketchPicker presetColors={["#A0006B", "#900061", "#6F004B", "#FFB533", "#9EC630", "#F95C41", "#231F20", "rgba(239, 229, 224, 0.4)", "rgba(35, 31, 32, 0.6)", "rgba(173, 0, 116, 0.1)"]} color={background} onChange={this.onChangeColor} /> */}
                </Form.Item>

                {/* <Form.Item label="Width" className="backgroundInput">
                    <InputNumber
                        value={width}
                        onChange={width => {
                            this.setState({width});
                        }}
                        max={375}
                        step={0.1}
                    />
                </Form.Item> */}
                <Form.Item label="Height" className="backgroundInput">
                    <InputNumber
                        value={height}
                        onChange={height => {
                            this.setState({height});
                        }}
                        step={0.1}
                    />
                </Form.Item>
                <Form.Item label="Border Radius" className="backgroundInput">
                    <InputNumber
                        value={borderRadius}
                        onChange={borderRadius => {
                            this.setState({borderRadius});
                        }}
                        step={1}
                    />
                </Form.Item>
                <Form.Item label="Padding">
                    <InputGroup compact>
                        <InputNumber className="inputTop" min={0} max={100} step={0.1} value={top} onChange={top => this.setState({top})} placeholder="top" />
                        <InputNumber className="inputLeft" min={0} max={100} step={0.1} value={left} onChange={left => this.setState({left})} placeholder="left" />
                        <InputNumber min={0} max={100} step={0.1} value={right} onChange={right => this.setState({right})} placeholder="right" />
                        <InputNumber className="inputTop" min={0} max={100} step={0.1} value={bottom} onChange={bottom => this.setState({bottom})} placeholder="bottom" />
                    </InputGroup>
                </Form.Item>
                <Form.Item label="Margin">
                    <InputGroup compact>
                        <InputNumber className="inputTop" min={0} max={100} step={0.1} value={mTop} onChange={mTop => this.setState({mTop})} placeholder="top" />
                        <InputNumber className="inputLeft" min={0} max={100} step={0.1} value={mLeft} onChange={mLeft => this.setState({mLeft})} placeholder="left" />
                        <InputNumber min={0} max={100} step={0.1} value={mRight} onChange={mRight => this.setState({mRight})} placeholder="right" />
                        <InputNumber className="inputTop" min={0} max={100} step={0.1} value={mBottom} onChange={mBottom => this.setState({mBottom})} placeholder="bottom" />
                    </InputGroup>
                </Form.Item>
                <Button className="btn" onClick={() => this.save()}>
                    Ok
                </Button>
            </div>
        );
    };
    render() {
        const {expanded} = this.state;
        return (
            <div className="rdw-embedded-wrapper" aria-haspopup="true" aria-expanded={expanded} aria-label="rdw-color-picker">
                <div className="rdw-option-wrapper" onClick={() => this.onExpandEvent()}>
                    <Icon type="bg-colors" />
                </div>
                {expanded ? this.renderSetBackgroundModal() : null}
            </div>
        );
    }
}

// custom block
class MyCustomBlock extends React.Component {
    render() {
        return this.props.children;
    }
}
// line height & word space
interface LineHeightProps {
    onChange: (data: any) => void;
    editorState: any;
    modalHandler: any;
    key: string;
    type: string;
}
class WordBlockTypeComponent extends React.PureComponent<LineHeightProps> {
    state = {
        expanded: false,
        value: 0,
    };
    signalExpanded = false;
    onExpandEvent = (): void => {
        this.signalExpanded = !this.state.expanded;
    };

    expandCollapse = (): void => {
        this.setState({
            expanded: this.signalExpanded,
        });
        this.signalExpanded = false;
    };

    doExpand = (): void => {
        this.setState({
            expanded: true,
        });
    };

    doCollapse = (): void => {
        this.setState({
            expanded: false,
        });
    };
    componentWillMount(): void {
        const {modalHandler} = this.props;
        modalHandler.registerCallBack(this.expandCollapse);
    }
    componentWillUnmount(): void {
        const {modalHandler} = this.props;
        modalHandler.deregisterCallBack(this.expandCollapse);
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    getAllBlockType = (background: string, width: number, height: number, padding: string, margin: string, borderRadius: string, lineHeight: string, letterSpacing: string) => {
        return {
            background,
            width,
            height,
            padding,
            margin,
            "border-radius": borderRadius,
            "line-height": lineHeight,
            "letter-spacing": letterSpacing,
            "box-sizing": "border-box",
        };
    };
    stopPropagation = (event: any) => {
        event.stopPropagation();
    };
    save = () => {
        const {editorState, onChange, type} = this.props;
        const {value} = this.state;
        this.setState({
            expanded: false,
        });
        const selectedBlocksMetadata = getSelectedBlocksMetadata(editorState);
        let newEditorState = null;
        let styles = {};
        if (type === "lineHeight") {
            styles = this.getAllBlockType(
                selectedBlocksMetadata.get("background"),
                selectedBlocksMetadata.get("width"),
                selectedBlocksMetadata.get("height"),
                selectedBlocksMetadata.get("padding"),
                selectedBlocksMetadata.get("margin"),
                selectedBlocksMetadata.get("border-radius"),
                `${value}px`,
                selectedBlocksMetadata.get("letter-spacing")
            );
        } else if (type === "wordSpace") {
            styles = this.getAllBlockType(
                selectedBlocksMetadata.get("background"),
                selectedBlocksMetadata.get("width"),
                selectedBlocksMetadata.get("height"),
                selectedBlocksMetadata.get("padding"),
                selectedBlocksMetadata.get("margin"),
                selectedBlocksMetadata.get("border-radius"),
                selectedBlocksMetadata.get("line-height"),
                `${value}px`
            );
        }
        newEditorState = setBlockData(editorState, styles);
        const blockKey = newEditorState.getSelection().getAnchorKey();
        const blockType = newEditorState
            .getCurrentContent()
            .getBlockForKey(blockKey)
            .getType();
        // MyCustomBlock change to MyCustomBlock will be unstyled
        if (blockType !== "MyCustomBlock") {
            newEditorState = RichUtils.toggleBlockType(newEditorState, "MyCustomBlock");
        }
        onChange(newEditorState);
    };
    renderSetBackgroundModal = () => {
        return (
            <div className="backgroundModal" onClick={this.stopPropagation}>
                <Form.Item label={this.props.type === "lineHeight" ? "Line Height" : "Word Spacing"}>
                    <InputNumber style={{width: "100%"}} min={0} max={100} step={0.1} onChange={value => this.setState({value})} />
                </Form.Item>
                <Button className="btn" onClick={() => this.save()}>
                    Ok
                </Button>
            </div>
        );
    };
    render() {
        const {type} = this.props;
        const {expanded} = this.state;
        return (
            <div className="rdw-embedded-wrapper" aria-haspopup="true" aria-expanded={expanded} aria-label="rdw-color-picker">
                <div className="rdw-option-wrapper" onClick={() => this.onExpandEvent()}>
                    {type === "lineHeight" ? <Icon type="line-height" /> : <Icon type="font-size" />}
                </div>
                {expanded ? this.renderSetBackgroundModal() : null}
            </div>
        );
    }
}

// image picker
interface ImageProps {
    editorState: EditorState;
    onChange: (data: any) => void;
    modalHandler: any;
}
class ImagePicker extends React.PureComponent<ImageProps> {
    state = {
        expanded: false,
        url: "",
        width: "auto",
        height: "auto",
        background: "#f3f2f1",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    };
    signalExpanded = false;
    doExpand = (): void => {
        this.setState({
            expanded: true,
        });
    };
    doCollapse = (): void => {
        this.setState({
            expanded: false,
        });
    };
    stopPropagation = (event: any) => {
        event.stopPropagation();
    };
    uploadChange = (info: any) => {
        if (info.file.response) {
            this.setState({
                url: info.file.response.s3_key,
            });
        }
    };
    save = () => {
        const {editorState, onChange} = this.props;
        const {width, height, url, background, top, bottom, right, left} = this.state;
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const contentStateWithEntity = contentState.createEntity("IMAGE", "IMMUTABLE", {
            src: `/image/${url}`,
            width: "100%",
            height: height === "auto" ? height : `${height}px`,
            // width: `${width}px`,
            // height: `${height}px`,
            background,
            padding: `${top ? top + "px" : "0"} ${right ? right + "px" : "0"} ${bottom ? bottom + "px" : "0"} ${left ? left + "px" : "0"}`,
        });
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(editorState, {
            currentContent: contentStateWithEntity,
        });

        const newNewEditorState = AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ");
        // const editorStateWithStyle = setBlockData(newNewEditorState, {background});
        // const editorStateWithType = RichUtils.toggleBlockType(editorStateWithStyle, "MyCustomBlock");
        // console.log(editorStateWithStyle)
        // const textWithEntity = Modifier.applyEntity(contentState, selection, " ", undefined, entityKey);
        // const data = EditorState.push(editorState, textWithEntity, "insert-characters");

        onChange(newNewEditorState);
        this.setState({
            url: "",
            width: "auto",
            height: "auto",
            expanded: false,
        });
    };
    renderUploadModal = () => {
        const props = {
            name: "file",
            action: `/file-uploader/banner`,
            onChange: this.uploadChange,
        };
        const {width, height, background, top, right, bottom, left} = this.state;
        return (
            <div className="backgroundModal" onClick={this.stopPropagation}>
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                </Dragger>
                {/* <Form.Item label="Width">
                    <Input
                        value={width}
                        onChange={e => {
                            this.setState({width: e.target.value});
                        }}
                        suffix="px"
                    />
                </Form.Item> */}
                <Form.Item label="Height">
                    <Input
                        value={height}
                        onChange={e => {
                            this.setState({height: e.target.value});
                        }}
                        suffix="px"
                    />
                </Form.Item>
                <Form.Item label="background">
                    <Input
                        value={background}
                        onChange={e => {
                            this.setState({background: e.target.value});
                        }}
                        suffix="hex"
                    />
                </Form.Item>
                <Form.Item label="Padding">
                    <InputGroup compact>
                        <InputNumber className="inputTop" min={0} max={100} step={0.1} value={top} onChange={top => this.setState({top})} placeholder="top" />
                        <InputNumber className="inputLeft" min={0} max={100} step={0.1} value={left} onChange={left => this.setState({left})} placeholder="left" />
                        <InputNumber min={0} max={100} step={0.1} value={right} onChange={right => this.setState({right})} placeholder="right" />
                        <InputNumber className="inputTop" min={0} max={100} step={0.1} value={bottom} onChange={bottom => this.setState({bottom})} placeholder="bottom" />
                    </InputGroup>
                </Form.Item>
                <Button type="default" onClick={() => this.save()}>
                    Ok
                </Button>
                <Button type="default" onClick={() => this.doCollapse()}>
                    Cancel
                </Button>
            </div>
        );
    };
    render() {
        const {expanded} = this.state;
        return (
            <div className="rdw-embedded-wrapper" aria-haspopup="true" aria-expanded={expanded} aria-label="rdw-color-picker">
                <div className="rdw-option-wrapper" onClick={() => this.doExpand()}>
                    <Icon type="picture" />
                </div>
                {expanded ? this.renderUploadModal() : null}
            </div>
        );
    }
}

// preview
interface PreviewProps {
    editorState: EditorState;
}
class PreviewDraft extends React.PureComponent<PreviewProps> {
    state = {
        visible: false,
    };
    stopPropagation = (event: any) => {
        event.stopPropagation();
    };
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };
    render() {
        const {editorState} = this.props;
        return (
            <div className="rdw-embedded-wrapper" aria-haspopup="true" aria-label="rdw-color-picker">
                <div className="rdw-option-wrapper" onClick={() => this.showModal()}>
                    <Icon type="eye" />
                </div>
                <Modal title="Preview" visible={this.state.visible} onCancel={this.handleCancel}>
                    <div style={{width: "375px"}} dangerouslySetInnerHTML={{__html: draftToHtml(convertToRaw(editorState.getCurrentContent()))}} />
                </Modal>
            </div>
        );
    }
}

interface Props {
    decorator: (field: ReactNode) => ReactNode;
    data: any;
    disabled?: boolean;
    validFailed?: boolean;
}
export class HtmlEditor extends React.PureComponent<Props> {
    state = {
        editorState: EditorState.createEmpty(),
        flag: true,
    };
    onEditorStateChange = (editorState: any) => {
        this.setState({
            editorState,
        });
    };
    formatClassName = (style: any) => {
        if (!style) {
            return style;
        } else {
            let className = "";
            className = style.replace(/\s/g, "").replace(/[^a-zA-Z0-9]/g, "");
            return className;
        }
    };
    myBlockStyleFn = (contentBlock: ContentBlock) => {
        const type = contentBlock.getType();
        const metaData = contentBlock.getData();
        let background = metaData.get("background");
        // const backgroundImage = metaData.get("background-image");
        const width = metaData.get("width");
        const height = metaData.get("height");
        const lineHeight = metaData.get("line-height");
        const letterSpacing = metaData.get("letter-spacing");
        const textAlign = metaData.get("text-align");
        let padding = metaData.get("padding");
        const margin = metaData.get("margin");
        const borderRadius = metaData.get("border-radius");
        const contentState = this.state.editorState.getCurrentContent();

        // img
        if (contentBlock.getEntityAt(0)) {
            const entity = contentState.getEntity(contentBlock.getEntityAt(0));
            if (!background) {
                background = entity.getData().background;
            }
            if (!padding) {
                padding = entity.getData().padding;
            }
        }
        // format className
        if (background || width || height || lineHeight || letterSpacing || textAlign || padding) {
            let letterSpacingName = "";
            if (!letterSpacing) {
                letterSpacingName = letterSpacing;
            } else {
                letterSpacingName = Math.round(Number(letterSpacing.substring(0, letterSpacing.indexOf("px"))) * 100).toString();
            }
            let backgroundName = "";
            if (background && background.indexOf("#") >= 0) {
                backgroundName = background.replace("#", "");
            } else if (background && background.indexOf("rgb") >= 0) {
                backgroundName = background.replace(/[^a-zA-Z0-9]/g, "");
                // backgroundName = background.replace(/./g, "");
                backgroundName = backgroundName.replace("(", "");
                backgroundName = backgroundName.replace(")", "");
            } else {
                backgroundName = background;
            }
            // let paddingName = "";
            // if (!padding) {
            //     paddingName = padding;
            // } else {
            //     paddingName = padding.replace(/\s/g, "").replace(/[^a-zA-Z0-9]/g, "");
            // }

            // let widthName = "";
            // if (!width) {
            //     widthName = width;
            // } else {
            //     widthName = width.replace(/[^a-zA-Z0-9]/g, "");
            // }

            // let heightName = "";
            // if (!height) {
            //     heightName = height;
            // } else {
            //     heightName = height.replace(/[^a-zA-Z0-9]/g, "");
            // }
            let className = "custom" + backgroundName + this.formatClassName(width) + this.formatClassName(height) + this.formatClassName(padding) + this.formatClassName(margin) + Math.round(lineHeight * 100) + letterSpacingName;
            // let className = "custom" + backgroundName + formatClassName()widthName + heightName + paddingName + Math.round(lineHeight * 100) + letterSpacingName;
            this.loadCssCode(`.${className} {
                    background: ${background};
                    width: ${width};
                   height: ${height};
                   padding: ${padding};
                   margin: ${margin};
                   border-radius: ${borderRadius};
                   line-height: ${lineHeight};
                letter-spacing: ${letterSpacing};
                box-sizing: border-box;
                }`);
            if (textAlign) {
                className += ` rdw-${textAlign}-aligned-block`;
            }
            return className;
        }
    };

    loadCssCode = (code: string) => {
        const style = document.createElement("style");
        style.type = "text/css";
        // style.rel = 'stylesheet';
        // for Chrome Firefox Opera Safari
        style.appendChild(document.createTextNode(code));
        // for IE
        // style.styleSheet.cssText = code;
        const head = document.getElementsByTagName("head")[0];
        head.appendChild(style);
    };
    static getDerivedStateFromProps(nextProps: Props, prevState: {editorState: EditorState; flag: boolean}) {
        const {data} = nextProps;
        const {flag, editorState} = prevState;
        if ((data && !data.blocks && flag) || (data && data.blocks && data.blocks.length !== 1 && data.blocks[0].text && !editorState && flag)) {
            const styles: any[] = [];
            const contentBlock = htmlToDraft(data, (nodeName: string, node: HTMLElement) => {
                if (nodeName === "div") {
                    const style = node.style.cssText.replace(/\s/g, "").split(";");
                    const obj = {};
                    for (const i in style) {
                        if (style[i]) {
                            const key = style[i].split(":")[0];
                            let value = style[i].split(":")[1];
                            if (key === "padding" || key === "margin") {
                                value = value.replace(/px/g, "px ");
                            }
                            obj[key] = value;
                        }
                    }
                    styles.push(obj);
                    return undefined;
                }
            });
            const contentState = ContentState.createFromBlockArray(contentBlock && contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            let newEditorState = editorState;
            for (let i = 0, j = 0; i < (contentBlock && contentBlock.contentBlocks.length); i++) {
                const selection = newEditorState.getSelection();
                let contentStateTest = newEditorState.getCurrentContent();
                contentStateTest = Modifier.splitBlock(contentStateTest, selection);
                const currentBlock = contentState.getBlockForKey(selection.getEndKey());
                const nextBlock = contentState
                    .getBlockMap()
                    .toSeq()
                    .skipUntil((v: any) => {
                        return v === currentBlock;
                    })
                    .rest()
                    .first();
                if (nextBlock) {
                    const nextBlockKey = nextBlock.getKey();
                    const nextBlockEmptySelection = new SelectionState({
                        anchorKey: nextBlockKey,
                        anchorOffset: 0,
                        focusKey: nextBlockKey,
                        focusOffset: 0,
                    });
                    if (currentBlock.getType() === "MyCustomBlock") {
                        newEditorState = setBlockData(newEditorState, styles[j]);
                        j++;
                    }
                    newEditorState = EditorState.forceSelection(newEditorState, nextBlockEmptySelection);
                } else {
                    if (currentBlock.getType() === "MyCustomBlock") {
                        newEditorState = setBlockData(newEditorState, styles[j]);
                        j++;
                    }
                }
            }

            return {
                // editorState,
                editorState: newEditorState,
                flag: false,
            };
        }
        return null;
    }
    render() {
        const {editorState} = this.state;
        const {decorator, data, disabled, validFailed} = this.props;
        const blockRenderMap = Immutable.Map({
            MyCustomBlock: {
                element: "section",
                wrapper: <MyCustomBlock />,
            },
        });
        return (
            <>
                {decorator(
                    // @ts-ignore
                    <Editor
                        wrapperClassName="wrapper-class"
                        toolbar={{
                            options: ["inline", "blockType", "fontSize", "fontFamily", "list", "remove", "history", "link", "colorPicker"],
                            inline: {options: ["bold", "italic", "underline", "strikethrough"]},
                            colorPicker: {component: ColorPic},
                            // textAlign: {component: TextAlign},
                            fontFamily: {options: ["BasisGrotesqueProBlack", "BasisGrotesqueProBold", "BasisGrotesqueProLight", "BasisGrotesqueProRegular", "CheltenhamEFBook"], className: undefined, component: undefined, dropdownClassName: "fontFamilyDropDown"},
                        }}
                        editorClassName={validFailed ? "contract-template-editor validFailed" : "contract-template-editor"}
                        toolbarClassName="toolbar-class"
                        editorState={editorState}
                        onEditorStateChange={this.onEditorStateChange}
                        toolbarCustomButtons={[
                            // <LinkComponent key="link" onChange={this.onEditorStateChange} editorState={editorState} modalHandler />,
                            <TextAlign key="backgroundBlock" onChange={this.onEditorStateChange} editorState={editorState} modalHandler />,
                            <BackgroundBlock key="backgroundBlock" onChange={this.onEditorStateChange} editorState={editorState} modalHandler />,
                            <WordBlockTypeComponent key="lineHeightBlock" type="lineHeight" onChange={this.onEditorStateChange} editorState={editorState} modalHandler />,
                            <WordBlockTypeComponent key="lineHeightBlock" type="wordSpace" onChange={this.onEditorStateChange} editorState={editorState} modalHandler />,
                            <ImagePicker key="imagePicker" onChange={this.onEditorStateChange} editorState={editorState} modalHandler />,
                            <PreviewDraft key="preview" editorState={editorState} />,
                        ]}
                        // @ts-ignore
                        blockRenderMap={Draft.DefaultDraftBlockRenderMap.merge(blockRenderMap)}
                        blockStyleFn={this.myBlockStyleFn}
                        readOnly={disabled}
                    />
                )}
                <p className={validFailed ? "showValidText" : "hideValidText"}>Description (Terms & Conditions) is required.</p>
            </>
        );
    }
}
