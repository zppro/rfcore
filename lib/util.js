/**
 * Created by zppro on 15-5-13.
 */
'use strict';

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



var util = {
    setProperty: setProperty,
    setPropertyRecursion: setPropertyRecursion,
    setPropertyDotExpression: setPropertyDotExpression
};


module.exports = util;

