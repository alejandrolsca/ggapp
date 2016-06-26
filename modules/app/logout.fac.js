module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', function ($http, $q) {
        var factory = {};
        factory.logout = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/app/logout.mdl.logOut.php', {
                    /* POST variables here */
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    return { "status": false };
                })
                );
            return deferred.promise;
        };
        return factory;
    }];

})(angular);