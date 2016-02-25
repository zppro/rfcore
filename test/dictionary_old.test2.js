/**
 * Created by zppro on 15-12-10.
 */

var d = require('../lib/dictionary');
var _ = require('underscore');

describe("test dictionary2", function() {
    var path = './test/dictionary.json';
    it("The d.pairs['t7'] should equal {k1:v1,k2:v2}", function(done) {
        d.readJSON(path,function(){
            d.pairs["t7"]["k1"].should.eql("v1");
            d.pairs["t7"]["k2"].should.eql("v2");
            done();
        });
    });
});