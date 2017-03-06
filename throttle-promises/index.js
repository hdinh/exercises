function throttlePromises(limit, arr) {
    return new Promise(function(resolve) {
        var nextArrIdx = 0;

        function run() {
            if (nextArrIdx < arr.length) {
                console.log(nextArrIdx);
                arr[nextArrIdx]().then(function () {
                    run();
                });

                nextArrIdx += 1
            }
        }

        for (var i = 0; i < limit; i++) {
            run();
        }
    });
}

module.exports = throttlePromises;
