function runIterator(iterator, done) {
    iterator(function (state) {
        if (state.isDone()) {
            done();
        } else {
            runIterator(iterator, done);
        }
    });
}

var toggleSignal = function (options, numSignals, done) {
    options.toggle();
    options.timeouter(function () {
        options.toggle();
        options.timeouter(function () {
            done();
        }, 1);
    }, numSignals);
}

var codeIterator = function (input, options) {
    var numSignals = (input == '-') ? 3 : 1;
    return function (done) {
        toggleSignal(
            options,
            numSignals,
            function () {
                done({
                    isDone: function() { return true; },
                });
            }
        );
    }
}

var characterIterator = function (input, options) {
    var codes = options.codes[input];
    var currentIdx = 0;
    return function (done) {
        var currentVal = codes[currentIdx];
        runIterator(
            codeIterator(currentVal, options),
            function () {
                currentIdx += 1;
                done({
                    isDone: function() { return currentIdx == codes.length; },
                });
            }
        );
    }
}

var wordIterator = function (input, options) {
    var currentIdx = 0;
    return function (done) {
        var currentVal = input[currentIdx];
        runIterator(
            characterIterator(currentVal, options),
            function () {
                currentIdx += 1;
                var state = {
                    isDone: function() { return currentIdx == input.length; },
                    nextIterator: it,
                }

                if (state.isDone()) {
                    done(state);
                } else {
                    // write space between letters
                    options.timeouter(function () {
                        done(state);
                    }, 2);
                }
            }
        );
    }
}

var sentenceIterator = function (input, options) {
    var currentIdx = 0;
    var words = input.split(' ');
    return function (done) {
        var currentVal = words[currentIdx];
        runIterator(
            wordIterator(currentVal, options),
            function () {
                currentIdx += 1;
                var state = {
                    isDone: function() { return currentIdx == words.length; },
                    nextIterator: it,
                }

                if (state.isDone()) {
                    return done(state);
                } else {
                    // write space between words
                    options.timeouter(function () {
                        done(state);
                    }, 6);
                }
            }
        );
    }
}

function transmitter(options, done) {
    runIterator(sentenceIterator(options.message, options), done);
}

module.exports = transmitter;
