function debounced(fn, ms) {
    var active = false
    var this_;
    var arguments_;
    return function (args) {
        this_ = this;
        arguments_ = [].slice.call(arguments);
        if (!active) {
            active = true;
            setTimeout(function () {
                try {
                    fn.apply(this_, arguments_);
                } finally {
                    active = false
                }
            }, ms);
        }
    }
}

module.exports = debounced;
