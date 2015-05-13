/**
 * Created by zppro on 15-5-12.
 */
'use strict';
var util = require('../lib/util');

module.exports = function (config,args){
    if(args){
        args.forEach(function(v,i){
            var arr = v.split('=');
            if(arr.length > 1 && arr[1].length >0){
                util.setProperty(config,arr[0],arr[1]);
            }
        });
    }
};