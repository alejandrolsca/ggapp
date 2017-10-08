module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$stateParams', function ($http, $q, $stateParams) {
        var factory = {};
        factory.data = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/material/mt_id', {
                    /* POST variables here */
                    mt_id: $stateParams.mt_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {

                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.update = function (mt_jsonb) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/material/update', {
                    /* POST variables here */
                    mt_id: $stateParams.mt_id,
                    mt_jsonb: mt_jsonb
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {

                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getSuppliers = function () {
            var promise = $http.post('/api/supplier/', {
                /* POST variables here */
                procces_id: new Date().getMilliseconds()
            }).success(function (data, status, headers, config) {
                return data;
            }).error(function (data, status, headers, config) {

                return { "status": false };
            });
            return promise;
        };
        return factory;
    }];

})(angular);