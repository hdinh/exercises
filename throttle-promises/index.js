function throttlePromises(limit, arr) {
    var numCompleted = 0;
    return new Promise(function(resolve) {
        var nextArrIdx = 0;
        var results = new Array(arr.length)

        function run() {
            if (nextArrIdx < arr.length) {
                var thisArrayIdx = nextArrIdx;
                arr[nextArrIdx]().then(function (result) {
                    results[thisArrayIdx] = result;
                    numCompleted += 1;
                    if (numCompleted == arr.length) {
                        resolve(results);
                    } else {
                        run();
                    }
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
