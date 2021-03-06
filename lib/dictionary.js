/**
 * Created by zppro on 15-12-10.
 */
require("should");
var _ = require('underscore');
var fs = require('fs-extra');

function dictionary() {
    this.keys = {};
    this.vals = {};
    this.pairs = {};
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
//8 [{k:"k1",v:{"name":"姓名1","order":1}},{k:"k2",v:{"name":"姓名2","order":2}}];

dictionary.prototype.add = function(k,o) {
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

        this.keys[k] = _keys;
        this.vals[k] = _vals;
    }
    else if(_.isArray(o)){
        if(o.length>0) {
            if(_.isString(o[0])) {
                this.keys[k] = o;
                this.vals[k] = o;
            }
            else if (_.isArray(o[0])) {
                this.keys[k] = _.map(o,function(it){
                    return it[0];
                });
                this.vals[k] = _.map(o,function(it){
                    return it[1];
                });
            }
            else if (_.isObject(o[0])) {
                this.keys[k] = _.pluck(o, 'k');
                this.vals[k] = _.pluck(o, 'v');
            }
            else{
                return;
            }
        }
        else {
            this.keys[k] = o;
            this.vals[k] = o;
        }
    }
    else if(_.isObject(o)){
        this.keys[k] = _.keys(o);
        this.vals[k] = _.values(o);
    }
    this.pairs[k] = _.object(this.keys[k],this.vals[k]);
};

dictionary.prototype.remove = function(k) {
    delete this.keys[k];
    delete this.vals[k];
    delete this.pairs[k];
};

dictionary.clear = function() {
    this.keys = {};
    this.vals = {};
    this.pairs = {};
};

dictionary.prototype.readJSON = function(f,callback) {
    var self = this;

    fs.readJSON(f,function(err,jo){
        if(_.isArray(jo) && jo.length>0) {
            for (var i = 0; i < jo.length; i++) {
                self.add("d" + i, jo[i]);
            }
        }
        else if(_.isObject(jo)) {

            for (var k in jo) {
                self.add(k, jo[k]);
            }
        }
        callback();
    });
};

dictionary.prototype.writeJSON = function(f,callback) {
    var self = this;
    fs.ensureFile(f,function(err){
        fs.writeJSON(f,self.pairs,callback);
    });
};

module.exports = function(){
    return new dictionary();
};