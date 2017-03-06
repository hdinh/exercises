function update_(state, commands) {
    if (!commands) {
        return state;
    }

    // process any commands now
    if (commands['$set']) {
        return commands['$set'];
    }

    // TODO: cleanup
    keys = new Set();
    for (k in commands) { keys.add(k); }
    for (k in state) { keys.add(k); }

    result = {};
    keys.forEach(function (k) {
        var newVal = update_(state[k], commands[k]);
        result[k] = newVal;
    });
    return result;
}

module.exports = update_;
