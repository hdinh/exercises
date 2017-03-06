function shallowCopy(obj) {
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0; i < obj.length; i++) {
            copy[i] = obj[i];
        }
        return copy;
    } else if (obj instanceof Object) {
        var copy = {};
        for (var k in obj) {
            if (obj.hasOwnProperty(k))
                copy[k] = obj[k];
        }
        return copy;
    } else if (typeof(obj) == 'number') {
        return obj;
    }

    assert(false);
}

function update(state, commands) {
    if (!commands) {
        return state;
    }

    if (commands['$set']) {
        return commands['$set'];
    } else if (commands['$merge']) {
        return Object.assign(state, commands['$merge']);
    }

    var state = shallowCopy(state);

    for (var k in commands) {
        if (k == '$push') {
            for (v in commands[k]) {
                state.push(commands[k][v]);
            }
        } else if (k == '$unshift') {
            for (v in commands[k]) {
                state.unshift(commands[k][v]);
            }
        } else if (k == '$splice') {
            for (v in commands[k]) {
                Array.prototype.splice.apply(state, commands[k][v])
            }
        } else if (k == '$apply'){
            state = commands[k](state)
        } else {
            state[k] = update(state[k], commands[k]);
        }
    };

    return state;
}

module.exports = update;
