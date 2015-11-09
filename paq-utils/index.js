function UniqueChoices(limit) {
	this._limit = (Number.isInteger(limit)) ? limit : 4;
	this._choices = new Set([]);
}

UniqueChoices.prototype.add = function(choice) {
	if (this.full())
		return false;
	return this._choices.add(choice);
}

UniqueChoices.prototype.addAll = function(choicesArray) {
	if (!Array.isArray(choicesArray))
		throw "Invalid Parameter for Choices: addAll expects array parameter";
	for (var i = 0; choicesArray.length > i && !this.full(); i++)
		this.add(choicesArray[i]);
}

UniqueChoices.prototype.getChoices = function() {
	var choices = [];
	this._choices.forEach(function(choice) {
		choices.push(choice);
	});
	return choices;
}

UniqueChoices.prototype.full = function() {
	return this._choices.size >= this._limit;
}

module.exports.UniqueChoices = UniqueChoices;







