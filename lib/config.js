/**
 * Created by zppro on 15-5-12.
 */
'use strict';
var util = require('../lib/util');

module.exports = function (config,args,type){

    if(args){
        args.forEach(function (v, i) {
            var arr = v.split('=');
            if (arr.length > 1 && arr[1].length > 0) {
                if(type==1) {
                    util.setProperty(config, arr[0], arr[1]);
                }
                else if(type==2) {
                    util.setPropertyRecursion(config, arr[0], arr[1]);
                }
                else{
                    // a.b.c = 1表达式方式的入参定义
                    util.setPropertyDotExpression(config, arr[0], arr[1]);
                }
            }
        });

    }
};