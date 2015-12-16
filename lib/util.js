/**
 * Created by zppro on 15-5-13.
 */

//'use strict';

var crypto = require('crypto');

function setProperty(o,k,v){
    if(typeof(o)==='object'){
        if(o.hasOwnProperty(k)){
            o[k] = v;
        }
    }
}

function setPropertyRecursion(o,k,v){
    if(typeof(o)==='object'){
        if(o.hasOwnProperty(k)){
            o[k] = v;
        }
        else{
            for (var oc in o) {
                setPropertyRecursion(o[oc],k, v);
            }
        }
    }
}

function setPropertyDotExpression(o,k,v){
    if(typeof(o)==='object'){
        if(o.hasOwnProperty(k)){
            o[k] = v;
        }
        else {
            //保证至少一个点
            var arrExpPath = k.split('.');
            if (arrExpPath.length > 1) {
                var obj = o[arrExpPath[0]];
                for (var i = 1; i < arrExpPath.length - 1; i++) {
                    obj = obj[arrExpPath[i]];
                }
                obj[arrExpPath[arrExpPath.length - 1]] = v;
            }
        }
    }
}

//Date相关

function dateDiff(interval, date1, date2) {
    var long = date2.getTime() - date1.getTime(); //相差毫秒
    switch (interval.toLowerCase()) {
        case "y": return parseInt(date2.getFullYear() - date1.getFullYear());
        case "m": return parseInt((date2.getFullYear() - date1.getFullYear()) * 12 + (date2.getMonth() - date1.getMonth()));
        case "d": return parseInt(long / 1000 / 60 / 60 / 24);
        case "w": return parseInt(long / 1000 / 60 / 60 / 24 / 7);
        case "h": return parseInt(long / 1000 / 60 / 60);
        case "n": return parseInt(long / 1000 / 60);
        case "s": return parseInt(long / 1000);
        case "l": return parseInt(long);
    }
}

function dateAdd(interval,number,date){
    switch (interval.toLowerCase()) {
        case "y": return new Date(date.setFullYear(date.getFullYear() + number));
        case "m": return new Date(date.setMonth(date.getMonth() + number));
        case "d": return new Date(date.setDate(date.getDate() + number));
        case "w": return new Date(date.setDate(date.getDate() + 7 * number));
        case "h": return new Date(date.setHours(date.getHours() + number));
        case "n": return new Date(date.setMinutes(date.getMinutes() + number));
        case "s": return new Date(date.setSeconds(date.getSeconds() + number));
        case "l": return new Date(date.setMilliseconds(date.getMilliseconds() + number));
    }
}

Date.prototype.ts = function(timezone){
    return new Date().getTime();
};

//与标准时区相差的小时数 亚洲基本为-
Date.prototype.tz = function(timezone) {
    return new Date().getTimezoneOffset() / 60;
};

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.format = Date.prototype.f = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

//String相关
String.prototype.format = String.prototype.f = function () {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

String.prototype.md5 = function () {
    return crypto.createHash('md5').update(this.toString()).digest('hex');;
};

//
// 给字符串对象添加一个startsWith()方法
//
String.prototype.startsWith = function (substring) {
    var reg = new RegExp('^' + substring);
    return reg.test(this);
};
//
// 给字符串对象添加一个endsWith()方法
//
String.prototype.endsWith = function (substring) {
    var reg = new RegExp(substring + '$');
    return reg.test(this);
};
//
// 删除所有空白字符
//
String.prototype.deleteWhiteSpaces = function () {
    var extraSpace = /[\s\n\r]+/g;
    return this.replace(extraSpace, "");
};


var util = {
    setProperty: setProperty,
    setPropertyRecursion: setPropertyRecursion,
    setPropertyDotExpression: setPropertyDotExpression,
    dateDiff: dateDiff,
    dateAdd: dateAdd
};


module.exports = util;

