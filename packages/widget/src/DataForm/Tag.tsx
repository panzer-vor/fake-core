import React, {Component, ReactNode, ChangeEventHandler, ChangeEvent} from "react";
import {Icon, Tag, message, Input} from "antd";
import {TweenOneGroup} from "rc-tween-one";

interface ImageProps {
    decorator: (field: ReactNode) => ReactNode;
    tags: string[];
    onChange: (tags: string[]) => void;
}

interface State {
    inputVisible: boolean;
    inputValue: string;
    tags: string[];
}

export class TagList extends Component<ImageProps, State> {
    input: any = undefined;
    state = {
        inputVisible: false,
        inputValue: "",
        input: null,
        tags: this.props.tags,
    };

    handleAdd = () => {
        const {onChange} = this.props;
        const {tags, inputValue} = this.state;
        if (inputValue) {
            if (tags.indexOf(inputValue) >= 0) {
                message.warn(`Tag ${inputValue} is exist`);
            } else {
                tags.push(inputValue);
            }
        }
        this.setState({inputVisible: false, inputValue: "", tags}, () => {
            onChange(tags);
        });
    };

    handleClose = (tag: string) => {
        const {onChange} = this.props;
        const {tags} = this.state;
        const index = tags.indexOf(tag);
        if (index || index === 0) {
            tags.splice(index, 1);
            this.setState({tags}, () => {
                onChange(tags);
            });
        }
        this.setState({inputVisible: false, inputValue: ""});
    };

    showInput = () => {
        this.setState({inputVisible: true}, () => this.input.focus());
    };

    handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({inputValue: e.target.value});
    };

    saveInputRef = (input: any) => (this.input = input);

    render() {
        const {decorator} = this.props;
        const {tags, inputVisible, inputValue} = this.state;
        return decorator(
            <div>
                <div style={{display: "inline-block"}}>
                    <TweenOneGroup
                        enter={{
                            scale: 0.8,
                            opacity: 0,
                            type: "from",
                            duration: 200,
                        }}
                        leave={{opacity: 0, width: 0, scale: 0, duration: 200}}
                        appear={false}
                    >
                        {tags.map(tag => (
                            <span key={tag} style={{display: "inline-block"}}>
                                <Tag
                                    key={tag}
                                    closable
                                    onClose={() => {
                                        this.handleClose(tag);
                                    }}
                                >
                                    {tag}
                                </Tag>
                            </span>
                        ))}
                    </TweenOneGroup>
                </div>
                {inputVisible && (
                    <span style={{display: "inline-block"}}>
                        <Input ref={this.saveInputRef} type="text" size="small" style={{width: 78}} value={inputValue} onChange={this.handleInputChange} onBlur={this.handleAdd} onPressEnter={this.handleAdd} />
                    </span>
                )}
                {!inputVisible && (
                    <span style={{display: "inline-block"}}>
                        <Tag onClick={this.showInput} style={{background: "#fff", borderStyle: "dashed"}}>
                            <Icon type="plus" /> New Tag
                        </Tag>
                    </span>
                )}
            </div>
        );
    }
}
