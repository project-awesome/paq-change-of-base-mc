var expect = require("chai").expect;

var paqChangeOfBaseMC = require("../"),
	paqChangeOfBaseFR = require("paq-fr-change-of-base");

describe("paramSchema", function() {
	it("should be an object", function() {
        expect(paqChangeOfBaseMC.paramSchema).to.be.an("object");
	});
	it("should be the same as the fr version's paramSchema", function() {
        expect(paqChangeOfBaseMC.paramSchema).to.eql(paqChangeOfBaseFR.paramSchema);
    });
    describe("title property", function() {
    	it("should equal 'mc-change-of-base'", function() {
    		expect(paqChangeOfBaseMC.paramSchema.title).to.equal('mc-change-of-base');
    	});
    });
});