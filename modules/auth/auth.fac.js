module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', function ($http, $q) {
        var factory = {};
        factory.login = function (user) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/auth/auth.mdl.login.php', {
                    /* POST variables here */
                    us_database: user.us_database,
                    us_user: user.us_user,
                    us_password: user.us_password
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    return { "status": false };
                })
                );
            return deferred.promise;
        }
        return factory;
    }];

})(angular);