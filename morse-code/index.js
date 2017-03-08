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

function getHandler(input, type, options) {
    var state = {isDone: false};
    if (type === SENTENCE) {
        return {
            iterator: function () {
                return function(doneCb) {
                    for (var i in input) {
                        var character = input[i];
                    }
                }
            }
        }
    }
}

function transmitter(options, done) {
    var handler = getHandler(options.message, SENTENCE, options);
    var it = handler.iterator();
    runIterator(it, done);
}

module.exports = transmitter;
