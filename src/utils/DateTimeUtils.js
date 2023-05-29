import { Languages } from "../Languages";

/** Get current date as Json datetime */
export function getCurrentDateAsJson() {
    let newDate = new Date();
    return newDate.toJSON();
}

/** Get current date */
export function getCurrentDate() {
    const date = new Date();
    //set default date to current date
    return date.toLocaleDateString('en-CA');
}

/** Get current time */
export function getCurrentTime() {
    const date = new Date();
    return date.toTimeString().split(' ')[0];
}

/** Get only time part from Json datetime */
export function getJsonAsTimeString(json, language) {
    return getTimeStringFromJson(json, language);
}

/** Get only date part from Json datetime */
export function getJsonAsDateString(json, language) {
    return getDateStringFromJson(json, language);
}

/** Get both date and time parts from Json datetime */
export function getJsonAsDateTimeString(json, language) {
    return getDateTimeStringFromJson(json, language);
}

/** Add date and time together and convert to Json ISO format */
export function convertDateAndTimeToJson(date, time) {

    console.log("convertDateAndTimeToJson, date", date);

    const myDate = new Date(date);
    var dateString = getDateStringFromDate(myDate);

    console.log("dateString", dateString);

    var timeString = "";
    if (!isEmptyOrUndefined(time)) {
        const timeTemp = new Date(time);
        timeString = timeTemp.getHours() + ':' + timeTemp.getMinutes() + ':00';
    } else {
        timeString = "00:00:00";
    }

    console.log("timestring", timeString);

    var combined = new Date(dateString + ' ' + timeString);

    var iso = combined.toISOString();

    return iso;
}

function getTimeStringFromJson(json, language = Languages.EN) {
    if (isEmptyOrUndefined(json)) {
        return "";
    }
    const myDate = new Date(json);
    const hour = myDate.getHours();
    const minute = myDate.getMinutes();
    const second = myDate.getSeconds();
    const seconds = String(second).padStart(2, '0');
    const minutes = String(minute).padStart(2, '0');
    switch (language) {
        case Languages.EN:
            return `${hour}:${minutes}:${seconds}`;
        case Languages.FI:
            return `klo ${hour}.${minutes}.${seconds}`;
        default:
            return "";
    }
}

function getDateStringFromJson(json, language = Languages.EN) {
    if (isEmptyOrUndefined(json)) {
        return "";
    }
    const myDate = new Date(json);
    return getDateStringFromDate(myDate, language);
}

function getDateStringFromDate(myDate, language) {
    const date = myDate.getDate();
    const month = myDate.getMonth() + 1;
    const year = myDate.getFullYear();

    switch (language) {
        case Languages.EN:
            return `${year}-${month < 10 ? `0${month}` : `${month}`}-${date < 10 ? `0${date}` : `${date}`}`;
        case Languages.FI:
            return `${date}.${month}.${year}`;
        default:
            return "";
    }
}

function getDateTimeStringFromJson(json, language = Languages.EN) {
    if (isEmptyOrUndefined(json)) {
        return "";
    }
    const dateStr = getDateStringFromJson(json, language);
    const timeString = getTimeStringFromJson(json, language);
    return `${dateStr} ${timeString}`;
}

function isEmptyOrUndefined(json) {
    if (json === "" || json === undefined) {
        return true;
    }
    return false;
}