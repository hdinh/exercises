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

function transmitter(options, done) {

}

module.exports = transmitter;
