var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

var paqChangeOfBaseMC = require("../");
var random = require('random-bits');

describe("paqChangeOfBaseMC", function() {
	describe("generate", function() {
		it('should work', function() {
			var randomStream = new random.random("abcd1234");
			var result = new paqChangeOfBaseMC.generate(randomStream);
			//console.log(result);
			expect(result).to.eql({"choices":["111101","10011011","1000010010","10001010","11010100"],"answer":4,"question":"Convert 212 from base 10 to base 2.","format":"multiple-choice"});
		});	
	});
});


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

describe("addDistractorChoices(answerChoices, fromRad, toRad, from, numToConvert)", function() {
	var answerChoicesMock, answerChoicesSpy;
	var generateToRadDistractorsStub, generateFromRadDistractorsStub;
	beforeEach(function() {
		answerChoicesMock = { addAll: function() {} };
		answerChoicesSpy = sinon.spy(answerChoicesMock, "addAll");
		generateToRadDistractorsStub = sinon.stub(paqChangeOfBaseMC, "generateToRadDistractors").returns("toRad-distractors-double");
		generateFromRadDistractorsStub = sinon.stub(paqChangeOfBaseMC, "generateFromRadDistractors").returns("fromRad-distractors-double");
	});
	afterEach(function() {
		generateToRadDistractorsStub.restore();
		generateFromRadDistractorsStub.restore();
		answerChoicesSpy.restore();
	});
	it ("should call generateToRadDistractors(toRad, numToConvert) once and add the choices", function() {
		paqChangeOfBaseMC.addDistractorChoices(answerChoicesMock, "fromRad-double", "toRad-double", "from-double", "numToConvert-double");
		expect(generateToRadDistractorsStub.calledOnce).to.be.true;
		expect(generateToRadDistractorsStub.withArgs("toRad-double", "numToConvert-double").calledOnce).to.be.true;
		expect(answerChoicesSpy.withArgs("toRad-distractors-double").calledOnce).to.be.true;
	});
	it ("should call generateFromRadDistractors(fromRad, toRad, numToConvert, from) once and add the choices", function() {
		paqChangeOfBaseMC.addDistractorChoices(answerChoicesMock, "fromRad-double", "toRad-double", "from-double", "numToConvert-double");
		expect(generateFromRadDistractorsStub.calledOnce).to.be.true;
		expect(generateFromRadDistractorsStub
			.withArgs("fromRad-double", "toRad-double", "numToConvert-double", "from-double")
			.calledOnce).to.be.true;
		expect(answerChoicesSpy.withArgs("fromRad-distractors-double").calledOnce).to.be.true;
	});
});



























