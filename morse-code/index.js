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

var SENTENCE = 0;
var LETTER = 1;
var CODE = 2;
var SIGNAL = 3;

var sentenceIterator = function (input, options, getSubIterator) {
    var currentIdx = 0;
    return function (cb) {
        var currentVal = input[currentIdx];
        currentIdx += 1;
        runIterator(getSubIterator(currentVal), done);
    }
}

var characterIterator = function (done) {}
var letterIterator = function (done) {}
var codeIterator = function (done) {}
var signalIterator = function (done) {}

var iteratorDepths = [
    sentenceIterator,
    letterIterator, 
    codeIterator,
    signalIterator
]

function getIterator(input, depth, options) {
    var state = {isDone: false};
    if (depth < iteratorDepths.length) {
        return iteratorDepths[depth](input, options, getIterator);
    }
}

function transmitter(options, done) {
    var iterator = getIterator(options.message, SENTENCE, options);
    runIterator(iterator, done);
}

module.exports = transmitter;
