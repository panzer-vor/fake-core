import moment from "moment";
export enum DateFormat {
    FULL_DATE = "YYYY-MM-DD HH:mm:ss",
    DATE = "YYYY-MM-DD",
    TIME = "HH:mm:ss",
    HOUR_MINUTE = "HH:mm",
    DATE_HOUR_MINUTE = "YYYY-MM-DD HH:mm",
    DATE_UTC = "MM/DD/YYYY",
}

export const fullDate = (date: Date | string) => formatDate(date);
export const getDate = (date: Date | string) => formatDate(date, DateFormat.DATE);
export const getTime = (date: Date | string) => formatDate(date, DateFormat.TIME);
export const getHourMinute = (date: Date | string) => formatDate(date, DateFormat.HOUR_MINUTE);
export const getDateHourMinute = (date: Date | string) => formatDate(date, DateFormat.DATE_HOUR_MINUTE);

export const formatDate = (date: Date | string, format: string = DateFormat.FULL_DATE) =>
    moment(date)
        .local()
        .format(format);

export const toUpperFirst = (str: string): string => str.toLowerCase().replace(/^\S/, v => v.toUpperCase());
export const getUTCDateTime = (date: Date | string) => {
    return date.toLocaleString("en-US", {year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", hour12: true}).replace(/,/, " ");
};
export const getUTCDate = (date: Date | string) => {
    return date.toLocaleString("en-US", {year: "numeric", month: "numeric", day: "numeric"}).replace(/,/, " ");
};
export const getUTCTime = (date: Date | null) => {
    return date ? date.toLocaleTimeString("en-US", {hour: "numeric", minute: "numeric", hour12: true}) : "";
};
export const decreaseHour = (data: Date, decreaseNumber: number) => {
    return new Date(data.getTime() - decreaseNumber * 60 * 60 * 1000);
};
export const increaseHour = (data: Date, increaseNumber: number) => {
    return new Date(data.getTime() + increaseNumber * 60 * 60 * 1000);
};

export const formatOrderTimeOption = {
    "12:00": "Lunch Time (10:00 - 14:00)",
    "18:00": "Dinner Time(16:00 - 20:00)",
};

export const formatNumber = (target: any, fractionDigits: number = 2) => {
    const temp = Number(target);
    if (!temp) {
        return target;
    }
    return Math.round(temp * 10 ** fractionDigits) / 10 ** fractionDigits;
};

export const genTimeId = (str: string = "") => {
    const now = new Date();
    const add0 = (con: string | number) => (con.toString().length === 1 ? `0${con}` : con);
    return `${add0(now.getUTCMonth() + 1)}${add0(now.getUTCDate())}${add0(now.getUTCHours())}${add0(now.getUTCMinutes())}${add0(now.getUTCSeconds())}-${str}`;
};

export const genMapInfoRow = (key: string, value: any, isBr: boolean = false) => {
    return `<div>${key}: <strong style="font-weight:700;color:#000">${value}</strong></div>` + (isBr ? "<br/>" : "");
};

/**
 * Get timeStamp in minute
 * @param timeStr eg: 16:09
 */
export const getSPTime = (timeStr: string) => {
    const spTimeReg = /^\d{1,2}:\d{1,2}$/;
    const spTimeReg2 = /^\d{1,2}:\d{1,2}:\d{1,2}/;
    if (spTimeReg.test(timeStr)) {
        const temp = timeStr.split(":");
        return +temp[0] * 60 + +temp[1];
    }
    if (spTimeReg2.test(timeStr)) {
        const temp = timeStr.split(":");
        return +temp[0] * 60 + +temp[1] + +temp[2] / 60;
    }
    return NaN;
};
