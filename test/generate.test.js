var chai = require("chai"),
	sinon = require("sinon"),
	expect = chai.expect;

var paqChangeOfBaseMC = require("../"),
	paqChangeOfBaseFR = require("paq-fr-change-of-base"),
	paqUtils = require("../paq-utils");

// bad giant unit test...
describe("generate(randomStream, params)", function() {
	var res;
	var numToConvertMock, randomStreamMock, answerChoicesMock, choicesMock;
	var getConversionStub, randIntBetweenInclusiveStub, toStringStub, UniqueChoicesStub,
		addDistractorChoicesStub, addRandomChoicesStub, shuffleStub, indexOfStub, getChoicesStub,
		generateQuestionTextStub, addStub, getSpaceBinaryStub, formatChoicesStub;
	var conversionDouble, fromRadDouble, toRadDouble, minDoube, maxDouble, paramsDouble,
		fromDouble, answerDouble, indexDouble, questionTextDouble, spaceBinaryDouble;
	var sandbox;

	beforeEach(function() {
		sandbox = sinon.sandbox.create();

		numToConvertMock = { toString: function() { } };
		randomStreamMock = { shuffle: function() { }, randIntBetweenInclusive: function() {} };
		answerChoicesMock = { add: function() { }, getChoices: function() { } };
		choicesMock = { indexOf: function() {} };
		fromDouble = sandbox.spy();
		answerDouble = sandbox.spy();
		paramsDouble = sandbox.spy();
		maxDouble = sandbox.spy();
		minDouble = sandbox.spy();
		fromRadDouble = sandbox.spy();
		toRadDouble = sandbox.spy();
		indexDouble = sandbox.spy();
		spaceBinaryDouble  = sandbox.spy();
		questionTextDouble = sandbox.spy();
		conversionDouble = {
			radix: { from: fromRadDouble, to: toRadDouble },
			range: { min: minDouble, max: maxDouble }
		}

		getConversionStub = sandbox.stub(paqChangeOfBaseFR, "getConversion").returns(conversionDouble);
		shuffleStub = sandbox.stub(randomStreamMock, "shuffle");
		randIntBetweenInclusiveStub = sandbox.stub(randomStreamMock, "randIntBetweenInclusive").returns(numToConvertMock);
		toStringStub = sandbox.stub(numToConvertMock, "toString")
			.withArgs(fromRadDouble).returns(fromDouble)
			.withArgs(toRadDouble).returns(answerDouble);
		UniqueChoicesStub = sandbox.stub(paqUtils, "UniqueChoices").returns(answerChoicesMock);
		addStub = sandbox.stub(answerChoicesMock, "add");
		getChoicesStub = sandbox.stub(answerChoicesMock, "getChoices").returns(choicesMock);
		addDistractorChoicesStub = sandbox.stub(paqChangeOfBaseMC, "addDistractorChoices");
		addRandomChoicesStub = sandbox.stub(paqChangeOfBaseMC, "addRandomChoices");
		indexOfStub = sandbox.stub(choicesMock, "indexOf").returns(indexDouble);
		generateQuestionTextStub = sandbox.stub(paqChangeOfBaseFR, "generateQuestionText").returns(questionTextDouble);
		getSpaceBinaryStub = sandbox.stub(paqChangeOfBaseFR, 'getSpaceBinary').withArgs(paramsDouble).returns(spaceBinaryDouble);
		formatChoicesStub = sandbox.stub(paqChangeOfBaseMC, 'formatChoices');
		res = paqChangeOfBaseMC.generate(randomStreamMock, paramsDouble);

	});
	afterEach(function() {
		sandbox.restore();
	});

	describe("getConversion", function() {
		it("should be called with appropriate parameters", function() {
			expect(getConversionStub.calledOnce).to.be.true;
			expect(getConversionStub.calledWith(
				randomStreamMock, paramsDouble, paqChangeOfBaseFR.defaultConversions
			)).to.be.true;
		});
	});
	describe("numToConvert", function() {
		it("should be selected with randIntBetweenInclusive with min, max from conversion", function() {
			expect(randIntBetweenInclusiveStub.calledOnce).to.be.true;
			expect(randIntBetweenInclusiveStub.calledWith(minDouble, maxDouble)).to.be.true;
		});
	});
	describe("number to convert string format", function() {
		it("should be determined by toString(fromRad) on numToConvert", function() {
			expect(toStringStub.withArgs(fromRadDouble).calledOnce).to.be.true;
		});
	});
	describe("answer", function() {
		it("should be determined by toString(toRad) on numToConvert", function() {
			expect(toStringStub.withArgs(toRadDouble).calledOnce).to.be.true;
		});
	});
	describe("answerChoices", function() {
		it("should create a new UniqueChoices object with limit of 5", function() {
			expect(UniqueChoicesStub.calledOnce).to.be.true;
			expect(UniqueChoicesStub.calledWith(5)).to.be.true;
		});
		it("should add the answer", function() {
			expect(addStub.calledOnce).to.be.true;
			expect(addStub.calledWith(answerDouble)).to.be.true;
		});
	});
	describe("addDistractorChoices", function() {
		it("should be called with appropriate parameters", function() {
			expect(addDistractorChoicesStub.calledOnce).to.be.true;
			expect(addDistractorChoicesStub.calledWith(
				answerChoicesMock, fromRadDouble, toRadDouble, fromDouble, numToConvertMock
			)).to.be.true;
		});
	});
	describe("addRandomChoices", function() {
		it("should be called with appropriate parameters", function() {
			expect(addRandomChoicesStub.calledOnce).to.be.true;
			expect(addRandomChoicesStub.calledWith(
				randomStreamMock, answerChoicesMock, toRadDouble, minDouble, maxDouble
			)).to.be.true;
		});
	});
	describe("unique choices result", function() {
		it("should be the result of answerChoices.getChoices()", function() {
			expect(getChoicesStub.calledOnce).to.be.true;
		});
		
		it("should be set after the correct, distractor, and random choices were generated", function() {
			expect(getChoicesStub.calledAfter(addStub)).to.be.true;
			expect(getChoicesStub.calledAfter(addDistractorChoicesStub)).to.be.true;
			expect(getChoicesStub.calledAfter(addRandomChoicesStub)).to.be.true;
		});
		it("should be shuffled by randomStream's shuffle method", function() {
			expect(shuffleStub.calledOnce).to.be.true;
			expect(shuffleStub.calledWith(choicesMock)).to.be.true;
		});
	});
	describe("properties assigned to this", function() {
		describe("choices", function() {
			it("should be assigned the shuffled choices", function() {
				expect(res.choices).to.equal(choicesMock);
			});
			it("should have formatted the choices after the answer index was set", function() {
				expect(formatChoicesStub.calledOnce).to.be.true;
				expect(formatChoicesStub.calledAfter(indexOfStub)).to.be.true;
				expect(formatChoicesStub.calledWith(choicesMock, fromRadDouble, toRadDouble, spaceBinaryDouble)).to.be.true;
			});
		});
		describe("answer", function() {
			it("should be the index of the correct answer in choices", function() {
				expect(indexOfStub.withArgs(answerDouble).calledOnce).to.be.true;
				expect(res.answer).to.equal(indexDouble);
			});
		});
		describe("question", function() {
			it("should be determined by generateQuestionText(randomStream, from, fromRad, toRad)", function() {
				expect(generateQuestionTextStub.withArgs(
					randomStreamMock, fromDouble, fromRadDouble, toRadDouble, spaceBinaryDouble
				).calledOnce).to.be.true;
			});
			it("should be assigned to result of generateQuestionText", function() {
				expect(res.question).to.equal(questionTextDouble);
			});
		});
		describe("format", function() {
			it("should be multiple-choice", function() {
				expect(res.format).to.equal("multiple-choice");
			});
		});
		
		describe("title", function() {
 			it("should be the module.exports.title", function() {
 				expect(res.title).to.equal("Change of Base Multiple Choice");
 			});
 		});
	});
});
