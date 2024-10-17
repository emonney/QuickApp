// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

import { Injectable } from '@angular/core';
import { HttpResponseBase, HttpResponse, HttpErrorResponse } from '@angular/common/http';

type HttpMessageSearchOptions = Readonly<{
  searchInCaption?: boolean;
  searchInMessage?: boolean;
  exactMatch?: boolean;
  startsWith?: boolean;
  endsWith?: boolean;
  contains?: boolean;
  resultType?: 'caption' | 'preferMessage' | 'both';
}>;

@Injectable()
export class Utilities {
  public static readonly captionAndMessageSeparator = ':';
  public static readonly noNetworkMessageCaption = 'No Network';
  public static readonly noNetworkMessageDetail = 'The server cannot be reached';
  public static readonly accessDeniedMessageCaption = 'Access Denied!';
  public static readonly accessDeniedMessageDetail = '';
  public static readonly notFoundMessageCaption = 'Not Found';
  public static readonly notFoundMessageDetail = 'The target resource cannot be found';

  public static readonly findHttpResponseMessageDefaultSearchOption: HttpMessageSearchOptions = {
    searchInCaption: true,
    searchInMessage: false,
    exactMatch: true,
    startsWith: false,
    endsWith: false,
    contains: false,
    resultType: 'preferMessage',
  };


