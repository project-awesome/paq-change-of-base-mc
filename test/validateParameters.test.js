var expect = require("chai").expect;

var paqChangeOfBaseMC = require("../"),
	paqChangeOfBaseFR = require("paq-fr-change-of-base");

describe("validateParameters(parameters)", function() {
	it("should be the same as the free response change of base function", function() {
        expect(paqChangeOfBaseMC.validateParameters).to.be.a("function");
        expect(paqChangeOfBaseMC.validateParameters).to.equal(paqChangeOfBaseFR.validateParameters);
    });
});