var chai = require("chai"),
	sinon = require("sinon"),
	expect = chai.expect;

var paqChangeOfBaseMC = require("../");


describe("generateFromRadDistractors(fromRad, toRad, numToConvert, from)", function() {
	var getDistractorRadicesStub, parseIntStub, isNaNStub;
	var getDistractorRadicesReturnDouble;
	var numToConvertDouble, fromRadDouble, toRadDouble, fromDouble;
	beforeEach(function() {
		numToConvertDouble = { toString: function() {} };
		fromDouble = "from-double";
		fromRadDouble = "from-rad-double";
		toRadDouble = "to-rad-double";
		getDistractorRadicesReturnDouble = [2, 3, 4];
		getDistractorRadicesStub = sinon.stub(paqChangeOfBaseMC, "getDistractorRadices").returns(getDistractorRadicesReturnDouble);
		parseIntStub = sinon.stub(global, "parseInt");
		isNaNStub = sinon.stub(global, "isNaN").returns(true);
	});
	afterEach(function() {
		getDistractorRadicesStub.restore();
		parseIntStub.restore();
		isNaNStub.restore();
	});
	it("should call getDistractorRadices(fromRad)", function() {
		paqChangeOfBaseMC.generateFromRadDistractors(fromRadDouble, toRadDouble, numToConvertDouble, fromDouble);
		expect(getDistractorRadicesStub.withArgs(fromRadDouble).calledOnce).to.be.true;
	});
	it("should call parseInt(from, rad) with all distractor radices", function() {
		paqChangeOfBaseMC.generateFromRadDistractors(fromRadDouble, toRadDouble, numToConvertDouble, fromDouble);
		expect(parseIntStub.calledWith(fromDouble, 2)).to.be.true;
		expect(parseIntStub.calledWith(fromDouble, 3)).to.be.true;
		expect(parseIntStub.calledWith(fromDouble, 4)).to.be.true;
		expect(parseIntStub.calledThrice).to.be.true;
	});

	describe("result array", function() {
		var validParsedIntDouble;
		var toStringStub;
		beforeEach(function() {
			validParsedIntDouble = { toString: function() {} };
			parseIntStub.onCall(0).returns(validParsedIntDouble);
			isNaNStub.withArgs(validParsedIntDouble).returns(false);
			toStringStub = sinon.stub(validParsedIntDouble, "toString").returns("to-string-double");
		});
		afterEach(function() {
			toStringStub.restore();
		});
		it("should include the toString(toRad) result of the values of parseInt that were not NaN's", function() {
			var result = paqChangeOfBaseMC.generateFromRadDistractors(fromRadDouble, toRadDouble, numToConvertDouble, fromDouble);
			expect(result).to.eql(["to-string-double"]);
		});
	});
});
