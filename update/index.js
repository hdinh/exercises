function update(state, commands) {
    if (!commands) {
        return state;
    }

    // process any commands now
    if (commands['$set']) {
        return commands['$set'];
    }

    // TODO: cleanup
    var keys = new Set();
    for (k in commands) { keys.add(k); }
    for (k in state) { keys.add(k); }

    var result = {};
    keys.forEach(function (k) {
        result[k] = update(state[k], commands[k]);
    });
    return result;
}

module.exports = update;
