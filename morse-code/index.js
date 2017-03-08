function runIterator(iterator, done) {
    iterator(function (state) {
        if (state.isDone()) {
            done();
        } else {
            runIterator(state.nextIterator, done);
        }
    });
}

var toggleSignal = function (options, numSignals, done) {
    options.toggle();
    options.timeouter(function () {
        options.toggle();
        options.timeouter(done, 1);
    }, numSignals);
}

var codeIterator = function (input, options) {
    var signals;
    var numSignals;
    if (input == '-') {
        numSignals = 3;
    } else {
        numSignals = 1;
    }

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
    var it = function (done) {
        var currentVal = codes[currentIdx];
        runIterator(
            codeIterator(currentVal, options),
            function () {
                currentIdx += 1;
                done({
                    isDone: function() { return currentIdx == codes.length; },
                    nextIterator: it,
                });
            }
        );
    }
    return it;
}

var wordIterator = function (input, options) {
    var currentIdx = 0;
    var it = function (done) {
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
                    runIterator(
                        codeIterator('.', options),
                        function () {
                            done(state);
                        }
                    );
                }
            }
        );
    }
    return it;
}

var sentenceIterator = function (input, options) {
    var currentIdx = 0;
    var words = input.split(' ');
    var it = function (done) {
        var currentVal = words[currentIdx];
        runIterator(
            wordIterator(currentVal, options),
            function () {
                currentIdx += 1;
                var state = {
                    isDone: function() { return currentIdx == input.length; },
                    nextIterator: it,
                }

                if (state.isDone()) {
                    return done(state);
                } else {
                    // write space between words
                    runIterator(
                        codeIterator('.......', options),
                        function () {
                            done(state);
                        }
                    );
                }
            }
        );
    }
    return it;
}

function transmitter(options, done) {
    runIterator(sentenceIterator(options.message, options), done);
}

module.exports = transmitter;
