// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';


@Injectable()
export class Utilities {

    public static readonly captionAndMessageSeparator = ":";
    public static readonly noNetworkMessageCaption = "No Network";
    public static readonly noNetworkMessageDetail = "The server cannot be reached";
    public static readonly accessDeniedMessageCaption = "Access Denied!";
    public static readonly accessDeniedMessageDetail = "";

    public static getHttpResponseMessage(data: Response | any): string[] {

        let responses: string[] = [];

        if (data instanceof Response) {

            if (this.checkNoNetwork(data)) {
                responses.push(`${this.noNetworkMessageCaption}${this.captionAndMessageSeparator} ${this.noNetworkMessageDetail}`);
            }
            else {
                try {
                    let responseObject = data.json();

                    if (typeof responseObject === 'object' || responseObject instanceof Object) {

                        for (let key in responseObject) {
                            if (key)
                                responses.push(`${key}${this.captionAndMessageSeparator} ${responseObject[key]}`);
                            else if (responseObject[key])
                                responses.push(responseObject[key].toString());
                        }
                    }
                }
                catch (error) {
                }
            }

            if (!responses.length && data.text())
                responses.push(`${data.statusText}: ${data.text()}`);
        }

        if (!responses.length)
            responses.push(data.toString());

        if (this.checkAccessDenied(data))
            responses.splice(0, 0, `${this.accessDeniedMessageCaption}${this.captionAndMessageSeparator} ${this.accessDeniedMessageDetail}`);


        return responses;
    }


    public static findHttpResponseMessage(messageToFind: string, data: Response | any, seachInCaptionOnly = true, includeCaptionInResult = false): string {

        let searchString = messageToFind.toLowerCase();
        let httpMessages = this.getHttpResponseMessage(data);

        for (let message of httpMessages) {
            let fullMessage = Utilities.splitInTwo(message, this.captionAndMessageSeparator);

            if (fullMessage.firstPart && fullMessage.firstPart.toLowerCase().indexOf(searchString) != -1) {
                return includeCaptionInResult ? message : fullMessage.secondPart || fullMessage.firstPart;
            }
        }

        if (!seachInCaptionOnly) {
            for (let message of httpMessages) {

                if (message.toLowerCase().indexOf(searchString) != -1) {
                    if (includeCaptionInResult) {
                        return message;
                    }
                    else {
                        let fullMessage = Utilities.splitInTwo(message, this.captionAndMessageSeparator);
                        return fullMessage.secondPart || fullMessage.firstPart;
                    }
                }
            }
        }

        return null;
    }


    public static checkNoNetwork(response: Response) {
        if (response instanceof Response) {
            return response.status == 0;
        }

        return false;
    }

    public static checkAccessDenied(response: Response) {
        if (response instanceof Response) {
            return response.status == 403;
        }

        return false;
    }

    public static checkNotFound(response: Response) {
        if (response instanceof Response) {
            return response.status == 404;
        }

        return false;
    }

    public static checkIsLocalHost(url: string, base?: string) {
        if (url) {
            let location = new URL(url, base);
            return location.hostname === "localhost" || location.hostname === "127.0.0.1";
        }

        return false;
    }



    public static getQueryParamsFromString(paramString: string) {

        if (!paramString)
            return null;

        let params: { [key: string]: string } = {};

        for (let param of paramString.split("&")) {
            let keyValue = Utilities.splitInTwo(param, "=");
            params[keyValue.firstPart] = keyValue.secondPart;
        }

        return params;
    }


    public static splitInTwo(text: string, separator: string): { firstPart: string, secondPart: string } {
        let separatorIndex = text.indexOf(separator);

        if (separatorIndex == -1)
            return { firstPart: text, secondPart: null };

        let part1 = text.substr(0, separatorIndex).trim();
        let part2 = text.substr(separatorIndex + 1).trim();

        return { firstPart: part1, secondPart: part2 };
    }


    public static safeStringify(object) {

        let result: string;

        try {
            result = JSON.stringify(object);
            return result;
        }
        catch (error) {

        }

        let simpleObject = {};

        for (let prop in object) {
            if (!object.hasOwnProperty(prop)) {
                continue;
            }
            if (typeof (object[prop]) == 'object') {
                continue;
            }
            if (typeof (object[prop]) == 'function') {
                continue;
            }
            simpleObject[prop] = object[prop];
        }

        result = "[***Sanitized Object***]: " + JSON.stringify(simpleObject);

        return result;
    }


