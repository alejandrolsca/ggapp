module.exports = (function (angular) {
    'use strict';

    return ['$http', '$q', '$stateParams', function ($http, $q, $stateParams) {
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
        factory.searchWoRelease = function(wo_release) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/shippinglist/cl_id/wo_release', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id,
                    wo_release: wo_release
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
        factory.searchWoPo = function(wo_po) {
            var deferred = $q.defer();
            deferred.resolve(
                $http.post('/api/shippinglist/cl_id/wo_po', {
                    /* POST variables here */
                    cl_id: $stateParams.cl_id,
                    wo_po: wo_po
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