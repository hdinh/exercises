function runIterator(iterator, done) {
    iterator(function (state) {
        if (state.isDone()) {
            done();
        } else {
            state.nextIterator(done);
        }
    });
}

var signalIterator = function (toggle, secs, options) {
    return function (done) {
        if (toggle) {
            options.toggle();
        }
        options.timeouter(function () {
            done({
                isDone: function() { return true; }
            });
        }, secs);
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
            signalIterator(true, 1, options),
            function () {
                done({
                    isDone: function() { return currentIdx < numSignals; },
                    nextIterator: it,
                });
            }
        );
    }
    return it;
}

var codesIterator = function (input, options) {
    var currentIdx = 0;
    var it = function (done) {
        var currentVal = input[currentIdx];
        currentIdx += 1;
        runIterator(
            codeIterator(currentVal, options),
            function () {
                done({
                    isDone: function() { return currentIdx == input.length; },
                    nextIterator: it,
                });
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
            codesIterator(currentVal, options),
            function () {
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
        currentIdx += 1;
        runIterator(
            characterIterator(currentVal, options),
            function () {
                var state = {
                    isDone: function() { return currentIdx == input.length; },
                    nextIterator: it,
                }

                if (state.isDone()) {
                    done(state);
                } else {
                    // write space between letters
                    runIterator(
                        codesIterator('.', options),
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
        currentIdx += 1;
        runIterator(
            wordIterator(currentVal, options),
            function () {
                var state = {
                    isDone: function() { return currentIdx == input.length; },
                    nextIterator: it,
                }

                if (state.isDone()) {
                    return done(state);
                } else {
                    // write space between words
                    runIterator(
                        codesIterator('.......', options),
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
