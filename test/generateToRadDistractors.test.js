var chai = require("chai"),
	sinon = require("sinon"),
	expect = chai.expect;

var paqChangeOfBaseMC = require("../");


describe("generateToRadDistractors(toRad, numToConvert)", function() {
	var getDistractorRadicesStub, toStringStub;
	var getDistractorRadicesReturnDouble;
	var numToConvertDouble;
	beforeEach(function() {
		numToConvertDouble = { toString: function() {} };
		getDistractorRadicesReturnDouble = [2, 3, 4];
		getDistractorRadicesStub = sinon.stub(paqChangeOfBaseMC, "getDistractorRadices").returns(getDistractorRadicesReturnDouble);
		toStringStub = sinon.stub(numToConvertDouble, "toString");
	});
	afterEach(function() {
		getDistractorRadicesStub.restore();
		toStringStub.restore();
	});
	it("should call getDistractorRadices(toRad)", function() {
		paqChangeOfBaseMC.generateToRadDistractors(5, numToConvertDouble);
		expect(getDistractorRadicesStub.withArgs(5).calledOnce).to.be.true;
	});
	it("should call numToConvert.toString on each of the distractor radices", function() {
		paqChangeOfBaseMC.generateToRadDistractors(5, numToConvertDouble);
		expect(toStringStub.withArgs(2).calledOnce).to.be.true;
		expect(toStringStub.withArgs(3).calledOnce).to.be.true;
		expect(toStringStub.withArgs(4).calledOnce).to.be.true;
		expect(toStringStub.calledThrice).to.be.true;
	});
	it("should return an array with the results of the numToConvert.toString calls", function() {
		toStringStub
		.withArgs(2).returns("toStringTwoResult")
		.withArgs(3).returns("toStringThreeResult")
		.withArgs(4).returns("toStringFourResult");
		var res = paqChangeOfBaseMC.generateToRadDistractors(5, numToConvertDouble);
		expect(res).to.eql(["toStringTwoResult", "toStringThreeResult", "toStringFourResult"]);
	});
});