/**
 * Created by zppro on 15-5-22.
 */
require("should");
var path = require('path');
var dataP = require('../lib/dataP');
var fs = require('fs-extra');
var ofs = require('fs');



describe("test dataP", function() {

    var TEST_DIR = './dataP';
    var DATAP_ITEMS = ['a', 'b'];

    describe('+ init', function () {
        describe(TEST_DIR + '/_def_.json will be created', function () {
            it(TEST_DIR + '/_def_.json created!!!', function (done) {
                dataP.init(TEST_DIR,{items:DATAP_ITEMS}).then(function () {
                    console.log(4);
                    ofs.exists(path.join(TEST_DIR, '_def_.json'), function (isExist) {
                        isExist.should.equal(true);
                        done();

                        describe('+ set/get', function () {
                            it('set & get _default_ {"key0":"value0"}', function() {
                                var key = 'key0';
                                var value ='value0';
                                dataP.set(key,value);
                                dataP.get(key).should.equal(value);
                            });
                        });

                        describe('+ write/read', function () {
                            it('write & read _default_.json {"key1":"value1"}', function(done) {
                                var key = 'key1';
                                var value ='value1';
                                dataP.write(key,value).then(function(success){
                                    if(success){
                                        dataP.read(key).then(function(ret){
                                            ret.should.equal(value);
                                            done();
                                        })
                                    }
                                    else{
                                        success.should.equal(true);
                                    }
                                });

                            });
                        });

                        describe('+ save all', function () {
                            var keya = 'key2';
                            var valuea ='value2';
                            var itema = 'a';
                            describe('+ will set to a ', function () {
                                it(' result:{"key2":"value2"}', function() {
                                    dataP.set(keya,valuea,itema);
                                    dataP.get(keya,itema).should.equal(valuea);
                                });
                            });

                            var keyb = 'key3';
                            var valueb ='value3';
                            var itemb = 'b';
                            describe('+ will set to b ', function () {
                                it(' result {"key3":"value3"}', function() {
                                    dataP.set(keyb,valueb,itemb);
                                    dataP.get(keyb,itemb).should.equal(valueb);
                                });
                            });

                            describe('+ save all', function () {
                                it('save a,b to json', function(done) {
                                    dataP.saveAll().then(function (successes) {
                                        var success = true;
                                        for(var i=0;i<successes.length;i++){
                                            success = success && successes[i];
                                        }
                                        success.should.equal(true);
                                        done();
                                    });
                                });
                            });

                        });


                        describe('+ save', function () {
                            var key = 'key4';
                            var value = 'value4';
                            describe('+ will set to _default_ ', function () {
                                it(' result:{"key4":"value4"}', function () {
                                    dataP.set(key, value);
                                    dataP.get(key).should.equal(value);
                                });
                            });

                            describe('+ save ', function () {
                                it('save _default_ to json', function(done) {
                                    dataP.save().then(function (success) {
                                        if (success) {
                                            fs.readJSON(path.join(TEST_DIR,'_default_.json'),function(err,ret){
                                                (ret[key] === value).should.equal(true);
                                                done();
                                            });
                                        }
                                        else{
                                            success.should.equal(true);
                                            done();
                                        }
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