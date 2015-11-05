var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

var cobUtils = require('../../change-of-base-utils');
var random = require('random-bits');

describe('radixDescription(radix, useBase)', function() {
	describe('when useBase is true and radix is  8', function() {
		it('should return "base 8"', function() {
			expect(cobUtils.radixDescription(8, true)).to.equal("base 8");
		});
	});
	describe('when useBase is false', function() {
		describe('when radix is 2', function() {
			it('should return "binary"', function() {
				expect(cobUtils.radixDescription(2, false)).to.equal("binary");
			});
		});
		describe('when radix is 8', function() {
			it('should return "octal"', function() {
				expect(cobUtils.radixDescription(8, false)).to.equal("octal");
			});
		});
		describe('when radix is 16', function() {
			it('should return "hexadecimal"', function() {
				expect(cobUtils.radixDescription(16, false)).to.equal("hexadecimal");
			});
		});
		describe('when radix is 10', function() {
			it('should return "decimal"', function() {
				expect(cobUtils.radixDescription(10, false)).to.equal("decimal");
			});
		});
		describe('when radix is 5', function() {
			it('should return "base 5"', function() {
				expect(cobUtils.radixDescription(5, false)).to.equal("base 5");
			});
		});
	});
});

describe("generateQuestionText(randomStream, from, fromRad, toRad)", function() {
	var randomStreamMock = {
		nextIntRange: function() {}
	}
	var nextIntRangeStub, radixDescriptionStub;
	var fromDouble, fromRadDouble, toRadDouble;
	beforeEach(function() {
		fromDouble = "from-double";
		fromRadDouble = "fromRad-double";
		toRadDouble = "toRad-double";
		nextIntRangeStub = sinon.stub(randomStreamMock, "nextIntRange");
		nextIntRangeStub.withArgs(2)
		.onFirstCall().returns("first-nextInt-double")
		.onSecondCall().returns("second-nextInt-double");

		radixDescriptionStub = sinon.stub(cobUtils, "radixDescription");
		radixDescriptionStub.withArgs(fromRadDouble, "first-nextInt-double").returns("from-description-double")
		.withArgs(toRadDouble, "second-nextInt-double").returns("to-description-double");
	});
	afterEach(function() {
		nextIntRangeStub.restore();
		radixDescriptionStub.restore();
	});

	it('should call randomStream.nextIntRange with argument 2, twice', function() {
		cobUtils.generateQuestionText(randomStreamMock, fromDouble, fromRadDouble, toRadDouble);
		expect(nextIntRangeStub.calledTwice).to.be.true;
	});

	it('should produce the random description for fromRad', function() {
		cobUtils.generateQuestionText(randomStreamMock, fromDouble, fromRadDouble, toRadDouble);
		expect(radixDescriptionStub.withArgs(fromRadDouble, "first-nextInt-double").calledOnce).to.be.true;
	});

	it('should produce the random description for toRad', function() {
		cobUtils.generateQuestionText(randomStreamMock, fromDouble, fromRadDouble, toRadDouble);
		expect(radixDescriptionStub.withArgs(toRadDouble, "second-nextInt-double").calledOnce).to.be.true;
	});

	it('should return the question text with appropriate radix formats', function() {
		var res = cobUtils.generateQuestionText(randomStreamMock, fromDouble, fromRadDouble, toRadDouble);
		expect(res).to.equal("Convert " + fromDouble + " from from-description-double to to-description-double.");
	});
});





















