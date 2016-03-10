var paqUtils = require("./paq-utils");
var paqChangeOfBaseFR = require("paq-fr-change-of-base");

exports.title = "Change of Base Multiple Choice";

exports.paramSchema = paqChangeOfBaseFR.paramSchema;
exports.paramSchema.title = 'mc-change-of-base';

exports.getDistractorRadices = function(rad) {
	var distractorRadices = {
    	"8" : [10,16],
    	"10" : [8,16],
    	"16" : [8,10]
	};
	return (rad in distractorRadices) ? distractorRadices[rad] : [];
}

exports.generateFromRadDistractors = function (fromRad, toRad, numToConvert, from) {
	var result = [];
	// If fromRad is in distractor radices, try interpreting the number in a different
	// radix than the intended one.   If the number we are converting is legit in that base,
	// convert from that number, correcttly, to the toRadix and try adding that as a distractor
	var distractorRadices = exports.getDistractorRadices(fromRad);
	distractorRadices.forEach(function(thisRad) {
		// can the string "from" be legally intepreted as a number in thisRad?
		// if so, then try to distract the student with that number correctly converted to the toRad
		var wrongInterpretationOfFrom = parseInt(from,thisRad);
		if (!isNaN(wrongInterpretationOfFrom)) {
			var badAnswer = wrongInterpretationOfFrom.toString(toRad);
			result.push(badAnswer);
		}
	});
	return result;
}

exports.generateToRadDistractors = function(toRad, numToConvert) {
	var distractorRadices = exports.getDistractorRadices(toRad);
	return distractorRadices.map(function(dRad) {
		return numToConvert.toString(dRad);
	});
}

exports.addDistractorChoices = function(answerChoices, fromRad, toRad, from, numToConvert) {
	// If toRad is in distractor radices, try adding the right answer in a wrong radix to the list.
	answerChoices.addAll(exports.generateToRadDistractors(toRad, numToConvert));
	answerChoices.addAll(exports.generateFromRadDistractors(fromRad, toRad, numToConvert, from));
}

exports.addRandomChoices = function(randomStream, answerChoices, toRad, min, max) {
	while (!answerChoices.full()) {
		var distractor = randomStream.randIntBetweenInclusive(min, max);
		answerChoices.add(distractor.toString(toRad));
	}
}

exports.formatChoices = function(choices, fromRad, toRad, spaceBinary) {
	if (!spaceBinary) return;
	choices.forEach(function(choice, i, arr) {
		arr[i] = paqChangeOfBaseFR.formatAnswer(choice, fromRad, toRad);
	});
}

exports.generate = function(randomStream, params) {
	var conversion = paqChangeOfBaseFR.getConversion(randomStream, params, paqChangeOfBaseFR.defaultConversions);
    var numToConvert = randomStream.randIntBetweenInclusive(conversion.range.min, conversion.range.max);
    var spaceBinary = paqChangeOfBaseFR.getSpaceBinary(params);
    var fromRad = conversion.radix.from;
    var toRad = conversion.radix.to;      
    var from = numToConvert.toString(fromRad);
    
    var answerAsString = numToConvert.toString(toRad);

	var answerChoices = new paqUtils.UniqueChoices(5);
	answerChoices.add(answerAsString);

	exports.addDistractorChoices(answerChoices, fromRad, toRad, from, numToConvert);
	exports.addRandomChoices(randomStream, answerChoices, toRad, conversion.range.min, conversion.range.max);

	var choices = answerChoices.getChoices();
	randomStream.shuffle(choices);

	//Find the correct answer
	var question = {};
	question.choices = choices;
	question.answer = choices.indexOf(answerAsString);
	question.question = paqChangeOfBaseFR.generateQuestionText(randomStream, from, fromRad, toRad, spaceBinary);
	question.format = 'multiple-choice';
	question.title = exports.title;
	exports.formatChoices(question.choices, fromRad, toRad, spaceBinary);
	return question;
};
