module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$stateParams', 'authService', function ($http, $q, $stateParams, authService) {
        var factory = {};
        factory.getClient = function () {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/shippinglist/client/cl_id', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id,
                    cl_status: 'A'
                }).success(function (data, status, headers, config) {
                    return data;
                }).error(function (data, status, headers, config) {              
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.getZone = function() {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/zone/cl_id', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id,
                    zo_status: 'A'
                }).success(function(data, status, headers, config) {
                    return data;
                }).error(function(data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.searchWoId = function(wo_id) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/shippinglist/cl_id/wo_id', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id,
                    wo_id: wo_id
                }).success(function(data, status, headers, config) {
                    return data;
                }).error(function(data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        factory.add = function(zo_id, wo_id, sl_createdby) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/shippinglist/add', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id,
                    zo_id: zo_id,
                    wo_id: wo_id,
                    sl_createdby: sl_createdby
                }).success(function(data, status, headers, config) {
                    return data;
                }).error(function(data, status, headers, config) {
                    
                    return { "status": false };
                })
            );
            return deferred.promise;
        };
        return factory;
    }];

})(angular);