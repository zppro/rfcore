/**
 * Created by zppro on 15-5-12.
 */
require("should");

var name = "zppro";

describe("Name", function() {
    it("The name should be zppro", function() {
        name.should.eql("zppro");
    });
});

var Person = function(name) {
    this.name = name;
};
var zppro = new Person(name);

describe("InstanceOf", function() {
    it("zppro should be an instance of Person", function() {
        zppro.should.be.an.instanceof(Person);
    });

    it("zppro should be an instance of Object", function() {
        zppro.should.be.an.instanceof(Object);
    });
});
describe("Property", function() {
    it("zppro should have property name", function() {
        zppro.should.have.property("name");
    });
});