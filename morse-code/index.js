var handlers = {}

function registerHandler(f) {
}

// handler for a signal
// input: signal
// iterator: none
// sub-handler: none

// handler for a code
// input: code
// iterator: signal
// sub-handler: handler for a signal

// handler for a letter
// input: letter
// iterator: code
// sub-handler: handler for a code

// handler for a sentence
// input: sentence
// iterator: letters
// sub-handler: handler for a letters

function runIterator(iterator, done) {
    iterator(function (state) {
        if (state.isDone()) {
            done();
        } else {
            state.nextIterator(done);
        }
    });
}

var signalIterator = function (input, options) {
    return function (done) {
        options.toggle();
        options.timeouter(function () {
            done();
        }, 1);
    }
}

var codeIterator = function (input, options) {
    var signals;
    var numSignals = 0;
    if (input == '-') {
        numSignals = 3;
    } else {
        numSignals = 1;
    }
    var currentIdx = 0;
    var it = function (done) {
        currentIdx += 1;
        runIterator(
            signalIterator(numSignals, options),
            function () {
                return {
                    isDone: function() { return currentIdx < numSignals; },
                    nextIterator: it,
                }
            }
        );
    }
    return it;
}

var characterIterator = function (input, options) {
    var codes = options.codes[input];
    var currentIdx = 0;
    var it = function (done) {
        var currentVal = codes[currentIdx];
        currentIdx += 1;
        runIterator(
            signalIterator(currentVal, options),
            function () {
                return {
                    isDone: function() { return currentIdx == codes.length; },
                    nextIterator: it,
                }
            }
        );
    }
    return it;
}

var sentenceIterator = function (input, options) {
    var currentIdx = 0;
    var it = function (done) {
        var currentVal = input[currentIdx];
        currentIdx += 1;
        runIterator(
            characterIterator(currentVal, options),
            function () {
                return {
                    isDone: function() { return currentIdx == input.length; },
                    nextIterator: it,
                }
            }
        );
    }
    return it;
}

function getIterator(input, depth, options) {
    var state = {isDone: false};
    if (depth < iteratorDepths.length) {
        return iteratorDepths[depth](input, options, getIterator);
    }
}

function transmitter(options, done) {
    var iterator = getIterator(options.message, SENTENCE, options);
    runIterator(sentenceIterator(options.message, options), done);
}

module.exports = transmitter;
