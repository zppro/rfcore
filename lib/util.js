/**
 * Created by zppro on 15-5-13.
 */

//'use strict';

var crypto = require('crypto');
var fs = require('fs-extra');
var path = require('path');
var through2 = require('through2');
var _ = require('underscore');
// var isNumber = require('util').isNumber;

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

//
//返回随机数
//len 长度
//
function randomN(len) {
    return Math.random().toString().substr(2,len);
}

function randomS(len) {
    return crypto.randomBytes(len).toString('hex').substr(0, len);
}

function paddingStr(str,paddingStr,paddingCount,isRightSide) {
    if (!str || !paddingStr || !paddingCount || !isNumber(paddingCount))
        return str;
    var paddingContent = '';
    for (var i = 0; i < paddingCount; i++) {
        paddingContent += paddingStr;
    }
    return isRightSide ? str + paddingContent : paddingContent + str;

}

function readDictionaryStructure(dir,exts) {
    dir = path.normalize(dir);
    if(dir.endsWith('/')) {
        dir = dir.substr(0, dir.length - 1);
    }
    var filter = through2.obj(function (item, enc, next) {
        if (dir != item.path) {
            if (!exts) {
                this.push(item);
            }
            else {
                if (!_.isArray(exts)) {
                    exts = [exts];
                }

                if (_.contains(exts, path.extname(item.path))) {
                    this.push(item);
                }
            }
        }
        next()
    });

    return _transformObject(dir, filter);
}


function readDirectoryStructure(dir,exts, options) {
    dir = path.normalize(dir);
    if (dir.endsWith('/')) {
        dir = dir.substr(0, dir.length - 1);
    }
    options = options || {};
    var filter = through2.obj(function (item, enc, next) {
        if (dir != item.path) {
            if (!exts) {
                this.push(item);
            }
            else {
                if (!_.isArray(exts)) {
                    exts = [exts];
                }

                if (_.contains(exts, path.extname(item.path))) {
                    this.push(item);
                }
            }
        }
        next()
    });

    return options.format === 'tree' ? _transformTree(dir, filter) : _transformObject(dir, filter);
}

function _transformTree(dir, filter) {
    var promise  = _transformObject(dir,filter).then(function(ret){
        var fileKeys = ['name', 'relative_name', 'path', 'relative_path'];
        var treeNodes = [], dirNode, children;
        for(var key in ret) {
            if (ret.hasOwnProperty(key)) {
                if (!_.contains(fileKeys, key) && _.isObject(ret[key])) {
                    dirNode = {_id: ret[key].relative_path || key, name: key};
                    children = _parseChildren(ret[key], fileKeys);
                    if(children && children.length > 0) {
                        dirNode.children = children;
                    }
                    treeNodes.push(dirNode)
                }
            }
        }

        return treeNodes;
    });
    return promise;
}

function _parseChildren(obj, fileKeys) {
    var treeNodes = [], dirNode, children;
    for(var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (!_.contains(fileKeys, key) && _.isObject(obj[key])) {
                dirNode = {_id: obj[key].relative_path || key, name: key};
                children = _parseChildren(obj[key], fileKeys);
                if (children && children.length > 0) {
                    dirNode.children = children;
                }
                treeNodes.push(dirNode)
            }
        }
    }
    return treeNodes;
}

function _transformObject(dir, filter) {
    var promise = new Promise(resolve=> {
            var ret = {};
            fs.walk(dir)
                .pipe(filter)
                .on('data', function (item) {
                    var baseName = path.basename(item.path);
                    if (item.stats.isDirectory()) {
                        ret[baseName] = {};
                    }
                    else {
                        var relativeDirs = item.path.replace(dir + '/', '').split('/');
                        relativeDirs.splice(relativeDirs.length - 1, 1);
                        var dirLength = relativeDirs.length;
                        var parent = ret;
                        for (var i = 0; i < dirLength; i++) {
                            parent[relativeDirs[i]] = parent[relativeDirs[i]] || {};
                            parent = parent[relativeDirs[i]];
                        }
                        var extName = path.extname(item.path);
                        var noExtBaseName = path.basename(item.path, extName);
                        var key = noExtBaseName + extName

                        parent[key] = {
                            name: key,
                            relative_name: relativeDirs.join('_') + '_' + noExtBaseName,
                            path: item.path,
                            relative_path: relativeDirs.join('/') + '/' + baseName
                        };
                    }
                })
                .on('end', function () {
                    resolve(ret);
                });
        }
    );
    return promise;
}

