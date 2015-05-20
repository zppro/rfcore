/**
 * Created by zppro on 15-5-18.
 */
require("should");
var path = require('path');
var data = require('../lib/data');
var fs = require('fs-extra');
var ofs = require('fs');


describe("test data", function() {

    var TEST_DIR = './data';
    var DATA_ITEMS = ['a','b'];

    describe('+ init', function () {
        describe(TEST_DIR+'/_def_.json will be created', function () {
            it(TEST_DIR+'/_def_.json created!!!', function(done) {
                data.init(TEST_DIR,{items:DATA_ITEMS}).then(function (cont, success) {
                    ofs.exists(path.join(TEST_DIR, '_def_.json'),function(isExist){
                        isExist.should.equal(success);

                        describe('+ set/get', function () {
                            it('set & get _default_ {"key0":"value0"}', function() {
                                var key = 'key0';
                                var value ='value0';
                                data.set(key,value);
                                data.get(key).should.equal(value);
                            });
                        });

                        done();

                        describe('+ write/read', function () {
                            it('write & read _default_.json {"key1":"value1"}', function(done) {
                                var key = 'key1';
                                var value ='value1';
                                data.write(key,value).then(function(cont){

                                    data.read(key).then(function(cont2,v){
                                        v.should.equal(value);
                                        done();
                                    })
                                });

                            });
                        });

                        describe('+ save all', function () {
                            var keya = 'key2';
                            var valuea ='value2';
                            var itema = 'a';
                            describe('+ will set to a ', function () {
                                it(' result:{"key2":"value2"}', function() {
                                    data.set(keya,valuea,itema);
                                    data.get(keya,itema).should.equal(valuea);
                                });
                            });

                            var keyb = 'key3';
                            var valueb ='value3';
                            var itemb = 'b';
                            describe('+ will set to b ', function () {
                                it(' result {"key3":"value3"}', function() {
                                    data.set(keyb,valueb,itemb);
                                    data.get(keyb,itemb).should.equal(valueb);
                                });
                            });

                            describe('+ save all', function () {
                                it('save a,b to json', function(done) {
                                    data.saveAll().then(function (cont, success) {
                                        if (success) {
                                            data.thenit(cont);
                                        }
                                        else{
                                            success.should.equal(true);
                                            done();
                                        }
                                    }).series([
                                        function (cont) {
                                            fs.readJSON(path.join(TEST_DIR, itema + '.json'), function(err,ret){
                                                if (ret[keya] === valuea) {
                                                    cont();
                                                }
                                                else{
                                                    (ret[keyb] === valueb).should.equal(true);
                                                    done();
                                                }
                                            });
                                        },
                                        function (cont) {
                                            fs.readJSON(path.join(TEST_DIR, itemb + '.json'), function(err,ret){
                                                (ret[keyb] === valueb).should.equal(true);
                                                done();
                                            });
                                        }
                                    ]);
                                });
                            });


                        });

                        describe('+ save', function () {
                            var key = 'key4';
                            var value = 'value4';
                            describe('+ will set to _default_ ', function () {
                                it(' result:{"key4":"value4"}', function () {
                                    data.set(key, value);
                                    data.get(key).should.equal(value);
                                });
                            });

                            describe('+ save ', function () {
                                it('save _default_ to json', function(done) {
                                    data.save().then(function (cont, success) {
                                        if (success) {
                                            fs.readJSON(path.join(TEST_DIR,'_default_.json'),cont);
                                        }
                                        else{
                                            success.should.equal(true);
                                            done();
                                        }
                                    }).then(function(cont,ret){
                                        (ret[key] === value).should.equal(true);
                                        done();
                                    });
                                });
                            });
                        });

                    });
                });
            });
        });

    });

});