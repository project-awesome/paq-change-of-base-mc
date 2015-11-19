var chai = require("chai"),
	sinon = require("sinon"),
	expect = chai.expect;

var paqChangeOfBaseMC = require("../"),
	paqChangeOfBaseFR = require("paq-fr-change-of-base");


describe("formatChoices(choices, fromRad, toRad, spaceBinary)", function() {
	var formatAnswerStub, choices;
	beforeEach(function() {
		formatAnswerStub = sinon.stub(paqChangeOfBaseFR, 'formatAnswer');
		choices = ['choice1', 'choice2'];
	});
	afterEach(function() {
		formatAnswerStub.restore();
	});
	describe("when spaceBinary is true", function() {
		it("should format each of the choices using formatAnswer", function() {
			formatAnswerStub
			.returns('should not be returned')
			.withArgs('choice1', 'fromRad-double', 'toRad-double').returns('newchoice1')
			.withArgs('choice2', 'fromRad-double', 'toRad-double').returns('newchoice2');
			paqChangeOfBaseMC.formatChoices(choices, 'fromRad-double', 'toRad-double', true);
			expect(choices).to.eql(['newchoice1', 'newchoice2']);
		});
	});
	describe("when spaceBinary is false", function() {
		it("should not format the answers", function() {
			paqChangeOfBaseMC.formatChoices(choices, 'fromRad-double', 'toRad-double', false);
			expect(formatAnswerStub.called).to.be.false;
			expect(choices).to.eql(choices);
		});
	});
});