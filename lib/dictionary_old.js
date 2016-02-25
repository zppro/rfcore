/**
 * Created by zppro on 15-12-10.
 */
require("should");
var _ = require('underscore');
var fs = require('fs-extra');

var dictionary = {
    keys: {},
    vals: {},
    pairs: {}
};

// v的可能取值
//
//1 "v1,v2"
//2 "k1=v1,k2=v2"
//3 "k1:v1,k2:v2"
//4 {"k1":"v1","k2":"v2"}
//5 ["v1","v2"]
//6 [{k:"k1",v:"v1"},{k:"k2",v:"v2"}]
//7 [["k1","v1"],["k2","v2"]]

dictionary.add = function(k,o) {
    if(_.isString(o)) {
        var pairs = o.split(",");
        var _keys = [];
        var _vals = [];
        _.each(pairs, function (io) {

            var split;
            if (io.indexOf("=") != -1) {
                split = "=";
            }
            else if (io.indexOf(":") != -1) {
                split = ":";
            }
            if (split) {
                var arrKV = io.split(split);
                _keys.push(arrKV[0]);
                _vals.push(arrKV[1]);
            }
            else {

                _keys.push(io);
                _vals.push(io);

            }
        });

        dictionary.keys[k] = _keys;
        dictionary.vals[k] = _vals;
    }
    else if(_.isArray(o)){
        if(o.length>0) {
            if(_.isString(o[0])) {
                dictionary.keys[k] = o;
                dictionary.vals[k] = o;
            }
            else if (_.isArray(o[0])) {
                dictionary.keys[k] = _.map(o,function(it){
                    return it[0];
                });
                dictionary.vals[k] = _.map(o,function(it){
                    return it[1];
                });
            }
            else if (_.isObject(o[0])) {
                dictionary.keys[k] = _.pluck(o, 'k');
                dictionary.vals[k] = _.pluck(o, 'v');;
                //console.log('debug inner dictionary:'+k);
                //console.log(dictionary.vals[k]);
                //console.log(dictionary.vals[k][1]);
            }
            else{
                return;
            }
        }
        else {
            dictionary.keys[k] = o;
            dictionary.vals[k] = o;
        }
    }
    else if(_.isObject(o)){
        dictionary.keys[k] = _.keys(o);
        dictionary.vals[k] = _.values(o);
    }
    dictionary.pairs[k] = _.object(dictionary.keys[k],dictionary.vals[k]);
};

dictionary.remove = function(k) {
    delete dictionary.keys[k];
    delete dictionary.vals[k];
    delete dictionary.pairs[k];
};

dictionary.clear = function() {
    dictionary.keys = {};
    dictionary.vals = {};
    dictionary.pairs = {};
};

dictionary.readJSON = function(f,callback) {
    fs.readJSON(f,function(err,jo){
        if(_.isArray(jo) && jo.length>0) {
            for (var i = 0; i < jo.length; j++) {
                dictionary.add("d" + i, jo[i]);
            }
        }
        else if(_.isObject(jo)) {

            for (var k in jo) {
                dictionary.add(k, jo[k]);
            }
        }
        callback();
    });
};

dictionary.writeJSON = function(f,callback) {
    fs.ensureFile(f,function(err){
        fs.writeJSON(f,dictionary.pairs,callback);
    });
};

module.exports = dictionary;