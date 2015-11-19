var chai = require("chai"),
	sinon = require("sinon"),
	expect = chai.expect;

var paqChangeOfBaseMC = require("../");

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
