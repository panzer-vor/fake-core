import React from "react";
import {Table} from "antd";
import {DragSource, DropTarget} from "react-dnd";
import {TableProps} from "antd/lib/table/interface";

let dragingIndex = -1;

interface Props extends TableProps<any> {}

class BodyRow extends React.Component<any> {
    render() {
        const {isOver, connectDragSource, connectDropTarget, moveRow, ...restProps} = this.props;
        const style = {...restProps.style, cursor: "move"};

        let {className} = restProps;
        if (isOver) {
            if (restProps.index > dragingIndex) {
                className += " drop-over-downward";
            }
            if (restProps.index < dragingIndex) {
                className += " drop-over-upward";
            }
        }

        return connectDragSource(connectDropTarget(<tr {...restProps} className={className} style={style} />));
    }
}

const rowTarget = {
    drop(props: any, monitor: any) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }

        // Time to actually perform the action
        props.moveRow(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    },
};

const rowSource = {
    beginDrag(props: any) {
        dragingIndex = props.index;
        return {
            index: props.index,
        };
    },
};

const DragableBodyRow = DropTarget("row", rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
}))(
    DragSource("row", rowSource, connect => ({
        connectDragSource: connect.dragSource(),
    }))(BodyRow)
);

export class DragableTable extends React.Component<Props> {
    components = {
        body: {
            row: DragableBodyRow,
        },
    };
    render() {
        return <Table components={this.components} {...this.props} />;
    }
}
