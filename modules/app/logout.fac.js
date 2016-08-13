module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$alerts', function ($http, $q, $alerts) {
        var factory = {};
        factory.logout = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/app/logout.mdl.logOut.php', {
                    /* POST variables here */
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