  public static cookies =
    {
      getItem: (sKey: string) => {
        return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(sKey)
          .replace(/[-.+*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
      },
      setItem: (sKey: string, sValue: string, vEnd: number | string | Date, sPath: string, sDomain: string, bSecure: boolean) => {
        if (!sKey || /^(?:expires|max-age|path|domain|secure)$/i.test(sKey)) {
          return false;
        }

        let sExpires = '';

        if (vEnd) {
          switch (vEnd.constructor) {
            case Number:
              sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + vEnd;
              break;
            case String:
              sExpires = '; expires=' + vEnd;
              break;
            case Date:
              sExpires = '; expires=' + (vEnd as Date).toUTCString();
              break;
          }
        }

        document.cookie = encodeURIComponent(sKey) + '=' + encodeURIComponent(sValue) + sExpires +
          (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '') + (bSecure ? '; secure' : '');
        return true;
      },
      removeItem: (sKey: string, sPath: string, sDomain: string) => {
        if (!sKey) {
          return false;
        }
        document.cookie = encodeURIComponent(sKey) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' +
          (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '');
        return true;
      },
      hasItem: (sKey: string) => {
        return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(sKey).replace(/[-.+*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
      },
      keys: () => {
        const aKeys = document.cookie.replace(/((?:^|\s*;)[^=]+)(?=;|$)|^\s*|\s*(?:=[^;]*)?(?:$)/g, '').split(/\s*(?:=[^;]*)?;\s*/);
        for (let nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
        return aKeys;
      }
    };

  public static getHttpResponseMessages(data: HttpResponseBase): string[] {
    const responses: string[] = [];

    if (this.checkNoNetwork(data)) {
      responses.push(`${this.noNetworkMessageCaption}${this.captionAndMessageSeparator} ${this.noNetworkMessageDetail}`);
    } else {
      const responseData = this.getResponseData(data);

      if (responseData) {
        if (typeof responseData === 'object') {
          for (const key in responseData) {
            responses.push(`${key}${this.captionAndMessageSeparator} ${responseData[key]}`);
          }
        }
        else {
          responses.push(responseData);
        }
      }
    }

    if (this.checkAccessDenied(data)) {
      responses.splice(0, 0, `${this.accessDeniedMessageCaption}${this.captionAndMessageSeparator} ${this.accessDeniedMessageDetail}`);
    }

    if (this.checkNotFound(data)) {
      let message = `${this.notFoundMessageCaption}${this.captionAndMessageSeparator} ${this.notFoundMessageDetail}`;
      if (data.url) {
        message += `. ${data.url}`;
      }

      responses.splice(0, 0, message);
    }

    if (!responses.length) {
      const response = (data as HttpErrorResponse).message ?? data.statusText;

      if (response)
        responses.push(response);
    }

    return responses;
  }

  public static getHttpResponseMessage(data: HttpResponseBase, ...preferredMessageKeys: string[]): string | null {
    let httpMessage =
      Utilities.findHttpResponseMessage(Utilities.noNetworkMessageCaption, data) ||
      Utilities.findHttpResponseMessage(Utilities.notFoundMessageCaption, data) ||
      Utilities.findHttpResponseMessage('error_description', data);

    if (!httpMessage) {
      for (const msgKey of preferredMessageKeys) {
        httpMessage = Utilities.findHttpResponseMessage(msgKey, data);

        if (httpMessage?.trim() !== '')
          return httpMessage;
      }
    }

    if (!httpMessage) {
      httpMessage = Utilities.findHttpResponseMessage('error', data);
    }

    if (!httpMessage) {
      const responseMessages = Utilities.getHttpResponseMessages(data);

      if (responseMessages.length)
        httpMessage = responseMessages.join('\n');
    }

    return httpMessage;
  }

  public static findHttpResponseMessage(searchString: string, data: HttpResponseBase,
    searchOptions?: HttpMessageSearchOptions): string | null {

    searchString = searchString.toUpperCase();
    searchOptions = { ...this.findHttpResponseMessageDefaultSearchOption, ...searchOptions };

    let result: string | null = null;
    let captionAndMessage = { caption: '', message: null as string | null };
    const httpMessages = this.getHttpResponseMessages(data);

    for (const httpMsg of httpMessages) {
      const splitMsg = Utilities.splitInTwo(httpMsg, this.captionAndMessageSeparator);
      captionAndMessage = { caption: splitMsg.firstPart, message: splitMsg.secondPart ?? null };

      let messageToSearch = '';

      if (searchOptions.searchInCaption && searchOptions.searchInMessage)
        messageToSearch = httpMsg;
      else if (searchOptions.searchInCaption)
        messageToSearch = captionAndMessage.caption;
      else if (searchOptions.searchInMessage)
        messageToSearch = captionAndMessage.message ?? '';

      messageToSearch = messageToSearch.toUpperCase();

      if (searchOptions.exactMatch && messageToSearch === searchString) {
        result = httpMsg;
        break;
      }

      if (searchOptions.startsWith && messageToSearch.startsWith(searchString)) {
        result = httpMsg;
        break;
      }

      if (searchOptions.endsWith && messageToSearch.endsWith(searchString)) {
        result = httpMsg;
        break;
      }

      if (searchOptions.contains && messageToSearch.includes(searchString)) {
        result = httpMsg;
        break;
      }
    }

    if (result && searchOptions.resultType)
      switch (searchOptions.resultType) {
        case 'preferMessage':
          return captionAndMessage.message ?? captionAndMessage.caption;
        case 'caption':
          return captionAndMessage.caption;
        case 'both':
          return result;
      }
    else
      return result;
  }

  public static getResponseData(response: HttpResponseBase) {
    let results;

    if (response instanceof HttpResponse) {
      results = response.body;
    }

    if (response instanceof HttpErrorResponse) {
      results = response.error || response.message || response.statusText;
    }

    return results;
  }

  public static checkNoNetwork(response: HttpResponseBase) {
    if (response instanceof HttpResponseBase) {
      return response.status === 0;
    }

    return false;
  }

  public static checkAccessDenied(response: HttpResponseBase) {
    if (response instanceof HttpResponseBase) {
      return response.status === 403;
    }

    return false;
  }

  public static checkNotFound(response: HttpResponseBase) {
    if (response instanceof HttpResponseBase) {
      return response.status === 404;
    }

    return false;
  }

  public static checkIsLocalHost(url: string, base?: string) {
    if (url) {
      const location = new URL(url, base);
      return location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    }

    return false;
  }

  public static getQueryParamsFromString(paramString: string) {
    const params: Record<string, string | undefined> = {};

    for (const param of paramString.split('&')) {
      const keyValue = Utilities.splitInTwo(param, '=');
      params[keyValue.firstPart] = keyValue.secondPart;
    }

    return params;
  }

  public static splitInTwo(text: string, separator: string, splitFromEnd = false): { firstPart: string, secondPart: string | undefined } {
    let separatorIndex = -1;

    if (separator !== '') {
      if (!splitFromEnd)
        separatorIndex = text.indexOf(separator);
      else
        separatorIndex = text.lastIndexOf(separator);
    }

    if (separatorIndex === -1) {
      return { firstPart: text, secondPart: undefined };
    }

    const part1 = text.substring(0, separatorIndex).trim();
    const part2 = text.substring(separatorIndex + 1).trim();

    return { firstPart: part1, secondPart: part2 };
  }

  public static stringify(value: unknown, depth = 3): string {
    const worker = (value: unknown, depth: number, padding = ''): string => {
      if (value === null || value === undefined) {
        return '';
      }

      if (typeof value === 'object') {
        const objectobject = '[object Object]';

        const result = value.toString();
        if (result !== objectobject)
          return result;

        const keyValuePairs = [];
        let tab = `\n${padding}`;

        for (const key in value) {
          if (Object.prototype.hasOwnProperty.call(value, key)) {
            const keyEntry = value[key as keyof object];

            if (typeof keyEntry !== 'function') {
              const keyValue = depth > 0 ? worker(keyEntry, depth - 1, padding + ' ') : String(keyEntry);
              keyValuePairs.push(`${tab}${key}: ${keyValue === objectobject ? '...' : keyValue}`);
              tab = padding;
            }
          }
        }

        return keyValuePairs.join('\n');
      }

      return String(value);
    }

    return worker(value, depth); //.replace(/^\s+/, '');
  }

  public static JsonTryParse(value: string) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  public static GetObjectWithLoweredPropertyNames<T extends Record<string, unknown>>(obj: T) {
    return Object.keys(obj).reduce((newObj, k) => {
      newObj[k.toLowerCase()] = obj[k];
      return newObj;
    }, {} as Record<string, unknown>) as T;
  }

  public static TestIsObjectEmpty(obj: object) {
    for (const prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }

    return true;
  }

  public static TestIsUndefined(value: unknown) {
    return typeof value === 'undefined';
  }

  public static TestIsString(value: unknown) {
    return typeof value === 'string';
  }

  public static capitalizeFirstLetter(text: string) {
    if (text) {
      return text.charAt(0).toUpperCase() + text.slice(1);
    } else {
      return text;
    }
  }

  public static toTitleCase(text: string) {
    return text.replace(/\w\S*/g, (subString) => {
      return subString.charAt(0).toUpperCase() + subString.substring(1).toLowerCase();
    });
  }

  public static toLowerCase(item: string | string[]) {
    if (Array.isArray(item)) {
      const loweredArray: string[] = [];

      for (let i = 0; i < item.length; i++) {
        loweredArray[i] = item[i].toLowerCase();
      }

      return loweredArray;
    } else {
      return item.toLowerCase();
    }
  }

  public static uniqueId() {
    return this.randomNumber(1000000, 9000000).toString();
  }

  public static randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  public static baseUrl() {
    let base = '';

    if (window.location.origin) {
      base = window.location.origin;
    } else {
      base = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    }

    return base.replace(/\/$/, '');
  }

  public static printDateOnly(date: Date) {
    date = new Date(date);

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dayOfWeek = date.getDay();
    const dayOfMonth = date.getDate();
    let sup = '';
    const month = date.getMonth();
    const year = date.getFullYear();

    if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
      sup = 'st';
    } else if (dayOfMonth === 2 || dayOfMonth === 22) {
      sup = 'nd';
    } else if (dayOfMonth === 3 || dayOfMonth === 23) {
      sup = 'rd';
    } else {
      sup = 'th';
    }

    const dateString = dayNames[dayOfWeek] + ', ' + dayOfMonth + sup + ' ' + monthNames[month] + ' ' + year;

    return dateString;
  }

  public static printTimeOnly(date: Date) {
    date = new Date(date);

    let period = '';
    let minute = date.getMinutes().toString();
    let hour = date.getHours();

    period = hour < 12 ? 'AM' : 'PM';

    if (hour === 0) {
      hour = 12;
    }
    if (hour > 12) {
      hour = hour - 12;
    }

    if (minute.length === 1) {
      minute = '0' + minute;
    }

    const timeString = hour + ':' + minute + ' ' + period;

    return timeString;
  }

  public static printDate(date: Date, separator = 'at') {
    return `${Utilities.printDateOnly(date)} ${separator} ${Utilities.printTimeOnly(date)}`;
  }

  public static printFriendlyDate(date: Date, separator = '-') {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    const test = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (test.toDateString() === today.toDateString()) {
      return `Today ${separator} ${Utilities.printTimeOnly(date)}`;
    }
    if (test.toDateString() === yesterday.toDateString()) {
      return `Yesterday ${separator} ${Utilities.printTimeOnly(date)}`;
    } else {
      return Utilities.printDate(date, separator);
    }
  }

  public static printShortDate(date: Date, separator = '/', dateTimeSeparator = '-') {
    let day = date.getDate().toString();
    let month = (date.getMonth() + 1).toString();
    const year = date.getFullYear();

    if (day.length === 1) {
      day = '0' + day;
    }

    if (month.length === 1) {
      month = '0' + month;
    }

    return `${month}${separator}${day}${separator}${year} ${dateTimeSeparator} ${Utilities.printTimeOnly(date)}`;
  }

  public static parseDate(input: string | number | Date) {
    if (input instanceof Date) {
      return input;
    }

    if (typeof input === 'string') {
      if (input.search(/[a-su-z+]/i) === -1) {
        input = input + 'Z';
      }

      return new Date(input);
    }

    return new Date(input);
  }

  public static printDuration(start: Date, end: Date) {
    start = new Date(start);
    end = new Date(end);

    // get total seconds between the times
    let delta = Math.abs(start.valueOf() - end.valueOf()) / 1000;

    // calculate (and subtract) whole days
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    const seconds = delta % 60;  // in theory the modulus is not required

    let printedDays = '';

    if (days) {
      printedDays = `${days} days`;
    }

    if (hours) {
      printedDays += printedDays ? `, ${hours} hours` : `${hours} hours`;
    }

    if (minutes) {
      printedDays += printedDays ? `, ${minutes} minutes` : `${minutes} minutes`;
    }

    if (seconds) {
      printedDays += printedDays ? ` and ${seconds} seconds` : `${seconds} seconds`;
    }


    if (!printedDays) {
      printedDays = '0';
    }

    return printedDays;
  }

  public static getAge(birthDate: string | number | Date, otherDate: string | number | Date) {
    birthDate = new Date(birthDate);
    otherDate = new Date(otherDate);

    let years = (otherDate.getFullYear() - birthDate.getFullYear());

    if (otherDate.getMonth() < birthDate.getMonth() ||
      otherDate.getMonth() === birthDate.getMonth() && otherDate.getDate() < birthDate.getDate()) {
      years--;
    }

    return years;
  }

  public static searchArray(searchTerm: string, caseSensitive: boolean, ...values: unknown[]) {
    if (!searchTerm) {
      return true;
    }

    let filter = searchTerm.trim();
    let data = values.join();

    if (!caseSensitive) {
      filter = filter.toLowerCase();
      data = data.toLowerCase();
    }

    return data.indexOf(filter) !== -1;
  }

  public static moveArrayItem(array: unknown[], oldIndex: number, newIndex: number) {
    if (oldIndex < 0) {
      return;
    }

    if (newIndex < 0) {
      newIndex += array.length;
    }

    if (newIndex >= array.length) {
      let k = newIndex - array.length;
      while ((k--) + 1) {
        array.push(undefined);
      }
    }

    array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
  }

  public static expandCamelCase(text: string) {
    if (!text) {
      return text;
    }

    return text.replace(/([A-Z][a-z]+)/g, ' $1')
      .replace(/([A-Z][A-Z]+)/g, ' $1')
      .replace(/([^A-Za-z ]+)/g, ' $1');
  }

  public static testIsAbsoluteUrl(url: string) {
    const r = new RegExp('^(?:[a-z]+:)?//', 'i');
    return r.test(url);
  }

  public static convertToAbsoluteUrl(url: string) {
    return Utilities.testIsAbsoluteUrl(url) ? url : '//' + url;
  }

  public static removeNulls<T extends object | unknown[]>(item: T) {
    const isArray = Array.isArray(item);

    for (const k in item) {
      if (Object.prototype.hasOwnProperty.call(item, k)) {
        const propertyValue = item[k as keyof typeof item];

        if (propertyValue === null) {
          if (isArray)
            item.splice(+k, 1)
          else
            delete item[k as keyof typeof item];
        } else if (typeof propertyValue === 'object') {
          Utilities.removeNulls(propertyValue);
        }

        if (isArray && item.length === +k) {
          Utilities.removeNulls(item);
        }
      }
    }

    return item;
  }

  public static debounce(fn: (...params: unknown[]) => unknown, delay: number, immediate?: boolean) {
    let timer: ReturnType<typeof setTimeout> | undefined;

    return function (this: unknown, ...args: unknown[]) {
      if (timer === undefined && immediate) {
        fn.apply(this, args);
      }

      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
      return timer;
    }
  }
}
