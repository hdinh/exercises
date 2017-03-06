function debounced(fn, ms) {
    var active = false;
    return function () {
        if (!active) {
            active = true
            setTimeout(function () {
                try {
                    fn();
                } finally {
                    active = false;
                }
            }, ms);
        }
    }
}

module.exports = debounced;
