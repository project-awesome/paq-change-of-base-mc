var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

var utils = require('../../paq-utils');

describe('Choices(limit)', function() {
	describe('limit param', function() {
		describe('when limit is not an integer', function() {
			it('should set _limit to default 4', function() {
				var choices = new utils.Choices("ayy");
				expect(choices._limit).to.equal(4);
			});
		});
		describe('when limit is an integer', function() {
			it('should set _limit to limit', function() {
				var choices = new utils.Choices(10);
				expect(choices._limit).to.equal(10);
			});
		});
	});
	describe("getChoices()", function() {
		var choices;
		beforeEach(function() {
			choices = new utils.Choices(5);
			choices._choices = "choiches-double";
		});
		it("should return _choices", function() {
			expect(choices.getChoices()).to.equal("choiches-double");
		});
	})
	describe('full()', function() {
		var choices;
		beforeEach(function() {
			choices = new utils.Choices(5);
		});
		describe('when _limit > _choices.length', function() {
			beforeEach(function() {
				choices._choices = ["one", "two"];
				choices._limit = 3;
			});
			it('should return false', function() {
				expect(choices.full()).to.be.false;
			});
		});
		describe('when _limit = _choices.length', function() {
			beforeEach(function() {
				choices._choices = ["one", "two"];
				choices._limit = 2;
			});
			it('should return true', function() {
				expect(choices.full()).to.be.true;
			});
		});
	});
	describe('addAll(choicesArray)', function() {
		var choices;
		beforeEach(function() {
			choices = new utils.Choices(5);
		});
		describe('when choicesArray is not an array', function() {
			it('should throw an error', function() {
				expect(function() { choices.addAll("not-an-array"); }).to.throw();
			});
		});
		describe('when choicesArray is an array', function() {
			var addSpy;
			beforeEach(function() {
				addSpy = sinon.spy(choices, "add");
			});
			afterEach(function() {
				addSpy.restore();
			});
			it('should call add() with each element in the array', function() {
				choices.addAll(['first-choice', 'second-choice']);
				expect(addSpy.calledTwice).to.be.true;
			});
			describe('when choices becomes full', function() {
				// for efficiency
				it('should stop calling add()', function() {
					choices.addAll(['first', 'second', 'third', 'fourth', 'fifth', 'sixth']);
					expect(addSpy.callCount).to.equal(5);
				});
			});
		});
	});
	describe('add(choice)', function() {
		var choices, sandbox, choiceDouble;
		beforeEach(function() {
			choiceDouble = "choice-double";
			choices = new utils.Choices(5);
			sandbox = sinon.sandbox.create();
		});
		afterEach(function() {
			sandbox.restore();
		});
		describe('when Choices is full', function() {
			var fullStub;
			beforeEach(function() {
				fullStub = sandbox.stub(choices, "full").returns(true);
			});
			it ('should return false', function() {
				expect(choices.add(choiceDouble)).to.equal(false);
			});
		});
		describe('when Choices is not full', function() {
			var fullStub;
			beforeEach(function() {
				fullStub = sandbox.stub(choices, "full").returns(false);
			});
			describe('when choice is not unique', function() {
				var _uniqueChoicesHasStub;
				beforeEach(function() {
					_uniqueChoicesHasStub = sandbox.stub(choices._uniqueChoices, "has").returns(true);
				});
				it('should call _uniqueChoices.has with given choice', function() {
					choices.add(choiceDouble);
					expect(_uniqueChoicesHasStub.calledWith(choiceDouble)).to.be.true;
				});
				it('should return false', function() {
					expect(choices.add(choiceDouble)).to.equal(false);
				});
			});
			describe('when choice is unique', function() {
				var _uniqueChoicesHasStub, _uniqueChoicesAddStub, _choicesPushStub;
				beforeEach(function() {
					_uniqueChoicesHasStub = sandbox.stub(choices._uniqueChoices, "has").returns(false);
					_uniqueChoicesAddStub = sandbox.stub(choices._uniqueChoices, "add");
					_choicesPushStub = sandbox.stub(choices._choices, "push");
				});
				it('should add choice to _uniqueChoices', function() {
					choices.add(choiceDouble);
					expect(_uniqueChoicesAddStub.calledWith(choiceDouble)).to.be.true;
				});
				it('should add choice to _choices', function() {
					choices.add(choiceDouble);
					expect(_choicesPushStub.calledWith(choiceDouble)).to.be.true;
				});
				it('should return true', function() {
					expect(choices.add(choiceDouble)).to.equal(true);
				});
			});
		});
	});
});



