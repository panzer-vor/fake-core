import React, {Component, ReactNode} from "react";
import Upload, {UploadChangeParam, UploadProps} from "antd/lib/upload";
import {Icon, Modal} from "antd";
import {UploadFile} from "antd/lib/upload/interface";
import {DropTarget, DragSource, ConnectableElement, ConnectDropTarget, ConnectDragSource, DropTargetSpec, DragSourceSpec} from "react-dnd";

interface ImageProps {
    decorator: (field: ReactNode) => ReactNode;
    folder: string;
    fileList?: string[];
    file?: string;
    multiple?: boolean;
    onChange?: (value: string | string[] | null) => void;
    minNum?: number;
    maxNum?: number;
}

interface State {
    loading: boolean;
    preview: string | null;
    fileList?: UploadFile[];
    listPreview?: string;
    showPreview: boolean;
    prevPreview: string | null;
}

export class Image extends Component<ImageProps, State> {
    state: State = {
        loading: false,
        preview: this.props.file ? `/image/${this.props.file}` : null,
        fileList: this.props.fileList && this.props.fileList.map((file, index): UploadFile => ({uid: index + "", name: file, status: "done", url: `/image/${file}`, type: "image", size: 10})),
        showPreview: false,
        prevPreview: this.props.file ? `/image/${this.props.file}` : null,
    };

    prevPreview = `/image/${this.props.file}`;

    handleChange = (info: UploadChangeParam) => {
        const {onChange, multiple} = this.props;
        if (multiple) {
            if (onChange) {
                this.onMultipleChange(info.fileList);
            }
        } else {
            if (info.file.status === "done") {
                this.setState({preview: `image/${info.file.response.s3_key}`, loading: false});
                if (onChange) {
                    onChange(info.file.response.s3_key);
                }
            } else {
                this.setState({loading: true});
            }
        }
    };

    onMultipleChange = (fileList: UploadFile[]) => {
        const {onChange, maxNum} = this.props;
        this.setState({fileList: typeof maxNum === "number" ? fileList.slice(-maxNum) : fileList});
        let isUploading = false;
        const list = fileList
            .filter(file => {
                const notUploading = (file.response && file.response.status === "done") || file.status === "done";
                if (!notUploading) {
                    isUploading = true;
                }
                return notUploading;
            })
            .map(file => (file.response ? file.response.s3_key : file.name));
        this.setState({loading: isUploading});
        if (onChange) {
            onChange(typeof maxNum === "number" ? list.slice(-maxNum) : list);
        }
    };

    handlePreview = (file: string) => {
        this.setState({
            listPreview: file,
            showPreview: true,
        });
    };

    handleRemove = (index: number) => {
        const {onChange} = this.props;
        const {fileList} = this.state;
        if (fileList && fileList.length > index) {
            fileList.splice(index, 1);
            this.setState({fileList});
            if (onChange) {
                onChange(fileList.map(file => (file.response ? file.response.s3_key : file.name)));
            }
        }
    };

    static getDerivedStateFromProps(props: ImageProps, state: State) {
        if (props.file) {
            const preview = `/image/` + props.file;
            if (state.preview !== preview && state.prevPreview !== preview) {
                return {preview, prevPreview: preview};
            }
        }
        return null;
    }

    render() {
        const {decorator, folder, multiple, maxNum} = this.props;
        const {fileList, showPreview, listPreview, preview, loading} = this.state;
        const props: UploadProps = {
            name: "file",
            action: `/file-uploader/${folder}`,
            listType: "picture-card",
            showUploadList: multiple || false,
        };
        return (
            <>
                <Modal visible={showPreview} footer={null} onCancel={() => this.setState({showPreview: false})}>
                    <img key={listPreview} style={{maxWidth: "100%"}} src={listPreview} />
                </Modal>
                {multiple ? (
                    <MultipleImage {...props} onChangeList={this.onMultipleChange} showUploadList={false} fileList={fileList || []} loading={loading} decorator={decorator} preview={preview} onChange={this.handleChange} handlePreview={this.handlePreview} handleRemove={this.handleRemove} />
                ) : (
                    <SingleUpload {...props} loading={loading} decorator={decorator} preview={preview} onChange={this.handleChange} />
                )}
            </>
        );
    }
}

