module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$stateParams', 'authService', function ($http, $q, $stateParams, authService) {
        var factory = {};
        factory.getSL = function (wo_id) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/shippinglist/sl_id', {
                    /* POST variables here */
                    sl_id: $stateParams.sl_id
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.searchWoId = function (cl_id, wo_id, zo_id) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/shippinglist/releaseinvoice', {
                    /* POST variables here */
                    cl_id: cl_id,
                    wo_id: wo_id,
                    zo_id: zo_id
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