function chunkArrayRange (arr, range) {
    var result = [], start, end;
    // console.log('total arr length:', arr.length);
    for (var x = 0; x < arr.length; x = x+range) {
        start = result.length * range;
        end = (start + range) < arr.length ? (start + range) : arr.length + 1;
        // console.log('chunkArrayRange:', start, end);
        result.push(arr.slice(start, end));
    }
    return result;
}

function chunkArraySize (arr, size) {
    var result = [], start, end;
    for (var x = 0; x < Math.ceil(arr.length / size); x++) {
        start = x * size;
        end = start + size;
        result.push(arr.slice(start, end));
    }
    return result;
}


function getPropertyCount(o){
    var n, count = 0;
    for(n in o){
        if(o.hasOwnProperty(n)){
            count++;
        }
    }
    return count;
}


function unflatten(data) {
    "use strict";
    if (Object(data) !== data || Array.isArray(data))
        return data;
    var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
        resultholder = {};
    for (var p in data) {
        var cur = resultholder,
            prop = "",
            m;
        while (m = regex.exec(p)) {
            cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
            prop = m[2] || m[1];
        }
        cur[prop] = data[p];
    }
    return resultholder[""] || resultholder;
};
function flatten (data) {
    var result = {};
    function recurse (cur, prop) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
            for(var i=0, l=cur.length; i<l; i++)
                recurse(cur[i], prop + "[" + i + "]");
            if (l == 0)
                result[prop] = [];
        } else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop+"."+p : p);
            }
            if (isEmpty && prop)
                result[prop] = {};
        }
    }
    recurse(data, "");
    return result;
}

function isPhone(aPhone) {
    var bValidate = RegExp(/^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|177)[0-9]{8}$/).test(aPhone);
    if (bValidate) {
        return true;
    }
    else
        return false;
}

function isIDNo(code) {
    var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
    var tip = "";
    var pass= true;

    //if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
    //if(!code || !/^[1-9][0-9]{5}(19[0-9]{2}|200[0-9]|2010)(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/i.test(code)){
    if(!code || !/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/i.test(code)){
        tip = "身份证号格式错误";
        pass = false;
        console.log(code);
    }
    else if(!city[code.substr(0,2)]){
        tip = "地址编码错误";
        pass = false;
    }
    else {
        //18位身份证需要验证最后一位校验位
        if (code.length == 18) {
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            //校验位
            var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++) {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if (parity[sum % 11] != code[17].toUpperCase()) {
                tip = "校验位错误";
                pass = false;
            }
        }
        else if (code.length == 15) {
            // 通过验证
        }
        else {
            pass = false;
        }
    }
    return pass;
}

function sexFromIDNo(idNo) {
    if (isIDNo(idNo)) {
        if(idNo.length == 18) {
            return idNo.charAt(16) % 2 ? 'M' : 'F'
        } else if(idNo.length == 15) {
            return idNo.charAt(14) % 2 ? 'M' : 'F'
        }
    }
    return 'N';
}

function birthdayFromIDNo(idNo) {
    if (isIDNo(idNo)) {
        if(idNo.length == 18) {
            return idNo.substr(6, 4) + '-' + idNo.substr(10, 2) + '-' + idNo.substr(12, 2);
        } else if(idNo.length == 15) {
            return '19' + idNo.substr(6, 2) + '-' + idNo.substr(8, 2) + '-' + idNo.substr(10, 2);
        }
    }
    return '';
}

var util = {
    setProperty: setProperty,
    setPropertyRecursion: setPropertyRecursion,
    setPropertyDotExpression: setPropertyDotExpression,
    getPropertyCount: getPropertyCount,
    dateDiff: dateDiff,
    dateAdd: dateAdd,
    randomN: randomN,
    randomS: randomS,
    paddingStr: paddingStr,
    readDictionaryStructure: readDictionaryStructure,
    readDirectoryStructure: readDirectoryStructure,
    chunkArrayRange: chunkArrayRange,
    chunkArraySize: chunkArraySize,
    unflatten: unflatten,
    flatten: flatten,
    isPhone: isPhone,
    isIDNo: isIDNo,
    sexFromIDNo: sexFromIDNo,
    birthdayFromIDNo: birthdayFromIDNo
};


module.exports = util;

