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


var dataT = {
    thenit:thenit,
    _defs_:{},
    _items_:{}
};

dataT.init = function (pwd,options){
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
            dataT._defs_ = o;
            thenit(cont2,dataT._defs_.items);
        }).each(dataT._defs_.items,function(cont2,k){
            var itemJSONPath = path.join(dataT._defs_.pwd,safekey(k));
            Thenjs(ofs.existsSync(itemJSONPath)).then(function(cont3,isExist){
                if(!isExist) {
                    fs.outputJSON(itemJSONPath, {_id_: k }, cont3);
                }
                else{
                    thenit(cont3);
                }
            }).then(function(cont3,err){
                fs.readJSON(itemJSONPath,cont3);
            }).then(function(cont3,o){
                dataT._items_[k] = o;
                thenit(cont2);
            });
        }).then(function(cont2){
            thenit(cont,true);
        }).fail(function (cont, error) { // 通常应该在链的最后放置一个 `fail` 方法收集异常
            //console.log(error);
            thenit(cont,false);
        });
    });
};

dataT.remote =  function (router,getPath,setPath,writePath,options) {
    router
        .get(getPath || 'dataT/get', function *(next) {
            this.type = 'application/json';
            this.body = JSON.stringify(dataT.get(this.query.k, this.query.i));
            yield next;
        })
        .post(setPath || 'dataT/set', options.middlewares, function *(next) {
            this.type = 'application/json';
            this.body = JSON.stringify({"success": true});
            var self = this;
            dataT.set(this.request.body.k, this.request.body.v, this.request.body.i);

            yield dataT.save(this.request.body.i).then(function(cont,success){
                self.body = JSON.stringify({"success": success});
                cont();
            }).toThunk();
        })
        .post(writePath || 'dataT/write', options.middlewares, function *(next) {
            this.type = 'application/json';
            var self = this;

            yield dataT.write(self.request.body.k, self.request.body.v, self.request.body.i).then(function(cont){
                console.log('123');
                self.body = JSON.stringify({"success": true});
                cont();
            }).toThunk();
        });
};

dataT.save = function(i){
    if(!i){
        i = C_DEFAULT_KEY;
    }

    if(dataT._items_[i]){
        return Thenjs(1).then(function(cont){
            fs.outputJSON(path.join(dataT._defs_.pwd,safekey(i)), dataT._items_[i], cont);
        }).then(function(cont){
            thenit(cont,true);
        });
    }
    else{
        return Thenjs(false);
    }
};

dataT.saveAll = function(){
    if(dataT._items_){
        return Thenjs(1).each(dataT._defs_.items,function(cont,v){
            var itemJSONPath = path.join(dataT._defs_.pwd,safekey(v));
            fs.outputJSON(itemJSONPath, dataT._items_[v], cont);
        }).then(function(cont){
            thenit(cont,true);
        });
    }
    else{
        return Thenjs(false);
    }
};


dataT.get = function(k,i){
    if(!i){
        i = C_DEFAULT_KEY;
    }
    if(dataT._items_[i]){
        return dataT._items_[i][k];
    }
    else{
        return null;
    }
};

dataT.set = function(k,v,i){
    if(!i){
        i = C_DEFAULT_KEY;
    }
    if(dataT._items_[i]){
        dataT._items_[i][k] = v;
    }
    else{
        dataT._items_[i] = {};
        dataT._items_[i][k] = v;
    }
};

dataT.read = function (k,i){
    if(!i){
        i = C_DEFAULT_KEY;
    }
    if(dataT._items_[i]){
        return Thenjs(function(cont){
            //cont(null,dataT._items_[i][k]);
            thenit(cont,dataT._items_[i][k]);
        });
    }
    else{
        return Thenjs(function(cont){
            thenit(cont,null);
        });
    }
};

dataT.write = function(k,v,i) {
    if(!i){
        i = C_DEFAULT_KEY;
    }
    var sPath = path.join(dataT._defs_.pwd,safekey(i));
    if(!dataT._items_[i]){
        //不存在
        if(ofs.existsSync(sPath)){
            return Thenjs(function(cont){
                fs.readJSON(sPath,cont);
            }).then(function(cont,content){
                dataT._items_[i] = content;
                dataT._items_[i][k] = v;
                fs.writeJSON(sPath,dataT._items_[i],cont);
            });
        }
        else{
            dataT._items_[i] = {_id_: i };
            dataT._items_[i][k] = v;
            return Thenjs(function(cont){
                fs.writeJSON(sPath,dataT._items_[i],cont);
            });
        }
    }
    else{
        dataT._items_[i][k] = v;
        return Thenjs(function(cont){
            fs.writeJSON(sPath,dataT._items_[i],cont);
        });
    }
};


module.exports = dataT;