    public static JSonTryParse(value: string) {
        try {
            return JSON.parse(value);
        }
        catch (e) {
            if (value === "undefined")
                return void 0;

            return value;
        }
    }


    public static TestIsUndefined(value: any) {
        return typeof value === 'undefined';
        //return value === undefined;
    }


    public static TestIsString(value: any) {
        return typeof value === 'string' || value instanceof String;
    }



    public static capitalizeFirstLetter(text: string) {
        if (text)
            return text.charAt(0).toUpperCase() + text.slice(1);
        else
            return text;
    }


    public static toTitleCase(text: string) {
        return text.replace(/\w\S*/g, (subString) => {
            return subString.charAt(0).toUpperCase() + subString.substr(1).toLowerCase();
        });
    }


    public static toLowerCase(items: string)
    public static toLowerCase(items: string[])
    public static toLowerCase(items: any): string | string[] {

        if (items instanceof Array) {
            let loweredRoles: string[] = [];

            for (let i = 0; i < items.length; i++) {
                loweredRoles[i] = items[i].toLowerCase();
            }

            return loweredRoles;
        }
        else if (typeof items === 'string' || items instanceof String) {
            return items.toLowerCase();
        }
    }


    public static uniqueId() {
        return this.randomNumber(1000000, 9000000).toString();
    }


    public static randomNumber(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }


    public static baseUrl() {
        if (window.location.origin)
            return window.location.origin

        return window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    }


    public static printDateOnly(date: Date) {

        date = new Date(date);

        let dayNames = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
        let monthNames = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

        let dayOfWeek = date.getDay();
        let dayOfMonth = date.getDate();
        let sup = "";
        let month = date.getMonth();
        let year = date.getFullYear();

        if (dayOfMonth == 1 || dayOfMonth == 21 || dayOfMonth == 31) {
            sup = "st";
        }
        else if (dayOfMonth == 2 || dayOfMonth == 22) {
            sup = "nd";
        }
        else if (dayOfMonth == 3 || dayOfMonth == 23) {
            sup = "rd";
        }
        else {
            sup = "th";
        }

        let dateString = dayNames[dayOfWeek] + ", " + dayOfMonth + sup + " " + monthNames[month] + " " + year;

        return dateString;
    }

    public static printTimeOnly(date: Date) {

        date = new Date(date);

        let period = "";
        let minute = date.getMinutes().toString();
        let hour = date.getHours();

        period = hour < 12 ? "AM" : "PM";

        if (hour == 0) {
            hour = 12;
        }
        if (hour > 12) {
            hour = hour - 12;
        }

        if (minute.length == 1) {
            minute = "0" + minute;
        }

        let timeString = hour + ":" + minute + " " + period;


        return timeString;
    }

    public static printDate(date: Date, separator = "at") {
        return `${Utilities.printDateOnly(date)} ${separator} ${Utilities.printTimeOnly(date)}`;
    }


    public static printFriendlyDate(date: Date, separator = "-") {
        let today = new Date(); today.setHours(0, 0, 0, 0);
        let yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
        let test = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        if (test.toDateString() == today.toDateString())
            return `Today ${separator} ${Utilities.printTimeOnly(date)}`;
        if (test.toDateString() == yesterday.toDateString())
            return `Yesterday ${separator} ${Utilities.printTimeOnly(date)}`;
        else
            return Utilities.printDate(date, separator);
    }

    public static printShortDate(date: Date, separator = "/", dateTimeSeparator = "-") {

        var day = date.getDate().toString();
        var month = (date.getMonth() + 1).toString();
        var year = date.getFullYear();

        if (day.length == 1)
            day = "0" + day;

        if (month.length == 1)
            month = "0" + month;

        return `${month}${separator}${day}${separator}${year} ${dateTimeSeparator} ${Utilities.printTimeOnly(date)}`;
    }


