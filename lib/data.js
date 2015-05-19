/**
 * Created by zppro on 15-5-15.
 */
var Thenjs = require('thenjs');
var fs = require('fs-extra');
var ofs = require('fs');
var path = require('path');
var _ = require('underscore');

var C_DEF_FILE_NAME='_def_.json';
var C_DEFAULT_KEY = '_default_';




var thenit = function(thenfn){
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift(null);
    return thenfn.apply(null,args);
};


var safekey =function(k){
    if(k.toLowerCase().substr(k.lastIndexOf('.'),5) === '.json'){
        return k;
    }
    else{
        return k+'.json';
    }
};


var data = {
    thenit:thenit,
    _defs_:{},
    _items_:{}
};

data.init = function (pwd,options){
    var defPath = path.join(pwd,C_DEF_FILE_NAME);
    var _objDef =  _.extend({pwd:pwd ,items:[]},options||{});
    if(_objDef.items.indexOf(C_DEFAULT_KEY) === -1){
        _objDef.items.unshift(C_DEFAULT_KEY);
    }
    return Thenjs(ofs.existsSync(defPath)).then(function(cont,isExist){
        Thenjs(function(cont2,err){
            fs.outputJSON(defPath,_objDef,cont2);
        }).then(function(cont2,err){
            fs.readJSON(defPath,cont2);
        }).then(function(cont2,o){
            data._defs_ = o;
            thenit(cont2,data._defs_.items);
        }).each(data._defs_.items,function(cont2,k){
            var itemJSONPath = path.join(data._defs_.pwd,safekey(k));
            console.log('itemJSONPath:'+itemJSONPath);
            Thenjs(ofs.existsSync(itemJSONPath)).then(function(cont3,isExist){
                console.log('isExist:'+isExist);
                if(!isExist) {
                    console.log(itemJSONPath);
                    fs.outputJSON(itemJSONPath, {_id_: k }, cont3);
                }
                else{
                    thenit(cont3);
                }
            }).then(function(cont3,err){
                fs.readJSON(itemJSONPath,cont3);
            }).then(function(cont3,o){
                data._items_[k] = o;
                thenit(cont2);
            });
        }).then(function(cont2){
            thenit(cont,true);
        }).fail(function (cont, error) { // 通常应该在链的最后放置一个 `fail` 方法收集异常
            console.log(error);
            thenit(cont,false);
        });
    });
};


data.read = function(k,s){
    if(!s){
        s = C_DEFAULT_KEY;
    }
    if(data._items_[s]){
        return Thenjs(function(cont){
            //cont(null,data._items_[s][k]);
            thenit(cont,data._items_[s][k]);
        });
    }
    else{
        return Thenjs(function(cont){
            thenit(cont,null);
        });
    }
};

data.write = function(k,v,s) {
    if(!s){
        s = C_DEFAULT_KEY;
    }
    var sPath = path.join(data._defs_.pwd,safekey(s));
    if(!data._items_[s]){
        //不存在
        if(ofs.existsSync(sPath)){
            //
            return Thenjs(function(cont){
                fs.readJSON(sPath,cont);
            }).then(function(cont,content){
                data._items_[s] = content;
                data._items_[s][k] = v;
                fs.writeJSON(sPath,data._items_[s],cont);
            });
        }
        else{
            data._items_[s] = {};
            data._items_[s][k] = v;
            return Thenjs(function(cont){
                fs.writeJSON(sPath,data._items_[s],cont);
            });
        }
    }
    else{
        data._items_[s][k] = v;

        return Thenjs(function(cont){
            fs.writeJSON(sPath,data._items_[s],cont);
        });
    }
};


module.exports = data;