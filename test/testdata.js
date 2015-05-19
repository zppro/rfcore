/**
 * Created by zppro on 15-5-18.
 */
require("should");
var path = require('path');
var data = require('../lib/data');
var fs = require('fs-extra');
var ofs = require('fs');


data.init('./datas2').then(function(cont,ret){
    console.dir('inited '+ ret);
    data.read('k1').then(function(cont2,v){
        if(!v){
            data.write('k1',{k1:'v1'}).then(function(cont3){
                data.read('k1').then(function(cont4,v){
                    console.dir(v);
                });
            });
        }
        else{
            console.dir('v exist')
            data.read('a1','a').then(function(cont,v1){
                if(!v1){
                    data.write('a1','a1 value!!!!','a').then(function(){
                        data.read('a1','a').then(function(c,v){
                            console.log('v:');
                            console.dir(v);
                        })
                    });
                }
            });
        }

    }).then(function(cont,v){
        //console.dir('read k1:'+v);
    });
});
