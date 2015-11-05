module.exports.radixDescription = function (radix, useBase) {
    if (useBase)
        return "base " + radix;
    switch(radix) {
        case 8: return "octal";
        case 16: return "hexadecimal";
        case 2: return "binary";
        case 10: return "decimal";
        default: return "base " + radix;
    }
}


module.exports.generateQuestionText = function (randomStream, from, fromRad, toRad) {
    var fromDesc = module.exports.radixDescription(fromRad, randomStream.nextIntRange(2));
    var toDesc = module.exports.radixDescription(toRad, randomStream.nextIntRange(2));
    return "Convert " + from + " from " + fromDesc + " to " + toDesc + ".";
}
