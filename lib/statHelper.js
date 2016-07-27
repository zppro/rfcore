/**
 * job Created by zppro on 16-7-27.
 * Target:统计帮助类
 *
 */

var _ = require('underscore');
var moment = require("moment");


module.exports = {
    //[start], stop, [step]
    rangeNumber: function (start, stop, step) {
        return _.range(start, stop, step);
    },
    rangeDateAsMonth: function (start, end, format) {
        return this._rangeDate(start, end, format);
    },
    rangeDateAsYear: function (start, end, format) {
        return this._rangeDate(start, end, format, 'years');
    },
    rangeDateAsDay: function (start, end, format){
        return this._rangeDate(start, end, format, 'days');
    },
    _rangeDate: function (start, end, format, type) {
        var s = moment(start);
        var e = end ? moment(end) : moment();
        !type && (type = 'months');
        var _f;
        switch (type) {
            case 'months':
                _f = 'YYYY-MM';
                break;
            case 'years':
                _f = 'YYYY';
                break;
            case 'days':
                _f = 'YYYY-MM-DD';
                break;
            default:
                return [];
                break;
        }

        var f = format || _f;
        var ret = [];

        for (var d = s; e.diff(d, type) >= 0; d = d.add(1, type)) {
            ret.push(d.format(f));
        }

        return ret;
    }
};