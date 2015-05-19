/**
 * Created by zppro on 15-5-18.
 */
require("should");
var path = require('path');
var data = require('../lib/data');
var fs = require('fs-extra');
var ofs = require('fs');


describe("test data", function() {

    var TEST_DIR = './datas';

    describe('+ init', function () {
        describe(TEST_DIR+'/_def_.json will be created', function () {
            it(TEST_DIR+'/_def_.json created!!!', function(done) {
                data.init(TEST_DIR).then(function (cont, success) {
                    ofs.exists(path.join(TEST_DIR, '_def_.json'),function(isExist){
                        isExist.should.equal(true);
                        done();
                    });

                });
            });
        });
    });

    describe('+ write/read', function () {
        it('write & read _default_.json {"key1":"value1"}', function(done) {
            var value ='value1';
            data.write('key1',value).then(function(cont){
                data.thenit(cont);
            }).then(function(){

                data.read('key1').then(function(cont,v){
                    v.should.equal(value);
                    done();
                })
            });
        });
    });
});