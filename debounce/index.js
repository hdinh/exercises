function debounced(fn, ms) {
    return function () {
        setTimeout(fn, ms);
    }
}

module.exports = debounced;