interface MultipleUploadProps extends UploadProps {
    loading: boolean;
    decorator: (field: ReactNode) => ReactNode;
    preview: string | null;
    fileList: UploadFile[];
    handlePreview: (file: string) => void;
    handleRemove: (index: number) => void;
    onChangeList: (files: UploadFile[]) => void;
}

const MultipleImage = ({decorator, onChange, onChangeList, handlePreview, handleRemove, loading, fileList, ...props}: MultipleUploadProps) => {
    const moveImage = (dragKey: number, hoverKey: number) => {
        const list = fileList.concat();
        const file = list.splice(dragKey, 1);
        list.splice(hoverKey, 0, file[0]);
        onChangeList(list);
    };
    return (
        <div className="form-upload-image">
            <ul className="form-upload-image__list">
                {fileList.map((file, index) => (
                    <WrapNode key={index} index={index} moveTabNode={moveImage}>
                        <li className="form-upload-image__item" key={file.uid}>
                            <div className="ant-upload ant-upload-select ant-upload-select-picture-card">
                                <span className="ant-upload">
                                    <img src={imagePath(file)} alt="" />
                                    <div className="form-upload-image__card-operation">
                                        <a href="javascript:void(0)" onClick={() => handlePreview(imagePath(file))}>
                                            <Icon type="eye" style={{color: "#fff"}} />
                                        </a>
                                        <a href="javascript:void(0)" onClick={() => handleRemove(index)}>
                                            <Icon type="delete" style={{color: "#fff"}} />
                                        </a>
                                    </div>
                                </span>
                            </div>
                        </li>
                    </WrapNode>
                ))}
                <li className="form-upload-image__item" key="add">
                    {decorator(
                        <Upload fileList={fileList} {...props} onChange={onChange}>
                            <div>
                                <Icon type={loading ? "loading" : "plus"} />
                                <div className="ant-upload-text">Upload</div>
                            </div>
                        </Upload>
                    )}
                </li>
            </ul>
        </div>
    );
};

interface SingleUploadProps extends UploadProps {
    loading: boolean;
    decorator: (field: ReactNode) => ReactNode;
    preview: string | null;
}

const SingleUpload = ({decorator, onChange, loading, preview, ...props}: SingleUploadProps) => {
    return (
        <>
            {decorator(
                <Upload {...props} onChange={onChange}>
                    {loading ? (
                        <Icon type="loading" />
                    ) : preview ? (
                        <img src={preview} alt="avatar" />
                    ) : (
                        <div>
                            <Icon type={loading ? "loading" : "plus"} />
                            <div className="ant-upload-text">Upload</div>
                        </div>
                    )}
                </Upload>
            )}
        </>
    );
};

const imagePath = (file: UploadFile): string => {
    const path = file.response ? file.response.s3_key : file.name;
    if (path && !path.startsWith("http")) {
        return "/image/" + path;
    }
    return path;
};

interface DraggableNodeProps {
    key: string | number | null;
    index: number;
    connectDragSource: ConnectDragSource;
    connectDropTarget: ConnectDropTarget;
    moveTabNode: (dragKey: number, hoverKey: number) => void;
    children: ConnectableElement;
}

class DraggableNode extends React.Component<DraggableNodeProps> {
    render() {
        const {connectDragSource, connectDropTarget, children} = this.props;

        return connectDragSource(connectDropTarget(children));
    }
}

const cardTarget: DropTargetSpec<DraggableNodeProps> = {
    drop(props, monitor) {
        const dragKey = monitor.getItem().index;
        const hoverKey = props.index;

        if (dragKey === hoverKey) {
            return;
        }

        props.moveTabNode(dragKey, hoverKey);
        monitor.getItem().index = hoverKey;
    },
};

const cardSource: DragSourceSpec<{index: string | number | null}, {}> = {
    beginDrag(props) {
        return {
            index: props.index,
        };
    },
};

const WrapNode = DropTarget("DND_NODE", cardTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
}))(
    DragSource("DND_NODE", cardSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }))(DraggableNode)
);
