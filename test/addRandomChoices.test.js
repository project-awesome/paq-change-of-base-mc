var chai = require("chai"),
	sinon = require("sinon"),
	expect = chai.expect;

var paqChangeOfBaseMC = require("../");

describe("addRandomChoices(randomStream, answerChoices, toRad, min, max)", function() {
	var answerChoicesMock, randomStreamMock, randIntResultMock;
	var fullStub, addStub, randIntBetweenInclusiveStub, toStringStub;
	var toRadDouble, minDouble, maxDouble, toStringReturnDouble;
	var sandbox;
	beforeEach(function() {
		toRadDouble = "toRad-double";
		minDouble = "min-double";
		maxDouble = "max-double";
		toStringReturnDouble = "toString-return-double";
		randIntResultMock = { toString: function() {} };
		answerChoicesMock = { full: function(){}, add: function() {} };
		randomStreamMock = { randIntBetweenInclusive: function() {} };
		sandbox = sinon.sandbox.create();
		fullStub = sandbox.stub(answerChoicesMock, "full");
		addStub = sandbox.stub(answerChoicesMock, "add");
		randIntBetweenInclusiveStub = sandbox.stub(randomStreamMock, "randIntBetweenInclusive").returns(randIntResultMock);
		toStringStub = sandbox.stub(randIntResultMock, "toString").returns(toStringReturnDouble);
	});
	afterEach(function() {
		sandbox.restore();
	});
	describe("when answerChoices becomes full", function() {
		beforeEach(function() {
			fullStub.returns(false);
			fullStub.onCall(1).returns(true);
			paqChangeOfBaseMC.addRandomChoices(randomStreamMock, answerChoicesMock, toRadDouble, minDouble, maxDouble);
		});
		it("should stop adding choices", function() {
			expect(fullStub.calledTwice).to.be.true;
			expect(randIntBetweenInclusiveStub.calledOnce).to.be.true;
			expect(addStub.calledOnce).to.be.true;
		});
	});
	describe("generating new choice", function() {
		beforeEach(function() {
			fullStub.returns(false);
			fullStub.onCall(1).returns(true);
			paqChangeOfBaseMC.addRandomChoices(randomStreamMock, answerChoicesMock, toRadDouble, minDouble, maxDouble);
		});
		describe("randIntBetweenInclusive", function() {
			it("should be called with min and max as parameters", function() {
				expect(randIntBetweenInclusiveStub.calledOnce).to.be.true;
				expect(randIntBetweenInclusiveStub.calledWith(minDouble, maxDouble)).to.be.true;
			});
		});
		describe("distractor", function() {
			it("should call toString(toRad)", function() {
				expect(toStringStub.calledOnce).to.be.true;
				expect(toStringStub.calledWith(toRadDouble)).to.be.true;
			});
		});
		describe("answerChoices.add", function() {
			it("should be called with the result of distractor's toString", function() {
				expect(addStub.calledOnce).to.be.true;
				expect(addStub.calledWith(toStringReturnDouble)).to.be.true;
			});
		});
	});
});

