/**
 * Created by zppro on 15-12-10.
 */

var d = require('../lib/dictionary')();
var _ = require('underscore');

describe("test dictionary2", function() {
    var path = './test/dictionary.json';
    it('The d.pairs["D1000"]["name"].should.eql("用户类型")', function(done) {

        d.readJSON(path,function(){
            console.log(d);
            d.pairs["D1000"]["name"].should.eql("用户类型");
            done();
        });
    });
});