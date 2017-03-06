function transmitter(options, done) {
    function typeCode(code, done_) {
        if (code === '.') {
            options.toggle();
            done_();
        } else if (code == '-') {
            options.toggle();
            options.timeouter(function () {
                options.toggle();
                options.timeouter(function () {
                    options.toggle();
                    done_();
                }, 1);
            }, 1);
        }
    }

    function typeLetterCodeSpace(done_) {
        options.timeouter(done_, 1);
    }

    function typeLetterSpace(done_) {
        options.timeouter(done_, 3);
    }

    function typeLetterCodes(idx, letter, done_) {
        if (letter == ' ') {
            options.timeouter(done_, 7);
        } else {
            var letterCodes = options.codes[letter];
            if (idx == letterCodes.length) {
                done_();
            } else {
                typeCode(letterCodes[idx], function () {
                    if (idx < letterCodes.length - 1) {
                        typeLetterCodeSpace(function() {
                            typeLetterCodes(idx + 1, letter, done_);
                        });
                    } else {
                        typeLetterCodes(idx + 1, letter, done_);
                    }
                });
            }
        }
    }

    function typeLetterOrSpace(idx) {
        if (idx == options.message.length) {
            done();
        } else {
            var letter = options.message[idx];
            console.log(letter)
            typeLetterCodes(0, letter, function() {
                if (idx < options.message.length - 1) {
                    typeLetterSpace(function() {
                        typeLetterOrSpace(idx + 1);
                    });
                } else {
                    typeLetterOrSpace(idx + 1);
                }
            });
        }
    }

    typeLetterOrSpace(0);
}

module.exports = transmitter;
