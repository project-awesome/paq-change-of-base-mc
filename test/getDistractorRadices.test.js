var chai = require("chai"),
	sinon = require("sinon"),
	expect = chai.expect;

var paqChangeOfBaseMC = require("../");


describe("getDistractorRadices(rad)", function() {
	describe("when rad is 8", function() {
		it('should return array [10, 16]', function() {
			expect(paqChangeOfBaseMC.getDistractorRadices(8)).to.eql([10,16]);
		});
	});
	describe("when rad is 10", function() {
		it('should return array [8, 16]', function() {
			expect(paqChangeOfBaseMC.getDistractorRadices(10)).to.eql([8,16]);
		});
	});
	describe("when rad is 16", function() {
		it('should return array [8, 10]', function() {
			expect(paqChangeOfBaseMC.getDistractorRadices(16)).to.eql([8,10]);
		});
	});
	describe("when rad is not 8, 10, or 16", function() {
		it('should return an empty array', function() {
			expect(paqChangeOfBaseMC.getDistractorRadices(5)).to.eql([]);
			expect(paqChangeOfBaseMC.getDistractorRadices()).to.eql([]);
		});
	});
});