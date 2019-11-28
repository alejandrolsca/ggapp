module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  function ($http, $q) {
        var factory = {};
        factory.getUsers = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/users', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds()
                }).success(function (data, status, headers, config) {
                    return data;
                })
            );
            return deferred.promise;
        };
        return factory;
    }];

})(angular);