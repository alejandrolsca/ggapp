module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q',  '$stateParams', function ($http, $q, $stateParams) {
        var factory = {};
        factory.getData = function (wo_status) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/tlr', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds(),
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.update = function (wo_status, wo_id) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/tlr/update', {
                    /* POST variables here */
                    procces_id: new Date().getMilliseconds(),
                    wo_status: wo_status,
                    wo_id: wo_id
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