module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  '$stateParams', function ($http, $q, $stateParams) {
        var factory = {};
        factory.getUser = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/users/user_id', {
                    /* POST variables here */
                    user_id: $stateParams.user_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.update = function (data) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/users/update/', {
                    /* POST variables here */
                    user_id: $stateParams.user_id,
                    data: data
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