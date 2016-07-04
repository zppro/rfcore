/**
 * Created by zppro on 15-5-12.
 */
var core = {};

core.config = require('./lib/config');
core.util = require('./lib/util');
core.dataT = require('./lib/dataT');
core.dataP = require('./lib/dataP');
core.dictionary = require('./lib/dictionary'); //推荐用factory输出
core.factory = function(name){
    var theModule = require('./lib/'+name);
    if(typeof theModule === 'function' ){
        return theModule();
    }
    else {
        return theModule;
    }
}

module.exports = core;