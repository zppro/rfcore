/**
 * Created by zppro on 15-5-22.
 */
var fs = require('fs-extra');
var ofs = require('fs');
var path = require('path');
var _ = require('underscore');


var C_DEF_FILE_NAME='_def_.json';
var C_DEFAULT_KEY = '_default_';

var dataP = {
    _defs_:{},
    _items_:{}
};

var safekey =function(k){
    if(k.toLowerCase().substr(k.lastIndexOf('.'),5) === '.json'){
        return k;
    }
    else{
        return k+'.json';
    }
};

function getItemPromises(pwd,items){
    return Promise.all(_.map(items,function(item){
        var itemJSONPath = path.join(pwd,safekey(item));
        console.log('566:'+itemJSONPath);
        return new Promise(function(resolve,reject){
           ofs.exists(itemJSONPath,function(isExist){
               if(!isExist){
                   var objItemJSON = {_id_: item };
                   fs.outputJSON(itemJSONPath,objItemJSON,function(err){
                       if(err){
                           reject(err);
                       }
                       else{
                           console.log(23);
                           dataP._items_[item] = objItemJSON;
                           resolve(objItemJSON);
                       }
                   });
               }
               else{
                   fs.readJSON(itemJSONPath,function(err,ret){
                       if(err){
                           reject(err);
                       }
                       else{
                           console.log(24);
                           dataP._items_[item] = ret;
                           resolve(ret);
                       }
                   });
               }
           });
        });
    }));
}

dataP.init = function (pwd,options){
    var defPath = path.join(pwd,C_DEF_FILE_NAME);
    var _objDef =  _.extend({pwd:pwd ,items:[]},options||{});
    if(_objDef.items.indexOf(C_DEFAULT_KEY) === -1){
        _objDef.items.unshift(C_DEFAULT_KEY);
    }

    var p1 = new Promise(function (resolve,reject){
        ofs.exists(defPath,function(isExist){
            if(!isExist){
                fs.outputJSON(defPath,_objDef,function(err){
                    if(err){
                        reject(err);
                    }
                    else{
                        getItemPromises(pwd,_objDef.items).then(function(){
                            resolve(_objDef);
                        });
                    }
                });
            }
            else{

                fs.readJSON(defPath,function(err,ret){
                    console.log('_def_.json exist');
                    console.dir(ret);
                    if(err){
                        reject(err);
                    }
                    else{
                        getItemPromises(pwd,ret.items).then(function(){
                            resolve(ret);
                        });
                    }
                });
            }
        });
    }).then(function(ret){
            dataP._defs_ = ret;
        });
    return p1;
};


dataP.get = function(k,i){
    if(!i){
        i = C_DEFAULT_KEY;
    }
    if(dataP._items_[i]){
        return dataP._items_[i][k];
    }
    else{
        return null;
    }
};

dataP.set = function(k,v,i){
    if(!i){
        i = C_DEFAULT_KEY;
    }
    if(dataP._items_[i]){
        dataP._items_[i][k] = v;
    }
    else{
        dataP._items_[i] = {};
        dataP._items_[i][k] = v;
    }
};


dataP.read = function (k,i){
    if(!i){
        i = C_DEFAULT_KEY;
    }

    return new Promise(function(resolve,reject){
        if(dataP._items_[i]){
            resolve(dataP._items_[i][k]);
        }
        else{
            resolve(null);
        }
    });

};

dataP.write = function(k,v,i) {
    if(!i){
        i = C_DEFAULT_KEY;
    }

    var sPath = path.join(dataP._defs_.pwd,safekey(i));

    if(dataP._items_[i]){
        //存在
        dataP._items_[i][k] = v;
        return new Promise(function(resolve,reject){
            fs.writeJSON(sPath,dataP._items_[i],function(err){
                resolve(true);
            });
        });
    }
    else{
        return Promise.resolve().then(function(){
            ofs.exists(sPath,function(isExist){
                if(isExist){
                    Promise.resolve().then(function(){
                        return new Promise(function(resolve,reject){
                            fs.readJSON(sPath,function(ret){
                                ret[k] = v;
                                dataP._items_[i] = ret;
                                resolve(true);
                            });
                        });
                    }).then(function(ret){
                        return new Promise(function(resolve,reject){
                            fs.writeJSON(sPath,ret,function(){
                                resolve(true);
                            });
                        });
                    });
                }
                else{
                    return Promise.reject('no such item to write');
                }
            });
        });
    }
};

dataP.save = function(i){
    if(!i){
        i = C_DEFAULT_KEY;
    }

    if(dataP._items_[i]){
        return Promise.resolve().then(function(){
            return new Promise(function(resolve,reject){
                fs.outputJSON(path.join(dataP._defs_.pwd,safekey(i)), dataP._items_[i], function(err){
                    if(err){
                        console.log('resolve',false);
                        resolve(false);
                    }
                    else{
                        console.log('resolve',true);
                        resolve(true);
                    }
                });
            });

        }).then(function(ret){
            return Promise.resolve(ret);
        });
    }
    else{
        return Promise.reject('no such item to save');
    }
};

dataP.saveAll = function(){
    if(dataP._items_){
        return Promise.all(_.map(dataP._defs_.items,function(item){
            var itemJSONPath = path.join(dataP._defs_.pwd,safekey(item));
            return new Promise(function(resolve,reject){
                fs.outputJSON(itemJSONPath, dataP._items_[item], function(err){
                    if(err){
                        resolve(false);
                    }
                    else{
                        resolve(true);
                    }
                });
            });
        }));
    }
    else{
        return Promise.resolve(true);
    }
};

dataP.remote = {
    settings:{getPath:'/data/get',setPath:'/data/set',writePath:'/data/write'},
    init : function (router,options) {
        this.settings = _.extend(this.settings,options);
        router
            .get(this.settings.getPath, function *(next) {
                this.type = 'application/json';
                this.body = JSON.stringify(dataP.get(this.query.k, this.query.i));
                yield next;
            })
            .post(this.settings.setPath, options.middlewares, function *(next) {
                this.type = 'application/json';
                this.body = JSON.stringify({"success": true});
                var self = this;
                dataP.set(this.request.body.k, this.request.body.v, this.request.body.i);

                yield dataP.save(this.request.body.i).then(function(success){
                    self.body = JSON.stringify({"success": success});
                });
            })
            .post(this.settings.writePath, options.middlewares, function *(next) {
                this.type = 'application/json';
                var self = this;

                yield dataP.write(self.request.body.k, self.request.body.v, self.request.body.i).then(function(success){
                    self.body = JSON.stringify({"success": success});
                });
            });
    }
};

module.exports = dataP;