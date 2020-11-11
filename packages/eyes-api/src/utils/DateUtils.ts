'use strict'

import * as dateFormat from 'dateformat';

enum DateFormats {
    DATE_FORMAT_ISO8601 = "yyyy-mm-dd'T'HH:MM:ss'Z'",
    DATE_FORMAT_RFC1123 = "ddd, dd mmm yyyy HH:MM:ss 'GMT'",
    DATE_FORMAT_LOGFILE = "yyyy_mm_dd__HH_MM_ss_l"
}

export function toISO8601DateTime(date: Date = new Date()): string {
    return dateFormat(date, DateFormats.DATE_FORMAT_ISO8601, true);
}

export function toRfc1123DateTime(date: Date = new Date()): string {
    return dateFormat(date, DateFormats.DATE_FORMAT_RFC1123, true);
}

export function toLogFileDateTime(date: Date = new Date(), utc: boolean = false): string {
    return dateFormat(date, DateFormats.DATE_FORMAT_LOGFILE, utc);
}

export function fromISO8601DateTime(dateTime: string): Date {
    return new Date(dateTime);
}