    public static parseDate(date) {

        if (date) {

            if (date instanceof Date) {
                return date;
            }

            if (typeof date === 'string' || date instanceof String) {
                if (date.search(/[a-su-z+]/i) == -1)
                    date = date + "Z";

                return new Date(date);
            }

            if (typeof date === 'number' || date instanceof Number) {
                return new Date(<any>date);
            }
        }
    }



    public static printDuration(start: Date, end: Date) {

        start = new Date(start);
        end = new Date(end);

        // get total seconds between the times
        let delta = Math.abs(start.valueOf() - end.valueOf()) / 1000;

        // calculate (and subtract) whole days
        let days = Math.floor(delta / 86400);
        delta -= days * 86400;

        // calculate (and subtract) whole hours
        let hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;

        // calculate (and subtract) whole minutes
        let minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;

        // what's left is seconds
        let seconds = delta % 60;  // in theory the modulus is not required


        let printedDays = "";

        if (days)
            printedDays = `${days} days`;

        if (hours)
            printedDays += printedDays ? `, ${hours} hours` : `${hours} hours`;

        if (minutes)
            printedDays += printedDays ? `, ${minutes} minutes` : `${minutes} minutes`;

        if (seconds)
            printedDays += printedDays ? ` and ${seconds} seconds` : `${seconds} seconds`;


        if (!printedDays)
            printedDays = "0";

        return printedDays;
    }


    public static getAge(birthDate, otherDate) {
        birthDate = new Date(birthDate);
        otherDate = new Date(otherDate);

        let years = (otherDate.getFullYear() - birthDate.getFullYear());

        if (otherDate.getMonth() < birthDate.getMonth() ||
            otherDate.getMonth() == birthDate.getMonth() && otherDate.getDate() < birthDate.getDate()) {
            years--;
        }

        return years;
    }




    public static searchArray(searchTerm: string, caseSensitive: boolean, ...values: any[]) {

        if (!searchTerm)
            return true;


        if (!caseSensitive)
            searchTerm = searchTerm.toLowerCase();

        for (let value of values) {

            if (value != null) {
                let strValue = value.toString();

                if (!caseSensitive)
                    strValue = strValue.toLowerCase();

                if (strValue.indexOf(searchTerm) !== -1)
                    return true;
            }
        }

        return false;
    }


    public static expandCamelCase(text: string) {

        if (!text)
            return text;

        return text.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => {
            return str.toUpperCase();
        })
    }


    public static testIsAbsoluteUrl(url: string) {

        let r = new RegExp('^(?:[a-z]+:)?//', 'i');
        return r.test(url);
    }


    public static convertToAbsoluteUrl(url: string) {

        return Utilities.testIsAbsoluteUrl(url) ? url : '//' + url;
    }



    public static removeNulls(obj) {
        let isArray = obj instanceof Array;

        for (let k in obj) {
            if (obj[k] === null) {
                isArray ? obj.splice(k, 1) : delete obj[k];
            }
            else if (typeof obj[k] == "object") {
                Utilities.removeNulls(obj[k]);
            }

            if (isArray && obj.length == k) {
                Utilities.removeNulls(obj);
            }
        }

        return obj;
    }


    public static debounce(func: (...args) => any, wait: number, immediate?: boolean) {
        var timeout;

        return function () {
            var context = this;
            var args_ = arguments;

            var later = function () {
                timeout = null;
                if (!immediate)
                    func.apply(context, args_);
            };

            var callNow = immediate && !timeout;

            clearTimeout(timeout);
            timeout = setTimeout(later, wait);

            if (callNow)
                func.apply(context, args_);
        };
    }



    public static cookies = {
        getItem: (sKey) => {
            return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
        },
        setItem: (sKey, sValue, vEnd, sPath, sDomain, bSecure) => {
            if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
                return false;
            }

            var sExpires = "";

            if (vEnd) {
                switch (vEnd.constructor) {
                    case Number:
                        sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                        break;
                    case String:
                        sExpires = "; expires=" + vEnd;
                        break;
                    case Date:
                        sExpires = "; expires=" + vEnd.toUTCString();
                        break;
                }
            }

            document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
            return true;
        },
        removeItem: (sKey, sPath, sDomain) => {
            if (!sKey) {
                return false;
            }
            document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
            return true;
        },
        hasItem: (sKey) => {
            return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
        },
        keys: () => {
            var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
            for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
            return aKeys;
        }
    }
}