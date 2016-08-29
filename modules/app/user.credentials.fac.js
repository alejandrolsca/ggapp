module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  function ($http, $q) {
        var factory = {};
        factory.credentials = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('modules/app/user.credentials.mdl.getCredentials.php', {
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