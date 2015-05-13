/**
 * Created by zppro on 15-5-13.
 */
require("should");

var util = require('../lib/util');


describe("test util.setProperty", function() {

    var testObj = { a :{aa:{aaa:'a111',aaa1:'a112'},aa1:'a12'} ,a1:'a2'};
    var k1 = 'a1', v1 = 'level1';
    var k2 = 'aa1', v2 = 'level2';
    var k3 = 'aaa1', v3 = 'level3';

    it("The testObj.a1 should equal level1", function() {
        util.setProperty(testObj,k1,v1);
        testObj.a1.should.eql(v1);
    });

    it("The testObj.aa1 should equal level2", function() {
        util.setProperty(testObj,k2,v2);
        testObj.a.aa1.should.eql(v2);
    });

    it("The testObj.aaa1 should equal level3", function() {
        util.setProperty(testObj,k3,v3);
        testObj.a.aa.aaa1.should.eql(v3);
    });
});