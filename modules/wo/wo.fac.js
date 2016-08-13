module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', '$stateParams', function ($http, $q, $alerts, $stateParams) {
        var factory = {};
        factory.getData = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('http://localhost:3000/wo/cl_id', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds(),
                    cl_id: $stateParams.cl_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    var stackError = JSON.stringify({
                        status: data.status,
                        error: data.error,
                        errorType: data.type,
                        config: config
                    }, null, 4);
                    $alerts.error('Wooops! an error has ocurred.', stackError);
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        return factory;
    }];

})(angular);