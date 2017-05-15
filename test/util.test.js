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
        util.setPropertyRecursion(testObj,k2,v2);
        testObj.a.aa1.should.eql(v2);
    });

    it("The testObj.aaa1 should equal level3", function() {
        util.setPropertyRecursion(testObj,k3,v3);
        testObj.a.aa.aaa1.should.eql(v3);
    });


});

describe("string.format|string.f", function() {
    it("The 'mongodb://{0}:{1}@{2}/{3}'.f('myuser','mypwd','myserver','mydatabase') should equal 'mongodb://myuser:mypassword@myserver/mydatabase' ", function() {
        'mongodb://{0}:{1}@{2}/{3}'.f('myuser','mypwd','myserver','mydatabase').should.eql('mongodb://myuser:mypwd@myserver/mydatabase');
    });
});

describe("string.md5", function() {
    it("The '123'.md5 should equal '202cb962ac59075b964b07152d234b70' ", function() {
        '123'.md5().should.eql('202cb962ac59075b964b07152d234b70');
    });
});

describe("date.ts", function() {
    it("The new date().ts should equal new date(ts)' ", function() {

        var dn = new Date();
        var ts = dn.ts();
        var d = new Date(ts);
        dn.should.eql(d);
    });
});

describe("date.tz", function() {
    it("The new date().tz should equal new date(ts)' ", function() {
        new Date().tz().should.eql(-8);
    });
});

describe("date.f", function() {
    it("The new date().f('yyyy-MM-dd') should equal '2015-12-16'' ", function() {
        new Date().f('yyyy').should.eql(new Date().getFullYear().toString());
    });
});

describe("random", function() {
    it("The randomN(6) should different randomN(6)  ", function() {
        var r1 = util.randomN(6);
        var r2 = util.randomN(6);
        console.log(r1);
        console.log(r2);
        console.log(Math.random());
        r1.toString().length.should.be.eql(6);
        r2.toString().length.should.be.eql(6);
        r1.should.not.be.eql(r2);
    });
});

describe("paddingStr", function() {
    it("The paddingStr('88','0',0) should be '000088'  ", function () {
        util.paddingStr('88', '0', 4).should.eql('000088');
        util.paddingStr('88', '0', 0).should.eql('88');
    });
});


describe("readDirectoryStructure", function() {
    it("begin readDirectoryStructure  ", function(done) {
        var p = util.readDirectoryStructure('/home/zppro/github/4gtour/src/models/dwh');
        p.then(function(ret) {
            console.dir(ret);
            '1'.should.eql('1');
            done();
        });
    });
});

describe("readDirectoryStructure", function() {
    it("begin readDirectoryStructure  ", function(done) {
        var p = util.readDirectoryStructure('/home/zppro/github/4gtour/src/models', '.js', {format: 'tree'});
        p.then(function(ret) {
            console.dir(ret);
            '1'.should.eql('1');
            done();
        });
    });
});