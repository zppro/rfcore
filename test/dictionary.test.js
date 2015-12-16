/**
 * Created by zppro on 15-12-10.
 */

var d = require('../lib/dictionary');
var _ = require('underscore');

describe("test dictionary", function() {
    var t1 = "v1,v2";
    d.add("t1",t1);
    it("The d.keys['t1'] should equal d.vals['t1']", function() {
        d.keys["t1"][0].should.equal(d.vals["t1"][0]);
        d.keys["t1"][1].should.equal(d.vals["t1"][1]);
    });

    var t2 = "k1=v1,k2=v2";
    d.add("t2",t2);
    it("The d.keys['t2'] should equal ['k1','k2'] and d.vals['t2'] should equal ['v1','v2']", function() {
        d.keys["t2"][0].should.equal("k1");
        d.keys["t2"][1].should.equal("k2");
        d.vals["t2"][0].should.equal("v1");
        d.vals["t2"][1].should.equal("v2");
    });

    var t3 = "k1:v1,k2:v2";
    d.add("t3",t3);
    it("The d.keys['t3'] should equal ['k1','k2'] and d.vals['t3'] should equal ['v1','v2']", function() {
        d.keys["t3"][0].should.equal("k1");
        d.keys["t3"][1].should.equal("k2");
        d.vals["t3"][0].should.equal("v1");
        d.vals["t3"][1].should.equal("v2");
    });

    var t4 = {"k1":"v1","k2":"v2"};
    d.add("t4",t4);
    it("The d.keys['t4'] should equal ['k1','k2'] and d.vals['t4'] should equal ['v1','v2']", function() {
        d.keys["t4"][0].should.eql("k1");
        d.keys["t4"][1].should.eql("k2");
        d.vals["t4"][0].should.eql("v1");
        d.vals["t4"][1].should.eql("v2");
    });

    var t5 = ["v1","v2"];
    d.add("t5",t5);
    it("The d.keys['t5'] should equal ['v1','v2'] and d.vals['t5'] should equal ['v1','v2']", function() {
        d.keys["t5"][0].should.eql("v1");
        d.keys["t5"][1].should.eql("v2");
        d.vals["t5"][0].should.eql("v1");
        d.vals["t5"][1].should.eql("v2");
    });

    var t6 = [{k:"k1",v:"v1"},{k:"k2",v:"v2"}];
    d.add("t6",t6);
    it("The d.keys['t6'] should equal ['k1','k2'] and d.vals['t6'] should equal ['v1','v2']", function() {
        d.keys["t6"][0].should.eql("k1");
        d.keys["t6"][1].should.eql("k2");
        d.vals["t6"][0].should.eql("v1");
        d.vals["t6"][1].should.eql("v2");
    });

    var t7 = [["k1","v1"],["k2","v2"]];
    d.add("t7",t7);
    it("The d.keys['t7'] should equal ['k1','k2'] and d.vals['t7'] should equal ['v1','v2']", function() {
        d.keys["t7"][0].should.eql("k1");
        d.keys["t7"][1].should.eql("k2");
        d.vals["t7"][0].should.eql("v1");
        d.vals["t7"][1].should.eql("v2");
    });

    it("The d.pairs['t7'] should equal {k1:v1,k2:v2}", function() {
        d.pairs["t7"]["k1"].should.eql("v1");
        d.pairs["t7"]["k2"].should.eql("v2");
    });


    var path = './test/dicionary.json';
    d.writeJSON(path, function () {


        it("The d.pairs['t7'] should equal {k1:v1,k2:v2}", function(done) {
            d.readJSON(path,function(){
                d.pairs["t7"]["k1"].should.eql("v1");
                d.pairs["t7"]["k2"].should.eql("v2");
                done();
            });
        });
    });

});