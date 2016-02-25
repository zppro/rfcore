/**
 * Created by zppro on 15-12-10.
 */

var d1 = require('../lib/dictionary')();
var d2 = require('../lib/dictionary')();
var _ = require('underscore');

describe("test dictionary", function() {
    var t1 = "v1,v2"; 
    d1.add("t1",t1);
    it("The d1.keys['t1'] should equal d1.vals['t1']", function() {
        d1.keys["t1"][0].should.equal(d1.vals["t1"][0]);
        d1.keys["t1"][1].should.equal(d1.vals["t1"][1]);
    });

    var t2 = "k1=v1,k2=v2";
    d1.add("t2",t2);
    it("The d1.keys['t2'] should equal ['k1','k2'] and d1.vals['t2'] should equal ['v1','v2']", function() {
        d1.keys["t2"][0].should.equal("k1");
        d1.keys["t2"][1].should.equal("k2");
        d1.vals["t2"][0].should.equal("v1");
        d1.vals["t2"][1].should.equal("v2");
    });

    var t3 = "k1:v1,k2:v2";
    d1.add("t3",t3);
    it("The d1.keys['t3'] should equal ['k1','k2'] and d1.vals['t3'] should equal ['v1','v2']", function() {
        d1.keys["t3"][0].should.equal("k1");
        d1.keys["t3"][1].should.equal("k2");
        d1.vals["t3"][0].should.equal("v1");
        d1.vals["t3"][1].should.equal("v2");
    });

    var t4 = {"k1":"v1","k2":"v2"};
    d1.add("t4",t4);
    it("The d1.keys['t4'] should equal ['k1','k2'] and d1.vals['t4'] should equal ['v1','v2']", function() {
        d1.keys["t4"][0].should.eql("k1");
        d1.keys["t4"][1].should.eql("k2");
        d1.vals["t4"][0].should.eql("v1");
        d1.vals["t4"][1].should.eql("v2");
    });

    var t5 = ["v1","v2"];
    d1.add("t5",t5);
    it("The d1.keys['t5'] should equal ['v1','v2'] and d1.vals['t5'] should equal ['v1','v2']", function() {
        d1.keys["t5"][0].should.eql("v1");
        d1.keys["t5"][1].should.eql("v2");
        d1.vals["t5"][0].should.eql("v1");
        d1.vals["t5"][1].should.eql("v2");
    });

    var t6 = [{k:"k1",v:"v1"},{k:"k2",v:"v2"}];
    d1.add("t6",t6);
    it("The d1.keys['t6'] should equal ['k1','k2'] and d1.vals['t6'] should equal ['v1','v2']", function() {
        d1.keys["t6"][0].should.eql("k1");
        d1.keys["t6"][1].should.eql("k2");
        d1.vals["t6"][0].should.eql("v1");
        d1.vals["t6"][1].should.eql("v2");
    });

    var t7 = [["k1","v1"],["k2","v2"]];
    d1.add("t7",t7);
    it("The d1.keys['t7'] should equal ['k1','k2'] and d1.vals['t7'] should equal ['v1','v2']", function() {
        d1.keys["t7"][0].should.eql("k1");
        d1.keys["t7"][1].should.eql("k2");
        d1.vals["t7"][0].should.eql("v1");
        d1.vals["t7"][1].should.eql("v2");
    });

    it("The d1.pairs['t7'] should equal {k1:v1,k2:v2}", function() {
        d1.pairs["t7"]["k1"].should.eql("v1");
        d1.pairs["t7"]["k2"].should.eql("v2");
    });

    var t8 = [{k:"k1",v:{"name":"姓名1","order":1}},{k:"k2",v:{"name":"姓名2","order":2}}];
    d2.add("t8",t8);
    it("The d2.keys['t8'] should equal ['k1','k2'] and d2.pairs['t8']['k1'].name should equal '姓名1'", function() {
        d2.keys["t8"][0].should.eql("k1");
        d2.keys["t8"][1].should.eql("k2");
        d2.pairs["t8"]["k1"].name.should.eql("姓名1");
        d2.pairs["t8"]["k1"].order.should.eql(1);
        d2.pairs["t8"]["k2"].name.should.eql("姓名2");
        d2.pairs["t8"]["k2"].order.should.eql(2);
    });



    //var path = './test/dictionary.json';
    //d1.writeJSON(path, function () {
    //    it("The d1.pairs['t7'] should equal {k1:v1,k2:v2}", function(done) {
    //        d1.readJSON(path,function(){
    //            d1.pairs["t7"]["k1"].should.eql("v1");
    //            d1.pairs["t7"]["k2"].should.eql("v2");
    //            done();
    //        });
    //    });
    //});

});