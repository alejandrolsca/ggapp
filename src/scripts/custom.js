(function (Array) {
    'use strict';

    var unique = function (mutate) {
        var unique = this.reduce(function (accum, current) {
            if (accum.indexOf(current) < 0) {
                accum.push(current);
            }
            return accum;
        }, []);
        if (mutate) {
            this.length = 0;
            for (var i = 0; i < unique.length; ++i) {
                this.push(unique[i]);
            }
            return this;
        }
        return unique;
    };

})(Array);
