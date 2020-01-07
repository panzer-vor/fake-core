import React, {useState, useCallback} from "react";
import {Select, Input} from "antd";

const {Option} = Select;

const ACTIVE_COLOR = "#605E5C";
const INACTIVE_COLOR = "#BEBBB8";

interface Props {
    onChange?: (page: number, pageSize: number) => void;
    total?: number;
    current?: number;
    pageSize?: number;
    changeStyle?: number;
}

export const Pagination = ({total = 1, current = 1, pageSize = 10, onChange = () => null, changeStyle = 20}: Props) => {
    const totalPage = Math.ceil((total || 1) / pageSize);

    const [inputValue, setInputValue] = useState("1");

    const setCurrentPage = (currentPage: number) => {
        setInputValue("" + currentPage);
        if (currentPage !== current) {
            onChange(currentPage, pageSize);
        }
    };

    const pageChange = useCallback((page: number) => () => (page > 0 ? setCurrentPage(Math.min(current + page, totalPage)) : setCurrentPage(Math.max(current + page, 1))), [totalPage]);

    const prevColor = current <= 1 ? INACTIVE_COLOR : ACTIVE_COLOR;
    const nextColor = current >= totalPage ? INACTIVE_COLOR : ACTIVE_COLOR;

    const inputEnter = () => {
        const value = Number(inputValue);
        if (Number.isNaN(value)) {
            setInputValue("");
        } else if (value < 0) {
            setCurrentPage(1);
        } else if (value > totalPage) {
            setCurrentPage(totalPage);
        } else {
            setCurrentPage(value);
        }
    };

    return (
        <ul style={{display: "flex", alignItems: "center", paddingLeft: 0, paddingTop: "38px", borderTop: "1px solid #f3f2f1"}}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: "20px", cursor: "pointer"}} onClick={pageChange(-totalPage)}>
                <path d="M16 0.710938L8.71094 8L16 15.2891L15.2891 16L7.28906 8L15.2891 0L16 0.710938ZM9 0.710938L1.71094 8L9 15.2891L8.28906 16L0.289062 8L8.28906 0L9 0.710938Z" fill={prevColor} />
            </svg>
            <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: "12px", cursor: "pointer"}} onClick={pageChange(-1)}>
                <path d="M8.27344 15.9766L0.289062 8L8.27344 0.0234375L8.97656 0.726562L1.71094 8L8.97656 15.2734L8.27344 15.9766Z" fill={prevColor} />
            </svg>
            {totalPage < changeStyle ? (
                <Select value={current} style={{width: "70px", marginRight: "8px"}} onChange={(val: number) => onChange(val, pageSize)}>
                    {Array.from({length: totalPage}, (v, i) => i + 1).map((v: number) => (
                        <Option value={v} key={`pages${v}`}>
                            {v}
                        </Option>
                    ))}
                </Select>
            ) : (
                <Input style={{width: "70px", marginRight: "8px"}} onPressEnter={inputEnter} value={inputValue} onBlur={inputEnter} onChange={event => setInputValue(event.currentTarget.value)} />
            )}

            <span style={{marginRight: "16px"}}>of {totalPage || 1}</span>
            <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: "20px", cursor: "pointer"}} onClick={pageChange(1)}>
                <path d="M0.0234375 15.2734L7.28906 8L0.0234375 0.726562L0.726562 0.0234375L8.71094 8L0.726562 15.9766L0.0234375 15.2734Z" fill={nextColor} />
            </svg>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{cursor: "pointer"}} onClick={pageChange(total)}>
                <path d="M0.710938 0L8.71094 8L0.710938 16L0 15.2891L7.28906 8L0 0.710938L0.710938 0ZM7.71094 0L15.7109 8L7.71094 16L7 15.2891L14.2891 8L7 0.710938L7.71094 0Z" fill={nextColor} />
            </svg>
        </ul>
    );
};
