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

var mapOps = {
    '$set': function(obj, val) { return val; },
    '$merge': function(obj, val) { return Object.assign(obj, val); }
}

var arrayOps = {
    '$push': function(obj, val) { obj.push(val); },
    '$unshift': function(obj, val) { obj.unshift(val); },
    '$splice': function(obj, val) { Array.prototype.splice.apply(obj, val); },
}

var funcOps = {
    '$apply': function(obj, fn) { return fn(obj); }
}

function update(state, commands) {
    for (var c in commands) {
        if (mapOps.hasOwnProperty(c)) {
            return mapOps[c](state, commands[c]);
        } else if (arrayOps.hasOwnProperty(c)) {
            for (var v in commands[c]) {
                arrayOps[c](state, commands[c][v]);
            }
        } else if (funcOps.hasOwnProperty(c)) {
            return funcOps[c](state, commands[c]);
        } else {
            var state = shallowCopy(state);
            state[c] = update(state[c], commands[c]);
        }
    }

    return state;
}

module.exports = update;
