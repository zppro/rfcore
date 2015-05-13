/**
 * Created by zppro on 15-5-13.
 */
'use strict';

function setProperty(o,k,v){
    if(typeof(o)==='object'){
        if(o.hasOwnProperty(k)){
            o[k] = v;
        }
        else{
            for (var oc in o) {
                setProperty(o[oc],k, v);
            }
        }
    }
}

var util = {
    setProperty :setProperty
};


module.exports = util;

