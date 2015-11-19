var chai = require("chai"),
	sinon = require("sinon"),
	expect = chai.expect;

var utils = require('../../paq-utils');

describe('UniqueChoices(limit)', function() {
	describe('_limit', function() {
		describe('when limit is not an integer', function() {
			it('should set _limit to default 4', function() {
				var choices = new utils.UniqueChoices("ayy");
				expect(choices._limit).to.equal(4);
			});
		});
		describe('when limit is an integer', function() {
			it('should set _limit to limit', function() {
				var choices = new utils.UniqueChoices(10);
				expect(choices._limit).to.equal(10);
			});
		});
	});
	describe("_choices", function() {
		it("should be of type Set", function() {
			var choices = new utils.UniqueChoices();
			expect(choices._choices).to.be.a("set");
		});
	});
	describe("getChoices()", function() {
		var choices;
		beforeEach(function() {
			choices = new utils.UniqueChoices(5);
			choices.add("double-one");
			choices.add("double-two");
		});
		it("should return an array of the choices", function() {
			var res = choices.getChoices();
			expect(res).to.be.an("array");
			expect(res).to.eql(["double-one", "double-two"]);
		});
	})
	describe('full()', function() {
		var choices;
		beforeEach(function() {
			choices = new utils.UniqueChoices(5);
		});
		describe('when _limit > _choices.size', function() {
			beforeEach(function() {
				choices._choices = new Set(["one", "two"]);
				choices._limit = 3;
			});
			it('should return false', function() {
				expect(choices.full()).to.be.false;
			});
		});
		describe('when _limit = _choices.size', function() {
			beforeEach(function() {
				choices._choices = new Set(["one", "two"]);
				choices._limit = 2;
			});
			it('should return true', function() {
				expect(choices.full()).to.be.true;
			});
		});
	});
	describe('add(choice)', function() {
		var choices, sandbox, choiceDouble;
		beforeEach(function() {
			choiceDouble = "choice-double";
			choices = new utils.UniqueChoices(5);
			sandbox = sinon.sandbox.create();
		});
		afterEach(function() {
			sandbox.restore();
		});
		describe('when UniqueChoices is full', function() {
			var fullStub;
			beforeEach(function() {
				fullStub = sandbox.stub(choices, "full").returns(true);
			});
			it ('should return false', function() {
				expect(choices.add(choiceDouble)).to.equal(false);
			});
		});
		describe('when UniqueChoices is not full', function() {
			var fullStub, _choicesAddStub;
			beforeEach(function() {
				fullStub = sandbox.stub(choices, "full").returns(false);
				_choicesAddStub = sandbox.stub(choices._choices, "add");
			});
			afterEach(function() {
				sandbox.restore();
			});
			it('should add choice to _choices', function() {
				choices.add(choiceDouble);
				expect(_choicesAddStub.calledWith(choiceDouble)).to.be.true;
			});
			it('should return the result of _choices.add', function() {
				_choicesAddStub.returns("add-return-double");
				expect(choices.add(choiceDouble)).to.equal("add-return-double");
			});
		});
	});
	describe('addAll(choicesArray)', function() {
		var choices;
		beforeEach(function() {
			choices = new utils.UniqueChoices(5);
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
});



